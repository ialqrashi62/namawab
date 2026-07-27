-- P3-BJ per-module: dental_ext
-- P3-BJ part 3/3 : dental_ext (Dental-Ext, parent=Dental)
CREATE TABLE IF NOT EXISTS dental_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_dental_ext_tenant ON dental_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dental_ext_patient ON dental_ext(patient_id);
