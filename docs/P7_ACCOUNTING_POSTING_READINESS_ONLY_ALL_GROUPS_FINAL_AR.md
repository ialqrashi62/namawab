# PHASE 7 — جاهزية الترحيل المحاسبي فقط (لا تفعيل)

> 2026-06-22 | المحاسبة OFF. مراجعة جاهزية فقط، لا ترحيل، لا قيود.

## الحالة الحيّة (postgres قراءة-فقط)
- جدول `journal_entries` **غير موجود** (42P01) ⇒ **JOURNAL_COUNT=0**، لا محرّك ترحيل مُفعَّل في الإنتاج.
- `ACCOUNTING_POSTING_ENABLED=OFF`.

## الجاهزية (مرجع: تمارين سابقة 63/63 PASS — [[namamedical-accounting-rehearsal]])
```text
posting engine code: مرشّح مُختبَر على قواعد معزولة (غير منشور)
CoA (دليل الحسابات): مرشّح جاهز
idempotency: مفتاح فريد لكل مصدر (invoice/receipt/refund) — في المرشّح
VAT/ZATCA: حقول الفاتورة حاضرة؛ الترحيل الضريبي ضمن المرشّح
invoice/receipt/refund: مسارات حيّة؛ الترحيل المحاسبي معطّل
payroll/insurance: ضمن نطاق المرشّح، غير منشور
rollback: down scripts للمخطط المحاسبي جاهزة
```

## ممنوع
لا إنشاء journal_entries، لا تفعيل ترحيل، لا قيود — خارج النطاق حتى موافقة صريحة منفصلة.

## الحالة
```text
FINAL_STATUS: ACCOUNTING_READINESS_ONLY_NO_ENABLEMENT
ACCOUNTING_POSTING_ENABLED: OFF   JOURNAL_COUNT: 0   ENGINE: rehearsed_candidate_not_deployed
NEXT_REQUIRED_ACTION: BLOCKED_PENDING_ACCOUNTING_APPROVAL
```
