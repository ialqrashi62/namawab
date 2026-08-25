-- e465 TIER4_UROL-101 Stones
CREATE TABLE IF NOT EXISTS tier4_urol_101_stones_size (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  size_mm NUMERIC NOT NULL,
  location TEXT NOT NULL,
  hounsfield NUMERIC NOT NULL,
  composition_guess TEXT,
  intervention TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urol_101_stones_size ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urol_101_stones_size FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urol_101_stones_size_t ON tier4_urol_101_stones_size;
CREATE POLICY tier4_urol_101_stones_size_t ON tier4_urol_101_stones_size
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_urol_101_stones_uti (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  dysuria BOOLEAN,
  frequency BOOLEAN,
  flank_pain BOOLEAN,
  fever BOOLEAN,
  pregnancy BOOLEAN,
  catheter BOOLEAN,
  diagnosis TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urol_101_stones_uti ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urol_101_stones_uti FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urol_101_stones_uti_t ON tier4_urol_101_stones_uti;
CREATE POLICY tier4_urol_101_stones_uti_t ON tier4_urol_101_stones_uti
  USING (tenant_id = current_setting('app.tenant_id', true));