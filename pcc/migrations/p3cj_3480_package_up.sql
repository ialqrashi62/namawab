-- P3-CJ package schema v3.48.0


CREATE SCHEMA IF NOT EXISTS p3cj;

CREATE TABLE IF NOT EXISTS p3cj_pcc_icu_ext3 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cj_pcc_icu_ext3_tenant ON p3cj_pcc_icu_ext3(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cj_pcc_icu_ext3_encounter ON p3cj_pcc_icu_ext3(encounter_id);

CREATE TABLE IF NOT EXISTS p3cj_pcc_ed_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cj_pcc_ed_ext2_tenant ON p3cj_pcc_ed_ext2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cj_pcc_ed_ext2_encounter ON p3cj_pcc_ed_ext2(encounter_id);

CREATE TABLE IF NOT EXISTS p3cj_pcc_ob_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cj_pcc_ob_ext2_tenant ON p3cj_pcc_ob_ext2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cj_pcc_ob_ext2_encounter ON p3cj_pcc_ob_ext2(encounter_id);
