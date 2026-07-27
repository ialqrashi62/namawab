-- P3-BE per-module: perinatal_ext
-- P3-BE part 3/3 : perinatal_ext (Perinatal-Ext, parent=Maternal-Fetal)
CREATE TABLE IF NOT EXISTS perinatal_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_perinatal_ext_tenant ON perinatal_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_perinatal_ext_patient ON perinatal_ext(patient_id);
