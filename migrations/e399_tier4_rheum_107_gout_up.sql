-- e399 TIER4_RHEUM-107 Gout & CPPD
CREATE TABLE IF NOT EXISTS tier4_rheum_107_gout_flare (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  joint_count INT NOT NULL,
  location TEXT,
  renal_function TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_107_gout_flare ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_107_gout_flare FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_107_gout_flare_t ON tier4_rheum_107_gout_flare;
CREATE POLICY tier4_rheum_107_gout_flare_t ON tier4_rheum_107_gout_flare
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rheum_107_gout_ult (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  urate_mg_dl NUMERIC NOT NULL,
  tophi_present BOOLEAN,
  urate_stones BOOLEAN,
  target NUMERIC,
  therapy TEXT,
  prophylaxis TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_107_gout_ult ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_107_gout_ult FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_107_gout_ult_t ON tier4_rheum_107_gout_ult;
CREATE POLICY tier4_rheum_107_gout_ult_t ON tier4_rheum_107_gout_ult
  USING (tenant_id = current_setting('app.tenant_id', true));