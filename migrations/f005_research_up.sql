-- filepath: migrations/f005_research_up.sql
-- TIER20_RESEARCH_EXT 132-136 research tables

CREATE TABLE IF NOT EXISTS tier20_research_trial (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  trial_id TEXT,
  subject_id TEXT,
  phase TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier20_research_trial ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier20_research_trial FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier20_research_trial_tenant ON tier20_research_trial;
CREATE POLICY tier20_research_trial_tenant ON tier20_research_trial USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier20_research_trial_tenant_idx ON tier20_research_trial (tenant_id, trial_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier20_research_consent (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  subject_id TEXT,
  trial_id TEXT,
  consent_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier20_research_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier20_research_consent FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier20_research_consent_tenant ON tier20_research_consent;
CREATE POLICY tier20_research_consent_tenant ON tier20_research_consent USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier20_research_consent_tenant_idx ON tier20_research_consent (tenant_id, subject_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier20_research_irb (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  submission_id TEXT,
  review_type TEXT,
  decision TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier20_research_irb ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier20_research_irb FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier20_research_irb_tenant ON tier20_research_irb;
CREATE POLICY tier20_research_irb_tenant ON tier20_research_irb USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier20_research_irb_tenant_idx ON tier20_research_irb (tenant_id, submission_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier20_research_recruitment (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  trial_id TEXT,
  screened_count DOUBLE PRECISION,
  enrolled_count DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier20_research_recruitment ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier20_research_recruitment FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier20_research_recruitment_tenant ON tier20_research_recruitment;
CREATE POLICY tier20_research_recruitment_tenant ON tier20_research_recruitment USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier20_research_recruitment_tenant_idx ON tier20_research_recruitment (tenant_id, trial_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier20_research_biobank (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  sample_id TEXT,
  specimen_type TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier20_research_biobank ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier20_research_biobank FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier20_research_biobank_tenant ON tier20_research_biobank;
CREATE POLICY tier20_research_biobank_tenant ON tier20_research_biobank USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier20_research_biobank_tenant_idx ON tier20_research_biobank (tenant_id, sample_id, created_at DESC);