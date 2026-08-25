-- e218 TIER3_ENT-303 Laryngology UP
CREATE TABLE IF NOT EXISTS tier3_ent_laryngology_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  suspicion_for_malignancy BOOLEAN DEFAULT false,
  vcp_management TEXT,
  lpr_likely BOOLEAN DEFAULT false,
  voice_therapy_candidate BOOLEAN DEFAULT false,
  spasmodic_dx TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_ent_lar_tenant ON tier3_ent_laryngology_assessments(tenant_id);
ALTER TABLE tier3_ent_laryngology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_ent_laryngology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_ent_lar_t_tenant_isolation ON tier3_ent_laryngology_assessments;
CREATE POLICY tier3_ent_lar_t_tenant_isolation ON tier3_ent_laryngology_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));