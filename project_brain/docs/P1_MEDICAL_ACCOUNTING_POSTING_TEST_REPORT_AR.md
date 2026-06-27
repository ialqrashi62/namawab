# P1 الترحيل المحاسبي — 06 تقرير الاختبارات (Test Report)

> التاريخ: 2026-06-20 | `namaweb/accounting_posting_test.js` — **28/28 PASS** (دوال نقية، بلا DB).

## مصفوفة الاختبارات المطلوبة

| Test | Expected | Actual | Status |
| ---- | -------- | ------ | ------ |
| patient invoice posting creates balanced journal | PASS | متوازن (Dr AR 115 / Cr Rev 100 / Cr VAT 15) | ✅ |
| فاتورة تأمين → Dr ذمم تأمين | PASS | ✅ | ✅ |
| receipt posting reduces receivable | PASS | Dr Cash / Cr AR | ✅ |
| duplicate posting blocked/idempotent | PASS | buildPostingReference فريد وثابت لكل مستند | ✅ |
| refund/credit note reverses correctly | PASS | refund Cr Cash؛ credit note Cr AR (يعكس الفاتورة) | ✅ |
| supplier invoice posts AP correctly | PASS | Dr Inventory / Cr AP (+VAT) | ✅ |
| payment voucher posts AP debit | PASS | Dr AP / Cr Cash | ✅ |
| inventory consumption posts inventory credit | PASS | Dr COGS / Cr Inventory | ✅ |
| reversal balanced (swap dr/cr) | PASS | ✅ | ✅ |
| unbalanced/zero entry rejected | PASS | validateBalanced يرفض (100≠90، والصفري) | ✅ |
| posting respects tenant context | PASS (تصميمي) | البناة تُمرّر للترحيل مع tenantId (entries/lines بها tenant_id) — يُؤكَّد عند الربط | ✅ (تصميم) |
| tenant 999 cannot see tenant 1 accounting data | PASS | journal tables بها tenant_id + RLS مخطّطة (عند التفعيل) | ⚠️ يُؤكَّد عند الربط |
| facility entitlement لا يكسر مسارات المحاسبة المسموحة | PASS | accounting module مسموح للأنواع الكاملة/المضبوطة (entitlement test) | ✅ |
| fail-closed entitlement regression | PASS | 50/50 | ✅ |
| RLS P0 regression 0→expected→0 | PASS | binding 9/9 | ✅ |
| Arabic UTF-8 reports | PASS | لا mojibake | ✅ |

## الانحدار الكامل
- `accounting_posting_test.js` 28/28 + كل `cross_tenant_*.js` (21) → **22/22 حزمة exit 0**. `node --check` للمحرك OK.
- **عدم تراجع**: RLS P0 (binding 9/9)، entitlement (41/41) + fail-closed (50/50).

## ملاحظة صدق
اختبارات عزل المستأجرين على مستوى DB لقيود المحاسبة الفعلية (tenant 999 لا يرى قيود tenant 1) **تُؤكَّد عند ربط المحرك + تفعيل RLS** (مرحلة فرعية)؛ حالياً المحرك مكتبة نقية غير موصولة، فالاختبارات تثبت صحة بناء القيود والتوازن والـ idempotency-reference والعكس.

`TEST_REPORT_COMPLETE — ENGINE 28/28 + REGRESSION 22/22 PASS`
