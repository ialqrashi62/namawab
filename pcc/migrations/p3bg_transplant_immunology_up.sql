-- P3-BG per-module: transplant_immunology
-- P3-BG part 1/3 : transplant_immunology (Transplant-Immunology, parent=Transplant-Imm)
CREATE TABLE IF NOT EXISTS transplant_immunology (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_transplant_immunology_tenant ON transplant_immunology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transplant_immunology_patient ON transplant_immunology(patient_id);
