-- TIER4_NEURO_EXT-102 Stroke
CREATE TABLE IF NOT EXISTS tier4_neuro_ext_102_stroke (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  nihss INT,
  eligible BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neuro_ext_102_stroke ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neuro_ext_102_stroke FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neuro_ext_102_stroke_isolation ON tier4_neuro_ext_102_stroke;
CREATE POLICY tier4_neuro_ext_102_stroke_isolation ON tier4_neuro_ext_102_stroke
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));