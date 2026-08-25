-- e394 TIER4_RHEUM-102 SLE
CREATE TABLE IF NOT EXISTS tier4_rheum_102_lupus_sledai (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  sledai INT NOT NULL,
  activity TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_102_lupus_sledai ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_102_lupus_sledai FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_102_lupus_sledai_t ON tier4_rheum_102_lupus_sledai;
CREATE POLICY tier4_rheum_102_lupus_sledai_t ON tier4_rheum_102_lupus_sledai
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rheum_102_lupus_ln (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  isn_class TEXT NOT NULL,
  creatinine_rising BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_102_lupus_ln ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_102_lupus_ln FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_102_lupus_ln_t ON tier4_rheum_102_lupus_ln;
CREATE POLICY tier4_rheum_102_lupus_ln_t ON tier4_rheum_102_lupus_ln
  USING (tenant_id = current_setting('app.tenant_id', true));