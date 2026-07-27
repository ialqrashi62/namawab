-- P3-BN per-module: gastro_ext
-- P3-BN part 1/3 : gastro_ext (Gastro-Ext, parent=Gastro-Advanced)
CREATE TABLE IF NOT EXISTS gastro_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_gastro_ext_tenant ON gastro_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_gastro_ext_patient ON gastro_ext(patient_id);
