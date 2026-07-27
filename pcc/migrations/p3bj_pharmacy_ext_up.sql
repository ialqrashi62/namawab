-- P3-BJ per-module: pharmacy_ext
-- P3-BJ part 2/3 : pharmacy_ext (Pharmacy-Ext, parent=Pharmacy-Adv)
CREATE TABLE IF NOT EXISTS pharmacy_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pharmacy_ext_tenant ON pharmacy_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_ext_patient ON pharmacy_ext(patient_id);
