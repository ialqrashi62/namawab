-- P3-BL per-module: rehab_ext2
-- P3-BL part 2/3 : rehab_ext2 (Rehab-Ext-2, parent=Rehab-Advanced)
CREATE TABLE IF NOT EXISTS rehab_ext2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_rehab_ext2_tenant ON rehab_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_rehab_ext2_patient ON rehab_ext2(patient_id);
