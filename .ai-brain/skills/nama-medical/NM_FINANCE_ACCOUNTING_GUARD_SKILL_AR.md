# NM_FINANCE_ACCOUNTING_GUARD_SKILL

**الغرض**: حارس المالية/المحاسبة. **التفعيل**: أي بوابة تمسّ المحاسبة/الفوترة/التسوية.

## الحارس الصارم (ثابت)
```text
ACCOUNTING_POSTING_ENABLED: OFF (must remain)
JOURNAL_COUNT: 0 (finance_journal_entries=0، must remain)
NO_ACCOUNTING_ENABLEMENT_WITHOUT_EXPLICIT_APPROVAL
```
candidate المحاسبة مُجرّب تاريخياً 63/63 (docs/accounting_candidates/)، **غير منفّذ**.

## التصنيف الإلزامي لكل بند مالي
`BLOCKED_PENDING_EXPLICIT_ACCOUNTING_APPROVAL` لـ: accounting posting enablement · journal posting · billing-to-GL · insurance settlement · ZATCA accounting linkage. (financial reports/reconciliation = CANDIDATE_READY قراءة فقط.)
بوابة التفعيل مخصّصة صريحة فقط: `APPROVE_ACCOUNTING_POSTING_ENABLEMENT_CANDIDATE_ONLY` ثم `..._PRODUCTION`.

## القواعد
لا توليد journal، لا تفعيل posting، لا ربط GL فعلي بلا موافقة. الفوترة/VAT (15%) موجودة في الكود (قراءة).

## حقول الإغلاق
`FINANCE_ACCOUNTING_STATUS · ACCOUNTING_POSTING_ENABLED(OFF) · JOURNAL_COUNT(0)`.
