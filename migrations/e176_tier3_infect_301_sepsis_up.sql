-- e176 TIER3_INFECT-301 Sepsis UP
CREATE TABLE IF NOT EXISTS sepsis_episodes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  episode_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  qsofa_score INTEGER,
  sofa_score INTEGER,
  lactate_initial NUMERIC(4,2),
  lactate_repeat NUMERIC(4,2),
  source VARCHAR(50),
  antibiotics_started VARCHAR(200),
  onset_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sepsis_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sepsis_episodes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sep_e_tenant_isolation ON sepsis_episodes;
CREATE POLICY sep_e_tenant_isolation ON sepsis_episodes
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));