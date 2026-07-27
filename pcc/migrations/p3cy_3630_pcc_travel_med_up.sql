-- P3-CY module schema for pcc_travel_med v3.63.0
CREATE TABLE IF NOT EXISTS p3cy_pcc_travel_med (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cy_pcc_travel_med_tenant ON p3cy_pcc_travel_med(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cy_pcc_travel_med_encounter ON p3cy_pcc_travel_med(encounter_id);
