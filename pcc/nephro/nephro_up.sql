-- pcc/nephro/nephro_up.sql — PCC: Nephrology
-- Forward migration. Non-destructive. Tenant isolation enforced.

CREATE TABLE IF NOT EXISTS nephro_admission (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, diagnosis TEXT, egfr REAL, ckd_stage TEXT,
  status TEXT NOT NULL DEFAULT 'admitted', cpt_codes TEXT NOT NULL DEFAULT '[]',
  admitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS nephro_dialysis_session (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, admission_id TEXT NOT NULL,
  modality TEXT NOT NULL, duration_hours REAL, fluid_removed_ml INTEGER,
  complications TEXT, performed_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS nephro_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, actor_id INTEGER,
  action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}', prev_hash TEXT, entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_nephro_adm_tenant ON nephro_admission(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nephro_dialysis_tenant ON nephro_dialysis_session(tenant_id);
CREATE INDEX IF NOT EXISTS idx_nephro_audit_tenant ON nephro_audit_log(tenant_id);
