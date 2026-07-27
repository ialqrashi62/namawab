-- P3-BC combined migration
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

-- P3-BC part 3/3 : med_psych (Med-Psych, parent=Consultation-Liaison)
CREATE TABLE IF NOT EXISTS med_psych (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_med_psych_tenant ON med_psych(tenant_id);
CREATE INDEX IF NOT EXISTS idx_med_psych_patient ON med_psych(patient_id);
