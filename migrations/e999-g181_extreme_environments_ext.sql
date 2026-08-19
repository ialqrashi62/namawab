-- filepath: e999-g181_extreme_environments_ext.sql
DO $$
DECLARE tdate TEXT;
BEGIN
  tdate := to_char(current_date, 'YYYY_MM_DD');
  EXECUTE format('CREATE TABLE IF NOT EXISTS extreme_environments_%s (id SERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, payload JSONB, created_at TIMESTAMPTZ DEFAULT NOW())', tdate);
  EXECUTE format('ALTER TABLE extreme_environments_%s ENABLE ROW LEVEL SECURITY', tdate);
  EXECUTE format('CREATE POLICY tenant_isolation ON extreme_environments_%s USING (tenant_id = current_setting(''app.tenant_id'', true))', tdate);
END$$;