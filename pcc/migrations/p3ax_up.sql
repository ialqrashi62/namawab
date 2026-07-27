-- P3-AX combined migration
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

-- P3-AX part 2/3 : art_therapy (Art-Therapy, parent=Expressive-Arts)
CREATE TABLE IF NOT EXISTS art_therapy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_art_therapy_tenant ON art_therapy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_art_therapy_patient ON art_therapy(patient_id);

-- P3-AX part 3/3 : recreational_therapy (Recreational-Therapy, parent=RT)
CREATE TABLE IF NOT EXISTS recreational_therapy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_recreational_therapy_tenant ON recreational_therapy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_recreational_therapy_patient ON recreational_therapy(patient_id);
