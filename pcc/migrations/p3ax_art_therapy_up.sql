-- P3-AX per-module: art_therapy
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
