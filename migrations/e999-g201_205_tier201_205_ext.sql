-- filepath: migrations/e999-g201_205_tier201_205_ext.sql
DO $$
DECLARE
  i INT; e INT;
  tn TEXT; num INT;
BEGIN
  FOR i IN 201..205 LOOP
    FOR e IN 1..5 LOOP
      num := 945 + 5*(i-201) + e;
      tn := 'tier' || i || '_r' || num || '_data';
      EXECUTE format('CREATE TABLE IF NOT EXISTS %I (id SERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())', tn);
      EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tn);
      EXECUTE format('DROP POLICY IF EXISTS force_rls ON %I', tn);
      EXECUTE format('CREATE POLICY force_rls ON %I USING (tenant_id = current_setting(%L, true))', tn, 'app.tenant_id');
    END LOOP;
  END LOOP;
END $$;