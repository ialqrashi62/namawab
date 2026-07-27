-- P3-AY per-module: hippotherapy
-- P3-AY part 1/3 : hippotherapy (Hippotherapy, parent=Animal-Assisted-PT)
CREATE TABLE IF NOT EXISTS hippotherapy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hippotherapy_tenant ON hippotherapy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hippotherapy_patient ON hippotherapy(patient_id);
