-- pcc/ed/ed_up.sql — PCC: ED
-- Forward migration. Non-destructive. Tenant isolation enforced.

CREATE TABLE ed_visit (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, chief_complaint TEXT NOT NULL, triage_level INTEGER,
  status TEXT NOT NULL DEFAULT 'in_progress', cpt_codes TEXT NOT NULL DEFAULT '[]',
  arrived_at TEXT NOT NULL DEFAULT (datetime('now')),
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE ed_vital_sign (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, visit_id TEXT NOT NULL,
  measured_at TEXT NOT NULL DEFAULT (datetime('now')),
  heart_rate INTEGER, sbp_mmhg INTEGER, spo2_pct INTEGER, temperature_c REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE ed_red_flag (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, visit_id TEXT NOT NULL,
  flag_type TEXT NOT NULL, severity TEXT NOT NULL, description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE ed_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, actor_id INTEGER,
  action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}', prev_hash TEXT, entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
