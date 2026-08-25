-- e458 TIER4_PATH-106 Molecular
CREATE TABLE IF NOT EXISTS tier4_path_106_mol_egfr (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  tumor_type TEXT NOT NULL,
  mutation TEXT NOT NULL,
  tumor_pct NUMERIC NOT NULL,
  eligible TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_path_106_mol_egfr ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_path_106_mol_egfr FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_path_106_mol_egfr_t ON tier4_path_106_mol_egfr;
CREATE POLICY tier4_path_106_mol_egfr_t ON tier4_path_106_mol_egfr
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_path_106_mol_msi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  msi_status TEXT NOT NULL,
  kras TEXT NOT NULL,
  braf TEXT NOT NULL,
  side TEXT NOT NULL,
  first_line TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_path_106_mol_msi ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_path_106_mol_msi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_path_106_mol_msi_t ON tier4_path_106_mol_msi;
CREATE POLICY tier4_path_106_mol_msi_t ON tier4_path_106_mol_msi
  USING (tenant_id = current_setting('app.tenant_id', true));