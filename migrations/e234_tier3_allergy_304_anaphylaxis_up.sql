-- e234 TIER3_ALLERGY-304 Anaphylaxis UP
CREATE TABLE IF NOT EXISTS tier3_allergy_anaphylaxis_events (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  severity TEXT,
  treatment_given TEXT,
  biphasic_risk TEXT,
  mastocytosis_suspected BOOLEAN DEFAULT false,
  immunotherapy_candidate BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_allergy_ana_tenant ON tier3_allergy_anaphylaxis_events(tenant_id);
ALTER TABLE tier3_allergy_anaphylaxis_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_allergy_anaphylaxis_events FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_allergy_ana_t_tenant_isolation ON tier3_allergy_anaphylaxis_events;
CREATE POLICY tier3_allergy_ana_t_tenant_isolation ON tier3_allergy_anaphylaxis_events
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));