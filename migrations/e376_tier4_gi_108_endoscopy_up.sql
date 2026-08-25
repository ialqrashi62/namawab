-- e376 TIER4_GI-108 Endoscopy (polyp risk, GI bleeding, EUS)
CREATE TABLE IF NOT EXISTS tier4_gi_108_endoscopy_polyp (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  polyp_count INT NOT NULL,
  largest_polyp_mm NUMERIC,
  histology TEXT,
  syndrome TEXT,
  surveillance TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_108_endoscopy_polyp ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_108_endoscopy_polyp FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_108_endoscopy_polyp_t ON tier4_gi_108_endoscopy_polyp;
CREATE POLICY tier4_gi_108_endoscopy_polyp_t ON tier4_gi_108_endoscopy_polyp
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_108_endoscopy_bleeding (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  presentation TEXT,
  heart_rate NUMERIC,
  sbp NUMERIC,
  hemoglobin NUMERIC,
  rockall_score NUMERIC,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_108_endoscopy_bleeding ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_108_endoscopy_bleeding FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_108_endoscopy_bleeding_t ON tier4_gi_108_endoscopy_bleeding;
CREATE POLICY tier4_gi_108_endoscopy_bleeding_t ON tier4_gi_108_endoscopy_bleeding
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_108_endoscopy_eus (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  indication TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_108_endoscopy_eus ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_108_endoscopy_eus FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_108_endoscopy_eus_t ON tier4_gi_108_endoscopy_eus;
CREATE POLICY tier4_gi_108_endoscopy_eus_t ON tier4_gi_108_endoscopy_eus
  USING (tenant_id = current_setting('app.tenant_id', true));