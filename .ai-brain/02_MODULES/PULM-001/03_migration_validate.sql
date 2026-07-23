# PULM-001 — Validation

```sql
-- e106_pulm_module_validate.sql
BEGIN;
DO $$
DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'pulm_encounters', 'pulm_pft', 'pulm_imaging', 'pulm_medications',
    'pulm_oxygen_orders', 'pulm_procedures', 'pulm_vector_index'
  ] LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
      RAISE EXCEPTION 'Table % missing', tbl;
    END IF;
  END LOOP;
  RAISE NOTICE 'All 7 PULM tables exist';
END $$;
COMMIT;
```
