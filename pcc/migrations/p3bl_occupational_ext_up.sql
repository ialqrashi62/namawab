-- P3-BL per-module: occupational_ext
-- P3-BL part 1/3 : occupational_ext (Occupational-Ext, parent=Occupational-Health)
CREATE TABLE IF NOT EXISTS occupational_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_occupational_ext_tenant ON occupational_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_occupational_ext_patient ON occupational_ext(patient_id);
