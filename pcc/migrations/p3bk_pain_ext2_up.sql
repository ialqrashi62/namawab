-- P3-BK per-module: pain_ext2
-- P3-BK part 2/3 : pain_ext2 (Pain-Ext-2, parent=Pain-Advanced)
CREATE TABLE IF NOT EXISTS pain_ext2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pain_ext2_tenant ON pain_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pain_ext2_patient ON pain_ext2(patient_id);
