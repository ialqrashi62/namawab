-- P3-BN per-module: id_ext
-- P3-BN part 3/3 : id_ext (ID-Ext, parent=Infectious-Disease)
CREATE TABLE IF NOT EXISTS id_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_id_ext_tenant ON id_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_id_ext_patient ON id_ext(patient_id);
