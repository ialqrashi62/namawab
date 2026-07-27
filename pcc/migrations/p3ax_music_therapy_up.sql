-- P3-AX per-module: music_therapy
-- P3-AX part 1/3 : music_therapy (Music-Therapy, parent=Expressive-Arts)
CREATE TABLE IF NOT EXISTS music_therapy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_music_therapy_tenant ON music_therapy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_music_therapy_patient ON music_therapy(patient_id);
