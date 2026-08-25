-- filepath: e707_tier5_ops_ext_101_bed_mgmt_up.sql
-- TIER5_OPS_EXT-101: Bed Management tables
CREATE TABLE IF NOT EXISTS bed_state (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  unit TEXT NOT NULL,
  bed_id TEXT NOT NULL,
  status TEXT NOT NULL,
  patient_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bed_state_t_unit ON bed_state(tenant_id, unit);
CREATE INDEX IF NOT EXISTS idx_bed_state_t_patient ON bed_state(tenant_id, patient_id);

CREATE TABLE IF NOT EXISTS bed_daily_metrics (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  snapshot_date DATE NOT NULL,
  unit TEXT NOT NULL,
  beds_total INT NOT NULL,
  beds_occupied INT NOT NULL,
  admissions INT NOT NULL,
  discharges INT NOT NULL,
  ready_to_leave INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bed_daily_t_date ON bed_daily_metrics(tenant_id, snapshot_date);

ALTER TABLE bed_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE bed_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE bed_state FORCE ROW LEVEL SECURITY;
ALTER TABLE bed_daily_metrics FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS p_bed_state_t ON bed_state;
CREATE POLICY p_bed_state_t ON bed_state USING (tenant_id = current_setting('app.tenant_id', true));
DROP POLICY IF EXISTS p_bed_daily_t ON bed_daily_metrics;
CREATE POLICY p_bed_daily_t ON bed_daily_metrics USING (tenant_id = current_setting('app.tenant_id', true));
