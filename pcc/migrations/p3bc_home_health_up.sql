-- P3-BC per-module: home_health
-- P3-BC part 1/3 : home_health (Home-Health, parent=Home-Care)
CREATE TABLE IF NOT EXISTS home_health (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_home_health_tenant ON home_health(tenant_id);
CREATE INDEX IF NOT EXISTS idx_home_health_patient ON home_health(patient_id);
