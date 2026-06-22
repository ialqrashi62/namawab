# PHASE 7 — بوابة المحاسبة (OFF، جاهزية فقط)

> 2026-06-22 | ممنوع التفعيل. تحقّق حيّ.

## الحالة الحيّة
- `journal_entries` غير موجود (42P01) ⇒ **JOURNAL_COUNT=0**، لا محرّك ترحيل مُفعَّل.
- `ACCOUNTING_POSTING_ENABLED=OFF`.

## الجاهزية (مرجع: تمارين سابقة 63/63 — [[namamedical-accounting-rehearsal]])
posting engine + CoA + idempotency + VAT/ZATCA + invoice/receipt/refund + payroll/insurance = مرشّحات مُختبَرة معزولة، **غير منشورة**. rollback scripts جاهزة.

## الحالة
```text
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
ACCOUNTING_STATUS: READINESS_ONLY_NO_ENABLEMENT
NEXT_REQUIRED_ACTION: BLOCKED_PENDING_ACCOUNTING_APPROVAL (خارج النطاق)
```
