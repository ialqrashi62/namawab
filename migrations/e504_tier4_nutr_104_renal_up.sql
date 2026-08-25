-- e504 TIER4_NUTR-104 Renal + Diabetic
CREATE TABLE IF NOT EXISTS tier4_nutr_104_renal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ckd_stage NUMERIC NOT NULL,
  on_dialysis BOOLEAN,
  potassium NUMERIC NOT NULL,
  phosphorus NUMERIC NOT NULL,
  protein_intake TEXT,
  potassium_restriction BOOLEAN,
  phosphorus_restriction BOOLEAN,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_nutr_104_renal ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_nutr_104_renal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_nutr_104_renal_t ON tier4_nutr_104_renal;
CREATE POLICY tier4_nutr_104_renal_t ON tier4_nutr_104_renal
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_nutr_104_diabetic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hba1c NUMERIC NOT NULL,
  carb_counting BOOLEAN,
  glycemic_index_awareness BOOLEAN,
  meal_pattern TEXT NOT NULL,
  carb_plan TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_nutr_104_diabetic ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_nutr_104_diabetic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_nutr_104_diabetic_t ON tier4_nutr_104_diabetic;
CREATE POLICY tier4_nutr_104_diabetic_t ON tier4_nutr_104_diabetic
  USING (tenant_id = current_setting('app.tenant_id', true));