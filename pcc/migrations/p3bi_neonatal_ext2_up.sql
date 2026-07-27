-- P3-BI per-module: neonatal_ext2
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
