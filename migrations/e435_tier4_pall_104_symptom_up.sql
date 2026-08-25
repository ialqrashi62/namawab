-- e435 TIER4_PALL-104 Symptom
CREATE TABLE IF NOT EXISTS tier4_pall_104_symptom_dyspnea (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  dyspnea_nrs_0_10 NUMERIC NOT NULL,
  spo2_pct NUMERIC,
  etiology TEXT,
  opioid_naive BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pall_104_symptom_dyspnea ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pall_104_symptom_dyspnea FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pall_104_symptom_dyspnea_t ON tier4_pall_104_symptom_dyspnea;
CREATE POLICY tier4_pall_104_symptom_dyspnea_t ON tier4_pall_104_symptom_dyspnea
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_pall_104_symptom_nausea (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  etiology TEXT NOT NULL,
  nausea_nrs_0_10 NUMERIC NOT NULL,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pall_104_symptom_nausea ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pall_104_symptom_nausea FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pall_104_symptom_nausea_t ON tier4_pall_104_symptom_nausea;
CREATE POLICY tier4_pall_104_symptom_nausea_t ON tier4_pall_104_symptom_nausea
  USING (tenant_id = current_setting('app.tenant_id', true));