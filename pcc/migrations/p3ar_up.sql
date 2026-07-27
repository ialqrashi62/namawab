CREATE TABLE IF NOT EXISTS critical_care_ext (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);CREATE INDEX IF NOT EXISTS idx_critical_care_ext_tenant ON critical_care_ext(tenant_id);

CREATE TABLE IF NOT EXISTS stroke_ext (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);CREATE INDEX IF NOT EXISTS idx_stroke_ext_tenant ON stroke_ext(tenant_id);

CREATE TABLE IF NOT EXISTS cardiology_ext2 (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL, audit_hash TEXT);CREATE INDEX IF NOT EXISTS idx_cardiology_ext2_tenant ON cardiology_ext2(tenant_id);
