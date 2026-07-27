-- P3-BF combined migration
-- P3-BF part 1/3 : fertility (Fertility, parent=Reproductive-Endo)
CREATE TABLE IF NOT EXISTS fertility (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_fertility_tenant ON fertility(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fertility_patient ON fertility(patient_id);

-- P3-BF part 2/3 : transplant_pediatric (Transplant-Pediatric, parent=Pedi-Surgery)
CREATE TABLE IF NOT EXISTS transplant_pediatric (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_transplant_pediatric_tenant ON transplant_pediatric(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transplant_pediatric_patient ON transplant_pediatric(patient_id);

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
