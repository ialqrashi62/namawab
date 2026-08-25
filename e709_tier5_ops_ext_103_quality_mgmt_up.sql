-- filepath: e709_tier5_ops_ext_103_quality_mgmt_up.sql
-- TIER5_OPS_EXT-103: Quality management tables
CREATE TABLE IF NOT EXISTS quality_indicator (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  indicator_code TEXT NOT NULL,
  indicator_name TEXT NOT NULL,
  category TEXT NOT NULL,
  numerator INT NOT NULL,
  denominator INT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_q_ind_t_period ON quality_indicator(tenant_id, period_end);

ALTER TABLE quality_indicator ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_indicator FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_q_ind_t ON quality_indicator;
CREATE POLICY p_q_ind_t ON quality_indicator USING (tenant_id = current_setting('app.tenant_id', true));
