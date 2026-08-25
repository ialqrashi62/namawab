-- filepath: e735_tier5_derm2_ext_105_pigmented_up.sql
CREATE TABLE IF NOT EXISTS pigmented_lesion (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  lesion_id TEXT,
  abcde_total INT NOT NULL,
  triage TEXT NOT NULL,
  photo_url TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pl_t ON pigmented_lesion(tenant_id, patient_id);
ALTER TABLE pigmented_lesion ENABLE ROW LEVEL SECURITY;
ALTER TABLE pigmented_lesion FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pl_t ON pigmented_lesion;
CREATE POLICY p_pl_t ON pigmented_lesion USING (tenant_id = current_setting('app.tenant_id', true));
