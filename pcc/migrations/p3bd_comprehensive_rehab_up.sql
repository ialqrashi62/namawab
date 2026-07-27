-- P3-BD per-module: comprehensive_rehab
-- P3-BD part 1/3 : comprehensive_rehab (Comprehensive-Rehab, parent=Rehab-IRF)
CREATE TABLE IF NOT EXISTS comprehensive_rehab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_comprehensive_rehab_tenant ON comprehensive_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_rehab_patient ON comprehensive_rehab(patient_id);
