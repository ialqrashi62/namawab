-- P3-BG per-module: palliative_ext2
-- P3-BG part 3/3 : palliative_ext2 (Palliative-Ext-2, parent=Palliative)
CREATE TABLE IF NOT EXISTS palliative_ext2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_palliative_ext2_tenant ON palliative_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_palliative_ext2_patient ON palliative_ext2(patient_id);
