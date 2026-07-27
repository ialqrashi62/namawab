-- P3-CR package schema v3.56.0


CREATE SCHEMA IF NOT EXISTS p3cr;

CREATE TABLE IF NOT EXISTS p3cr_pcc_surgical_checklist (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cr_pcc_surgical_checklist_tenant ON p3cr_pcc_surgical_checklist(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cr_pcc_surgical_checklist_encounter ON p3cr_pcc_surgical_checklist(encounter_id);

CREATE TABLE IF NOT EXISTS p3cr_pcc_handoff (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cr_pcc_handoff_tenant ON p3cr_pcc_handoff(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cr_pcc_handoff_encounter ON p3cr_pcc_handoff(encounter_id);

CREATE TABLE IF NOT EXISTS p3cr_pcc_safety (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cr_pcc_safety_tenant ON p3cr_pcc_safety(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cr_pcc_safety_encounter ON p3cr_pcc_safety(encounter_id);
