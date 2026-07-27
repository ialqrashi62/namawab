-- P3-BN per-module: rheum_ext2
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
