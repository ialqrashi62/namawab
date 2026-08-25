-- filepath: e716_tier5_rehab_ext_104_amputee_prosthetic_up.sql
CREATE TABLE IF NOT EXISTS prosthetic_fit (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  amputation_level TEXT NOT NULL,
  prosthetic_type TEXT NOT NULL,
  fit_quality INT NOT NULL,
  fitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pros_t_pat ON prosthetic_fit(tenant_id, patient_id);
ALTER TABLE prosthetic_fit ENABLE ROW LEVEL SECURITY;
ALTER TABLE prosthetic_fit FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pros_t ON prosthetic_fit;
CREATE POLICY p_pros_t ON prosthetic_fit USING (tenant_id = current_setting('app.tenant_id', true));
