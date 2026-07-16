'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { calculateMaturityScore, determineRequiredDocuments } from '@/lib/utils'
import { generateDocumentAi, auditDocumentAi } from '@/lib/ai'
const pdfParse = require('pdf-parse')


// ============================================================
// AUTH ACTIONS
// ============================================================

/**
 * Sign up with email + password.
 * Creates the auth user — profile is auto-created by DB trigger.
 */
export async function signUpAction(formData: {
  email: string
  password: string
  fullName: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: { full_name: formData.fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { data, error: null }
}

/**
 * Sign in with email + password.
 */
export async function signInAction(formData: { email: string; password: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Dev Only: Auto create & login a test user without email confirmation.
 */
export async function devAutoLoginAction() {
  if (process.env.NODE_ENV !== 'development') {
    return { error: 'Não permitido em produção' }
  }

  const supabase = await createClient()
  const service = createServiceClient()
  
  const email = 'dev@local.host'
  const password = 'devpassword123'

  // Attempt to create user with email confirmed (bypassing SMTP)
  // If user already exists, this will fail silently and we'll just log in
  await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Desenvolvedor' }
  })

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Sign out and redirect to login.
 */
export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

/**
 * Request password reset email.
 */
export async function forgotPasswordAction(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

/**
 * Update password (after reset link clicked).
 */
export async function updatePasswordAction(password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

// ============================================================
// ONBOARDING ACTIONS
// ============================================================

interface OnboardingPayload {
  org_name: string
  domain: string
  country: string
  niche: string
  size: string
  has_eu_presence: boolean
  data_volume: string
  processes_special_categories: boolean
  has_iso_cert: boolean
  existing_documents: string[]
}

/**
 * Complete the onboarding flow:
 *  1. Create the organization
 *  2. Link the current user as admin
 *  3. Calculate maturity score
 *  4. Save onboarding_responses
 *  5. Update org maturity_score
 *  6. Write to audit_log
 */
export async function completeOnboardingAction(payload: OnboardingPayload) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  // Use service client to bypass RLS because the user's profile doesn't have the org_id yet,
  // which causes the .select() to fail on the organizations table SELECT policy.
  const supabaseAdmin = createServiceClient()

  // 1. Create organization
  const { data: org, error: orgError } = await (supabaseAdmin as any)
    .from('organizations')
    .insert({
      name: payload.org_name,
      domain: payload.domain || null,
      niche: payload.niche,
      size: payload.size,
      country: payload.country,
      has_eu_presence: payload.has_eu_presence,
      has_iso_cert: payload.has_iso_cert,
      onboarding_completed: true,
    })
    .select()
    .single()

  if (orgError) return { error: (orgError as any).message }

  // 2. Link user as org admin
  const { error: profileError } = await (supabaseAdmin as any)
    .from('profiles')
    .update({ org_id: org.id, role: 'admin' })
    .eq('id', user.id)

  if (profileError) return { error: (profileError as any).message }

  // 3. Calculate score and required docs
  const score = calculateMaturityScore({
    has_eu_presence: payload.has_eu_presence,
    has_iso_cert: payload.has_iso_cert,
    existing_documents: payload.existing_documents,
    processes_special_categories: payload.processes_special_categories,
    data_volume: payload.data_volume,
  })

  const requiredDocs = determineRequiredDocuments({
    size: payload.size,
    processes_special_categories: payload.processes_special_categories,
    has_eu_presence: payload.has_eu_presence,
    data_volume: payload.data_volume,
  })

  // 4. Save onboarding responses
  const { error: obError } = await (supabase as any)
    .from('onboarding_responses')
    .insert({
      org_id: org.id,
      niche: payload.niche,
      size: payload.size,
      has_eu_presence: payload.has_eu_presence,
      data_volume: payload.data_volume,
      processes_special_categories: payload.processes_special_categories,
      has_iso_cert: payload.has_iso_cert,
      existing_documents: payload.existing_documents,
      calculated_score: score,
      required_documents: requiredDocs,
    })

  if (obError) return { error: (obError as any).message }

  // 5. Update org score
  await (supabase as any)
    .from('organizations')
    .update({ maturity_score: score })
    .eq('id', org.id)

  // 6. Audit log (fire-and-forget)
  try {
    const service = createServiceClient()
    await (service as any).from('audit_log').insert({
      org_id: org.id,
      user_id: user.id,
      action: 'onboarding.completed',
      target_id: org.id,
      target_type: 'organization',
      metadata: { score, required_documents_count: requiredDocs.length },
    })
  } catch {
    // Non-critical — don't fail the request
  }

  revalidatePath('/dashboard')
  return { data: { org, score, requiredDocs }, error: null }
}

// ============================================================
// DOCUMENT ACTIONS
// ============================================================

/**
 * Create a document record (before AI generation or upload starts).
 */
export async function createDocumentAction(payload: {
  org_id: string
  name: string
  type: string
  status?: 'pending' | 'generating' | 'analyzing'
  generated_by_ai?: boolean
  original_url?: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data, error } = await (supabase as any)
    .from('documents')
    .insert({
      org_id: payload.org_id,
      name: payload.name,
      type: payload.type,
      status: payload.status ?? 'pending',
      generated_by_ai: payload.generated_by_ai ?? false,
      original_url: payload.original_url ?? null,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) return { error: (error as any).message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/documents')
  return { data, error: null }
}

/**
 * Update a document's status and/or AI analysis results.
 */
export async function updateDocumentAction(
  id: string,
  updates: {
    status?: string
    compliant_url?: string
    ai_analysis_json?: Record<string, unknown>
  }
) {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { error: (error as any).message }

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/documents/${id}`)
  return { data, error: null }
}

/**
 * Helper to check AI limits for an organization based on their plan tier.
 */
async function checkOrganizationAiLimits(orgId: string, planTier: string) {
  if (planTier === 'enterprise') return true

  const limit = planTier === 'pro' ? 20 : 3
  const service = createServiceClient()
  
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count } = await (service as any)
    .from('audit_log')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .in('action', ['document.generated', 'document.audited'])
    .gte('created_at', startOfMonth.toISOString())

  return (count || 0) < limit
}

/**
 * Generate a new document from scratch using AI.
 */
export async function generateDocumentAiAction(documentId: string) {
  const supabase = await createClient()

  // 1. Get document and org details
  const { data: doc } = await (supabase as any)
    .from('documents')
    .select('*, organizations(*), onboarding_responses!inner(*)')
    .eq('id', documentId)
    .single()

  if (!doc) return { error: 'Documento não encontrado' }

  const canProceed = await checkOrganizationAiLimits(doc.org_id, doc.organizations.plan_tier)
  if (!canProceed) return { error: 'limit_reached' }

  // Set status to generating
  await (supabase as any).from('documents').update({ status: 'generating' }).eq('id', documentId)
  revalidatePath('/dashboard/documents')

  const context = {
    documentType: doc.type,
    niche: doc.onboarding_responses.niche,
    size: doc.onboarding_responses.size,
    country: doc.organizations.country || 'Europa',
    dataVolume: doc.onboarding_responses.data_volume,
    processesSpecialCategories: doc.onboarding_responses.processes_special_categories,
    hasEuPresence: doc.onboarding_responses.has_eu_presence,
  }

  try {
    // 2. Generate with AI
    const markdownContent = await generateDocumentAi(context)

    // 3. Upload to Supabase Storage
    const fileName = `${doc.org_id}/${documentId}_compliant.md`
    
    // We use the service client for storage to bypass RLS issues in backend if needed
    const service = createServiceClient()
    const { error: uploadError } = await service.storage
      .from('documents')
      .upload(fileName, markdownContent, {
        contentType: 'text/markdown',
        upsert: true
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = service.storage.from('documents').getPublicUrl(fileName)

    // 4. Update document record
    await (supabase as any)
      .from('documents')
      .update({
        status: 'compliant',
        compliant_url: publicUrl,
      })
      .eq('id', documentId)

    // 5. Log audit to count towards limits
    await service.from('audit_log').insert({
      org_id: doc.org_id,
      action: 'document.generated',
      target_id: documentId,
      target_type: 'document'
    })

    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/documents/${documentId}`)
    return { data: { success: true, url: publicUrl }, error: null }
  } catch (err: any) {
    await (supabase as any).from('documents').update({ status: 'missing' }).eq('id', documentId)
    return { error: err.message }
  }
}

/**
 * Audit an uploaded document using AI.
 */
export async function auditDocumentAiAction(documentId: string) {
  const supabase = await createClient()

  const { data: doc } = await (supabase as any)
    .from('documents')
    .select('*, organizations(*)')
    .eq('id', documentId)
    .single()

  if (!doc || !doc.original_url) return { error: 'Documento não encontrado ou sem arquivo original' }

  const canProceed = await checkOrganizationAiLimits(doc.org_id, doc.organizations.plan_tier)
  if (!canProceed) return { error: 'limit_reached' }

  await (supabase as any).from('documents').update({ status: 'analyzing' }).eq('id', documentId)
  revalidatePath('/dashboard/documents')

  try {
    // 1. Download original file text
    const response = await fetch(doc.original_url)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    let textToAnalyze = ''
    
    if (doc.original_url.toLowerCase().endsWith('.pdf')) {
      const data = await pdfParse(buffer)
      textToAnalyze = data.text
    } else {
      // Fallback for txt or md
      textToAnalyze = buffer.toString('utf-8')
    }

    if (!textToAnalyze || textToAnalyze.trim() === '') {
      throw new Error('Não foi possível extrair texto do arquivo.')
    }

    // 2. Audit with AI
    const result = await auditDocumentAi(textToAnalyze, doc.type)

    // 3. Upload improved text to Storage
    const fileName = `${doc.org_id}/${documentId}_compliant.md`
    const service = createServiceClient()
    
    await service.storage
      .from('documents')
      .upload(fileName, result.improvedText, {
        contentType: 'text/markdown',
        upsert: true
      })

    const { data: { publicUrl } } = service.storage.from('documents').getPublicUrl(fileName)

    // 4. Update document record
    await (supabase as any)
      .from('documents')
      .update({
        status: result.complianceScore >= 80 ? 'compliant' : 'analyzed',
        compliant_url: publicUrl,
        ai_analysis_json: result as any, // TS json type safety
      })
      .eq('id', documentId)

    // 5. Log audit to count towards limits
    await service.from('audit_log').insert({
      org_id: doc.org_id,
      action: 'document.audited',
      target_id: documentId,
      target_type: 'document'
    })

    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/documents/${documentId}`)
    return { data: { success: true }, error: null }
  } catch (err: any) {
    await (supabase as any).from('documents').update({ status: 'pending' }).eq('id', documentId)
    return { error: err.message }
  }
}

// ============================================================
// ORGANIZATION ACTIONS
// ============================================================

/**
 * Update organization settings.
 */
export async function updateOrganizationAction(
  orgId: string,
  updates: { name?: string; domain?: string; niche?: string }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return { error: 'Acesso negado. Apenas administradores podem realizar esta ação.' }
  }

  const { data, error } = await (supabase as any)
    .from('organizations')
    .update(updates)
    .eq('id', orgId)
    .select()
    .single()

  if (error) return { error: (error as any).message }

  revalidatePath('/settings')
  return { data, error: null }
}

// ============================================================
// TEAM ACTIONS
// ============================================================

/**
 * Invite a team member by email.
 * Creates an invitation record with a unique token.
 */
export async function inviteTeamMemberAction(payload: {
  org_id: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return { error: 'Acesso negado. Apenas administradores podem realizar esta ação.' }
  }

  // Check if email already has a pending invitation
  const { data: existing } = await (supabase as any)
    .from('invitations')
    .select('id')
    .eq('org_id', payload.org_id)
    .eq('email', payload.email)
    .is('accepted_at', null)
    .single()

  if (existing) {
    return { error: 'Já existe um convite pendente para este e-mail.' }
  }

  const { data, error } = await (supabase as any)
    .from('invitations')
    .insert({
      org_id: payload.org_id,
      email: payload.email,
      role: payload.role,
      invited_by: user.id,
    })
    .select()
    .single()

  if (error) return { error: (error as any).message }

  // TODO: send invitation email via Resend in Phase 2

  revalidatePath('/settings/team')
  return { data, error: null }
}
