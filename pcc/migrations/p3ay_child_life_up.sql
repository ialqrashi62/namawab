-- P3-AY per-module: child_life
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
