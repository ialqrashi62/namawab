-- pcc/bicu/bicu_up.sql
-- BICU (Burn ICU) — 4 tables, RLS + FORCE RLS
-- Sandbox only.

BEGIN;

CREATE TABLE IF NOT EXISTS bicu_admission (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    patient_id      BIGINT NOT NULL,
    encounter_id    BIGINT NOT NULL,
    burn_mechanism  VARCHAR(40) NOT NULL CHECK (burn_mechanism IN
                        ('thermal', 'electrical', 'chemical', 'radiation', 'friction', 'inhalation')),
    tbsa_pct        NUMERIC(5, 2) NOT NULL,
    burn_depth      VARCHAR(20) NOT NULL CHECK (burn_depth IN
                        ('superficial', 'partial_thickness', 'full_thickness', 'mixed')),
    inhalation_injury BOOLEAN NOT NULL DEFAULT false,
    baux_score      SMALLINT,
    status          VARCHAR(20) NOT NULL DEFAULT 'admitted' CHECK (status IN
                        ('admitted', 'in_bicu', 'transferred', 'discharged', 'deceased')),
    cpt_codes       JSONB NOT NULL DEFAULT '[]'::jsonb,
    admitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    discharged_at   TIMESTAMPTZ,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bicu_admission_tenant ON bicu_admission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bicu_admission_patient ON bicu_admission(tenant_id, patient_id);
ALTER TABLE bicu_admission ENABLE ROW LEVEL SECURITY;
ALTER TABLE bicu_admission FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bicu_admission_tenant ON bicu_admission;
CREATE POLICY bicu_admission_tenant ON bicu_admission
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS bicu_fluid_balance (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    admission_id    UUID NOT NULL REFERENCES bicu_admission(id) ON DELETE CASCADE,
    measured_at     TIMESTAMPTZ NOT NULL,
    fluid_in_ml     NUMERIC(8, 2),
    fluid_out_ml    NUMERIC(8, 2),
    urine_output_ml NUMERIC(8, 2),
    rate_ml_per_hour NUMERIC(8, 2),
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bicu_fluid_tenant ON bicu_fluid_balance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bicu_fluid_admission ON bicu_fluid_balance(admission_id);
ALTER TABLE bicu_fluid_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE bicu_fluid_balance FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bicu_fluid_tenant ON bicu_fluid_balance;
CREATE POLICY bicu_fluid_tenant ON bicu_fluid_balance
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS bicu_red_flag (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    admission_id    UUID NOT NULL REFERENCES bicu_admission(id) ON DELETE CASCADE,
    flag_type       VARCHAR(40) NOT NULL CHECK (flag_type IN
                        ('compartment_syndrome', 'over_resuscitation',
                         'under_resuscitation', 'inhalation_severe',
                         'burn_sepsis', 'rhabdomyolysis', 'electrolyte',
                         'airway_compromise', 'co_poisoning', 'other')),
    severity        VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
    description     TEXT,
    response        TEXT,
    acknowledged_by BIGINT,
    acknowledged_at TIMESTAMPTZ,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bicu_red_flag_tenant ON bicu_red_flag(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bicu_red_flag_admission ON bicu_red_flag(admission_id);
ALTER TABLE bicu_red_flag ENABLE ROW LEVEL SECURITY;
ALTER TABLE bicu_red_flag FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bicu_red_flag_tenant ON bicu_red_flag;
CREATE POLICY bicu_red_flag_tenant ON bicu_red_flag
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS bicu_audit_log (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    admission_id    UUID REFERENCES bicu_admission(id) ON DELETE SET NULL,
    actor_id        BIGINT,
    action          VARCHAR(40) NOT NULL,
    entity_type     VARCHAR(40) NOT NULL,
    entity_id       UUID,
    payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
    prev_hash       VARCHAR(64),
    entry_hash      VARCHAR(64) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bicu_audit_tenant ON bicu_audit_log(tenant_id);
ALTER TABLE bicu_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE bicu_audit_log FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bicu_audit_tenant ON bicu_audit_log;
CREATE POLICY bicu_audit_tenant ON bicu_audit_log
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

COMMIT;
