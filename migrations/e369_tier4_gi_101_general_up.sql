-- e369 TIER4_GI-101 General GI (GERD, IBS, dyspepsia)
CREATE TABLE IF NOT EXISTS tier4_gi_101_general_gerd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  duration_weeks INT NOT NULL,
  alarm_features BOOLEAN NOT NULL DEFAULT FALSE,
  therapy TEXT NOT NULL,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_101_general_gerd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_101_general_gerd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_101_general_gerd_t ON tier4_gi_101_general_gerd;
CREATE POLICY tier4_gi_101_general_gerd_t ON tier4_gi_101_general_gerd
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_101_general_ibs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  subtype TEXT NOT NULL,
  therapy TEXT NOT NULL,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_101_general_ibs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_101_general_ibs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_101_general_ibs_t ON tier4_gi_101_general_ibs;
CREATE POLICY tier4_gi_101_general_ibs_t ON tier4_gi_101_general_ibs
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_101_general_dyspepsia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  alarm BOOLEAN NOT NULL DEFAULT FALSE,
  therapy TEXT NOT NULL,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_101_general_dyspepsia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_101_general_dyspepsia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_101_general_dyspepsia_t ON tier4_gi_101_general_dyspepsia;
CREATE POLICY tier4_gi_101_general_dyspepsia_t ON tier4_gi_101_general_dyspepsia
  USING (tenant_id = current_setting('app.tenant_id', true));