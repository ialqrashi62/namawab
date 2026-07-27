-- P3-BN combined migration
-- P3-BN part 1/3 : gastro_ext (Gastro-Ext, parent=Gastro-Advanced)
CREATE TABLE IF NOT EXISTS gastro_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_gastro_ext_tenant ON gastro_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_gastro_ext_patient ON gastro_ext(patient_id);

-- P3-BN part 2/3 : rheum_ext2 (Rheum-Ext-2, parent=Rheum-Advanced)
CREATE TABLE IF NOT EXISTS rheum_ext2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_rheum_ext2_tenant ON rheum_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rheum_ext2_patient ON rheum_ext2(patient_id);

-- P3-BN part 3/3 : id_ext (ID-Ext, parent=Infectious-Disease)
CREATE TABLE IF NOT EXISTS id_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_id_ext_tenant ON id_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_id_ext_patient ON id_ext(patient_id);
