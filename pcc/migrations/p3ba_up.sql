-- P3-BA combined migration
-- P3-BA part 1/3 : wound_ostomy (Wound-Ostomy, parent=WOCN)
CREATE TABLE IF NOT EXISTS wound_ostomy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_wound_ostomy_tenant ON wound_ostomy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wound_ostomy_patient ON wound_ostomy(patient_id);

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

-- P3-BA part 3/3 : telerehab (Telerehab, parent=Digital-Health)
CREATE TABLE IF NOT EXISTS telerehab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_telerehab_tenant ON telerehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_telerehab_patient ON telerehab(patient_id);
