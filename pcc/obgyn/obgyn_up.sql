-- pcc/obgyn/obgyn_up.sql — PCC: OBGYN
-- Forward migration. Non-destructive. Tenant isolation enforced.

CREATE TABLE obgyn_pregnancy (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, gestational_age_weeks INTEGER, gravidity INTEGER, parity INTEGER,
  status TEXT NOT NULL DEFAULT 'active', cpt_codes TEXT NOT NULL DEFAULT '[]',
  registered_at TEXT NOT NULL DEFAULT (datetime('now')),
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE obgyn_labour (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, pregnancy_id TEXT NOT NULL,
  cervical_dilation_cm INTEGER, fetal_hr INTEGER, presentation TEXT,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE obgyn_red_flag (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, pregnancy_id TEXT NOT NULL,
  flag_type TEXT NOT NULL, severity TEXT NOT NULL, description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE obgyn_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, actor_id INTEGER,
  action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}', prev_hash TEXT, entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
