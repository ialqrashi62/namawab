-- P3-BC per-module: med_psych
-- P3-BC part 3/3 : med_psych (Med-Psych, parent=Consultation-Liaison)
CREATE TABLE IF NOT EXISTS med_psych (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_med_psych_tenant ON med_psych(tenant_id);
CREATE INDEX IF NOT EXISTS idx_med_psych_patient ON med_psych(patient_id);
