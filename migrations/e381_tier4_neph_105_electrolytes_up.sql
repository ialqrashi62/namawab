-- e381 TIER4_NEPH-105 Electrolyte & Acid-Base
CREATE TABLE IF NOT EXISTS tier4_neph_105_electrolytes_hyperk (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  potassium NUMERIC NOT NULL,
  ecg_change TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_105_electrolytes_hyperk ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_105_electrolytes_hyperk FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_105_electrolytes_hyperk_t ON tier4_neph_105_electrolytes_hyperk;
CREATE POLICY tier4_neph_105_electrolytes_hyperk_t ON tier4_neph_105_electrolytes_hyperk
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_neph_105_electrolytes_hypona (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  sodium NUMERIC NOT NULL,
  serum_osm NUMERIC,
  volume_status TEXT,
  severity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_105_electrolytes_hypona ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_105_electrolytes_hypona FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_105_electrolytes_hypona_t ON tier4_neph_105_electrolytes_hypona;
CREATE POLICY tier4_neph_105_electrolytes_hypona_t ON tier4_neph_105_electrolytes_hypona
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_neph_105_electrolytes_acidosis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ph NUMERIC NOT NULL,
  bicarbonate NUMERIC,
  anion_gap NUMERIC,
  etiology TEXT,
  severity TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_105_electrolytes_acidosis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_105_electrolytes_acidosis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_105_electrolytes_acidosis_t ON tier4_neph_105_electrolytes_acidosis;
CREATE POLICY tier4_neph_105_electrolytes_acidosis_t ON tier4_neph_105_electrolytes_acidosis
  USING (tenant_id = current_setting('app.tenant_id', true));