-- filepath: migrations/e999-g171_175_tier171_175_ext.sql
-- TIER171-175: 24 tables (one per engine) + RLS
DO $$
DECLARE
  i INT;
  tn TEXT;
BEGIN
  FOR i IN 171..175 LOOP
    -- 5 engines per tier x 5 functions each
    FOR e IN 1..5 LOOP
      tn := 'tier' || i || '_r' || (790 + 5*(i-171) + e) || '_data';
      EXECUTE format('CREATE TABLE IF NOT EXISTS %I (id SERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())', tn);
      EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tn);
      EXECUTE format('DROP POLICY IF EXISTS force_rls ON %I', tn);
      EXECUTE format('CREATE POLICY force_rls ON %I USING (tenant_id = current_setting(%L, true))', tn, 'app.tenant_id');
    END LOOP;
  END LOOP;
END $$;