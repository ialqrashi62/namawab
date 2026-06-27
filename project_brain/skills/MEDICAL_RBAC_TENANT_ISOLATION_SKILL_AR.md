# مهارة تدقيق الصلاحيات وعزل المستأجرين (RBAC & Tenant Isolation)

## Purpose
تدقيق الأدوار/الصلاحيات وعزل المستأجرين واستحقاقات المنشآت على كل الطبقات (UI/API/Service/DB)، وكشف مخاطر الوصول العابر للمستأجرين وتجاوز الصلاحيات عبر URL/API.

## When to Use
عند أي عمل على العزل أو الصلاحيات، وقبل أي توسّع متعدد المستأجرين.

## Inputs Needed
`ROLE_PERMISSIONS`، `requireRole`/`requireTenantScope`/`getRequestTenantContext` في server.js؛ سياسات RLS في db_postgres.js؛ اختبارات `cross_tenant_*`.

## Procedure
1. مصفوفة الأدوار/الصلاحيات لكل موديول (View/Create/Edit/Delete/Approve/Post/Cancel/Export/Configure).
2. مصفوفة المنشأة×الموديول (مفعّل/حد/add-on/مُنفَّذ API/مُنفَّذ UI).
3. تحقّق: كل مسار حسّاس يستخدم `requireTenantScope`؟ كل استعلام يصفّي tenant_id؟ كل create يختم tenant؟ update/delete يتحقّق من الملكية؟ لا قبول tenant_id من العميل؟
4. فحص RLS على مستوى DB (وربط `app.tenant_id` — انظر حاجز Wave2B).

## Safety Rules
قراءة فقط في التدقيق. لا تعتمد على الواجهة وحدها. لا تعديل سياسات RLS إلا بإثبات خطأ + BLOCKER قبل التنفيذ.

## Output Format
`docs/MEDICAL_RBAC_AND_ENTITLEMENTS_AUDIT_AR.md` — مصفوفتا الصلاحيات والمنشآت + مخاطر التجاوز + الصلاحيات الناقصة/الخطرة.

## Done Criteria
المصفوفتان مكتملتان، إنفاذ كل طبقة مُتحقَّق منه، مخاطر العزل/التجاوز موثّقة باختبارات.
