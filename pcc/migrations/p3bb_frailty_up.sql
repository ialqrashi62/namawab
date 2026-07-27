-- P3-BB per-module: frailty
-- P3-BB part 2/3 : frailty (Frailty, parent=Geriatric)
CREATE TABLE IF NOT EXISTS frailty (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_frailty_tenant ON frailty(tenant_id);
CREATE INDEX IF NOT EXISTS idx_frailty_patient ON frailty(patient_id);
