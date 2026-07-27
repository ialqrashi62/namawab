-- P3-BI per-module: rad_ext
-- P3-BI part 2/3 : rad_ext (Rad-Ext, parent=Radiology-Advanced)
CREATE TABLE IF NOT EXISTS rad_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_rad_ext_tenant ON rad_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rad_ext_patient ON rad_ext(patient_id);
