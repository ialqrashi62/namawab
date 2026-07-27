-- P3-AZ per-module: prosthetics_orthotics
-- P3-AZ part 3/3 : prosthetics_orthotics (Prosthetics-Orthotics, parent=Devices)
CREATE TABLE IF NOT EXISTS prosthetics_orthotics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_prosthetics_orthotics_tenant ON prosthetics_orthotics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_prosthetics_orthotics_patient ON prosthetics_orthotics(patient_id);
