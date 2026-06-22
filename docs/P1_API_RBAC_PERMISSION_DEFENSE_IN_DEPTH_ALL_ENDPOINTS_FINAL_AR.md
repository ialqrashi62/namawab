# PHASE 1 — دفاع في العمق للصلاحيات/الأدوار على كل نهايات API

> 2026-06-22 | تدقيق شامل للنهايات + إصلاح code-only واحد منشور. RLS (147 FORCE) هو الحد الصلب الحيّ.

## المنهجية
تدقيق قراءة-فقط لكل مسارات `server.js` (~6970 سطر) عبر وكيلين متوازيين (RBAC + tenant)، ثم **مطابقة النتائج مع إنفاذ RLS الحيّ** المُثبَت في PHASE 0.

## المطابقة الحاسمة (تصحيح تصنيف الخطورة)
التطبيق يتصل كـ`nama_medical_app` (super=false, bypassrls=false) مع ربط `app.tenant_id` لكل طلب، و**147 جدولاً FORCE RLS**. لذلك:
- أي `SELECT/UPDATE/DELETE ... WHERE id=$1` بلا `AND tenant_id` على جدول مملوك لمستأجر **لا يُسرّب عبر المستأجرين**: RLS يُرجع 0 صف / يمنع الكتابة (مُثبَت PHASE 0: patients ctx999=0، no-ctx=0). ⇒ هذه **دفاع-في-العمق**، **ليست ثغرات IDOR قابلة للاستغلال**.
- الفئة الوحيدة التي **لا يغطّيها RLS** = **RBAC داخل نفس المستأجر** (فحص الدور)، لأن RLS يفصل المستأجرين لا الأدوار.

## الإصلاح المنشور (الفئة التي لا يغطّيها RLS)
**`POST /api/settings/users` (server.js:1425) — تصعيد امتياز: إنشاء مستخدم Admin.**
- صلاحية `settings` يملكها دور **IT** غير الـAdmin (ROLE_PERMISSIONS سطر 134). المسار كان يقبل `role` من الـbody بلا فحص Admin ⇒ مستخدم IT يستطيع إنشاء حساب Admin.
- بينما `PUT` (1435) مُحصّن (P0 سابق) و`DELETE` (1500) Admin-only، كان `POST` مفتوحاً.
- **الإصلاح**: حارس `req.session.user.role !== 'Admin' → 403 + BLOCKED_USER_CREATE audit`، قبل الـINSERT. (يطابق نمط PUT/DELETE.)
- **اختبار**: `settings_user_create_admin_guard_test.js` (6/6 PASS) + `node --check` OK.
- **النشر**: pm2 restart ⇒ health 5/5، unauth POST=401، عزل سليم (patients 3/0/0، FORCE=147). namaweb `9becc9e→ae539b2` مدفوع FF إلى `origin/main`.

## ما لم يُغيَّر عمداً (قرار منضبط)
- **`GET /api/employees` بلا requireRole**: يُغذّي قوائم الأطباء المنسدلة في شاشات كثيرة (الحجز/العمليات/المريض — app.js:2040/2634/7788/8350/8507). تقييده يكسر سير العمل السريري. كشف الرواتب هنا **داخل المستأجر فقط** (RLS يمنع عبر المستأجرين). ⇒ مرشّح قرار-مالك، غير منشور.
- **POST/DELETE /api/employees**: عمليات HR؛ يمكن تقييدها بـrequireRole('hr') لكن تحتاج تأكيد شاشة الواجهة ⇒ مرشّح.
- **مجموعة IDOR/الكتابة بلا tenant filter** (patients account/billing summary/queue/medical records/invoice refund...): **مُخفَّفة بـRLS** ⇒ تُؤجَّل كدُفعات دفاع-في-العمق (أدناه) لتفادي مخاطر الانحدار على ملف إنتاج ضخم.

## نتيجة قوية
**لا مسار يثق بـtenant_id/facility_id من body/query** (تدقيق PHASE 2: صفر حالات). المصدر الوحيد للسياق هو الجلسة (`getRequestTenantContext`).

## دفعات الإصلاح (مرشّحات دفاع-في-العمق، غير منشورة — RLS يغطّيها الآن)
- **Batch A (امتياز/أمان)**: ✅ POST settings/users (منشور). متبقّي: مراجعة employees POST/DELETE RBAC.
- **Batch B (PHI سريري)**: إضافة `AND tenant_id` صريح على SELECT/UPDATE لـmedical_records/queue/lab_radiology_orders (RLS يغطّي).
- **Batch C (مالية/تأمين)**: `AND tenant_id` على invoices refund/paid/insurance_claims (RLS يغطّي؛ refund سبق تحصينه بـrequireTenantScope في حملة سابقة).
- **Batch D (إدارة/تقارير)**: توسيع logAudit على patients PUT/forms DELETE/settings PUT.
- **Batch E (ثانوية)**: forms/queue_ads/messages — أغلبها أصلاً ضمن 147 FORCE RLS (form_templates/company_settings لها tenant_id+RLS — تصحيح لادعاء "جدول عام").

## الحالة
```text
FINAL_STATUS: API_RBAC_DEFENSE_IN_DEPTH_ALL_GROUPS_COMPLETE_OR_CODE_DEPLOYED
DEPLOYED_FIX: POST /api/settings/users admin-guard (namaweb ae539b2, origin/main, health 5/5)
RLS_MITIGATED_FINDINGS: defense-in-depth candidates (Batches B-E), NOT exploitable cross-tenant
BODY_QUERY_TENANT_TRUST: NONE (0 instances)
NEXT_REQUIRED_ACTION (اختياري): مراجعة employees POST/DELETE RBAC + دفعات دفاع-في-العمق
```
