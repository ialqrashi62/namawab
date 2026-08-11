DO $$
DECLARE
  fname TEXT;
  version TEXT;
  cnt INT := 0;
  files TEXT[] := ARRAY[
    'e0_01_tenants_archetype_up.sql',
    'e0_02_facilities_extend_up.sql'
  ];
BEGIN
  FOREACH fname IN ARRAY files LOOP
    version := replace(fname, '_up.sql', '');
    INSERT INTO schema_migrations (version_num, description, checksum)
    VALUES (version, 'baseline-2026-08-05', repeat('0', 64))
    ON CONFLICT (version_num) DO NOTHING;
    cnt := cnt + 1;
  END LOOP;
  RAISE NOTICE 'Inserted % baseline rows (sample)', cnt;
END $$;
SELECT count(*) AS baseline_count FROM schema_migrations;
