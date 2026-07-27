-- P3-BL combined migration
-- P3-BL part 1/3 : occupational_ext (Occupational-Ext, parent=Occupational-Health)
CREATE TABLE IF NOT EXISTS occupational_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_occupational_ext_tenant ON occupational_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_occupational_ext_patient ON occupational_ext(patient_id);

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

-- P3-BL part 3/3 : ent_ext (ENT-Ext, parent=ENT)
CREATE TABLE IF NOT EXISTS ent_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ent_ext_tenant ON ent_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ent_ext_patient ON ent_ext(patient_id);
