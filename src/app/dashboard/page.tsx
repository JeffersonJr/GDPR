import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import DashboardClient from '@/components/dashboard/DashboardClient'
import { DashboardSkeleton } from '@/components/ui/Skeletons'

export const metadata: Metadata = { title: 'Dashboard — E-Compliance' }

// Force dynamic rendering so we always get fresh data
export const dynamic = 'force-dynamic'

async function DashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Parallel queries for performance
  const [profileResult, documentsResult, onboardingResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('*, organizations(*)')
      .eq('id', user.id)
      .single(),
    supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: true }),
    supabase
      .from('onboarding_responses')
      .select('required_documents, calculated_score')
      .single(),
  ])

  const profile = profileResult.data
  const org = profile?.organizations as any
  const documents = documentsResult.data ?? []
  const requiredDocs = (onboardingResult.data?.required_documents as string[]) ?? []

  return (
    <DashboardClient
      profile={profile}
      org={org}
      documents={documents as any}
      requiredDocs={requiredDocs}
    />
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  )
}
