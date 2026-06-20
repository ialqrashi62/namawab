# P1 الترحيل المحاسبي — 07 جاهزية الإنتاج (Production Readiness)

> التاريخ: 2026-06-20

| السؤال | الإجابة |
| ------ | ------- |
| هل يوجد DDL؟ | **نعم (مطلوب للتفعيل، غير منفّذ)**: source_type/source_id + فهرس فريد idempotency؛ tenant_id لـ chart_of_accounts |
| هل يوجد data migration/seed؟ | **نعم (مطلوب)**: تعبئة شجرة الحسابات القياسية (CoA فارغة على الإنتاج) |
| هل يوجد تغيير في production data؟ | **لا** (هذه المرحلة) |
| هل النشر code-only؟ | المحرك code-only لكنه **غير موصول** (لا أثر runtime)؛ النشر الفعلي يحتاج DDL+data+ربط |
| الملفات المعدّلة/المضافة | `namaweb/accounting_posting.js` (جديد)، `namaweb/accounting_posting_test.js` (جديد)، 8 تقارير docs |
| الاختبارات | 28/28 محرك + 22/22 انحدار PASS |
| rollback plan | المحرك: غير موصول → لا rollback إنتاجي مطلوب (لا أثر)؛ التفعيل لاحقاً سيشمل backup + down SQL + revert |
| smoke checks المطلوبة (عند التفعيل) | إنشاء فاتورة → التحقق من قيد متوازن؛ سند قبض → تقليل ذمم؛ منع ترحيل مكرّر؛ ميزان المراجعة = 0 فرق |
| هل يسمح بالنشر المحكوم الآن؟ | **لا** — `BLOCKED_PENDING_DDL_APPROVAL` + `BLOCKED_PENDING_DATA_CHANGE_APPROVAL` |

## مسار التفعيل المُعتمَد (مراحل فرعية مقترحة)
1. `P1_ACCOUNTING_DDL_AND_COA_SEED` (بموافقة DDL + data): إضافة أعمدة idempotency + tenant_id لـ CoA + seed شجرة حسابات.
2. `P1_PATIENT_INVOICE_RECEIPT_POSTING`: ربط المحرك بـ invoice/pay/refund/cancel + RLS على journal + اختبارات DB + نشر محكوم.
3. `P1_SUPPLIER_INVOICE_POSTING` ثم `P1_INVENTORY_CONSUMPTION_POSTING`.

`PRODUCTION_READINESS_COMPLETE — NOT READY FOR DEPLOY (DDL+DATA gated)`
