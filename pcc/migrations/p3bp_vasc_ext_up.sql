-- P3-BP per-module: vasc_ext
-- P3-BP part 2/3 : vasc_ext (Vasc-Ext, parent=Vascular-Surgery)
CREATE TABLE IF NOT EXISTS vasc_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_vasc_ext_tenant ON vasc_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vasc_ext_patient ON vasc_ext(patient_id);
