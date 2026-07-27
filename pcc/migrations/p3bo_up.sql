-- P3-BO combined migration
-- P3-BO part 1/3 : allergy_ext (Allergy-Ext, parent=Allergy-Immunology)
CREATE TABLE IF NOT EXISTS allergy_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_allergy_ext_tenant ON allergy_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_allergy_ext_patient ON allergy_ext(patient_id);

-- P3-BO part 2/3 : endocrine_ext (Endocrine-Ext, parent=Endocrine)
CREATE TABLE IF NOT EXISTS endocrine_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_endocrine_ext_tenant ON endocrine_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_endocrine_ext_patient ON endocrine_ext(patient_id);

-- P3-BO part 3/3 : derm_ext2 (Derm-Ext-2, parent=Derm-Advanced)
CREATE TABLE IF NOT EXISTS derm_ext2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_derm_ext2_tenant ON derm_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_derm_ext2_patient ON derm_ext2(patient_id);
