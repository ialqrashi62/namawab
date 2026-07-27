-- P3-BP per-module: uro_ext
-- P3-BP part 1/3 : uro_ext (Uro-Ext, parent=Urology)
CREATE TABLE IF NOT EXISTS uro_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_uro_ext_tenant ON uro_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_uro_ext_patient ON uro_ext(patient_id);
