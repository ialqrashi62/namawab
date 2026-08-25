CREATE TABLE IF NOT EXISTS home_wound (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  wound_type TEXT NOT NULL,
  area_cm2 NUMERIC NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_hw_t ON home_wound(tenant_id, patient_id);
ALTER TABLE home_wound ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_wound FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_hw_t ON home_wound;
CREATE POLICY p_hw_t ON home_wound USING (tenant_id = current_setting('app.tenant_id', true));
