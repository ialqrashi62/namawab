-- P3-BO per-module: allergy_ext
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
