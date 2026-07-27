-- P3-BB per-module: geriatric_assessment
-- P3-BB part 3/3 : geriatric_assessment (Geriatric-Assessment, parent=CGA)
CREATE TABLE IF NOT EXISTS geriatric_assessment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_geriatric_assessment_tenant ON geriatric_assessment(tenant_id);
CREATE INDEX IF NOT EXISTS idx_geriatric_assessment_patient ON geriatric_assessment(patient_id);
