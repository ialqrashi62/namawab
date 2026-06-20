# جرد الموديولات والميزات (Modules & Features Inventory)

> التاريخ: 2026-06-20 | الحالة الراهنة (ef1acf9). مرجع أساسي: [MEDICAL_MODULES_AND_FEATURES_INVENTORY_AR.md](MEDICAL_MODULES_AND_FEATURES_INVENTORY_AR.md) — هذا تحديث للحالة + الجديد.

## معيار الاكتمال
وحدة Complete = UI + API + DB + validation + permissions + tenant isolation + facility entitlement + business logic + tests + docs.

## جدول الحالة الراهنة (تحديث)
| الموديول | الحالة | عزل المستأجر | facility entitlement | ملاحظة تحديث |
| -------- | ------ | ------------ | -------------------- | ------------- |
| المرضى/المواعيد/الاستقبال | Functional | ✅ كود + RLS + binding | ✅ backend fail-closed | RLS فعّال (app يقرأ بعد binding) |
| EMR/التمريض/الطبيب | Functional | ✅ | ✅ | — |
| التنويم/ICU/الطوارئ/الجراحة | Functional | ✅ (FORCE RLS لبعضها) | ✅ | — |
| المختبر/الأشعة/الصيدلية | Functional | ✅ (FORCE RLS) | ✅ | — |
| الفوترة/الحسابات | Functional | ✅ | ✅ | — |
| **المحاسبة/الترحيل** | **Wired-OFF** | ✅ (app.tenant_id داخل المعاملة) | ✅ | **جديد**: محرك ترحيل مُوصَّل خلف flag OFF؛ لا قيود تُكتب حتى التفعيل |
| التأمين | Partial | ✅ | ✅ | لا EDI/NPHIES فعلي (سجلات) |
| المخازن/المشتريات | Functional/Partial | ✅/جزئي | ✅ | RFQ/3-way match ناقص |
| HR/الجودة | Functional | ✅ | ✅ | — |
| السجلات الطبية/الصيدلية السريرية/التأهيل/البوابة/التغذية | Functional | ✅ (Wave1 كود؛ RLS DDL غير منشور) | ✅ | عزل كود؛ FORCE RLS لها غير مطبّق على الإنتاج |
| الطب عن بعد/علم الأمراض/الخدمة الاجتماعية/الوفيات/ZATCA | Functional | ✅ (Wave2 منشور) | ✅ | — |
| بنك الدم/الموافقات/الباقات | Partial | ❌ (Class A معلّق DDL) | ✅ (الحارس يغطّيها) | عزل ناقص — يحتاج tenant_id + RLS |
| SaaS tenants/provisioning | Partial | بنية فقط | ✅ نوع المنشأة | لا provisioning/خطط/فوترة |
| استحقاقات نوع المنشأة | **Functional (منشور)** | — | ✅ 10 أنواع | **جديد**: إنفاذ backend fail-closed منشور |

## أبرز الميزات الجديدة (ef1acf9)
- محرك ترحيل محاسبي fail-closed (مُوصَّل، OFF).
- حارس SESSION_SECRET + rate limiter اختياري `/api`.
- استحقاقات نوع المنشأة على مستوى API (10 أنواع، default-deny للمسارات غير المصنّفة).

## فجوات الاكتمال (موجزة — انظر RISKS register)
- بنك الدم/الموافقات/الباقات: عزل ناقص (Class A، DDL معلّق).
- المحاسبة: مُوصَّلة لكن OFF + شجرة الحسابات فارغة على الإنتاج (CoA=0).
- التأمين/المشتريات: منطق ناقص (EDI، 3-way match).
- SaaS التجاري: provisioning/خطط/فوترة مفقودة.

`MODULES_AND_FEATURES_INVENTORY_COMPLETE`
