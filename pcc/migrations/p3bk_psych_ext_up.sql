-- P3-BK per-module: psych_ext
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
