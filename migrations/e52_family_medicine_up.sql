-- filepath: namaweb/migrations/e52_family_medicine_up.sql
-- Family Medicine — patients, visits, wellness, screening tables
-- Pattern: nm-sql-table-template
-- Idempotent, tenant-scoped, RLS-enabled.

BEGIN;

-- ============================================================
-- family_medicine_patients
-- ============================================================
CREATE TABLE IF NOT EXISTS family_medicine_patients (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       BIGINT NOT NULL,
    mrn             TEXT NOT NULL,
    name_ar         TEXT,
    name_en         TEXT,
    age             INTEGER,
    sex             TEXT,
    chief_complaint TEXT,
    status          TEXT DEFAULT 'active',
    medical_history JSONB,
    family_history  JSONB,
    allergies       JSONB,
    immunizations   JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE (tenant_id, mrn)
);

CREATE INDEX IF NOT EXISTS idx_fm_patients_tenant ON family_medicine_patients (tenant_id);
CREATE INDEX IF NOT EXISTS idx_fm_patients_status ON family_medicine_patients (tenant_id, status);

ALTER TABLE family_medicine_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_medicine_patients FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS fm_patients_tenant_isolation ON family_medicine_patients;
CREATE POLICY fm_patients_tenant_isolation ON family_medicine_patients
    USING (tenant_id::text = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

-- ============================================================
-- family_medicine_visits
-- ============================================================
CREATE TABLE IF NOT EXISTS family_medicine_visits (
    id                 BIGSERIAL PRIMARY KEY,
    tenant_id          BIGINT NOT NULL,
    patient_id         BIGINT NOT NULL REFERENCES family_medicine_patients(id) ON DELETE CASCADE,
    visit_date         TIMESTAMPTZ NOT NULL DEFAULT now(),
    chief_complaint    TEXT,
    sbp                INTEGER,
    hr                 INTEGER,
    weight             NUMERIC(5,2),
    height             NUMERIC(5,2),
    diagnosis          TEXT,
    notes              TEXT,
    attending_user_id  BIGINT NOT NULL REFERENCES system_users(id),
    payload            JSONB,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_fm_visits_tenant ON family_medicine_visits (tenant_id);
CREATE INDEX IF NOT EXISTS idx_fm_visits_patient ON family_medicine_visits (patient_id, visit_date DESC);

ALTER TABLE family_medicine_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_medicine_visits FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS fm_visits_tenant_isolation ON family_medicine_visits;
CREATE POLICY fm_visits_tenant_isolation ON family_medicine_visits
    USING (tenant_id::text = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

-- ============================================================
-- family_medicine_wellness
-- ============================================================
CREATE TABLE IF NOT EXISTS family_medicine_wellness (
    id           BIGSERIAL PRIMARY KEY,
    tenant_id    BIGINT NOT NULL,
    patient_id   BIGINT NOT NULL REFERENCES family_medicine_patients(id) ON DELETE CASCADE,
    assessed_by  BIGINT NOT NULL REFERENCES system_users(id),
    payload      JSONB NOT NULL,
    score        INTEGER,
    risk         TEXT,
    result       JSONB,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_fm_wellness_tenant ON family_medicine_wellness (tenant_id);
CREATE INDEX IF NOT EXISTS idx_fm_wellness_patient ON family_medicine_wellness (patient_id, created_at DESC);

ALTER TABLE family_medicine_wellness ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_medicine_wellness FORCE  ROW LEVEL SECURITY;

DROP POLICY IF EXISTS fm_wellness_tenant_isolation ON family_medicine_wellness;
CREATE POLICY fm_wellness_tenant_isolation ON family_medicine_wellness
    USING (tenant_id::text = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

COMMIT;