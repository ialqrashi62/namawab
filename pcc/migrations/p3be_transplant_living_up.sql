-- P3-BE per-module: transplant_living
-- P3-BE part 1/3 : transplant_living (Transplant-Living, parent=Transplant)
CREATE TABLE IF NOT EXISTS transplant_living (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_transplant_living_tenant ON transplant_living(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transplant_living_patient ON transplant_living(patient_id);
