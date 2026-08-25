-- e491 TIER4_URG-103 Injury
CREATE TABLE IF NOT EXISTS tier4_urg_103_inj_head (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  gcs NUMERIC NOT NULL,
  loss_of_consciousness BOOLEAN,
  anticoagulation BOOLEAN,
  vomiting BOOLEAN,
  age NUMERIC NOT NULL,
  amnesia BOOLEAN,
  worry BOOLEAN,
  rule TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urg_103_inj_head ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urg_103_inj_head FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urg_103_inj_head_t ON tier4_urg_103_inj_head;
CREATE POLICY tier4_urg_103_inj_head_t ON tier4_urg_103_inj_head
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_urg_103_inj_fracture (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  location TEXT NOT NULL,
  deformity BOOLEAN,
  swelling BOOLEAN,
  weight_bearing BOOLEAN,
  age NUMERIC NOT NULL,
  imaging TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urg_103_inj_fracture ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urg_103_inj_fracture FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urg_103_inj_fracture_t ON tier4_urg_103_inj_fracture;
CREATE POLICY tier4_urg_103_inj_fracture_t ON tier4_urg_103_inj_fracture
  USING (tenant_id = current_setting('app.tenant_id', true));