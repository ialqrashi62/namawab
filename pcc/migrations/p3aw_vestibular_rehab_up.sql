-- P3-AW per-module: vestibular_rehab
-- P3-AW part 1/3 : vestibular_rehab (Vestibular-Rehab, parent=Neuro-Rehab)
CREATE TABLE IF NOT EXISTS vestibular_rehab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_vestibular_rehab_tenant ON vestibular_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vestibular_rehab_patient ON vestibular_rehab(patient_id);
