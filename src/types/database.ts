/**
 * Supabase Database type definitions — auto-generated shape.
 * Expand as new tables are added. Used to type the Supabase client.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          domain: string | null
          niche: string | null
          size: string | null
          country: string | null
          has_eu_presence: boolean
          has_iso_cert: boolean
          maturity_score: number | null
          plan_tier: 'free' | 'pro' | 'enterprise'
          plan_document_limit: number | null
          onboarding_completed: boolean
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['organizations']['Row']> & { name: string }
        Update: Partial<Database['public']['Tables']['organizations']['Row']>
      }
      profiles: {
        Row: {
          id: string
          org_id: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'editor' | 'viewer'
          email: string
          invited_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string; email: string }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      documents: {
        Row: {
          id: string
          org_id: string
          name: string
          type: string
          status: 'missing' | 'pending' | 'analyzing' | 'analyzed' | 'compliant' | 'generating'
          original_url: string | null
          compliant_url: string | null
          generated_by_ai: boolean
          ai_analysis_json: Json | null
          ai_model_used: string | null
          version: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['documents']['Row']> & {
          org_id: string; name: string; type: string
        }
        Update: Partial<Database['public']['Tables']['documents']['Row']>
      }
      onboarding_responses: {
        Row: {
          id: string
          org_id: string
          niche: string
          size: string
          has_eu_presence: boolean
          data_volume: string
          processes_special_categories: boolean
          has_iso_cert: boolean
          existing_documents: string[]
          calculated_score: number
          required_documents: string[]
          completed_at: string
        }
        Insert: Partial<Database['public']['Tables']['onboarding_responses']['Row']> & {
          org_id: string; niche: string; size: string; data_volume: string
        }
        Update: Partial<Database['public']['Tables']['onboarding_responses']['Row']>
      }
      invitations: {
        Row: {
          id: string
          org_id: string
          email: string
          role: 'admin' | 'editor' | 'viewer'
          token: string
          invited_by: string
          accepted_at: string | null
          expires_at: string
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['invitations']['Row']> & {
          org_id: string; email: string; invited_by: string
        }
        Update: Partial<Database['public']['Tables']['invitations']['Row']>
      }
      audit_log: {
        Row: {
          id: string
          org_id: string
          user_id: string | null
          action: string
          target_id: string | null
          target_type: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['audit_log']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: {
      my_org_id: { Args: Record<string, never>; Returns: string }
      my_role: { Args: Record<string, never>; Returns: string }
    }
    Enums: Record<string, never>
  }
}

// Convenience row types
export type OrgRow = Database['public']['Tables']['organizations']['Row']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type DocumentRow = Database['public']['Tables']['documents']['Row']
export type OnboardingRow = Database['public']['Tables']['onboarding_responses']['Row']
export type InvitationRow = Database['public']['Tables']['invitations']['Row']
export type AuditLogRow = Database['public']['Tables']['audit_log']['Row']

// Profile with org joined
export type ProfileWithOrg = ProfileRow & { organizations: OrgRow | null }
