CREATE TABLE IF NOT EXISTS nuclear_med (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);
CREATE INDEX IF NOT EXISTS idx_nuclear_med_tenant ON nuclear_med(tenant_id);

CREATE TABLE IF NOT EXISTS palliative_ext (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);
CREATE INDEX IF NOT EXISTS idx_palliative_ext_tenant ON palliative_ext(tenant_id);

CREATE TABLE IF NOT EXISTS hospital_admin (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);
CREATE INDEX IF NOT EXISTS idx_hospital_admin_tenant ON hospital_admin(tenant_id);
