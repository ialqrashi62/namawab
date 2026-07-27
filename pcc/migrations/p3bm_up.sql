-- P3-BM combined migration
-- P3-BM part 1/3 : ophth_ext (Ophth-Ext, parent=Ophthalmology)
CREATE TABLE IF NOT EXISTS ophth_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ophth_ext_tenant ON ophth_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ophth_ext_patient ON ophth_ext(patient_id);

-- P3-BM part 2/3 : hem_ext (Hem-Ext, parent=Hematology)
CREATE TABLE IF NOT EXISTS hem_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hem_ext_tenant ON hem_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hem_ext_patient ON hem_ext(patient_id);

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
