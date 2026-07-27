-- P3-BH combined migration
-- P3-BH part 1/3 : transplant_pharmacy (Transplant-Pharmacy, parent=Transplant-Pharm)
CREATE TABLE IF NOT EXISTS transplant_pharmacy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_transplant_pharmacy_tenant ON transplant_pharmacy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transplant_pharmacy_patient ON transplant_pharmacy(patient_id);

-- P3-BH part 2/3 : neuro_ext2 (Neuro-Ext-2, parent=Neuro)
CREATE TABLE IF NOT EXISTS neuro_ext2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_neuro_ext2_tenant ON neuro_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_neuro_ext2_patient ON neuro_ext2(patient_id);

-- P3-BH part 3/3 : cv_ext2 (CV-Ext-2, parent=Cardiology)
CREATE TABLE IF NOT EXISTS cv_ext2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_cv_ext2_tenant ON cv_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cv_ext2_patient ON cv_ext2(patient_id);
