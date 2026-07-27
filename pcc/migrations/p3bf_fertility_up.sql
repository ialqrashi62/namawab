-- P3-BF per-module: fertility
-- P3-BF part 1/3 : fertility (Fertility, parent=Reproductive-Endo)
CREATE TABLE IF NOT EXISTS fertility (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_fertility_tenant ON fertility(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fertility_patient ON fertility(patient_id);
