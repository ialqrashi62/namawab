-- P3-BK per-module: sports_med_ext
-- P3-BK part 1/3 : sports_med_ext (Sports-Med-Ext, parent=Sports-Medicine)
CREATE TABLE IF NOT EXISTS sports_med_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sports_med_ext_tenant ON sports_med_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sports_med_ext_patient ON sports_med_ext(patient_id);
