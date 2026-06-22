# Phase E Finance / Accounting — تصنيف فقط (لا تفعيل)

> صارم: ACCOUNTING_POSTING_ENABLED يبقى OFF؛ journal=0؛ لا تفعيل بلا موافقة صريحة. كل بند ينتهي candidate أو blocked-pending-accounting-approval.

| البند | الإجراء | التصنيف | مالك | DDL | نشر | محاسبة | مخاطرة | البوابة |
|---|---|---|---|---|---|---|---|---|
| accounting posting enablement | candidate مُجرّب تاريخياً 63/63؛ **لم يُفعّل** | BLOCKED_PENDING_ACCOUNTING_APPROVAL | نعم | نعم | نعم | **تفعيل** | **عالية** | APPROVE_ACCOUNTING_POSTING_ENABLEMENT_CANDIDATE_ONLY ثم ..._PRODUCTION |
| journal posting | يبقى OFF (journal=0) | BLOCKED_PENDING_ACCOUNTING_APPROVAL | نعم | نعم | نعم | نعم | عالية | = أعلاه |
| billing-to-GL | تصميم ربط الفوترة بدفتر الأستاذ candidate | CANDIDATE_READY | نعم | نعم | نعم | نعم(عند التفعيل) | عالية | candidate محاسبي |
| insurance settlement accounting | يعتمد NPHIES (D4) + المحاسبة | BLOCKED_PENDING_EXTERNAL_PARTY | نعم | نعم | نعم | نعم | عالية | = D4 + accounting |
| ZATCA accounting linkage | يعتمد ZATCA Ph2 (D3) | BLOCKED_PENDING_KEY_OR_CERTIFICATE | نعم | محتمل | نعم | نعم | عالية | = D3 |
| financial reports | تقارير قراءة (فوترة/VAT موجودة) candidate | CANDIDATE_READY | نعم | لا | نعم | لا(قراءة) | منخفضة | candidate تقارير |
| reconciliation | تصميم مطابقة candidate | CANDIDATE_READY | نعم | محتمل | نعم | لا | متوسطة | candidate |

## أدلّة
- تحقّق قراءة: `finance_journal_entries`=0، `ACCOUNTING_POSTING_ENABLED`=OFF. الفوترة/VAT (15%) موجودة في الكود (invoices + ZATCA محاكاة).
- candidate المحاسبة + CoA/mapping seeds موجودة في `docs/accounting_candidates/` (مُجرّبة 63/63 سابقاً، غير منفّذة على الإنتاج).

## الخلاصة
**لم يُفعّل أي شيء محاسبي.** البنود المحاسبية الجوهرية = blocked-pending-accounting-approval (بوابة مخصّصة صريحة)؛ التقارير/المطابقة candidate منخفضة المخاطرة. الربط التنظيمي (ZATCA/insurance) محجوب على مساراته.
