-- P3-BP per-module: ortho_ext
-- P3-BP part 3/3 : ortho_ext (Ortho-Ext, parent=Orthopedics)
CREATE TABLE IF NOT EXISTS ortho_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ortho_ext_tenant ON ortho_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ortho_ext_patient ON ortho_ext(patient_id);
