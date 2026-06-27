# Wave 7 — Finance / Accounting Guard (مراجعة فقط، لا تفعيل)

> صارم: لم يُفعّل أي شيء. تحقّق قراءة: `finance_journal_entries`=0، `ACCOUNTING_POSTING_ENABLED`=OFF. كل بند يبقى محجوباً على موافقة محاسبية صريحة.

| البند | الحالة | التصنيف |
|---|---|---|
| accounting posting enablement | candidate مُجرّب 63/63 (تاريخياً)، غير منفّذ | BLOCKED_PENDING_EXPLICIT_ACCOUNTING_APPROVAL |
| billing-to-GL | تصميم ربط الفوترة بدفتر الأستاذ | BLOCKED_PENDING_EXPLICIT_ACCOUNTING_APPROVAL |
| insurance settlement | يعتمد NPHIES + المحاسبة | BLOCKED_PENDING_EXPLICIT_ACCOUNTING_APPROVAL |
| ZATCA accounting linkage | يعتمد ZATCA Ph2 + المحاسبة | BLOCKED_PENDING_EXPLICIT_ACCOUNTING_APPROVAL |
| financial reports | تقارير قراءة (الفوترة/VAT موجودة) | BLOCKED_PENDING_EXPLICIT_ACCOUNTING_APPROVAL (يبقى ضمن الحارس) |
| reconciliation | تصميم مطابقة | BLOCKED_PENDING_EXPLICIT_ACCOUNTING_APPROVAL |

## الحارس
```text
ACCOUNTING_POSTING_ENABLED: OFF (must remain)
JOURNAL_COUNT: 0 (must remain)
NO_ACCOUNTING_ENABLEMENT_WITHOUT_EXPLICIT_APPROVAL: enforced
```
أي تنفيذ محاسبي يتطلّب بوابة مخصّصة صريحة: `APPROVE_ACCOUNTING_POSTING_ENABLEMENT_CANDIDATE_ONLY` ثم `..._PRODUCTION`.

```text
FINANCE_ACCOUNTING_STATUS: BLOCKED_PENDING_EXPLICIT_ACCOUNTING_APPROVAL (all items)
ACCOUNTING_POSTING_ENABLED: OFF | JOURNAL_COUNT: 0
```
