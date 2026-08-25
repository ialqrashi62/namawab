-- e490 TIER4_URG-102 Procedures
CREATE TABLE IF NOT EXISTS tier4_urg_102_proc_lac (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  length_cm NUMERIC NOT NULL,
  depth TEXT NOT NULL,
  location TEXT NOT NULL,
  contamination BOOLEAN,
  age_hours NUMERIC NOT NULL,
  management TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urg_102_proc_lac ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urg_102_proc_lac FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urg_102_proc_lac_t ON tier4_urg_102_proc_lac;
CREATE POLICY tier4_urg_102_proc_lac_t ON tier4_urg_102_proc_lac
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_urg_102_proc_abscess (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  size_cm NUMERIC NOT NULL,
  fluctuant BOOLEAN,
  diabetic BOOLEAN,
  immunocompromised BOOLEAN,
  location TEXT NOT NULL,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urg_102_proc_abscess ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urg_102_proc_abscess FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urg_102_proc_abscess_t ON tier4_urg_102_proc_abscess;
CREATE POLICY tier4_urg_102_proc_abscess_t ON tier4_urg_102_proc_abscess
  USING (tenant_id = current_setting('app.tenant_id', true));