-- e160 TIER3_GI-305 GI Bleed UP
CREATE TABLE IF NOT EXISTS gi_bleed_episodes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  episode_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  source VARCHAR(20),
  blatchford_score INTEGER,
  risk_level VARCHAR(20),
  hemoglobin_at_presentation NUMERIC(4,2),
  transfusion_required BOOLEAN,
  endoscopy_timing VARCHAR(20),
  presenting_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE gi_bleed_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_bleed_episodes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gi_b_tenant_isolation ON gi_bleed_episodes;
CREATE POLICY gi_b_tenant_isolation ON gi_bleed_episodes
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));