-- pcc/nnicu/nnicu_up.sql
-- NNICU (Neonatal ICU) — 4 tables, RLS + FORCE RLS
-- Sandbox only. Never run on production.

BEGIN;

CREATE TABLE IF NOT EXISTS nnicu_admission (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    patient_id      BIGINT NOT NULL,
    encounter_id    BIGINT NOT NULL,
    birth_weight_kg NUMERIC(5, 3) NOT NULL,
    gestational_age_weeks NUMERIC(4, 1) NOT NULL,
    admission_type  VARCHAR(40) NOT NULL CHECK (admission_type IN
                        ('rds', 'sepsis', 'hie', 'premature', 'jaundice',
                         'nec', 'ivh', 'rop', 'pphn', 'cdh', 'mas',
                         'observation', 'transfer')),
    apgar_1min      SMALLINT CHECK (apgar_1min >= 0 AND apgar_1min <= 10),
    apgar_5min      SMALLINT CHECK (apgar_5min >= 0 AND apgar_5min <= 10),
    ballard_score   SMALLINT,
    cord_ph         NUMERIC(3, 2),
    base_excess     NUMERIC(5, 1),
    on_ventilator   BOOLEAN NOT NULL DEFAULT false,
    on_surfactant   BOOLEAN NOT NULL DEFAULT false,
    on_therapeutic_hypothermia BOOLEAN NOT NULL DEFAULT false,
    status          VARCHAR(20) NOT NULL DEFAULT 'admitted' CHECK (status IN
                        ('admitted', 'in_nnicu', 'transferred', 'discharged', 'deceased')),
    cpt_codes       JSONB NOT NULL DEFAULT '[]'::jsonb,
    admitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    discharged_at   TIMESTAMPTZ,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nnicu_admission_tenant ON nnicu_admission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nnicu_admission_patient ON nnicu_admission(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_nnicu_admission_status ON nnicu_admission(tenant_id, status);
ALTER TABLE nnicu_admission ENABLE ROW LEVEL SECURITY;
ALTER TABLE nnicu_admission FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nnicu_admission_tenant ON nnicu_admission;
CREATE POLICY nnicu_admission_tenant ON nnicu_admission
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS nnicu_medication_dose (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    admission_id    UUID NOT NULL REFERENCES nnicu_admission(id) ON DELETE CASCADE,
    drug_name       VARCHAR(80) NOT NULL,
    dose_mg_per_kg  NUMERIC(8, 3) NOT NULL,
    total_mg        NUMERIC(8, 3) NOT NULL,
    weight_at_dose_kg NUMERIC(5, 3) NOT NULL,
    route           VARCHAR(20) NOT NULL CHECK (route IN ('IV', 'IM', 'PO', 'NG', 'PR', 'IN', 'TOPICAL')),
    frequency       VARCHAR(20),
    given_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    given_by        BIGINT,
    hold_reason     TEXT,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nnicu_med_tenant ON nnicu_medication_dose(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nnicu_med_admission ON nnicu_medication_dose(admission_id);
ALTER TABLE nnicu_medication_dose ENABLE ROW LEVEL SECURITY;
ALTER TABLE nnicu_medication_dose FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nnicu_med_tenant ON nnicu_medication_dose;
CREATE POLICY nnicu_med_tenant ON nnicu_medication_dose
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS nnicu_vital_sign (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    admission_id    UUID NOT NULL REFERENCES nnicu_admission(id) ON DELETE CASCADE,
    measured_at     TIMESTAMPTZ NOT NULL,
    heart_rate      SMALLINT,
    resp_rate       SMALLINT,
    spo2_pct        SMALLINT,
    temperature_c   NUMERIC(4, 2),
    weight_kg       NUMERIC(5, 3),
    bilirubulin_mg_dl NUMERIC(4, 1),
    blood_glucose_mg_dl NUMERIC(5, 1),
    on_ventilator   BOOLEAN NOT NULL DEFAULT false,
    vent_settings   JSONB,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nnicu_vital_tenant ON nnicu_vital_sign(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nnicu_vital_admission ON nnicu_vital_sign(admission_id);
ALTER TABLE nnicu_vital_sign ENABLE ROW LEVEL SECURITY;
ALTER TABLE nnicu_vital_sign FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nnicu_vital_tenant ON nnicu_vital_sign;
CREATE POLICY nnicu_vital_tenant ON nnicu_vital_sign
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS nnicu_audit_log (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    admission_id    UUID REFERENCES nnicu_admission(id) ON DELETE SET NULL,
    actor_id        BIGINT,
    action          VARCHAR(40) NOT NULL,
    entity_type     VARCHAR(40) NOT NULL,
    entity_id       UUID,
    payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
    prev_hash       VARCHAR(64),
    entry_hash      VARCHAR(64) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nnicu_audit_tenant ON nnicu_audit_log(tenant_id);
ALTER TABLE nnicu_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE nnicu_audit_log FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nnicu_audit_tenant ON nnicu_audit_log;
CREATE POLICY nnicu_audit_tenant ON nnicu_audit_log
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

COMMIT;
