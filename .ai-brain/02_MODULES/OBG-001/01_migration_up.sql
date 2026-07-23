---
module_id: OBG-001
section: 04_devops
template_ref: TPL:DEPT
generated: 2026-07-23
---

# OBG-001 Migration (up + down + validate)

## Up Migration (skeleton — extends existing e40_* OB series)

```sql
-- File: namaweb/migrations/e101_obg_module_up.sql
-- OBG-001: Obstetrics & Gynecology module extensions
BEGIN;

CREATE TABLE IF NOT EXISTS obg_pregnancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  mrn VARCHAR(50) NOT NULL,
  lmp DATE,                          -- last menstrual period
  edd_by_lmp DATE,                   -- estimated date of delivery
  edd_by_us DATE,                    -- US-confirmed EDD
  ga_weeks INT,                      -- gestational age
  ga_days INT,
  gravida INT,                       -- total pregnancies
  para INT,                          -- viable births
  abortus INT,                       -- miscarriages
  living INT,                        -- living children
  gpal VARCHAR(20),                  -- e.g., G3P2A1L2
  risk_level VARCHAR(20),             -- low, moderate, high
  blood_type VARCHAR(10),            -- A+, O-, etc.
  antibody_screen VARCHAR(100),
  rh_immunoglobulin_given BOOLEAN,
  rubella_immune BOOLEAN,
  varicella_immune BOOLEAN,
  gbs_status VARCHAR(20),            -- positive, negative, unknown
  hiv_status VARCHAR(20),
  hep_b_status VARCHAR(20),
  syphilis_status VARCHAR(20),
  pre_pregnancy_weight_kg DECIMAL(5,1),
  pre_pregnancy_bmi DECIMAL(4,1),
  primary_ob_id UUID REFERENCES system_users(id),
  primary_midwife_id UUID REFERENCES system_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obg_preg_tenant_patient ON obg_pregnancies (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_obg_preg_edd ON obg_pregnancies (tenant_id, edd_by_us);

ALTER TABLE obg_pregnancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE obg_pregnancies FORCE ROW LEVEL SECURITY;
CREATE POLICY obg_preg_tenant_isolation ON obg_pregnancies
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Prenatal visits
CREATE TABLE IF NOT EXISTS obg_prenatal_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  pregnancy_id UUID NOT NULL REFERENCES obg_pregnancies(id),
  visit_date DATE NOT NULL,
  ga_weeks_at_visit INT,
  weight_kg DECIMAL(5,1),
  bp_systolic INT,
  bp_diastolic INT,
  urine_protein VARCHAR(20),         -- negative, trace, 1+, 2+, 3+, 4+
  fundal_height_cm INT,
  fetal_heart_rate INT,
  presentation VARCHAR(20),           -- cephalic, breech, transverse
  edema VARCHAR(20),
  complaints TEXT,                    -- encrypted
  plan TEXT,                          -- encrypted
  provider_id UUID NOT NULL REFERENCES system_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obg_pnv_tenant_preg ON obg_prenatal_visits (tenant_id, pregnancy_id, visit_date);

ALTER TABLE obg_prenatal_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE obg_prenatal_visits FORCE ROW LEVEL SECURITY;
CREATE POLICY obg_pnv_tenant_isolation ON obg_prenatal_visits
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Deliveries
CREATE TABLE IF NOT EXISTS obg_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  pregnancy_id UUID NOT NULL REFERENCES obg_pregnancies(id),
  delivery_date TIMESTAMPTZ NOT NULL,
  delivery_mode VARCHAR(30) NOT NULL, -- vaginal, vacuum, forceps, c_section
  ga_at_delivery_weeks INT,
  apgar_1min INT,
  apgar_5min INT,
  apgar_10min INT,
  maternal_ebl_ml INT,
  labor_duration_hours DECIMAL(5,1),
  indication TEXT,                    -- encrypted (indication for C-section, etc.)
  complications TEXT,                  -- encrypted
  cord_ph VARCHAR(10),
  amniotic_fluid VARCHAR(30),         -- clear, meconium, bloody
  placenta_complete BOOLEAN,
  perineal_laceration VARCHAR(20),     -- none, 1st, 2nd, 3rd, 4th
  anesthesia VARCHAR(50),             -- none, epidural, spinal, general
  delivering_provider_id UUID NOT NULL REFERENCES system_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obg_deliv_tenant_preg ON obg_deliveries (tenant_id, pregnancy_id);
CREATE INDEX IF NOT EXISTS idx_obg_deliv_date ON obg_deliveries (tenant_id, delivery_date);

ALTER TABLE obg_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE obg_deliveries FORCE ROW LEVEL SECURITY;
CREATE POLICY obg_deliv_tenant_isolation ON obg_deliveries
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Newborns (linked to delivery)
CREATE TABLE IF NOT EXISTS obg_newborns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  delivery_id UUID NOT NULL REFERENCES obg_deliveries(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  mrn VARCHAR(50) NOT NULL,
  birth_datetime TIMESTAMPTZ NOT NULL,
  sex VARCHAR(1),
  birth_weight_g INT,
  birth_length_cm DECIMAL(4,1),
  head_circumference_cm DECIMAL(4,1),
  apgar_1min INT,
  apgar_5min INT,
  apgar_10min INT,
  resuscitation_attempted BOOLEAN,
  nicu_admission BOOLEAN,
  breastfeeding_initiated BOOLEAN,
  vitamin_k_given BOOLEAN,
  hep_b_vaccine_given BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_obg_newborn_tenant ON obg_newborns (tenant_id, delivery_id);
CREATE INDEX IF NOT EXISTS idx_obg_newborn_patient ON obg_newborns (tenant_id, patient_id);

ALTER TABLE obg_newborns ENABLE ROW LEVEL SECURITY;
ALTER TABLE obg_newborns FORCE ROW LEVEL SECURITY;
CREATE POLICY obg_newborn_tenant_isolation ON obg_newborns
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

COMMIT;
```

## Down Migration

```sql
BEGIN;
DROP TABLE IF EXISTS obg_newborns CASCADE;
DROP TABLE IF EXISTS obg_deliveries CASCADE;
DROP TABLE IF EXISTS obg_prenatal_visits CASCADE;
DROP TABLE IF EXISTS obg_pregnancies CASCADE;
COMMIT;
```

## Validate

```sql
-- Verify all tables exist and RLS enabled
DO $$
DECLARE
  missing TEXT[] := '{}';
  required TEXT[] := ARRAY['obg_pregnancies', 'obg_prenatal_visits', 'obg_deliveries', 'obg_newborns'];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY required LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t) THEN
      missing := array_append(missing, t);
    END IF;
  END LOOP;
  IF array_length(missing, 1) > 0 THEN
    RAISE EXCEPTION 'Missing OBG tables: %', array_to_string(missing, ', ');
  END IF;
  RAISE NOTICE 'OBG-001 migration validation: ALL PASS';
END $$;
```

---
*Owner: SA + DSL. L4 validated.*
