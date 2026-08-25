-- e197 TIER3_PSYCH-302 Mood/Anxiety UP
CREATE TABLE IF NOT EXISTS tier3_psych_mood_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  phq9_total INTEGER,
  phq9_severity TEXT,
  gad7_total INTEGER,
  gad7_severity TEXT,
  bipolar_suspected BOOLEAN DEFAULT false,
  panic_disorder BOOLEAN DEFAULT false,
  ptsd_positive BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_psych_mood_tenant ON tier3_psych_mood_assessments(tenant_id);
ALTER TABLE tier3_psych_mood_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_psych_mood_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_psych_mood_t_tenant_isolation ON tier3_psych_mood_assessments;
CREATE POLICY tier3_psych_mood_t_tenant_isolation ON tier3_psych_mood_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));