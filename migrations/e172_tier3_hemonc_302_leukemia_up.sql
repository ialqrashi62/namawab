-- e172 TIER3_HEMONC-302 Leukemia UP
CREATE TABLE IF NOT EXISTS leukemia_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  classification VARCHAR(50),
  cytogenetics VARCHAR(100),
  molecular VARCHAR(100),
  eln_risk VARCHAR(20),
  on_induction VARCHAR(50),
  mrd_status VARCHAR(30),
  diagnosed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE leukemia_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE leukemia_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS leuk_r_tenant_isolation ON leukemia_records;
CREATE POLICY leuk_r_tenant_isolation ON leukemia_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS neutropenic_fever_episodes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  episode_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  anc NUMERIC(6,2),
  temp_max NUMERIC(4,2),
  severity VARCHAR(20),
  antibiotics_started VARCHAR(200),
  blood_culture_done BOOLEAN,
  onset_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE neutropenic_fever_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE neutropenic_fever_episodes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nfe_tenant_isolation ON neutropenic_fever_episodes;
CREATE POLICY nfe_tenant_isolation ON neutropenic_fever_episodes
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));