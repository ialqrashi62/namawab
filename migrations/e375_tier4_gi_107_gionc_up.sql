-- e375 TIER4_GI-107 GI Oncology (CRC staging, gastric, HCC)
CREATE TABLE IF NOT EXISTS tier4_gi_107_gionc_crc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  t INT NOT NULL,
  n INT NOT NULL,
  m INT NOT NULL,
  msi TEXT,
  ras TEXT,
  stage TEXT,
  therapy TEXT,
  msi_h_role TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_107_gionc_crc ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_107_gionc_crc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_107_gionc_crc_t ON tier4_gi_107_gionc_crc;
CREATE POLICY tier4_gi_107_gionc_crc_t ON tier4_gi_107_gionc_crc
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_107_gionc_gastric (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  location TEXT,
  lauren TEXT,
  her2 TEXT,
  ctdna TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_107_gionc_gastric ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_107_gionc_gastric FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_107_gionc_gastric_t ON tier4_gi_107_gionc_gastric;
CREATE POLICY tier4_gi_107_gionc_gastric_t ON tier4_gi_107_gionc_gastric
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_107_gionc_hcc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  bclc_stage TEXT,
  child_pugh TEXT,
  mvi BOOLEAN,
  afp_ng_ml NUMERIC,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_107_gionc_hcc ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_107_gionc_hcc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_107_gionc_hcc_t ON tier4_gi_107_gionc_hcc;
CREATE POLICY tier4_gi_107_gionc_hcc_t ON tier4_gi_107_gionc_hcc
  USING (tenant_id = current_setting('app.tenant_id', true));