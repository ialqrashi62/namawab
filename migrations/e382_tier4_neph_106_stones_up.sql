-- e382 TIER4_NEPH-106 Stones
CREATE TABLE IF NOT EXISTS tier4_neph_106_stones_colic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  stone_size_mm NUMERIC NOT NULL,
  location TEXT,
  hydronephrosis TEXT,
  urosepsis BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_106_stones_colic ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_106_stones_colic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_106_stones_colic_t ON tier4_neph_106_stones_colic;
CREATE POLICY tier4_neph_106_stones_colic_t ON tier4_neph_106_stones_colic
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_neph_106_stones_composition (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  composition TEXT,
  recurrent BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_106_stones_composition ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_106_stones_composition FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_106_stones_composition_t ON tier4_neph_106_stones_composition;
CREATE POLICY tier4_neph_106_stones_composition_t ON tier4_neph_106_stones_composition
  USING (tenant_id = current_setting('app.tenant_id', true));