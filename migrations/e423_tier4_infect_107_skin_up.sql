-- e423 TIER4_INFECT-107 SSTI
CREATE TABLE IF NOT EXISTS tier4_infect_107_skin_cellulitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  severity TEXT NOT NULL,
  organism TEXT,
  systemic_signs BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_107_skin_cellulitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_107_skin_cellulitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_107_skin_cellulitis_t ON tier4_infect_107_skin_cellulitis;
CREATE POLICY tier4_infect_107_skin_cellulitis_t ON tier4_infect_107_skin_cellulitis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_infect_107_skin_necrotizing (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  suspicion TEXT,
  lrnec_score NUMERIC,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_107_skin_necrotizing ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_107_skin_necrotizing FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_107_skin_necrotizing_t ON tier4_infect_107_skin_necrotizing;
CREATE POLICY tier4_infect_107_skin_necrotizing_t ON tier4_infect_107_skin_necrotizing
  USING (tenant_id = current_setting('app.tenant_id', true));