-- filepath: migrations/e999-g176_180_tier176_180_ext.sql
-- TIER176-180: 25 tables (one per engine) + RLS
DO $$
DECLARE
  i INT;
  e INT;
  tn TEXT;
  prefix TEXT;
  num INT;
BEGIN
  FOR i IN 176..180 LOOP
    FOR e IN 1..5 LOOP
      -- 5 engines per tier; numbers 821,822,823,824,825 for tier176, then 826-830 for 177, etc.
      num := 815 + 5*(i-176) + e;
      -- Map prefix (use a generic name based on table suffix)
      prefix := 'r' || num;
      tn := 'tier' || i || '_' || prefix || '_data';
      EXECUTE format('CREATE TABLE IF NOT EXISTS %I (id SERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())', tn);
      EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tn);
      EXECUTE format('DROP POLICY IF EXISTS force_rls ON %I', tn);
      EXECUTE format('CREATE POLICY force_rls ON %I USING (tenant_id = current_setting(%L, true))', tn, 'app.tenant_id');
    END LOOP;
  END LOOP;
END $$;