# PHASE 3 — حزمة قبول العميل (UAT) لكل الوحدات

> 2026-06-22 | حزمة UAT للتوقيع. التنفيذ الحيّ عبر المتصفح يحتاج حساب اختبار (PHASE 2).

## النطاق ومعايير القبول
كل وحدة تُختبر للوصول الصحيح + العزل (RLS) + الصلاحية (RBAC). معيار النجاح: المستخدم يرى/يعدّل بيانات مستأجره فقط؛ غير المصرّح = 401/403.

## سيناريوهات لكل وحدة (متوقَّع)
| الوحدة | سيناريو | النتيجة المتوقعة |
|---|---|---|
| patients | إنشاء/عرض/تعديل مريض | داخل المستأجر فقط؛ آخر=0 |
| appointments | حجز/تعديل موعد | داخل المستأجر |
| admissions/beds | تنويم + إشغال سرير | داخل المستأجر |
| nursing/ICU | تقييم/علامات حيوية | داخل المستأجر |
| lab/radiology | طلب/نتيجة | داخل المستأجر |
| pharmacy | صرف (لا خصم قبل الصرف) | داخل المستأجر؛ القاعدة الحرجة محفوظة |
| billing/insurance | فاتورة/مطالبة (قراءة) | داخل المستأجر؛ refund محصّن |
| HR/employees | إضافة/حذف موظف | **HR/Admin فقط** (403 لغيرهم)؛ GET قوائم متاح |
| reports | تقارير مالية/عمولات | tenant-scoped |
| admin/settings | إنشاء/تعديل مستخدم | **Admin فقط** (403 لغيره) |
| facility entitlements | رؤية الوحدات حسب النوع | الشاشات المسموحة فقط |

## محدوديات/اختبارات موقوفة
```text
browser E2E: pending test account
accounting posting: OFF (out of UAT scope)
audit-reader cross-tenant read: candidate (not deployed)
```

## حقول توقيع المالك
```text
UAT_RESULT: [ PASS / FAIL / CONDITIONAL ]
OWNER_SIGNOFF: ____________  DATE: ____________
GO_NO_GO: [ GO_WITH_OWNER_GATES / NO_GO ]
```
