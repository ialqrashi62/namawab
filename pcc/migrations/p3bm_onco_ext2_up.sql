-- P3-BM per-module: onco_ext2
-- P3-BM part 3/3 : onco_ext2 (Onco-Ext-2, parent=Oncology-Advanced)
CREATE TABLE IF NOT EXISTS onco_ext2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_onco_ext2_tenant ON onco_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_onco_ext2_patient ON onco_ext2(patient_id);
