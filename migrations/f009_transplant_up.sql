-- filepath: migrations/f009_transplant_up.sql
-- TIER24_TRANSPLANT_EXT 153-157 transplant tables

CREATE TABLE IF NOT EXISTS tier24_transplant_candidate (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  candidate_id TEXT,
  recipient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier24_transplant_candidate ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier24_transplant_candidate FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier24_transplant_candidate_tenant ON tier24_transplant_candidate;
CREATE POLICY tier24_transplant_candidate_tenant ON tier24_transplant_candidate USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier24_transplant_candidate_tenant_idx ON tier24_transplant_candidate (tenant_id, candidate_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier24_transplant_donor (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  donor_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier24_transplant_donor ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier24_transplant_donor FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier24_transplant_donor_tenant ON tier24_transplant_donor;
CREATE POLICY tier24_transplant_donor_tenant ON tier24_transplant_donor USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier24_transplant_donor_tenant_idx ON tier24_transplant_donor (tenant_id, donor_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier24_transplant_immuno (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  recipient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier24_transplant_immuno ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier24_transplant_immuno FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier24_transplant_immuno_tenant ON tier24_transplant_immuno;
CREATE POLICY tier24_transplant_immuno_tenant ON tier24_transplant_immuno USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier24_transplant_immuno_tenant_idx ON tier24_transplant_immuno (tenant_id, recipient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier24_transplant_outcome (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  recipient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier24_transplant_outcome ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier24_transplant_outcome FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier24_transplant_outcome_tenant ON tier24_transplant_outcome;
CREATE POLICY tier24_transplant_outcome_tenant ON tier24_transplant_outcome USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier24_transplant_outcome_tenant_idx ON tier24_transplant_outcome (tenant_id, recipient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier24_transplant_followup (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  recipient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier24_transplant_followup ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier24_transplant_followup FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier24_transplant_followup_tenant ON tier24_transplant_followup;
CREATE POLICY tier24_transplant_followup_tenant ON tier24_transplant_followup USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier24_transplant_followup_tenant_idx ON tier24_transplant_followup (tenant_id, recipient_id, created_at DESC);