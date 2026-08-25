-- e424 TIER4_INFECT-108 Transplant ID
CREATE TABLE IF NOT EXISTS tier4_infect_108_txid_prophylaxis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  transplant TEXT,
  donor_serostatus TEXT,
  weeks_post_transplant NUMERIC,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_108_txid_prophylaxis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_108_txid_prophylaxis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_108_txid_prophylaxis_t ON tier4_infect_108_txid_prophylaxis;
CREATE POLICY tier4_infect_108_txid_prophylaxis_t ON tier4_infect_108_txid_prophylaxis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_infect_108_txid_oi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  oi_type TEXT NOT NULL,
  immunosuppression TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_108_txid_oi ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_108_txid_oi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_108_txid_oi_t ON tier4_infect_108_txid_oi;
CREATE POLICY tier4_infect_108_txid_oi_t ON tier4_infect_108_txid_oi
  USING (tenant_id = current_setting('app.tenant_id', true));