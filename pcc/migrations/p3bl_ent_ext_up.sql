-- P3-BL per-module: ent_ext
-- P3-BL part 3/3 : ent_ext (ENT-Ext, parent=ENT)
CREATE TABLE IF NOT EXISTS ent_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ent_ext_tenant ON ent_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ent_ext_patient ON ent_ext(patient_id);
