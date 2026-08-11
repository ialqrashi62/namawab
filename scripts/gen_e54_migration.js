#!/usr/bin/env node
// Generate e54 migration for 53 dept tables
'use strict';
const fs = require('fs');
const path = require('path');

const STAGING_DIR = '.ai-brain/05_ENGINES';

// 53 dept names that match the .ai-brain/05_ENGINES/ files
const stubs = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('_engine.js'));
const depts = stubs.map(f => f.replace('_engine.js', ''));
console.log(`Generating migration for ${depts.length} depts`);

// Build CREATE TABLE for each dept
const upStatements = [];
const downStatements = [];

for (const dept of depts) {
    const tableName = `${dept}_assessments`;
    upStatements.push(`
-- ${dept} assessments
CREATE TABLE IF NOT EXISTS ${tableName} (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    engine_name VARCHAR(120) NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC,
    risk_level VARCHAR(20),
    recommendation TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_${dept}_tenant_created ON ${tableName}(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_${dept}_patient ON ${tableName}(patient_id) WHERE patient_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_${dept}_engine ON ${tableName}(engine_name);
ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;
ALTER TABLE ${tableName} FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ${dept}_tenant_isolation ON ${tableName};
CREATE POLICY ${dept}_tenant_isolation ON ${tableName}
    USING (tenant_id = current_setting('app.tenant_id', true)::bigint);
CREATE TRIGGER ${dept}_set_updated_at
    BEFORE UPDATE ON ${tableName}
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();
`);

    downStatements.push(`
DROP TABLE IF EXISTS ${tableName} CASCADE;
`);
}

const up = `-- filepath: namaweb/migrations/e54_53dept_assessments_up.sql
-- e54: 53 dept assessment tables (one per dept)
-- Pattern: each dept gets a {_assessments} table with tenant_id, RLS, indexes
BEGIN;
${upStatements.join('\n')}
COMMIT;
`;

const down = `-- filepath: namaweb/migrations/e54_53dept_assessments_down.sql
-- e54 down: drop all 53 dept assessment tables
BEGIN;
${downStatements.join('\n')}
COMMIT;
`;

fs.writeFileSync('namaweb/migrations/e54_53dept_assessments_up.sql', up);
fs.writeFileSync('namaweb/migrations/e54_53dept_assessments_down.sql', down);

console.log(`Generated e54 migration: ${upStatements.length} tables`);
console.log(`  up:   ${up.length} bytes`);
console.log(`  down: ${down.length} bytes`);
