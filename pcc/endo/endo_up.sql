-- pcc/endo/endo_up.sql — PCC: Endocrinology
-- Forward migration. Non-destructive. Tenant isolation enforced.

CREATE TABLE IF NOT EXISTS endo_admission (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, diagnosis TEXT, severity TEXT,
  status TEXT NOT NULL DEFAULT 'admitted', cpt_codes TEXT NOT NULL DEFAULT '[]',
  admitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS endo_lab (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, admission_id TEXT NOT NULL,
  test_type TEXT NOT NULL, value REAL, units TEXT,
  drawn_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS endo_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, actor_id INTEGER,
  action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}', prev_hash TEXT, entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_endo_adm_tenant ON endo_admission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_endo_lab_tenant ON endo_lab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_endo_audit_tenant ON endo_audit_log(tenant_id);
