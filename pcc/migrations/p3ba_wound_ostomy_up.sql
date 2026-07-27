-- P3-BA per-module: wound_ostomy
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
