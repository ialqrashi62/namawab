-- e461 TIER4_OPHTH-103 Cornea
CREATE TABLE IF NOT EXISTS tier4_ophth_103_cornea_ulcer (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  size_mm NUMERIC NOT NULL,
  central BOOLEAN,
  hypopyon BOOLEAN,
  contact_lens_wearer BOOLEAN,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_103_cornea_ulcer ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_103_cornea_ulcer FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_103_cornea_ulcer_t ON tier4_ophth_103_cornea_ulcer;
CREATE POLICY tier4_ophth_103_cornea_ulcer_t ON tier4_ophth_103_cornea_ulcer
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_ophth_103_cornea_dryeye (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  schirmer NUMERIC NOT NULL,
  osmolarity NUMERIC NOT NULL,
  staining BOOLEAN,
  severity TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_103_cornea_dryeye ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_103_cornea_dryeye FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_103_cornea_dryeye_t ON tier4_ophth_103_cornea_dryeye;
CREATE POLICY tier4_ophth_103_cornea_dryeye_t ON tier4_ophth_103_cornea_dryeye
  USING (tenant_id = current_setting('app.tenant_id', true));