-- P3-AV combined migration
-- P3-AV part 1/3 : hand_therapy (Hand-Therapy, parent=OT)
CREATE TABLE IF NOT EXISTS hand_therapy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hand_therapy_tenant ON hand_therapy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hand_therapy_patient ON hand_therapy(patient_id);

-- P3-AV part 2/3 : cardiac_rehab (Cardiac-Rehab, parent=Cardiology)
CREATE TABLE IF NOT EXISTS cardiac_rehab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_cardiac_rehab_tenant ON cardiac_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cardiac_rehab_patient ON cardiac_rehab(patient_id);

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
