-- P3-BP combined migration
-- P3-BP part 1/3 : uro_ext (Uro-Ext, parent=Urology)
CREATE TABLE IF NOT EXISTS uro_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_uro_ext_tenant ON uro_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_uro_ext_patient ON uro_ext(patient_id);

-- P3-BP part 2/3 : vasc_ext (Vasc-Ext, parent=Vascular-Surgery)
CREATE TABLE IF NOT EXISTS vasc_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_vasc_ext_tenant ON vasc_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vasc_ext_patient ON vasc_ext(patient_id);

-- P3-BP part 3/3 : ortho_ext (Ortho-Ext, parent=Orthopedics)
CREATE TABLE IF NOT EXISTS ortho_ext (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ortho_ext_tenant ON ortho_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ortho_ext_patient ON ortho_ext(patient_id);
