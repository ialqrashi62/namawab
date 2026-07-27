-- P3-BG combined migration
-- P3-BG part 1/3 : transplant_immunology (Transplant-Immunology, parent=Transplant-Imm)
CREATE TABLE IF NOT EXISTS transplant_immunology (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_transplant_immunology_tenant ON transplant_immunology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transplant_immunology_patient ON transplant_immunology(patient_id);

-- P3-BG part 2/3 : mens_health_ext (Mens-Health-Ext, parent=Mens-Health)
CREATE TABLE IF NOT EXISTS mens_health_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_mens_health_ext_tenant ON mens_health_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mens_health_ext_patient ON mens_health_ext(patient_id);

-- P3-BG part 3/3 : palliative_ext2 (Palliative-Ext-2, parent=Palliative)
CREATE TABLE IF NOT EXISTS palliative_ext2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_palliative_ext2_tenant ON palliative_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_palliative_ext2_patient ON palliative_ext2(patient_id);
