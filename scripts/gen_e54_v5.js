#!/usr/bin/env node
// Generate e54 v5 - simple, no FKs, defensive
'use strict';
const fs = require('fs');
const STAGING_DIR = '.ai-brain/05_ENGINES';
const stubs = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('_engine.js'));
const depts = stubs.map(f => f.replace('_engine.js', ''));

const upStatements = [];
const downStatements = [];

for (const dept of depts) {
    const tableName = `${dept}_assessments`;
    upStatements.push(`
-- ${dept} assessments
CREATE TABLE IF NOT EXISTS ${tableName} (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    patient_id BIGINT,
    encounter_id BIGINT,
    engine_name VARCHAR(120),
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS patient_id BIGINT;
ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS encounter_id BIGINT;
ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS engine_name VARCHAR(120);
ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS input_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS output_payload JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS score NUMERIC;
ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20);
ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS performed_by BIGINT;
ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_${dept}_tenant_created ON ${tableName}(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_${dept}_patient ON ${tableName}(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_${dept}_engine ON ${tableName}(engine_name);
DO $$
BEGIN
    BEGIN
        ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'RLS already enabled on ${tableName}';
    END;
    BEGIN
        ALTER TABLE ${tableName} FORCE ROW LEVEL SECURITY;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'FORCE RLS already on ${tableName}';
    END;
    EXECUTE 'DROP POLICY IF EXISTS ${dept}_tenant_isolation ON ${tableName}';
    EXECUTE 'CREATE POLICY ${dept}_tenant_isolation ON ${tableName} USING (current_setting(''app.tenant_id'', true) <> '''' AND tenant_id = current_setting(''app.tenant_id'', true)::bigint)';
END $$;
`);
    downStatements.push(`
DROP TABLE IF EXISTS ${tableName} CASCADE;
`);
}

const up = `-- filepath: namaweb/migrations/e54_53dept_assessments_v5_up.sql
-- e54 v5: 53 dept tables (no FKs, defensive RLS, independent blocks)
${upStatements.join('\n')}
`;

const down = `-- filepath: namaweb/migrations/e54_53dept_assessments_v5_down.sql
-- e54 v5 down
${downStatements.join('\n')}
`;

fs.writeFileSync('namaweb/migrations/e54_53dept_assessments_v5_up.sql', up);
fs.writeFileSync('namaweb/migrations/e54_53dept_assessments_v5_down.sql', down);
console.log(`Generated v5: ${depts.length} depts`);
