-- P3-BJ combined migration
-- P3-BJ part 1/3 : perinatal_ext2 (Perinatal-Ext-2, parent=Maternal-Fetal-Adv)
CREATE TABLE IF NOT EXISTS perinatal_ext2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_perinatal_ext2_tenant ON perinatal_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_perinatal_ext2_patient ON perinatal_ext2(patient_id);

-- P3-BJ part 2/3 : pharmacy_ext (Pharmacy-Ext, parent=Pharmacy-Adv)
CREATE TABLE IF NOT EXISTS pharmacy_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pharmacy_ext_tenant ON pharmacy_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_ext_patient ON pharmacy_ext(patient_id);

-- P3-BJ part 3/3 : dental_ext (Dental-Ext, parent=Dental)
CREATE TABLE IF NOT EXISTS dental_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_dental_ext_tenant ON dental_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dental_ext_patient ON dental_ext(patient_id);
