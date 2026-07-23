---
module_id: PEDS-002
section: 04_devops
template_ref: TPL:DEPT
generated: 2026-07-23
---

# PEDS-002 Migration (skeleton)

```sql
-- File: namaweb/migrations/e102_nicu_module_up.sql
BEGIN;

CREATE TABLE IF NOT EXISTS peds_nicu_admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id UUID NOT NULL REFERENCES patients(id),  -- newborn
  delivery_id UUID REFERENCES obg_deliveries(id),
  admission_datetime TIMESTAMPTZ NOT NULL DEFAULT now(),
  birth_weight_g INT NOT NULL,
  birth_gestational_age_weeks INT,
  admission_gestational_age_weeks INT,
  admission_weight_g INT,
  admission_diagnosis TEXT,           -- encrypted
  apgar_1min INT,
  apgar_5min INT,
  apgar_10min INT,
  resuscitation_attempted BOOLEAN,
  nicu_level INT,                     -- 1, 2, 3, 4
  transferred_from VARCHAR(200),     -- born here vs transferred
  attending_neonatologist_id UUID REFERENCES system_users(id),
  primary_nurse_id UUID REFERENCES system_users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'admitted',
  discharge_datetime TIMESTAMPTZ,
  discharge_weight_g INT,
  discharge_diagnosis TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_peds_nicu_tenant_patient ON peds_nicu_admissions (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_peds_nicu_status ON peds_nicu_admissions (tenant_id, status) WHERE status = 'admitted';

ALTER TABLE peds_nicu_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_nicu_admissions FORCE ROW LEVEL SECURITY;
CREATE POLICY peds_nicu_tenant_isolation ON peds_nicu_admissions
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Vitals (high frequency)
CREATE TABLE IF NOT EXISTS peds_nicu_vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  admission_id UUID NOT NULL REFERENCES peds_nicu_admissions(id),
  recorded_at TIMESTAMPTZ NOT NULL,
  heart_rate INT,
  respiratory_rate INT,
  spo2 INT,
  systolic_bp INT,
  diastolic_bp INT,
  mean_bp INT,
  temperature_c DECIMAL(4,1),
  weight_g INT,
  recorded_by UUID NOT NULL REFERENCES system_users(id)
);

CREATE INDEX IF NOT EXISTS idx_peds_nicu_vitals_time ON peds_nicu_vitals (tenant_id, admission_id, recorded_at DESC);

ALTER TABLE peds_nicu_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_nicu_vitals FORCE ROW LEVEL SECURITY;
CREATE POLICY peds_nicu_vitals_tenant_isolation ON peds_nicu_vitals
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Respiratory support
CREATE TABLE IF NOT EXISTS peds_nicu_respiratory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  admission_id UUID NOT NULL REFERENCES peds_nicu_admissions(id),
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  support_type VARCHAR(30) NOT NULL,    -- CPAP, SIMV, HFOV, NIPPV, RA
  peep_cm_h2o INT,
  pip_cm_h2o INT,
  rate_per_min INT,
  fio2 DECIMAL(4,2),
  flow_lpm INT,
  surfactant_given BOOLEAN,
  ino BOOLEAN,
  ecmo BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_peds_nicu_resp ON peds_nicu_respiratory (tenant_id, admission_id, started_at);

ALTER TABLE peds_nicu_respiratory ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_nicu_respiratory FORCE ROW LEVEL SECURITY;
CREATE POLICY peds_nicu_resp_tenant_isolation ON peds_nicu_respiratory
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

COMMIT;

-- Down
-- DROP TABLE IF EXISTS peds_nicu_respiratory CASCADE;
-- DROP TABLE IF EXISTS peds_nicu_vitals CASCADE;
-- DROP TABLE IF EXISTS peds_nicu_admissions CASCADE;
```

---
*Owner: SA + DSL. L4 validated.*
