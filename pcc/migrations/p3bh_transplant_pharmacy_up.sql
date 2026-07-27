-- P3-BH per-module: transplant_pharmacy
-- P3-BH part 1/3 : transplant_pharmacy (Transplant-Pharmacy, parent=Transplant-Pharm)
CREATE TABLE IF NOT EXISTS transplant_pharmacy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_transplant_pharmacy_tenant ON transplant_pharmacy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transplant_pharmacy_patient ON transplant_pharmacy(patient_id);
