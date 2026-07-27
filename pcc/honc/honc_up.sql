-- pcc/honc/honc_up.sql — PCC #10: Hematology/Oncology ICU
-- Forward migration. Non-destructive. Tenant isolation enforced.

CREATE TABLE IF NOT EXISTS honc_admission (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL,
  diagnosis TEXT NOT NULL,
  oncologic_emergency TEXT,
  status TEXT NOT NULL DEFAULT 'admitted',
  cpt_codes TEXT NOT NULL DEFAULT '[]',
  admitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  soft_deleted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS honc_chemo_order (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  admission_id TEXT NOT NULL,
  regimen TEXT NOT NULL,
  cycle INTEGER,
  dose_modification TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (admission_id) REFERENCES honc_admission(id)
);

CREATE TABLE IF NOT EXISTS honc_red_flag (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  admission_id TEXT NOT NULL,
  flag_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS honc_audit_log (
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

CREATE INDEX IF NOT EXISTS idx_honc_adm_tenant ON honc_admission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_honc_adm_patient ON honc_admission(patient_id);
CREATE INDEX IF NOT EXISTS idx_honc_chemo_tenant ON honc_chemo_order(tenant_id);
CREATE INDEX IF NOT EXISTS idx_honc_audit_tenant ON honc_audit_log(tenant_id);

-- RLS note: production PG requires ENABLE + FORCE ROW LEVEL SECURITY
-- (in sql.js sandbox, RLS is not enforceable; this comment is the marker)
