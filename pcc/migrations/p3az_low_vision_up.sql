-- P3-AZ per-module: low_vision
-- P3-AZ part 1/3 : low_vision (Low-Vision, parent=Sensory-Rehab)
CREATE TABLE IF NOT EXISTS low_vision (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_low_vision_tenant ON low_vision(tenant_id);
CREATE INDEX IF NOT EXISTS idx_low_vision_patient ON low_vision(patient_id);
