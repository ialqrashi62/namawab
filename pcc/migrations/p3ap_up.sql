CREATE TABLE IF NOT EXISTS transplant_heart (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);CREATE INDEX IF NOT EXISTS idx_transplant_heart_tenant ON transplant_heart(tenant_id);

CREATE TABLE IF NOT EXISTS transplant_liver (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);CREATE INDEX IF NOT EXISTS idx_transplant_liver_tenant ON transplant_liver(tenant_id);

CREATE TABLE IF NOT EXISTS transfusion_med (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);CREATE INDEX IF NOT EXISTS idx_transfusion_med_tenant ON transfusion_med(tenant_id);
