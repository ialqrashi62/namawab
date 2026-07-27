-- P3-AV per-module: hand_therapy
-- P3-AV part 1/3 : hand_therapy (Hand-Therapy, parent=OT)
CREATE TABLE IF NOT EXISTS hand_therapy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hand_therapy_tenant ON hand_therapy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hand_therapy_patient ON hand_therapy(patient_id);
