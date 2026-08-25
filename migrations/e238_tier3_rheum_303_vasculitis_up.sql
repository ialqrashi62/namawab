-- e238 TIER3_RHEUM-303 Vasculitis UP
CREATE TABLE IF NOT EXISTS tier3_rheum_vasculitis_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  anca_type TEXT,
  gca_likely BOOLEAN DEFAULT false,
  iga_vasculitis_likely BOOLEAN DEFAULT false,
  behcet_likely BOOLEAN DEFAULT false,
  cryoglobulinemia_etiology TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_rheum_vasc_tenant ON tier3_rheum_vasculitis_assessments(tenant_id);
ALTER TABLE tier3_rheum_vasculitis_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_rheum_vasculitis_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_rheum_vasc_t_tenant_isolation ON tier3_rheum_vasculitis_assessments;
CREATE POLICY tier3_rheum_vasc_t_tenant_isolation ON tier3_rheum_vasculitis_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));