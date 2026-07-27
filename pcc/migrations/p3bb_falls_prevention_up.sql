-- P3-BB per-module: falls_prevention
-- P3-BB part 1/3 : falls_prevention (Falls-Prevention, parent=Geriatric-Rehab)
CREATE TABLE IF NOT EXISTS falls_prevention (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_falls_prevention_tenant ON falls_prevention(tenant_id);
CREATE INDEX IF NOT EXISTS idx_falls_prevention_patient ON falls_prevention(patient_id);
