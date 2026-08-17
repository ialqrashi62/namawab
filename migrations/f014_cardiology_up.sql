-- filepath: migrations/f014_cardiology_up.sql
-- TIER29_CARDIOLOGY_EXT 178-182 cardiology tables

CREATE TABLE IF NOT EXISTS tier29_cardiology_stress (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  test_id TEXT,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier29_cardiology_stress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier29_cardiology_stress FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier29_cardiology_stress_tenant ON tier29_cardiology_stress;
CREATE POLICY tier29_cardiology_stress_tenant ON tier29_cardiology_stress USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier29_cardiology_stress_tenant_idx ON tier29_cardiology_stress (tenant_id, test_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier29_cardiology_echo (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  study_id TEXT,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier29_cardiology_echo ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier29_cardiology_echo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier29_cardiology_echo_tenant ON tier29_cardiology_echo;
CREATE POLICY tier29_cardiology_echo_tenant ON tier29_cardiology_echo USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier29_cardiology_echo_tenant_idx ON tier29_cardiology_echo (tenant_id, study_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier29_cardiology_cath (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  procedure_id TEXT,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier29_cardiology_cath ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier29_cardiology_cath FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier29_cardiology_cath_tenant ON tier29_cardiology_cath;
CREATE POLICY tier29_cardiology_cath_tenant ON tier29_cardiology_cath USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier29_cardiology_cath_tenant_idx ON tier29_cardiology_cath (tenant_id, procedure_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier29_cardiology_ep (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  assessment_id TEXT,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier29_cardiology_ep ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier29_cardiology_ep FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier29_cardiology_ep_tenant ON tier29_cardiology_ep;
CREATE POLICY tier29_cardiology_ep_tenant ON tier29_cardiology_ep USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier29_cardiology_ep_tenant_idx ON tier29_cardiology_ep (tenant_id, assessment_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier29_cardiology_hf (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier29_cardiology_hf ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier29_cardiology_hf FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier29_cardiology_hf_tenant ON tier29_cardiology_hf;
CREATE POLICY tier29_cardiology_hf_tenant ON tier29_cardiology_hf USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier29_cardiology_hf_tenant_idx ON tier29_cardiology_hf (tenant_id, patient_id, created_at DESC);