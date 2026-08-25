-- filepath: e726_tier5_rare_ext_102_iem_up.sql
CREATE TABLE IF NOT EXISTS iem_screen (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  disease TEXT NOT NULL,
  result TEXT NOT NULL,
  screened_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_iem_t ON iem_screen(tenant_id, disease);
ALTER TABLE iem_screen ENABLE ROW LEVEL SECURITY;
ALTER TABLE iem_screen FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_iem_t ON iem_screen;
CREATE POLICY p_iem_t ON iem_screen USING (tenant_id = current_setting('app.tenant_id', true));
