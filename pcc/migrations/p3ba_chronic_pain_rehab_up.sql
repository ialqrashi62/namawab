-- P3-BA per-module: chronic_pain_rehab
-- P3-BA part 2/3 : chronic_pain_rehab (Chronic-Pain-Rehab, parent=Pain-Rehab)
CREATE TABLE IF NOT EXISTS chronic_pain_rehab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_chronic_pain_rehab_tenant ON chronic_pain_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_chronic_pain_rehab_patient ON chronic_pain_rehab(patient_id);
