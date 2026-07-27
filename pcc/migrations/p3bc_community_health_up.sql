-- P3-BC per-module: community_health
-- P3-BC part 2/3 : community_health (Community-Health, parent=Public-Health)
CREATE TABLE IF NOT EXISTS community_health (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_community_health_tenant ON community_health(tenant_id);
CREATE INDEX IF NOT EXISTS idx_community_health_patient ON community_health(patient_id);
