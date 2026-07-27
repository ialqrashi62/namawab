-- P3-BO per-module: derm_ext2
-- P3-BO part 3/3 : derm_ext2 (Derm-Ext-2, parent=Derm-Advanced)
CREATE TABLE IF NOT EXISTS derm_ext2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_derm_ext2_tenant ON derm_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_derm_ext2_patient ON derm_ext2(patient_id);
