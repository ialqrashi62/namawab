-- P3-BD per-module: sleep_medicine_ext
-- P3-BD part 2/3 : sleep_medicine_ext (Sleep-Medicine-Ext, parent=Sleep)
CREATE TABLE IF NOT EXISTS sleep_medicine_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sleep_medicine_ext_tenant ON sleep_medicine_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sleep_medicine_ext_patient ON sleep_medicine_ext(patient_id);
