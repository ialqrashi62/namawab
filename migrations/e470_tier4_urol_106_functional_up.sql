-- e470 TIER4_UROL-106 Functional
CREATE TABLE IF NOT EXISTS tier4_urol_106_incontinence (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  leakage_with_cough BOOLEAN,
  leakage_with_urgency BOOLEAN,
  leakage_constantly BOOLEAN,
  prior_hysterectomy BOOLEAN,
  pregnancy BOOLEAN,
  type TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urol_106_incontinence ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urol_106_incontinence FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urol_106_incontinence_t ON tier4_urol_106_incontinence;
CREATE POLICY tier4_urol_106_incontinence_t ON tier4_urol_106_incontinence
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_urol_106_ic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pelvic_pain BOOLEAN,
  bladder_urgency BOOLEAN,
  frequency NUMERIC NOT NULL,
  nocturia NUMERIC NOT NULL,
  hunner_ulcer BOOLEAN,
  chronic BOOLEAN,
  diagnosis TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urol_106_ic ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urol_106_ic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urol_106_ic_t ON tier4_urol_106_ic;
CREATE POLICY tier4_urol_106_ic_t ON tier4_urol_106_ic
  USING (tenant_id = current_setting('app.tenant_id', true));