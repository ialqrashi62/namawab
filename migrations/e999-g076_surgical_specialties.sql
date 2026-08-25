-- filepath: migrations/e999-g076_surgical_specialties.sql
-- TIER56 Surgical Specialties (5 tables)
CREATE TABLE IF NOT EXISTS surg_neuro (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  approach TEXT,
  extent TEXT,
  complications TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE surg_neuro ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_neuro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON surg_neuro;
CREATE POLICY p1 ON surg_neuro USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS surg_plastic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  type TEXT,
  indication TEXT,
  follow_up NUMERIC,
  complications TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE surg_plastic ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_plastic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON surg_plastic;
CREATE POLICY p1 ON surg_plastic USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS surg_urology (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  approach TEXT,
  indication TEXT,
  complication TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE surg_urology ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_urology FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON surg_urology;
CREATE POLICY p1 ON surg_urology USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS surg_ent_surg (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  indication TEXT,
  extent TEXT,
  severity TEXT,
  complications TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE surg_ent_surg ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_ent_surg FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON surg_ent_surg;
CREATE POLICY p1 ON surg_ent_surg USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS surg_thoracic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  approach TEXT,
  indication TEXT,
  lobe TEXT,
  complications TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE surg_thoracic ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_thoracic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON surg_thoracic;
CREATE POLICY p1 ON surg_thoracic USING (tenant_id = current_setting('app.tenant_id', true));