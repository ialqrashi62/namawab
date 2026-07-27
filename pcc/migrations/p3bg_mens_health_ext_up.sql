-- P3-BG per-module: mens_health_ext
-- P3-BG part 2/3 : mens_health_ext (Mens-Health-Ext, parent=Mens-Health)
CREATE TABLE IF NOT EXISTS mens_health_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_mens_health_ext_tenant ON mens_health_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mens_health_ext_patient ON mens_health_ext(patient_id);
