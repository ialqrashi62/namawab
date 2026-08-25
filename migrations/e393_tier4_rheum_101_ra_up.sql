-- e393 TIER4_RHEUM-101 Rheumatoid Arthritis
CREATE TABLE IF NOT EXISTS tier4_rheum_101_ra_das28 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  tender_joints INT NOT NULL,
  swollen_joints INT NOT NULL,
  esr NUMERIC NOT NULL,
  patient_global_0_100 NUMERIC,
  das28 NUMERIC,
  activity TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_101_ra_das28 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_101_ra_das28 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_101_ra_das28_t ON tier4_rheum_101_ra_das28;
CREATE POLICY tier4_rheum_101_ra_das28_t ON tier4_rheum_101_ra_das28
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rheum_101_ra_t2t (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  activity TEXT NOT NULL,
  csdmard BOOLEAN,
  bdmard BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_101_ra_t2t ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_101_ra_t2t FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_101_ra_t2t_t ON tier4_rheum_101_ra_t2t;
CREATE POLICY tier4_rheum_101_ra_t2t_t ON tier4_rheum_101_ra_t2t
  USING (tenant_id = current_setting('app.tenant_id', true));