-- pcc/hematology/hematology_up.sql -- PCC: hematology
-- Forward migration. Non-destructive. Tenant isolation enforced.
CREATE TABLE IF NOT EXISTS hematology_admission (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, diagnosis TEXT, status TEXT NOT NULL DEFAULT 'active',
  cpt_codes TEXT NOT NULL DEFAULT '[]',
  admitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS hematology_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, actor_id INTEGER,
  action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}', prev_hash TEXT, entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hematology_adm_tenant ON hematology_admission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hematology_audit_tenant ON hematology_audit_log(tenant_id);
