# P1 — فحوص ما بعد DDL (Invoice Schema DDL Post-Check)

> البوابة 4 | التاريخ: 2026-06-21 | read-only.

```text
10_columns_exist: YES
types_match_candidate: YES
  discount:real, discount_reason:text, created_by:text, original_amount:real,
  cancelled:integer, cancel_reason:text, cancelled_by:text, cancelled_at:timestamp,
  amount_paid:real, balance_due:real
defaults_nullability_safe: YES (DEFAULT آمنة؛ لا NOT NULL خطير)
total_invoice_columns: 25 (15 + 10)
invoice_count_unchanged: YES (3)
journal_count: 0
ACCOUNTING_POSTING_ENABLED: OFF
no_unexpected_data_changes: YES (DDL additive فقط؛ لا UPDATE/seed)
```

`INVOICE_SCHEMA_DDL_POSTCHECK_COMPLETE`
