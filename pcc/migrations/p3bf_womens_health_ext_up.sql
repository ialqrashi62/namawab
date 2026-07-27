-- P3-BF per-module: womens_health_ext
-- P3-BF part 3/3 : womens_health_ext (Womens-Health-Ext, parent=OB-GYN)
CREATE TABLE IF NOT EXISTS womens_health_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_womens_health_ext_tenant ON womens_health_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_womens_health_ext_patient ON womens_health_ext(patient_id);
