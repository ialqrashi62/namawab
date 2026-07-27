-- P3-BE combined migration
-- P3-BE part 1/3 : transplant_living (Transplant-Living, parent=Transplant)
CREATE TABLE IF NOT EXISTS transplant_living (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_transplant_living_tenant ON transplant_living(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transplant_living_patient ON transplant_living(patient_id);

-- P3-BE part 2/3 : neonatal_ext (Neonatal-Ext, parent=NICU)
CREATE TABLE IF NOT EXISTS neonatal_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_neonatal_ext_tenant ON neonatal_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_neonatal_ext_patient ON neonatal_ext(patient_id);

-- P3-BE part 3/3 : perinatal_ext (Perinatal-Ext, parent=Maternal-Fetal)
CREATE TABLE IF NOT EXISTS perinatal_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_perinatal_ext_tenant ON perinatal_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_perinatal_ext_patient ON perinatal_ext(patient_id);
