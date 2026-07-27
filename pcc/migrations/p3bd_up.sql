-- P3-BD combined migration
-- P3-BD part 1/3 : comprehensive_rehab (Comprehensive-Rehab, parent=Rehab-IRF)
CREATE TABLE IF NOT EXISTS comprehensive_rehab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_comprehensive_rehab_tenant ON comprehensive_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_rehab_patient ON comprehensive_rehab(patient_id);

-- P3-BD part 2/3 : sleep_medicine_ext (Sleep-Medicine-Ext, parent=Sleep)
CREATE TABLE IF NOT EXISTS sleep_medicine_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sleep_medicine_ext_tenant ON sleep_medicine_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sleep_medicine_ext_patient ON sleep_medicine_ext(patient_id);

-- P3-BD part 3/3 : transplant_extended (Transplant-Extended, parent=Transplant)
CREATE TABLE IF NOT EXISTS transplant_extended (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_transplant_extended_tenant ON transplant_extended(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transplant_extended_patient ON transplant_extended(patient_id);
