-- filepath: migrations/e999-g147_specialty_ext.sql
CREATE TABLE IF NOT EXISTS tier127_cardio_656 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ecg_id TEXT, pm_id TEXT, icd_id TEXT, rehab_id TEXT, chf_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier127_cardio_656 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier127_cardio_656 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t127_card_656_isolation ON tier127_cardio_656;
CREATE POLICY t127_card_656_isolation ON tier127_cardio_656 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier127_neuro_657 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  nih_id TEXT, seiz_id TEXT, exam_id TEXT, eeg_id TEXT, lp_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier127_neuro_657 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier127_neuro_657 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t127_neuro_657_isolation ON tier127_neuro_657;
CREATE POLICY t127_neuro_657_isolation ON tier127_neuro_657 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier127_oncology_658 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cycle_id TEXT, resp_id TEXT, surv_id TEXT, pc_id TEXT, hospice_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier127_oncology_658 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier127_oncology_658 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t127_onco_658_isolation ON tier127_oncology_658;
CREATE POLICY t127_onco_658_isolation ON tier127_oncology_658 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier127_dialysis_659 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hd_id TEXT, pd_id TEXT, access_id TEXT, workup_id TEXT, ckd_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier127_dialysis_659 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier127_dialysis_659 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t127_dial_659_isolation ON tier127_dialysis_659;
CREATE POLICY t127_dial_659_isolation ON tier127_dialysis_659 USING (tenant_id = current_setting('app.tenant_id', true));