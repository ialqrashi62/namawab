---
module_id: SURG-001
section: 04_devops
template_ref: TPL:DEPT
generated: 2026-07-23
---

# SURG-001 Migration (skeleton)

```sql
-- File: namaweb/migrations/e104_surg_module_up.sql
BEGIN;

CREATE TABLE IF NOT EXISTS surg_procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  encounter_id UUID,
  scheduled_date TIMESTAMPTZ,
  actual_date TIMESTAMPTZ,
  procedure_name VARCHAR(200) NOT NULL,
  cpt_code VARCHAR(20),
  snomed_code VARCHAR(30),
  procedure_class VARCHAR(20),     -- clean, clean_contaminated, contaminated, dirty
  anesthesia_type VARCHAR(30),     -- local, regional, general, monitored
  asa_class INT,                  -- 1-6
  estimated_duration_min INT,
  actual_duration_min INT,
  indication TEXT,                -- encrypted
  operative_note TEXT,            -- encrypted
  findings TEXT,                  -- encrypted
  complications TEXT,              -- encrypted
  ebl_ml INT,
  antibiotic_given BOOLEAN,
  antibiotic_name VARCHAR(100),
  antibiotic_dose VARCHAR(50),
  antibiotic_time TIMESTAMPTZ,
  count_correct BOOLEAN,            -- instrument, sponge, needle
  primary_surgeon_id UUID NOT NULL REFERENCES system_users(id),
  assistant_surgeon_id UUID REFERENCES system_users(id),
  anesthesiologist_id UUID REFERENCES system_users(id),
  or_nurse_id UUID REFERENCES system_users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_surg_proc_tenant_patient ON surg_procedures (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_surg_proc_date ON surg_procedures (tenant_id, actual_date);

ALTER TABLE surg_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_procedures FORCE ROW LEVEL SECURITY;
CREATE POLICY surg_proc_tenant_isolation ON surg_procedures
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Pre-op assessments
CREATE TABLE IF NOT EXISTS surg_preop (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  procedure_id UUID REFERENCES surg_procedures(id),
  assessment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  asa_class INT,
  cardiac_risk_index INT,          -- RCRI
  pulmonary_risk_score INT,        -- ARISCAT
  vte_risk_score INT,              -- Caprini
  anemia BOOLEAN,
  malnutrition BOOLEAN,
  diabetes BOOLEAN,
  smoker BOOLEAN,
  anticoagulation_status VARCHAR(50),
  pregnancy_test_done BOOLEAN,
  pregnancy_test_result BOOLEAN,
  consent_obtained BOOLEAN,
  consent_witness_id UUID REFERENCES system_users(id),
  anesthesia_consult_done BOOLEAN,
  surgeon_id UUID NOT NULL REFERENCES system_users(id),
  clearance_status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- cleared, pending, denied
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_surg_preop ON surg_preop (tenant_id, procedure_id);

ALTER TABLE surg_preop ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_preop FORCE ROW LEVEL SECURITY;
CREATE POLICY surg_preop_tenant_isolation ON surg_preop
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

COMMIT;
```

---
*Owner: SA + DSL. L4 validated.*
