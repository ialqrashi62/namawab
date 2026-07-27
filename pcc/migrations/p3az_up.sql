-- P3-AZ combined migration
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

-- P3-AZ part 2/3 : voice_therapy (Voice-Therapy, parent=Speech-Swallowing)
CREATE TABLE IF NOT EXISTS voice_therapy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_voice_therapy_tenant ON voice_therapy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_voice_therapy_patient ON voice_therapy(patient_id);

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
