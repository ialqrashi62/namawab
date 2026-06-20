# P0 الموجة 2 — 08 مصفوفة P0 المتبقية (Remaining P0 Matrix)

> التاريخ: 2026-06-20

## ما أُغلق حتى الآن

| الموجة | النطاق | الحالة |
| ------ | ------ | ------ |
| Wave 1 | السجلات الطبية، الصيدلية السريرية، التأهيل، بوابة المرضى، التغذية (Class A) | كود + SQL جاهز؛ **بانتظار نشر DDL مُعتمَد** |
| Wave 2 | telemedicine, pathology, social_work, mortuary, zatca (Class B) | ✅ **مُصلَح ومنشور ومُتحقَّق منه** على الإنتاج |

## المتبقي ضمن P0

| العنصر | الصنف | الحالة | الإجراء المطلوب |
| ------ | ----- | ------ | --------------- |
| **Wave 1 (5 موديولات Class A)** | A | كود + SQL جاهز، غير منشور | نشر DDL مُعتمَد (`p0_tenant_isolation_modern_modules_up.sql`) + نشر كود |
| **blood_bank (units/donors/crossmatch/transfusions)** | A | SQL جاهز (`wave2_up.sql`)؛ الكود **لم يُعدَّل** | كود (Wave 2b) + نشر DDL مُعتمَد |
| **approvals** | A | SQL جاهز؛ الكود لم يُعدَّل | كود + DDL (Wave 2b) |
| **package_sessions** | A | SQL جاهز؛ الكود لم يُعدَّل | كود + DDL (Wave 2b) |
| **internal_messages** | A | لم يُعالَج | نموذج عزل sender/receiver + tenant (Wave 3 — بحث) |
| **cssd_* / cme_*** | A | لم يُعالَج (PII منخفض) | Wave 3 |
| الموديولات منخفضة الـ PII (quality/maintenance/transport/infection — معظمها Class B) | B | يحتاج فحص تصفية | Wave 3 |

## لماذا لا يزال P0 مفتوحاً (PARTIAL)

- لم تُنشر بعد عناصر Class A (Wave 1 + blood_bank/approvals/packages) لأنها تحتاج DDL مُعتمَد.
- blood_bank/approvals/packages **لم يُعدَّل كودها** بعد (مؤجّل لتفادي كسر الإنتاج بدون DDL).
- لذلك: `PRODUCTION_READY: YES_SINGLE_TENANT_ONLY`، `P0_OPEN: PARTIAL`.

## الخطوة التالية الموصى بها

`P0_TENANT_ISOLATION_WAVE2B_CLASSA_CONTROLLED_DDL_DEPLOY` (موافقة نشر مُتحكَّم به لـ Class A: Wave 1 + blood_bank/approvals/packages — backup + noop + up + validate + كود + smoke + rollback readiness)، ثم `WAVE3` للمتبقي.

## شرط إعلان YES_MULTI_TENANT_READY (غير مُحقَّق بعد)

- كل موجات P0 مغلقة ومنشورة ومُتحقَّق منها — **لا**.
- كل المسارات الحساسة `requireTenantScope` — جزئي.
- RLS/FORCE RLS لكل الجداول الحساسة في version control ومُطبَّقة — جزئي (SQL جاهز، Class A غير مطبّق على الإنتاج).

`REMAINING_P0_MATRIX_COMPLETE — P0_OPEN: PARTIAL`
