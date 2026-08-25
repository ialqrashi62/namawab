-- e428 TIER4_PULM-104 PAH
CREATE TABLE IF NOT EXISTS tier4_pulm_104_pulmhtn_risk (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  who_functional_class INT NOT NULL,
  six_min_walk_meters NUMERIC,
  ntprobnp NUMERIC,
  right_atrial_pressure NUMERIC,
  cardiac_index NUMERIC,
  risk_score INT,
  risk TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_104_pulmhtn_risk ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_104_pulmhtn_risk FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_104_pulmhtn_risk_t ON tier4_pulm_104_pulmhtn_risk;
CREATE POLICY tier4_pulm_104_pulmhtn_risk_t ON tier4_pulm_104_pulmhtn_risk
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_pulm_104_pulmhtn_cteph (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  chronic_pe_history BOOLEAN,
  operable BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_104_pulmhtn_cteph ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_104_pulmhtn_cteph FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_104_pulmhtn_cteph_t ON tier4_pulm_104_pulmhtn_cteph;
CREATE POLICY tier4_pulm_104_pulmhtn_cteph_t ON tier4_pulm_104_pulmhtn_cteph
  USING (tenant_id = current_setting('app.tenant_id', true));