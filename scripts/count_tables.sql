SELECT count(*) AS dept_tables FROM pg_tables WHERE schemaname='public' AND tablename LIKE '%_assessments';
