-- e761 tier5 pharmacy pgx
CREATE TABLE IF NOT EXISTS pharmacy_pgx (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pgx_t ON pharmacy_pgx(tenant_id, patient_id);
ALTER TABLE pharmacy_pgx ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_pgx FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pgx_t ON pharmacy_pgx;
CREATE POLICY p_pgx_t ON pharmacy_pgx USING (tenant_id = current_setting('app.tenant_id', true));
