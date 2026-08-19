-- filepath: migrations/e999-g141_precision_ext.sql
CREATE TABLE IF NOT EXISTS tier121_pharm_advanced_632 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  rx_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier121_pharm_advanced_632 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier121_pharm_advanced_632 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t121_pa_632_isolation ON tier121_pharm_advanced_632;
CREATE POLICY t121_pa_632_isolation ON tier121_pharm_advanced_632 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier121_genomics_633 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  test_id TEXT, var_id TEXT, pgx_id TEXT, screen_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier121_genomics_633 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier121_genomics_633 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t121_gen_633_isolation ON tier121_genomics_633;
CREATE POLICY t121_gen_633_isolation ON tier121_genomics_633 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier121_biomarkers_634 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  marker_id TEXT, test_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier121_biomarkers_634 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier121_biomarkers_634 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t121_bm_634_isolation ON tier121_biomarkers_634;
CREATE POLICY t121_bm_634_isolation ON tier121_biomarkers_634 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier121_precision_med_635 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  board_id TEXT, rx_id TEXT, dx_id TEXT, bx_id TEXT, mrd_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier121_precision_med_635 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier121_precision_med_635 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t121_pm_635_isolation ON tier121_precision_med_635;
CREATE POLICY t121_pm_635_isolation ON tier121_precision_med_635 USING (tenant_id = current_setting('app.tenant_id', true));