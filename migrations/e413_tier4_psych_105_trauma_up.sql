-- e413 TIER4_PSYCH-105 Trauma & PTSD
CREATE TABLE IF NOT EXISTS tier4_psych_105_trauma_ptsd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pcl5 INT NOT NULL,
  trauma_type TEXT,
  severity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_105_trauma_ptsd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_105_trauma_ptsd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_105_trauma_ptsd_t ON tier4_psych_105_trauma_ptsd;
CREATE POLICY tier4_psych_105_trauma_ptsd_t ON tier4_psych_105_trauma_ptsd
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_psych_105_trauma_complex (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  distinct_trauma_count INT,
  dissociative_symptoms BOOLEAN,
  emotional_dysregulation BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_105_trauma_complex ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_105_trauma_complex FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_105_trauma_complex_t ON tier4_psych_105_trauma_complex;
CREATE POLICY tier4_psych_105_trauma_complex_t ON tier4_psych_105_trauma_complex
  USING (tenant_id = current_setting('app.tenant_id', true));