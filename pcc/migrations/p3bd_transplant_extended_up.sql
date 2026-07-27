-- P3-BD per-module: transplant_extended
-- P3-BD part 3/3 : transplant_extended (Transplant-Extended, parent=Transplant)
CREATE TABLE IF NOT EXISTS transplant_extended (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_transplant_extended_tenant ON transplant_extended(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transplant_extended_patient ON transplant_extended(patient_id);
