-- filepath: e999-g187_icu_emr_trauma_critical_ext.sql
DO $$
DECLARE tdate TEXT;
BEGIN
  tdate := to_char(current_date, 'YYYY_MM_DD');
  EXECUTE format('CREATE TABLE IF NOT EXISTS icu_emr_trauma_critical_%s (id SERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, payload JSONB, created_at TIMESTAMPTZ DEFAULT NOW())', tdate);
  EXECUTE format('ALTER TABLE icu_emr_trauma_critical_%s ENABLE ROW LEVEL SECURITY', tdate);
  EXECUTE format('CREATE POLICY tenant_isolation ON icu_emr_trauma_critical_%s USING (tenant_id = current_setting(''app.tenant_id'', true))', tdate);
END$$;