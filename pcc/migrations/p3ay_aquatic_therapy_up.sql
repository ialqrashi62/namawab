-- P3-AY per-module: aquatic_therapy
-- P3-AY part 2/3 : aquatic_therapy (Aquatic-Therapy, parent=Aquatic-PT)
CREATE TABLE IF NOT EXISTS aquatic_therapy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_aquatic_therapy_tenant ON aquatic_therapy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_aquatic_therapy_patient ON aquatic_therapy(patient_id);
