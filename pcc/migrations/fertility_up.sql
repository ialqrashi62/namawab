-- P3-BF fertility migration v3.18.0
BEGIN;
CREATE TABLE IF NOT EXISTS fertility_records (id SERIAL PRIMARY KEY, tenant_id INTEGER NOT NULL, fertility_id TEXT, partner_age TEXT, duration_months TEXT, cycle TEXT, prior_preg TEXT, plan TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS fertility_labs (id SERIAL PRIMARY KEY, tenant_id INTEGER NOT NULL, lab_id TEXT, fertility_id TEXT, amh TEXT, fsh TEXT, estradiol TEXT, collected_at TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_fertility_records_tid ON fertility_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fertility_labs_tid ON fertility_labs(tenant_id);
COMMIT;
