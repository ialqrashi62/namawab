-- pcc/lab/lab_up.sql — PCC: lab
-- Forward migration. Non-destructive. Tenant isolation enforced.

CREATE TABLE IF NOT EXISTS lab_order (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, test_name TEXT, status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'routine', cpt_codes TEXT NOT NULL DEFAULT '[]',
  ordered_at TEXT NOT NULL DEFAULT (datetime('now')),
  collected_at TEXT, resulted_at TEXT,
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS lab_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, actor_id INTEGER,
  action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}', prev_hash TEXT, entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_lab_order_tenant ON lab_order(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lab_audit_tenant ON lab_audit_log(tenant_id);
