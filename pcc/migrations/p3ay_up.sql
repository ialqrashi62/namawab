-- P3-AY combined migration
-- P3-AY part 1/3 : hippotherapy (Hippotherapy, parent=Animal-Assisted-PT)
CREATE TABLE IF NOT EXISTS hippotherapy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hippotherapy_tenant ON hippotherapy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hippotherapy_patient ON hippotherapy(patient_id);

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

-- P3-AY part 3/3 : child_life (Child-Life, parent=Pediatric-Support)
CREATE TABLE IF NOT EXISTS child_life (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_child_life_tenant ON child_life(tenant_id);
CREATE INDEX IF NOT EXISTS idx_child_life_patient ON child_life(patient_id);
