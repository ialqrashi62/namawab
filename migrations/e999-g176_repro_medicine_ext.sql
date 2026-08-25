-- filepath: migrations/e999-g176_repro_medicine_ext.sql
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS repro_medicine_2026_08_20 (
    id SERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL,
    payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
EXCEPTION WHEN duplicate_table THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE repro_medicine_2026_08_20 ENABLE ROW LEVEL SECURITY; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE repro_medicine_2026_08_20 FORCE ROW LEVEL SECURITY; EXCEPTION WHEN OTHERS THEN NULL; END $$;
DO $$ BEGIN DROP POLICY IF EXISTS tenant_isolation ON repro_medicine_2026_08_20;
  CREATE POLICY tenant_isolation ON repro_medicine_2026_08_20 USING (tenant_id = current_setting('app.tenant_id', true)) WITH CHECK (tenant_id = current_setting('app.tenant_id', true));
EXCEPTION WHEN OTHERS THEN NULL; END $$;