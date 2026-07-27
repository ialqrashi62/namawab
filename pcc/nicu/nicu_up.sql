-- pcc/nicu/nicu_up.sql — PCC #12: Neurocritical ICU
-- Forward migration. Non-destructive. Tenant isolation enforced.

CREATE TABLE IF NOT EXISTS nicu_admission (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL,
  diagnosis TEXT NOT NULL,
  nihss INTEGER,
  gcs INTEGER,
  status TEXT NOT NULL DEFAULT 'admitted',
  cpt_codes TEXT NOT NULL DEFAULT '[]',
  admitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  soft_deleted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS nicu_neuro_exam (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  admission_id TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  findings TEXT NOT NULL,
  examined_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS nicu_red_flag (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  admission_id TEXT NOT NULL,
  flag_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS nicu_audit_log (
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

CREATE INDEX IF NOT EXISTS idx_nicu_adm_tenant ON nicu_admission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nicu_exam_tenant ON nicu_neuro_exam(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nicu_audit_tenant ON nicu_audit_log(tenant_id);
