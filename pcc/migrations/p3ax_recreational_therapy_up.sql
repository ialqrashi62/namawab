-- P3-AX per-module: recreational_therapy
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
