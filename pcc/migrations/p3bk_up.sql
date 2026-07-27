-- P3-BK combined migration
-- P3-BK part 1/3 : sports_med_ext (Sports-Med-Ext, parent=Sports-Medicine)
CREATE TABLE IF NOT EXISTS sports_med_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sports_med_ext_tenant ON sports_med_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sports_med_ext_patient ON sports_med_ext(patient_id);

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

-- P3-BK part 3/3 : psych_ext (Psych-Ext, parent=Psychiatry)
CREATE TABLE IF NOT EXISTS psych_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_psych_ext_tenant ON psych_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_psych_ext_patient ON psych_ext(patient_id);
