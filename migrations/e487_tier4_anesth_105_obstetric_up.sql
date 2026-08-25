-- e487 TIER4_ANESTH-105 Obstetric
CREATE TABLE IF NOT EXISTS tier4_anesth_105_ob_labor (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  gestational_weeks NUMERIC NOT NULL,
  platelet NUMERIC NOT NULL,
  inr NUMERIC NOT NULL,
  vb_history BOOLEAN,
  recommended TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_anesth_105_ob_labor ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_anesth_105_ob_labor FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_anesth_105_ob_labor_t ON tier4_anesth_105_ob_labor;
CREATE POLICY tier4_anesth_105_ob_labor_t ON tier4_anesth_105_ob_labor
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_anesth_105_ob_csection (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  emergency BOOLEAN,
  platelet NUMERIC NOT NULL,
  spinal_anatomy_difficult BOOLEAN,
  anesthesia TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_anesth_105_ob_csection ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_anesth_105_ob_csection FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_anesth_105_ob_csection_t ON tier4_anesth_105_ob_csection;
CREATE POLICY tier4_anesth_105_ob_csection_t ON tier4_anesth_105_ob_csection
  USING (tenant_id = current_setting('app.tenant_id', true));