-- P3-AV per-module: cardiac_rehab
-- P3-AV part 2/3 : cardiac_rehab (Cardiac-Rehab, parent=Cardiology)
CREATE TABLE IF NOT EXISTS cardiac_rehab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_cardiac_rehab_tenant ON cardiac_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cardiac_rehab_patient ON cardiac_rehab(patient_id);
