CREATE TABLE IF NOT EXISTS radiology_ext (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);CREATE INDEX IF NOT EXISTS idx_radiology_ext_tenant ON radiology_ext(tenant_id);

CREATE TABLE IF NOT EXISTS pharmacy_compounding (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);CREATE INDEX IF NOT EXISTS idx_pharmacy_compounding_tenant ON pharmacy_compounding(tenant_id);

CREATE TABLE IF NOT EXISTS lab_specialty (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);CREATE INDEX IF NOT EXISTS idx_lab_specialty_tenant ON lab_specialty(tenant_id);
