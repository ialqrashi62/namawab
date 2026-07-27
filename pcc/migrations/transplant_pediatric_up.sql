-- P3-BF transplant_pediatric migration v3.18.0
BEGIN;
CREATE TABLE IF NOT EXISTS tx_pedi_records (id SERIAL PRIMARY KEY, tenant_id INTEGER NOT NULL, tpd_id TEXT, organ TEXT, age TEXT, weight TEXT, etiology TEXT, plan TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS tx_pedi_labs (id SERIAL PRIMARY KEY, tenant_id INTEGER NOT NULL, lab_id TEXT, tpd_id TEXT, gfr TEXT, tac_level TEXT, ebv TEXT, drawn_at TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_tx_pedi_records_tid ON tx_pedi_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tx_pedi_labs_tid ON tx_pedi_labs(tenant_id);
COMMIT;
