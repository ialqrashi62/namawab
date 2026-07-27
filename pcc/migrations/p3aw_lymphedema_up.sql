-- P3-AW per-module: lymphedema
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
