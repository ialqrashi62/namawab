# P1 — تنفيذ DDL والتحقّق (Invoice Schema DDL Execution & Validate)

> البوابة 3 | التاريخ: 2026-06-21.

```text
DDL_FILE_EXECUTED: docs/sql/invoice_schema_drift_candidate_up.sql (الوحيد)
EXECUTION_MODE: ALTER TABLE invoices ADD COLUMN IF NOT EXISTS × 10 (additive، داخل BEGIN/COMMIT)
DROP/UPDATE/SEED/BACKFILL: NONE
OTHER_TABLES_TOUCHED: NONE
POST_DDL_VALIDATE: PASS
  required_columns_present: 10/10
  missing: []
  invoice_count: 3 (unchanged)
  journal_count: 0
```
لم يُنفَّذ أي DDL آخر (لا accounting، لا RLS policy). نُفِّذ كدور `postgres` (المالك) على جدول FORCE-RLS — ALTER ADD COLUMN لا يمسّ السياسات.

`INVOICE_SCHEMA_DDL_EXECUTION_VALIDATE_COMPLETE`
