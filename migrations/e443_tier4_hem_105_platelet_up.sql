-- e443 TIER4_HEM-105 Platelet
CREATE TABLE IF NOT EXISTS tier4_hem_105_platelet_thrombo (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  platelet_count NUMERIC NOT NULL,
  etiology TEXT,
  mucocutaneous_bleeding BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_105_platelet_thrombo ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_105_platelet_thrombo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_105_platelet_thrombo_t ON tier4_hem_105_platelet_thrombo;
CREATE POLICY tier4_hem_105_platelet_thrombo_t ON tier4_hem_105_platelet_thrombo
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_hem_105_platelet_itp (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  platelet_count NUMERIC NOT NULL,
  chronicity TEXT NOT NULL,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_105_platelet_itp ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_105_platelet_itp FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_105_platelet_itp_t ON tier4_hem_105_platelet_itp;
CREATE POLICY tier4_hem_105_platelet_itp_t ON tier4_hem_105_platelet_itp
  USING (tenant_id = current_setting('app.tenant_id', true));