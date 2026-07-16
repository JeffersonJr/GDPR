// ============================================================
// E-Compliance — Global TypeScript Types
// ============================================================

// ------ Supabase Auth ------
export type UserRole = 'admin' | 'editor' | 'viewer'

// ------ Plan Tiers ------
export type PlanTier = 'free' | 'pro' | 'enterprise'

// ------ Organizations ------
export interface Organization {
  id: string
  name: string
  domain: string | null
  niche: string | null
  size: OrgSize | null
  country: string | null
  maturity_score: number | null
  plan_tier: PlanTier
  plan_document_limit: number | null
  has_eu_presence: boolean
  has_iso_cert: boolean
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export type OrgSize =
  | 'solo'         // 1 person
  | 'micro'        // 2–10
  | 'small'        // 11–50
  | 'medium'       // 51–250
  | 'large'        // 251–1000
  | 'enterprise'   // 1000+

// ------ Users ------
export interface Profile {
  id: string            // matches auth.users.id
  org_id: string | null
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  email: string
  invited_by: string | null
  created_at: string
  updated_at: string
}

// ------ Documents ------
export type DocumentType =
  | 'privacy_policy'
  | 'cookie_policy'
  | 'terms_of_use'
  | 'dpa'                  // Data Processing Agreement
  | 'ropa'                 // Record of Processing Activities
  | 'dpia'                 // Data Protection Impact Assessment
  | 'breach_notification'
  | 'consent_form'
  | 'data_retention_policy'
  | 'third_party_processor'
  | 'other'

export type DocumentStatus =
  | 'missing'      // not yet created/uploaded
  | 'pending'      // uploaded, waiting for AI analysis
  | 'analyzing'    // AI is currently processing
  | 'analyzed'     // AI returned suggestions
  | 'compliant'    // user accepted & finalized
  | 'generating'   // AI is generating from scratch

export interface ComplianceDocument {
  id: string
  org_id: string
  name: string
  type: DocumentType
  status: DocumentStatus
  original_url: string | null
  compliant_url: string | null
  generated_by_ai: boolean
  ai_analysis_json: AiAnalysis | null
  version: number
  created_at: string
  updated_at: string
}

export interface AiAnalysis {
  compliance_score: number    // 0–100
  missing_clauses: string[]
  problematic_clauses: Array<{
    original: string
    issue: string
    suggestion: string
  }>
  summary: string
  gdpr_articles_referenced: string[]
}

// ------ Onboarding ------
export interface OnboardingResponse {
  id: string
  org_id: string
  niche: string
  size: OrgSize
  has_eu_presence: boolean
  data_volume: DataVolume
  processes_special_categories: boolean
  has_iso_cert: boolean
  existing_documents: DocumentType[]
  calculated_score: number
  required_documents: DocumentType[]
  completed_at: string
}

export type DataVolume =
  | 'under_500'
  | '500_to_5000'
  | '5000_to_50000'
  | '50000_to_500000'
  | 'over_500000'

// ------ Plan Limits ------
export interface PlanLimits {
  max_documents: number | null   // null = unlimited
  max_users: number
  max_orgs: number
  version_history: boolean
  export_reports: boolean
  priority_support: boolean
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    max_documents: 2,
    max_users: 1,
    max_orgs: 1,
    version_history: false,
    export_reports: false,
    priority_support: false,
  },
  pro: {
    max_documents: 20,
    max_users: 5,
    max_orgs: 1,
    version_history: true,
    export_reports: false,
    priority_support: false,
  },
  enterprise: {
    max_documents: null,
    max_users: 999,
    max_orgs: 999,
    version_history: true,
    export_reports: true,
    priority_support: true,
  },
}

// ------ GDPR Required Documents by profile ------
export const GDPR_REQUIRED_DOCUMENTS: DocumentType[] = [
  'privacy_policy',
  'cookie_policy',
  'terms_of_use',
  'dpa',
  'ropa',
  'data_retention_policy',
]

export const GDPR_HIGH_RISK_DOCUMENTS: DocumentType[] = [
  'dpia',
  'breach_notification',
  'consent_form',
  'third_party_processor',
]

// ------ API Response ------
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}
