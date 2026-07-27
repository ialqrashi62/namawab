-- P3-AW combined migration
-- P3-AW part 1/3 : vestibular_rehab (Vestibular-Rehab, parent=Neuro-Rehab)
CREATE TABLE IF NOT EXISTS vestibular_rehab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_vestibular_rehab_tenant ON vestibular_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vestibular_rehab_patient ON vestibular_rehab(patient_id);

-- P3-AW part 2/3 : lymphedema (Lymphedema, parent=Rehab)
CREATE TABLE IF NOT EXISTS lymphedema (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_lymphedema_tenant ON lymphedema(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lymphedema_patient ON lymphedema(patient_id);

-- P3-AW part 3/3 : driving_rehab (Driving-Rehab, parent=Driver-Rehab)
CREATE TABLE IF NOT EXISTS driving_rehab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_driving_rehab_tenant ON driving_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_driving_rehab_patient ON driving_rehab(patient_id);
