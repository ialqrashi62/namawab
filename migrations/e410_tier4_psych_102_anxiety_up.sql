-- e410 TIER4_PSYCH-102 Anxiety
CREATE TABLE IF NOT EXISTS tier4_psych_102_anxiety_gad (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  gad7 INT NOT NULL,
  severity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_102_anxiety_gad ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_102_anxiety_gad FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_102_anxiety_gad_t ON tier4_psych_102_anxiety_gad;
CREATE POLICY tier4_psych_102_anxiety_gad_t ON tier4_psych_102_anxiety_gad
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_psych_102_anxiety_panic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  panic_attacks_per_month INT,
  agoraphobia BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_102_anxiety_panic ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_102_anxiety_panic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_102_anxiety_panic_t ON tier4_psych_102_anxiety_panic;
CREATE POLICY tier4_psych_102_anxiety_panic_t ON tier4_psych_102_anxiety_panic
  USING (tenant_id = current_setting('app.tenant_id', true));