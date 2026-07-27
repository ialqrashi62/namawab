-- P3-BM per-module: ophth_ext
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
