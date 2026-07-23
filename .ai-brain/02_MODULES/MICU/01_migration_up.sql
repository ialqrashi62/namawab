---
module_id: MICU
section: 04_devops
template_ref: TPL:DEPT
generated: 2026-07-23
---

# MICU Migration (skeleton)

```sql
-- File: namaweb/migrations/e103_micu_module_up.sql
BEGIN;

CREATE TABLE IF NOT EXISTS icu_admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  encounter_id UUID,                  -- source encounter
  admitted_from VARCHAR(50),          -- ed, ward, or, transfer
  admission_datetime TIMESTAMPTZ NOT NULL DEFAULT now(),
  admission_diagnosis TEXT,           -- encrypted
  apache_ii_score INT,
  apache_ii_mortality_pct DECIMAL(5,2),
  sofa_score INT,
  gcs_total INT,
  attending_intensivist_id UUID NOT NULL REFERENCES system_users(id),
  primary_nurse_id UUID REFERENCES system_users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'admitted',
  discharge_datetime TIMESTAMPTZ,
  discharge_disposition VARCHAR(30),   -- ward, step_down, transfer, deceased
  los_days DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_icu_adm_tenant_patient ON icu_admissions (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_icu_adm_active ON icu_admissions (tenant_id, status) WHERE status = 'admitted';

ALTER TABLE icu_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_admissions FORCE ROW LEVEL SECURITY;
CREATE POLICY icu_adm_tenant_isolation ON icu_admissions
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Vitals (continuous)
CREATE TABLE IF NOT EXISTS icu_vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  admission_id UUID NOT NULL REFERENCES icu_admissions(id),
  recorded_at TIMESTAMPTZ NOT NULL,
  heart_rate INT,
  systolic_bp INT,
  diastolic_bp INT,
  mean_bp INT,
  respiratory_rate INT,
  spo2 INT,
  temperature_c DECIMAL(4,1),
  cvp INT,                             -- central venous pressure
  fio2 DECIMAL(4,2),
  peep INT,
  recorded_by UUID NOT NULL REFERENCES system_users(id)
);

CREATE INDEX IF NOT EXISTS idx_icu_vitals_time ON icu_vitals (tenant_id, admission_id, recorded_at DESC);

ALTER TABLE icu_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_vitals FORCE ROW LEVEL SECURITY;
CREATE POLICY icu_vitals_tenant_isolation ON icu_vitals
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Ventilator settings
CREATE TABLE IF NOT EXISTS icu_ventilator (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  admission_id UUID NOT NULL REFERENCES icu_admissions(id),
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  mode VARCHAR(30),
  tidal_volume_ml INT,
  peep INT,
  fio2 DECIMAL(4,2),
  respiratory_rate INT,
  pressure_support INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_icu_vent ON icu_ventilator (tenant_id, admission_id, started_at);

ALTER TABLE icu_ventilator ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_ventilator FORCE ROW LEVEL SECURITY;
CREATE POLICY icu_vent_tenant_isolation ON icu_ventilator
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Daily scores
CREATE TABLE IF NOT EXISTS icu_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  admission_id UUID NOT NULL REFERENCES icu_admissions(id),
  recorded_date DATE NOT NULL,
  apache_ii_score INT,
  sofa_score INT,
  gcs_total INT,
  rass_score INT,                      -- sedation
  cam_icu_positive BOOLEAN,            -- delirium
  recorded_by UUID NOT NULL REFERENCES system_users(id)
);

CREATE INDEX IF NOT EXISTS idx_icu_scores ON icu_scores (tenant_id, admission_id, recorded_date);

ALTER TABLE icu_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_scores FORCE ROW LEVEL SECURITY;
CREATE POLICY icu_scores_tenant_isolation ON icu_scores
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

COMMIT;
```

---
*Owner: SA + DSL. L4 validated.*
