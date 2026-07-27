-- P3-AV per-module: pelvic_rehab
-- P3-AV part 3/3 : pelvic_rehab (Pelvic-Rehab, parent=Pelvic PT)
CREATE TABLE IF NOT EXISTS pelvic_rehab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pelvic_rehab_tenant ON pelvic_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pelvic_rehab_patient ON pelvic_rehab(patient_id);
