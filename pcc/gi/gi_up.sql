-- pcc/gi/gi_up.sql — PCC: Gastroenterology
-- Forward migration. Non-destructive. Tenant isolation enforced.

CREATE TABLE IF NOT EXISTS gi_admission (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, diagnosis TEXT, severity TEXT,
  status TEXT NOT NULL DEFAULT 'admitted', cpt_codes TEXT NOT NULL DEFAULT '[]',
  admitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gi_endoscopy (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, admission_id TEXT NOT NULL,
  procedure_type TEXT NOT NULL, findings TEXT, biopsy_taken BOOLEAN,
  performed_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gi_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, actor_id INTEGER,
  action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}', prev_hash TEXT, entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_gi_adm_tenant ON gi_admission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_gi_endoscopy_tenant ON gi_endoscopy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_gi_audit_tenant ON gi_audit_log(tenant_id);
