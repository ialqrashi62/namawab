-- e152 TIER3_RENAL-302 AKI UP
CREATE TABLE IF NOT EXISTS aki_episodes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  episode_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  stage VARCHAR(20),
  cause VARCHAR(50),
  baseline_creatinine NUMERIC(6,2),
  peak_creatinine NUMERIC(6,2),
  onset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  recovery_status VARCHAR(20),
  rrt_needed BOOLEAN DEFAULT false
);
ALTER TABLE aki_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE aki_episodes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS aki_e_tenant_isolation ON aki_episodes;
CREATE POLICY aki_e_tenant_isolation ON aki_episodes
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));