-- P3-BE per-module: neonatal_ext
-- P3-BE part 2/3 : neonatal_ext (Neonatal-Ext, parent=NICU)
CREATE TABLE IF NOT EXISTS neonatal_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_neonatal_ext_tenant ON neonatal_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_neonatal_ext_patient ON neonatal_ext(patient_id);
