-- e398 TIER4_RHEUM-106 Scleroderma
CREATE TABLE IF NOT EXISTS tier4_rheum_106_scleroderma_subset (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  subset TEXT,
  ab TEXT,
  ild BOOLEAN,
  renal_crisis_risk BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_106_scleroderma_subset ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_106_scleroderma_subset FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_106_scleroderma_subset_t ON tier4_rheum_106_scleroderma_subset;
CREATE POLICY tier4_rheum_106_scleroderma_subset_t ON tier4_rheum_106_scleroderma_subset
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rheum_106_scleroderma_pah (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  systolic_pap_mmhg NUMERIC,
  ntprobnp NUMERIC,
  dlco_pct NUMERIC,
  high_risk BOOLEAN,
  plan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_106_scleroderma_pah ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_106_scleroderma_pah FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_106_scleroderma_pah_t ON tier4_rheum_106_scleroderma_pah;
CREATE POLICY tier4_rheum_106_scleroderma_pah_t ON tier4_rheum_106_scleroderma_pah
  USING (tenant_id = current_setting('app.tenant_id', true));