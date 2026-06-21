# P1 — تحقّق ما قبل DDL (Invoice Schema DDL Pre-Validate)

> البوابة 2 | التاريخ: 2026-06-21 | read-only قبل التطبيق.

```text
invoices_table_exists: YES
current_invoice_columns: 15
required_columns_present: 0/10
missing_10_columns_confirmed: YES (discount, discount_reason, created_by, original_amount,
  cancelled, cancel_reason, cancelled_by, cancelled_at, amount_paid, balance_due)
invoice_count_current: 3
journal_count: 0
ACCOUNTING_POSTING_ENABLED: OFF
```
الحالة مؤكَّدة: الانحراف قائم (10 أعمدة مفقودة) ⇒ تطبيق المرشّح additive مبرَّر. المرشّح idempotent (لو ظهرت أعمدة موجودة لاحقاً لا يفشل).

`INVOICE_SCHEMA_DDL_PREVALIDATE_COMPLETE`
