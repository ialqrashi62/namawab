-- P3-BJ per-module: perinatal_ext2
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
