-- P3-BO per-module: endocrine_ext
-- P3-BO part 2/3 : endocrine_ext (Endocrine-Ext, parent=Endocrine)
CREATE TABLE IF NOT EXISTS endocrine_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_endocrine_ext_tenant ON endocrine_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_endocrine_ext_patient ON endocrine_ext(patient_id);
