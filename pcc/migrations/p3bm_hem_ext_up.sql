-- P3-BM per-module: hem_ext
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
