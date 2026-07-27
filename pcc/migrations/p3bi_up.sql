-- P3-BI combined migration
-- P3-BI part 1/3 : neonatal_ext2 (Neonatal-Ext-2, parent=NICU-Advanced)
CREATE TABLE IF NOT EXISTS neonatal_ext2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_neonatal_ext2_tenant ON neonatal_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_neonatal_ext2_patient ON neonatal_ext2(patient_id);

-- P3-BI part 2/3 : rad_ext (Rad-Ext, parent=Radiology-Advanced)
CREATE TABLE IF NOT EXISTS rad_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_rad_ext_tenant ON rad_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rad_ext_patient ON rad_ext(patient_id);

-- P3-BI part 3/3 : lab_ext (Lab-Ext, parent=Lab-Advanced)
CREATE TABLE IF NOT EXISTS lab_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_lab_ext_tenant ON lab_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lab_ext_patient ON lab_ext(patient_id);
