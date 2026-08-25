-- filepath: e708_tier5_ops_ext_102_staff_sched_up.sql
-- TIER5_OPS_EXT-102: Staff scheduling tables
CREATE TABLE IF NOT EXISTS staff_schedule (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  schedule_date DATE NOT NULL,
  staff_id TEXT NOT NULL,
  role TEXT NOT NULL,
  unit TEXT NOT NULL,
  shift TEXT NOT NULL,
  hours_scheduled NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sched_t_date ON staff_schedule(tenant_id, schedule_date);
CREATE INDEX IF NOT EXISTS idx_sched_t_role ON staff_schedule(tenant_id, role);

ALTER TABLE staff_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_schedule FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_sched_t ON staff_schedule;
CREATE POLICY p_sched_t ON staff_schedule USING (tenant_id = current_setting('app.tenant_id', true));
