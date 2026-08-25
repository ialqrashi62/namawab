-- e446 TIER4_HEM-108 Transfusion
CREATE TABLE IF NOT EXISTS tier4_hem_108_transfusion_prbc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hgb_g_dl NUMERIC NOT NULL,
  symptomatic_anemia BOOLEAN,
  hemodynamically_stable BOOLEAN,
  threshold NUMERIC,
  decision TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_108_transfusion_prbc ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_108_transfusion_prbc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_108_transfusion_prbc_t ON tier4_hem_108_transfusion_prbc;
CREATE POLICY tier4_hem_108_transfusion_prbc_t ON tier4_hem_108_transfusion_prbc
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_hem_108_transfusion_plt (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  platelet_count NUMERIC NOT NULL,
  procedure TEXT,
  bleeding BOOLEAN,
  threshold NUMERIC,
  decision TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_108_transfusion_plt ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_108_transfusion_plt FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_108_transfusion_plt_t ON tier4_hem_108_transfusion_plt;
CREATE POLICY tier4_hem_108_transfusion_plt_t ON tier4_hem_108_transfusion_plt
  USING (tenant_id = current_setting('app.tenant_id', true));