-- e467 TIER4_UROL-103 BPH
CREATE TABLE IF NOT EXISTS tier4_urol_103_bph_ipss (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  urgency NUMERIC NOT NULL,
  frequency NUMERIC NOT NULL,
  hesitancy NUMERIC NOT NULL,
  incomplete_emptying NUMERIC NOT NULL,
  nocturia NUMERIC NOT NULL,
  weak_stream NUMERIC NOT NULL,
  straining NUMERIC NOT NULL,
  intermittency NUMERIC NOT NULL,
  total NUMERIC,
  severity TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urol_103_bph_ipss ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urol_103_bph_ipss FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urol_103_bph_ipss_t ON tier4_urol_103_bph_ipss;
CREATE POLICY tier4_urol_103_bph_ipss_t ON tier4_urol_103_bph_ipss
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_urol_103_bph_psa (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  psa_value NUMERIC NOT NULL,
  age INT NOT NULL,
  previous_psa NUMERIC,
  velocity NUMERIC,
  finasteride BOOLEAN,
  adjusted_psa NUMERIC,
  action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urol_103_bph_psa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urol_103_bph_psa FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urol_103_bph_psa_t ON tier4_urol_103_bph_psa;
CREATE POLICY tier4_urol_103_bph_psa_t ON tier4_urol_103_bph_psa
  USING (tenant_id = current_setting('app.tenant_id', true));