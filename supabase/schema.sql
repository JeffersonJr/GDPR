-- ================================================================
-- E-Compliance SaaS — Supabase Schema & RLS Policies
-- Versão: 1.0.0
-- Execute este script no SQL Editor do painel Supabase
-- ================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Para busca full-text

-- ================================================================
-- ENUMS
-- ================================================================

CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE plan_tier AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE org_size AS ENUM ('solo', 'micro', 'small', 'medium', 'large', 'enterprise');
CREATE TYPE data_volume AS ENUM ('under_500', '500_to_5000', '5000_to_50000', '50000_to_500000', 'over_500000');

CREATE TYPE document_type AS ENUM (
  'privacy_policy',
  'cookie_policy',
  'terms_of_use',
  'dpa',
  'ropa',
  'dpia',
  'breach_notification',
  'consent_form',
  'data_retention_policy',
  'third_party_processor',
  'other'
);

CREATE TYPE document_status AS ENUM (
  'missing',
  'pending',
  'analyzing',
  'analyzed',
  'compliant',
  'generating'
);

-- ================================================================
-- TABLE: organizations
-- ================================================================

CREATE TABLE organizations (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT NOT NULL,
  domain                TEXT,
  niche                 TEXT,
  size                  org_size,
  country               TEXT,                         -- ISO 3166-1 alpha-2
  has_eu_presence       BOOLEAN NOT NULL DEFAULT FALSE,
  has_iso_cert          BOOLEAN NOT NULL DEFAULT FALSE,
  maturity_score        SMALLINT CHECK (maturity_score BETWEEN 0 AND 100),
  plan_tier             plan_tier NOT NULL DEFAULT 'free',
  plan_document_limit   SMALLINT DEFAULT 2,           -- NULL = unlimited
  onboarding_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_customer_id    TEXT UNIQUE,                  -- For billing integration
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE organizations IS 'Tenant organizations — each client is one row';
COMMENT ON COLUMN organizations.maturity_score IS 'GDPR compliance score 0-100, computed from onboarding + documents';
COMMENT ON COLUMN organizations.plan_document_limit IS 'Max documents allowed; NULL = unlimited (Enterprise)';

-- ================================================================
-- TABLE: profiles (extends auth.users)
-- ================================================================

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id          UUID REFERENCES organizations(id) ON DELETE SET NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  role            user_role NOT NULL DEFAULT 'viewer',
  email           TEXT NOT NULL,
  invited_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'User profiles linked 1:1 with auth.users; scoped to an organization';

-- ================================================================
-- TABLE: invitations
-- ================================================================

CREATE TABLE invitations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  role            user_role NOT NULL DEFAULT 'viewer',
  token           TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  accepted_at     TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE invitations IS 'Pending team invitations with one-time tokens';

-- ================================================================
-- TABLE: onboarding_responses
-- ================================================================

CREATE TABLE onboarding_responses (
  id                            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id                        UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  niche                         TEXT NOT NULL,
  size                          org_size NOT NULL,
  has_eu_presence               BOOLEAN NOT NULL DEFAULT FALSE,
  data_volume                   data_volume NOT NULL,
  processes_special_categories  BOOLEAN NOT NULL DEFAULT FALSE,  -- GDPR Art. 9 data
  has_iso_cert                  BOOLEAN NOT NULL DEFAULT FALSE,
  existing_documents            document_type[] NOT NULL DEFAULT '{}',
  calculated_score              SMALLINT NOT NULL DEFAULT 0,
  required_documents            document_type[] NOT NULL DEFAULT '{}',
  completed_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE onboarding_responses IS 'Adaptive onboarding answers that drive the AI compliance engine';
COMMENT ON COLUMN onboarding_responses.processes_special_categories IS 'True if org processes health, biometric, political, religious, or criminal data (GDPR Art. 9)';

-- ================================================================
-- TABLE: documents
-- ================================================================

CREATE TABLE documents (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id              UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  type                document_type NOT NULL,
  status              document_status NOT NULL DEFAULT 'pending',
  original_url        TEXT,      -- Supabase Storage path for uploaded original
  compliant_url       TEXT,      -- Supabase Storage path for AI-improved version
  generated_by_ai     BOOLEAN NOT NULL DEFAULT FALSE,
  ai_analysis_json    JSONB,     -- AiAnalysis type: score, missing_clauses, suggestions
  ai_model_used       TEXT,      -- e.g., 'gpt-4o', 'gemini-1.5-pro'
  version             SMALLINT NOT NULL DEFAULT 1,
  created_by          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate document types per org (each type = 1 active doc)
  UNIQUE(org_id, type)
);

COMMENT ON TABLE documents IS 'GDPR compliance documents per organization; one active record per type';
COMMENT ON COLUMN documents.ai_analysis_json IS 'Structured JSON: {compliance_score, missing_clauses[], problematic_clauses[], summary, gdpr_articles_referenced[]}';

-- ================================================================
-- TABLE: document_versions (Version History)
-- ================================================================

CREATE TABLE document_versions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id     UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  version         SMALLINT NOT NULL,
  file_url        TEXT NOT NULL,
  change_summary  TEXT,
  created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE document_versions IS 'Historical versions of documents — available on Pro+ plans';

-- ================================================================
-- TABLE: audit_log
-- ================================================================

CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,    -- e.g., 'document.created', 'document.analyzed', 'user.invited'
  target_id   UUID,             -- ID of the affected entity
  target_type TEXT,             -- e.g., 'document', 'user'
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE audit_log IS 'Immutable audit trail for compliance reporting and regulatory presentation';

-- ================================================================
-- INDEXES
-- ================================================================

CREATE INDEX idx_profiles_org_id ON profiles(org_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_documents_org_id ON documents(org_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_document_versions_document_id ON document_versions(document_id);
CREATE INDEX idx_audit_log_org_id ON audit_log(org_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);

-- ================================================================
-- FUNCTIONS & TRIGGERS
-- ================================================================

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Auto-create profile on user sign-up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Recalculate org maturity_score when documents change
CREATE OR REPLACE FUNCTION recalculate_org_score()
RETURNS TRIGGER AS $$
DECLARE
  v_total     INT;
  v_compliant INT;
  v_new_score SMALLINT;
BEGIN
  SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'compliant')
  INTO v_total, v_compliant
  FROM documents
  WHERE org_id = COALESCE(NEW.org_id, OLD.org_id);

  IF v_total = 0 THEN
    v_new_score := 0;
  ELSE
    v_new_score := ROUND((v_compliant::NUMERIC / v_total) * 100);
  END IF;

  UPDATE organizations
  SET maturity_score = v_new_score
  WHERE id = COALESCE(NEW.org_id, OLD.org_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_recalculate_score_on_document_change
  AFTER INSERT OR UPDATE OR DELETE ON documents
  FOR EACH ROW EXECUTE FUNCTION recalculate_org_score();

-- Enforce plan document limits
CREATE OR REPLACE FUNCTION enforce_document_limit()
RETURNS TRIGGER AS $$
DECLARE
  v_limit   SMALLINT;
  v_current INT;
BEGIN
  SELECT plan_document_limit INTO v_limit FROM organizations WHERE id = NEW.org_id;

  -- NULL limit = unlimited (Enterprise)
  IF v_limit IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO v_current FROM documents WHERE org_id = NEW.org_id;

  IF v_current >= v_limit THEN
    RAISE EXCEPTION 'Limite de documentos do plano atingido (máximo: %). Faça upgrade para continuar.', v_limit
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_document_limit
  BEFORE INSERT ON documents
  FOR EACH ROW EXECUTE FUNCTION enforce_document_limit();

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------
-- Helper function: get the current user's org_id
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION my_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper: get the current user's role
CREATE OR REPLACE FUNCTION my_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ----------------------------------------------------------------
-- ORGANIZATIONS — RLS
-- ----------------------------------------------------------------

-- Members can read their own org
CREATE POLICY "org_select_own"
  ON organizations FOR SELECT
  TO authenticated
  USING (id = my_org_id());

-- Only org admins can update their org
CREATE POLICY "org_update_admin"
  ON organizations FOR UPDATE
  TO authenticated
  USING (id = my_org_id() AND my_role() = 'admin')
  WITH CHECK (id = my_org_id() AND my_role() = 'admin');

-- Insert allowed (for onboarding — user creates org)
CREATE POLICY "org_insert_authenticated"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- ----------------------------------------------------------------
-- PROFILES — RLS
-- ----------------------------------------------------------------

-- Users can read profiles in their org
CREATE POLICY "profiles_select_own_org"
  ON profiles FOR SELECT
  TO authenticated
  USING (org_id = my_org_id() OR id = auth.uid());

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can update roles of users in same org
CREATE POLICY "profiles_update_role_admin"
  ON profiles FOR UPDATE
  TO authenticated
  USING (org_id = my_org_id() AND my_role() = 'admin')
  WITH CHECK (org_id = my_org_id());

-- Allow insert (triggered from handle_new_user — SECURITY DEFINER)
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- ----------------------------------------------------------------
-- DOCUMENTS — RLS
-- ----------------------------------------------------------------

-- All org members can read documents
CREATE POLICY "documents_select_own_org"
  ON documents FOR SELECT
  TO authenticated
  USING (org_id = my_org_id());

-- Admin and Editor can insert documents
CREATE POLICY "documents_insert_editor"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    org_id = my_org_id()
    AND my_role() IN ('admin', 'editor')
  );

-- Admin and Editor can update documents
CREATE POLICY "documents_update_editor"
  ON documents FOR UPDATE
  TO authenticated
  USING (org_id = my_org_id() AND my_role() IN ('admin', 'editor'))
  WITH CHECK (org_id = my_org_id());

-- Only admins can delete documents
CREATE POLICY "documents_delete_admin"
  ON documents FOR DELETE
  TO authenticated
  USING (org_id = my_org_id() AND my_role() = 'admin');

-- ----------------------------------------------------------------
-- DOCUMENT VERSIONS — RLS
-- ----------------------------------------------------------------

CREATE POLICY "doc_versions_select_own_org"
  ON document_versions FOR SELECT
  TO authenticated
  USING (org_id = my_org_id());

CREATE POLICY "doc_versions_insert_editor"
  ON document_versions FOR INSERT
  TO authenticated
  WITH CHECK (org_id = my_org_id() AND my_role() IN ('admin', 'editor'));

-- ----------------------------------------------------------------
-- ONBOARDING RESPONSES — RLS
-- ----------------------------------------------------------------

CREATE POLICY "onboarding_select_own_org"
  ON onboarding_responses FOR SELECT
  TO authenticated
  USING (org_id = my_org_id());

CREATE POLICY "onboarding_insert_own_org"
  ON onboarding_responses FOR INSERT
  TO authenticated
  WITH CHECK (org_id = my_org_id() AND my_role() IN ('admin', 'editor'));

CREATE POLICY "onboarding_update_own_org"
  ON onboarding_responses FOR UPDATE
  TO authenticated
  USING (org_id = my_org_id() AND my_role() IN ('admin', 'editor'));

-- ----------------------------------------------------------------
-- INVITATIONS — RLS
-- ----------------------------------------------------------------

-- Admins can manage invitations in their org
CREATE POLICY "invitations_select_admin"
  ON invitations FOR SELECT
  TO authenticated
  USING (org_id = my_org_id() AND my_role() = 'admin');

CREATE POLICY "invitations_insert_admin"
  ON invitations FOR INSERT
  TO authenticated
  WITH CHECK (org_id = my_org_id() AND my_role() = 'admin');

CREATE POLICY "invitations_delete_admin"
  ON invitations FOR DELETE
  TO authenticated
  USING (org_id = my_org_id() AND my_role() = 'admin');

-- ----------------------------------------------------------------
-- AUDIT LOG — RLS
-- ----------------------------------------------------------------

-- Admins can read the full audit log for their org
CREATE POLICY "audit_select_admin"
  ON audit_log FOR SELECT
  TO authenticated
  USING (org_id = my_org_id() AND my_role() = 'admin');

-- Server-side functions can insert (via service role)
-- No INSERT policy for regular users — always written via SECURITY DEFINER functions

-- ================================================================
-- STORAGE BUCKETS
-- ================================================================

-- Create storage buckets (run in Supabase Dashboard > Storage, or via API)
-- These SQL statements configure bucket policies if using the SQL editor:

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'documents-original',
    'documents-original',
    FALSE,
    52428800,  -- 50MB limit
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  ),
  (
    'documents-compliant',
    'documents-compliant',
    FALSE,
    52428800,
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  )
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: users can only access files within their org folder (org_id/*)
CREATE POLICY "storage_original_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents-original'
    AND (storage.foldername(name))[1] = my_org_id()::TEXT
  );

CREATE POLICY "storage_original_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents-original'
    AND (storage.foldername(name))[1] = my_org_id()::TEXT
    AND my_role() IN ('admin', 'editor')
  );

CREATE POLICY "storage_original_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents-original'
    AND (storage.foldername(name))[1] = my_org_id()::TEXT
    AND my_role() = 'admin'
  );

CREATE POLICY "storage_compliant_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents-compliant'
    AND (storage.foldername(name))[1] = my_org_id()::TEXT
  );

CREATE POLICY "storage_compliant_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents-compliant'
    AND (storage.foldername(name))[1] = my_org_id()::TEXT
  );

-- ================================================================
-- SEED DATA (for local dev / testing only)
-- ================================================================

-- Uncomment to seed a test organization:
/*
INSERT INTO organizations (id, name, domain, niche, size, country, plan_tier, onboarding_completed)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'Acme Corp (Dev)',
  'acme.dev',
  'saas',
  'small',
  'PT',
  'pro',
  TRUE
);
*/

-- ================================================================
-- GRANT SERVICE ROLE ACCESS (for serverless API functions)
-- ================================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ================================================================
-- END OF SCRIPT
-- ================================================================
