-- e519 TIER4_GYN_EXT-101 Menstrual
CREATE TABLE IF NOT EXISTS tier4_gyn_ext_101_aub (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  structural BOOLEAN,
  ovulatory BOOLEAN,
  endometrial BOOLEAN,
  iatrogenic BOOLEAN,
  not_yet_classified BOOLEAN,
  diagnosis TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gyn_ext_101_aub ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gyn_ext_101_aub FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gyn_ext_101_aub_t ON tier4_gyn_ext_101_aub;
CREATE POLICY tier4_gyn_ext_101_aub_t ON tier4_gyn_ext_101_aub
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gyn_ext_101_pattern (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cycle_length_days NUMERIC NOT NULL,
  bleeding_days NUMERIC NOT NULL,
  pad_change_per_hour NUMERIC NOT NULL,
  heavy BOOLEAN,
  oligomenorrhea BOOLEAN,
  polymenorrhea BOOLEAN,
  pattern TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gyn_ext_101_pattern ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gyn_ext_101_pattern FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gyn_ext_101_pattern_t ON tier4_gyn_ext_101_pattern;
CREATE POLICY tier4_gyn_ext_101_pattern_t ON tier4_gyn_ext_101_pattern
  USING (tenant_id = current_setting('app.tenant_id', true));