-- P3-AW per-module: driving_rehab
-- P3-AW part 3/3 : driving_rehab (Driving-Rehab, parent=Driver-Rehab)
CREATE TABLE IF NOT EXISTS driving_rehab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_driving_rehab_tenant ON driving_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_driving_rehab_patient ON driving_rehab(patient_id);
