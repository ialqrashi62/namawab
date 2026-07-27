-- pcc/cticu/cticu_up.sql — PCC #11: Cardiothoracic ICU
-- Forward migration. Non-destructive. Tenant isolation enforced.

CREATE TABLE IF NOT EXISTS cticu_admission (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL,
  procedure_type TEXT NOT NULL,
  bypass_minutes INTEGER,
  cross_clamp_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'admitted',
  cpt_codes TEXT NOT NULL DEFAULT '[]',
  admitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  soft_deleted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cticu_chest_tube (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  admission_id TEXT NOT NULL,
  hourly_output_ml INTEGER NOT NULL,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cticu_red_flag (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  admission_id TEXT NOT NULL,
  flag_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cticu_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  actor_id INTEGER,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}',
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cticu_adm_tenant ON cticu_admission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cticu_tube_tenant ON cticu_chest_tube(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cticu_audit_tenant ON cticu_audit_log(tenant_id);
