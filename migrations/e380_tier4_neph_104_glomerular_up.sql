-- e380 TIER4_NEPH-104 Glomerular Disease
CREATE TABLE IF NOT EXISTS tier4_neph_104_glomerular_ns (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  proteinuria_g_24h NUMERIC NOT NULL,
  serum_albumin NUMERIC NOT NULL,
  edema BOOLEAN,
  dyslipidemia BOOLEAN,
  syndrome TEXT,
  workup TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_104_glomerular_ns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_104_glomerular_ns FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_104_glomerular_ns_t ON tier4_neph_104_glomerular_ns;
CREATE POLICY tier4_neph_104_glomerular_ns_t ON tier4_neph_104_glomerular_ns
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_neph_104_glomerular_rpgn (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  gfr_drop_pct NUMERIC NOT NULL,
  dysmorphic_hematuria BOOLEAN,
  active_urinary_sediment BOOLEAN,
  classification TEXT,
  plan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_104_glomerular_rpgn ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_104_glomerular_rpgn FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_104_glomerular_rpgn_t ON tier4_neph_104_glomerular_rpgn;
CREATE POLICY tier4_neph_104_glomerular_rpgn_t ON tier4_neph_104_glomerular_rpgn
  USING (tenant_id = current_setting('app.tenant_id', true));