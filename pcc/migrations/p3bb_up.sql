-- P3-BB combined migration
-- P3-BB part 1/3 : falls_prevention (Falls-Prevention, parent=Geriatric-Rehab)
CREATE TABLE IF NOT EXISTS falls_prevention (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_falls_prevention_tenant ON falls_prevention(tenant_id);
CREATE INDEX IF NOT EXISTS idx_falls_prevention_patient ON falls_prevention(patient_id);

-- P3-BB part 2/3 : frailty (Frailty, parent=Geriatric)
CREATE TABLE IF NOT EXISTS frailty (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_frailty_tenant ON frailty(tenant_id);
CREATE INDEX IF NOT EXISTS idx_frailty_patient ON frailty(patient_id);

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
