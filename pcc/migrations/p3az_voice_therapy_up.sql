-- P3-AZ per-module: voice_therapy
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
