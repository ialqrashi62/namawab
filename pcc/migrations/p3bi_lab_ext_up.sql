-- P3-BI per-module: lab_ext
-- P3-BI part 3/3 : lab_ext (Lab-Ext, parent=Lab-Advanced)
CREATE TABLE IF NOT EXISTS lab_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_lab_ext_tenant ON lab_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lab_ext_patient ON lab_ext(patient_id);
