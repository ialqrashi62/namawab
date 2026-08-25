-- e396 TIER4_RHEUM-104 Vasculitis
CREATE TABLE IF NOT EXISTS tier4_rheum_104_vasculitis_anca (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  anca_type TEXT,
  suspected_dx TEXT,
  organ_threat TEXT,
  severity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_104_vasculitis_anca ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_104_vasculitis_anca FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_104_vasculitis_anca_t ON tier4_rheum_104_vasculitis_anca;
CREATE POLICY tier4_rheum_104_vasculitis_anca_t ON tier4_rheum_104_vasculitis_anca
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rheum_104_vasculitis_gca (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  esr NUMERIC,
  crp NUMERIC,
  visual_symptoms BOOLEAN,
  jaw_claudication BOOLEAN,
  new_headache BOOLEAN,
  suspect BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_104_vasculitis_gca ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_104_vasculitis_gca FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_104_vasculitis_gca_t ON tier4_rheum_104_vasculitis_gca;
CREATE POLICY tier4_rheum_104_vasculitis_gca_t ON tier4_rheum_104_vasculitis_gca
  USING (tenant_id = current_setting('app.tenant_id', true));