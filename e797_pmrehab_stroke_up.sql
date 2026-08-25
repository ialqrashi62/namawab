CREATE TABLE IF NOT EXISTS pmrehab_stroke (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pmrehab_stroke_t ON pmrehab_stroke(tenant_id, patient_id);
ALTER TABLE pmrehab_stroke ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmrehab_stroke FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pmrehab_stroke_t ON pmrehab_stroke;
CREATE POLICY p_pmrehab_stroke_t ON pmrehab_stroke USING (tenant_id = current_setting('app.tenant_id', true));
