-- P3-BH per-module: neuro_ext2
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
