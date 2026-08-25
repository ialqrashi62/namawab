-- e412 TIER4_PSYCH-104 Schizophrenia
CREATE TABLE IF NOT EXISTS tier4_psych_104_schizo_fep (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  psychotic_symptoms_weeks INT,
  predominant TEXT,
  suicide_risk TEXT,
  medication_adherent BOOLEAN,
  care_pathway TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_104_schizo_fep ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_104_schizo_fep FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_104_schizo_fep_t ON tier4_psych_104_schizo_fep;
CREATE POLICY tier4_psych_104_schizo_fep_t ON tier4_psych_104_schizo_fep
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_psych_104_schizo_trs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  prior_adequate_trials INT,
  compliance_confirmed BOOLEAN,
  clozapine_eligible BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_104_schizo_trs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_104_schizo_trs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_104_schizo_trs_t ON tier4_psych_104_schizo_trs;
CREATE POLICY tier4_psych_104_schizo_trs_t ON tier4_psych_104_schizo_trs
  USING (tenant_id = current_setting('app.tenant_id', true));