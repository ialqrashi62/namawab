# 08 — ويزرد تسجيل/تهيئة منشأة جديدة (Facility Onboarding Wizard)

> متطلب أضافه المالك: عند تسجيل **منشأة جديدة** يقدّم الويزرد عدّة **أنماط (archetypes)** — **مدينة طبية / مستشفى كبير / مستشفى عام / مستوصف (Polyclinic) / مركز صحي** — ويُهيّئ النظام تلقائياً حسب النمط (الوحدات المُفعّلة، السعة، التراخيص، التكاملات). يبني على المنطق القائم `FACILITY_ALLOWED` (hospital=الكل، health_center/clinic=مجموعة فرعية) ويوسّعه.

## 1) أنماط المنشآت (Archetypes) ومصفوفة تفعيل الوحدات
> الأرقام = فهارس `NAV_ITEMS` (انظر 01). الجدول قابل للتخصيص بعد التهيئة (toggle لكل وحدة).

| النمط | الوصف | السعة الافتراضية | الوحدات المُفعّلة (مبدئياً) | تراخيص/تكاملات إلزامية |
|---|---|---|---|---|
| **medical_city** (مدينة طبية) | عدّة مستشفيات/تخصصات + مرافق مشتركة | متعدّد المنشآت (multi-facility tenant) | **كل الـ43** + إدارة متعدّدة المنشآت + مرجعيات مشتركة | MOH + CBAHI + NPHIES + ZATCA + SCFHS + PACS |
| **large_hospital** (مستشفى كبير) | مستشفى ثالثي >300 سرير، طوارئ+عناية+عمليات | أسرّة كثيرة + ICU + OR متعدّد | كل الـ43 تقريباً (قد تُعطّل CME/Cosmetic اختيارياً) | MOH + CBAHI + NPHIES + ZATCA + PACS |
| **general_hospital** (مستشفى عام) | مستشفى ثانوي، خدمات أساسية + تنويم | أسرّة + ER + OR محدود | النواة السريرية + تنويم + مختبر/أشعة/صيدلية + مالية/تأمين | MOH + NPHIES + ZATCA |
| **polyclinic** (مستوصف) | عيادات خارجية متعدّدة التخصص، بلا تنويم | بلا أسرّة، عيادات فقط | `[0,1,2,3,4,6,7,8,9,11,12,13,14,15,20,30,34,42]` (الحالي clinic) + Pharmacy/Lab/Rad العيادية | NPHIES + ZATCA |
| **health_center** (مركز صحي) | رعاية أولية، لقاحات/أمومة/طوارئ بسيطة | بلا أسرّة | `[0,1,2,3,4,5,6,7,8,9,11,12,13,14,15,20,21,30,33,34,35,41,42]` (الحالي health_center) | MOH (رعاية أولية) + NPHIES |

**القاعدة:** `medical_city` و`large_hospital` ⟹ `FACILITY_ALLOWED = null` (الكل). الباقي ⟹ مجموعة فهارس صريحة (موجودة جزئياً). تُضاف أنماط `medical_city`/`large_hospital`/`general_hospital` إلى `FACILITY_ALLOWED` و`facilityType`.

## 2) خطوات الويزرد (Multi-step)
1. **نوع المنشأة (Archetype):** بطاقات اختيار (مدينة طبية/مستشفى كبير/عام/مستوصف/مركز صحي) — تحدّد القيم الافتراضية للخطوات التالية.
2. **الهوية والترخيص:** الاسم (ع/EN)، رقم ترخيص MOH، السجل التجاري، الرقم الضريبي (VAT/ZATCA)، المدينة/المنطقة، الشعار.
3. **الهيكل التنظيمي:** الأقسام/التخصصات، عدد الأسرّة (إن وُجد تنويم)، الغرف/العيادات، أجهزة الأشعة/المختبر. (medical_city: عدّة منشآت فرعية.)
4. **الوحدات (Modules):** قائمة الـ43 مع toggle، **مُعبّأة مسبقاً** حسب النمط؛ يمكن للمالك التفعيل/التعطيل (مع تحذير تبعيات: مثلاً ICU يتطلب Inpatient).
5. **مستخدم المسؤول (Admin):** إنشاء أول حساب Admin (اسم/بريد/جوال) + كلمة مرور قوية (لا افتراضي).
6. **التكاملات:** تفعيل NPHIES (eligibility/claims)، ZATCA Phase 2، PACS (إن أشعة)، Wasfaty — كـ **gated** (مفاتيح حقيقية لاحقاً، لا CSR/OTP الآن).
7. **الهوية البصرية + اللغة:** ألوان/شعار + لغة افتراضية (ع/EN) + RTL + المنطقة الزمنية + العملة (SAR).
8. **بيانات أولية + تأكيد:** seed مرجعيات (CoA/كتالوج/قوالب موافقة/أدوار) حسب النمط → مراجعة → **إنشاء المستأجر (tenant)**.

## 3) الجداول/الأزرار/القوائم
- **شاشة:** Wizard بخطوات (stepper) + شريط تقدّم + رجوع/تالي/تخطٍّ (للاختياري).
- **بطاقات النمط:** 5 بطاقات (أيقونة + وصف + «الوحدات المُفعّلة: N»).
- **مصفوفة الوحدات:** جدول (الوحدة | مُفعّلة [toggle] | تبعيات | ملاحظة) مع «تفعيل الكل/إلغاء».
- **أزرار:** «التالي» · «رجوع» · «حفظ كمسودّة» · «إنشاء المنشأة» · «إلغاء».
- **قائمة إدارية لاحقة:** Settings → Facility Setup (إعادة فتح الويزرد/تعديل الوحدات).

## 4) برومنت جاهز (Ready Prompt)
```
أنشئ "Facility Onboarding Wizard" متعدّد الخطوات لنظام HIS متعدّد المستأجرين (Node/Express + SPA).
الأنماط: medical_city, large_hospital, general_hospital, polyclinic, health_center — كل نمط يحدّد
مجموعة وحدات مُفعّلة (فهارس NAV_ITEMS) + سعة + تراخيص إلزامية. الخطوات: نوع المنشأة → الهوية/الترخيص
(MOH/VAT/CR) → الهيكل (أقسام/أسرّة/عيادات/أجهزة) → مصفوفة الوحدات (toggle مع تبعيات) → مستخدم Admin
(كلمة مرور قوية، لا افتراضي) → التكاملات (NPHIES/ZATCA/PACS/Wasfaty كـ gated) → الهوية البصرية/اللغة →
seed + تأكيد. عند الإنشاء: INSERT في tenants + facilities + facility_modules + system_users (Admin) +
seed المرجعيات حسب النمط، كله ضمن transaction + tenant_id + audit. RBAC: super-admin فقط ينشئ مستأجراً.
الواجهة عربية/إنجليزية RTL، كل النصوص عبر tr()، كل إدخال يُهرَّب (escapeHTML). لا تفعّل أي اتصال خارجي حقيقي.
```

## 5) سيناريو عمل (Work Scenario)
1. Super-admin يفتح «تسجيل منشأة جديدة».
2. يختار **«مدينة طبية»** → الويزرد يُعبّئ كل الوحدات + يفعّل multi-facility.
3. يُدخل اسم/ترخيص MOH/VAT/CR + الشعار → التالي.
4. يضيف المنشآت الفرعية/الأقسام/الأسرّة → التالي.
5. يراجع مصفوفة الوحدات (الكل مُفعّل) → يُعطّل «جراحة التجميل» مثلاً → تحذير: لا تبعيات → التالي.
6. ينشئ حساب Admin بكلمة مرور قوية → التالي.
7. يفعّل NPHIES + ZATCA (gated، بلا مفاتيح حقيقية الآن) → التالي.
8. يضبط الألوان/اللغة الافتراضية ع + RTL → التالي.
9. يراجع الملخّص → «إنشاء المنشأة» → النظام ينشئ المستأجر + المرجعيات + Admin ضمن transaction → رسالة نجاح + رابط دخول Admin.

## 6) فلو البيانات (Data Flow)
```
Super-admin (UI Wizard)
   │  (خطوة بخطوة، حالة محفوظة محلياً/مسودّة)
   ▼
POST /api/admin/facilities/provision   (requireSuperAdmin)
   │  payload: {archetype, identity, structure, modules[], adminUser, integrations, branding}
   ▼  BEGIN TRANSACTION
   ├─ INSERT tenants(name, archetype, vat_no, cr_no, moh_license, created_by)         → tenant_id
   ├─ INSERT facilities(tenant_id, type, beds, departments[], timezone, currency)
   ├─ INSERT facility_modules(tenant_id, module_index, enabled)  × (مصفوفة الوحدات)
   ├─ INSERT system_users(tenant_id, role='Admin', username, bcrypt(pw))              (Admin)
   ├─ INSERT integration_settings(tenant_id, nphies/zatca/pacs = configured&gated)
   ├─ seed: chart_of_accounts | catalog | consent_templates | roles  (حسب archetype)
   └─ COMMIT  → audit_log(action='facility_provisioned', tenant_id, by)
   ▼
Response 201 {tenant_id, admin_login_url}
   ▼
عند دخول Admin: GET /api/auth/me → facilityType=archetype → الواجهة تُظهر الوحدات المُفعّلة فقط
(FACILITY_ALLOWED[archetype]) — مطابقة المنطق القائم في app.js.
```

## 7) ERD (كيانات التهيئة)
- `tenants` (id, name_ar/en, archetype, moh_license, cr_no, vat_no, status, created_by, created_at)
- `facilities` (id, tenant_id→tenants, type, beds, currency, timezone, parent_facility_id) — `parent_facility_id` يدعم **مدينة طبية** (منشآت فرعية).
- `facility_modules` (id, tenant_id, module_index, enabled) — يحلّ محلّ/يدعم `FACILITY_ALLOWED` ديناميكياً من DB.
- `integration_settings` (tenant_id, provider, status, config_json[no-secrets], gated) — موجود جزئياً.
- `system_users` (tenant_id, role, …) — موجود.
- كلها تحت RLS + tenant_id (السياسة قائمة).

## 8) ملاحظات أمان/امتثال
- إنشاء مستأجر = **super-admin فقط** (role-guard) + audit.
- لا كلمات مرور افتراضية (تماشياً مع Gate 4 المنشور).
- التكاملات (NPHIES/ZATCA/PACS) تبقى **gated** — لا CSR/OTP/شهادات/اتصال خارجي عند التهيئة.
- `facility_modules` من DB (ديناميكي) أنظف من ثابت `FACILITY_ALLOWED` — توصية ترقية.
- multi-facility (مدينة طبية): `parent_facility_id` + تقارير مجمّعة عبر المنشآت + عزل tenant واحد بمنشآت متعدّدة.

> هذا الويزرد = شرط أساسي قبل تشغيل أي منشأة جديدة؛ يُدمج في طبقة الإدارة العليا (super-admin) ويغذّي `facilityType`/`FACILITY_ALLOWED` القائمة. مرتبط بـ ERD العام (04) وقصص المستخدم (06).
