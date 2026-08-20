-- filepath: e999-g184_cultural_dental_vision_ext.sql
DO $$
DECLARE tdate TEXT;
BEGIN
  tdate := to_char(current_date, 'YYYY_MM_DD');
  EXECUTE format('CREATE TABLE IF NOT EXISTS cultural_dental_vision_%s (id SERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, payload JSONB, created_at TIMESTAMPTZ DEFAULT NOW())', tdate);
  EXECUTE format('ALTER TABLE cultural_dental_vision_%s ENABLE ROW LEVEL SECURITY', tdate);
  EXECUTE format('CREATE POLICY tenant_isolation ON cultural_dental_vision_%s USING (tenant_id = current_setting(''app.tenant_id'', true))', tdate);
END$$;