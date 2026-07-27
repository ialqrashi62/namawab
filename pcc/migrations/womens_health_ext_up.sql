-- P3-BF womens_health_ext migration v3.18.0
BEGIN;
CREATE TABLE IF NOT EXISTS whe_records (id SERIAL PRIMARY KEY, tenant_id INTEGER NOT NULL, whe_id TEXT, age TEXT, menopause TEXT, cycle TEXT, plan TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS whe_labs (id SERIAL PRIMARY KEY, tenant_id INTEGER NOT NULL, lab_id TEXT, whe_id TEXT, fsh TEXT, hpv TEXT, culture TEXT, collected_at TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_whe_records_tid ON whe_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_whe_labs_tid ON whe_labs(tenant_id);
COMMIT;
