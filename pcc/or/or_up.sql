-- pcc/or/or_up.sql — PCC: OR
-- Forward migration. Non-destructive. Tenant isolation enforced.

CREATE TABLE or_case (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, procedure_type TEXT NOT NULL, asa_class INTEGER,
  scheduled_duration_hrs REAL, status TEXT NOT NULL DEFAULT 'scheduled',
  cpt_codes TEXT NOT NULL DEFAULT '[]',
  scheduled_at TEXT NOT NULL DEFAULT (datetime('now')),
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE or_intraop_event (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, case_id TEXT NOT NULL,
  event_type TEXT NOT NULL, severity TEXT, description TEXT,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE or_red_flag (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, case_id TEXT NOT NULL,
  flag_type TEXT NOT NULL, severity TEXT NOT NULL, description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE or_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, actor_id INTEGER,
  action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}', prev_hash TEXT, entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
