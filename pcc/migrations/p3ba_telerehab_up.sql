-- P3-BA per-module: telerehab
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
