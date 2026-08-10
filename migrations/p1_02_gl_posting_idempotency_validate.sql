-- p1_02_gl_posting_idempotency_validate.sql  (run AFTER p1_02_gl_posting_idempotency_up.sql; read-only)
-- PASS = idempotency_key column exists AND the partial unique index exists.
SELECT
  (SELECT count(*)::int FROM information_schema.columns
       WHERE table_name='finance_journal_entries' AND column_name='idempotency_key')   AS idempotency_col,   -- expect 1
  (SELECT count(*)::int FROM pg_indexes
       WHERE tablename='finance_journal_entries' AND indexname='uq_fje_tenant_idempotency') AS unique_index; -- expect 1
