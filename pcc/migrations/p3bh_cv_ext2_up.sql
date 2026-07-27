-- P3-BH per-module: cv_ext2
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
