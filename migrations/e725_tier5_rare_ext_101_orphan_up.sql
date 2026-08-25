-- filepath: e725_tier5_rare_ext_101_orphan_up.sql
-- TIER5_RARE_EXT-101: Rare/orphan disease tables
CREATE TABLE IF NOT EXISTS rare_dx (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  disease_code TEXT NOT NULL,
  diagnosis_confidence TEXT NOT NULL,
  diagnosed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rare_t ON rare_dx(tenant_id, disease_code);
ALTER TABLE rare_dx ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_dx FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_rare_t ON rare_dx;
CREATE POLICY p_rare_t ON rare_dx USING (tenant_id = current_setting('app.tenant_id', true));
