-- P3-BF per-module: transplant_pediatric
-- P3-BF part 2/3 : transplant_pediatric (Transplant-Pediatric, parent=Pedi-Surgery)
CREATE TABLE IF NOT EXISTS transplant_pediatric (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_transplant_pediatric_tenant ON transplant_pediatric(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transplant_pediatric_patient ON transplant_pediatric(patient_id);
