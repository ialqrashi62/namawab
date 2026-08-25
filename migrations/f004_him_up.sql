-- filepath: migrations/f004_him_up.sql
-- TIER19_HIM_EXT 127-131 HIM tables

CREATE TABLE IF NOT EXISTS tier19_him_coding (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  encounter_id TEXT,
  code TEXT,
  code_type TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier19_him_coding ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier19_him_coding FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier19_him_coding_tenant ON tier19_him_coding;
CREATE POLICY tier19_him_coding_tenant ON tier19_him_coding USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier19_him_coding_tenant_idx ON tier19_him_coding (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier19_him_roi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  recipient_id TEXT,
  request_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier19_him_roi ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier19_him_roi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier19_him_roi_tenant ON tier19_him_roi;
CREATE POLICY tier19_him_roi_tenant ON tier19_him_roi USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier19_him_roi_tenant_idx ON tier19_him_roi (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier19_him_deficiency (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  chart_id TEXT,
  assigned_to TEXT,
  deficiency_type TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier19_him_deficiency ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier19_him_deficiency FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier19_him_deficiency_tenant ON tier19_him_deficiency;
CREATE POLICY tier19_him_deficiency_tenant ON tier19_him_deficiency USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier19_him_deficiency_tenant_idx ON tier19_him_deficiency (tenant_id, chart_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier19_him_audit (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  audit_id TEXT,
  audit_type TEXT,
  compliance_pct DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier19_him_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier19_him_audit FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier19_him_audit_tenant ON tier19_him_audit;
CREATE POLICY tier19_him_audit_tenant ON tier19_him_audit USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier19_him_audit_tenant_idx ON tier19_him_audit (tenant_id, audit_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier19_him_release (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  doc_id TEXT,
  chart_id TEXT,
  release_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier19_him_release ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier19_him_release FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier19_him_release_tenant ON tier19_him_release;
CREATE POLICY tier19_him_release_tenant ON tier19_him_release USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier19_him_release_tenant_idx ON tier19_him_release (tenant_id, doc_id, created_at DESC);