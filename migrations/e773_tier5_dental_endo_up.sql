-- e773 tier5 dental endo
CREATE TABLE IF NOT EXISTS dental_endo (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dent_t ON dental_endo(tenant_id, patient_id);
ALTER TABLE dental_endo ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_endo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_dent_t ON dental_endo;
CREATE POLICY p_dent_t ON dental_endo USING (tenant_id = current_setting('app.tenant_id', true));
