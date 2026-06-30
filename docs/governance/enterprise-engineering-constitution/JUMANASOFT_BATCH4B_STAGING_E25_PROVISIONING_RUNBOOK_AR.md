# الدفعة 4B — Runbook توفير e25 على staging (GATE 10 — إعداد فقط، لم يُنفَّذ)

**التاريخ:** 2026-06-30 · الحالة: **غير مُنفَّذ** — وثيقة تشغيلية لتنفيذ لاحق على **staging فقط** بإذن المالك.
**القاعدة:** لا تشغيل على production. لا تنفيذ الآن. كل خطوة تتطلّب تأكيداً صريحاً وقت التنفيذ.

> ⚠️ هذا Runbook يصف خطوات يدوية يشغّلها المالك/devops على بيئة staging معزولة. الأوامر **placeholders** — لا تُشغَّل من هذه الدفعة.

## 0) المتطلّبات المسبقة (Preflight)
- [ ] بيئة **staging معزولة** (ليست production؛ قاعدة بيانات منفصلة، تطبيق منفصل).
- [ ] إذن مالك صريح موثّق (تاريخ + اسم).
- [ ] نسخة الكود على staging تحوي فرع `feature/jumanasoft-plans-pricing` (e25) + `feature/jumanasoft-entitlements-runtime` (resolver).
- [ ] صلاحية DDL على staging (دور يملك CREATE TABLE — وليس `nama_medical_app` المقيّد).
- [ ] تأكيد أن `plans` / `plan_entitlements` / `tenant_plan_assignments` **غير موجودة** بعد (تجنّب تعارض).

## 1) النسخ الاحتياطي / اللقطة (إلزامي)
- [ ] `pg_dump` كامل لقاعدة staging قبل أي DDL، إلى مسار آمن خارج webroot.
  - `pg_dump -Fc -d <STAGING_DB> -f /backups/staging_pre_e25_<TS>.dump`
- [ ] التحقق من نجاح الـ dump (الحجم/الكود 0) قبل المتابعة.

## 2) أمر الترحيل (placeholder — staging فقط)
- [ ] تطبيق `e25_plans_pricing_candidate_up.sql` داخل معاملة:
  - `psql -d <STAGING_DB> -v ON_ERROR_STOP=1 -1 -f namaweb/migrations/e25_plans_pricing_candidate_up.sql`
- additive فقط (`CREATE TABLE IF NOT EXISTS` + فهارس + CHECK) — لا DROP/ALTER هدّام.

## 3) استعلامات التحقّق (Validation)
- [ ] تشغيل `e25_plans_pricing_candidate_validate.sql` والتأكد أن `all_ok = true`:
  - `psql -d <STAGING_DB> -f namaweb/migrations/e25_plans_pricing_candidate_validate.sql`
- [ ] التأكد من القيود: `plans_plan_key_fmt` و`tpa_source_chk` موجودة، والفهرسان `idx_plans_active` / `idx_tpa_tenant_current`.

## 4) بذور خطط عيّنة (Seed — staging فقط، بيانات وهمية)
- [ ] إدراج خطط تجريبية عبر **واجهة Super Admin** (المفضّل، تمرّ بالتحقّق) أو SQL يدوي:
  ```sql
  -- مثال (staging فقط): standard مجانية + pro مدفوعة
  INSERT INTO plans (plan_key,name_ar,name_en,currency,monthly_price,yearly_price,trial_days,active,sort_order)
  VALUES ('standard','قياسية','Standard','SAR',0,0,0,true,0),
         ('pro','احترافية','Pro','SAR',499,4990,14,true,1);
  INSERT INTO plan_entitlements (plan_id,max_users,max_branches,max_invoices_per_month,modules_enabled,support_level,api_access,custom_domain)
  SELECT id, CASE plan_key WHEN 'standard' THEN 5 ELSE 50 END, NULL, NULL,
         CASE plan_key WHEN 'standard' THEN 'dashboard,patients' ELSE 'dashboard,patients,lab,radiology,pharmacy' END,
         CASE plan_key WHEN 'standard' THEN 'standard' ELSE 'priority' END,
         (plan_key='pro'), false
  FROM plans WHERE plan_key IN ('standard','pro');
  ```
- [ ] **لا بيانات إنتاج حقيقية** في البذور.

## 5) Rollback
- [ ] عند أي فشل: استعادة من اللقطة، أو تشغيل `e25_plans_pricing_candidate_down.sql` (يُسقِط الجداول الثلاث الجديدة فقط — لا بيانات قائمة تُفقَد على staging):
  - `psql -d <STAGING_DB> -v ON_ERROR_STOP=1 -1 -f namaweb/migrations/e25_plans_pricing_candidate_down.sql`

## 6) أعلام التفعيل (بعد التحقّق)
- [ ] `SUPER_ADMIN_ENABLED=true` + `SUPER_ADMIN_USERS=<أسماء>` (ويجب على المسؤولين **إعادة تسجيل الدخول** لتعبئة `username` بالجلسة — انظر الدفعة 2).
- [ ] `ENTITLEMENTS_ENABLED=true` + `ENTITLEMENTS_ENFORCEMENT_MODE=observe` (يبدأ observe، لا enforce).
- [ ] `ENTITLEMENTS_FAIL_MODE=allow_existing` (fail-open).

## 7) اختبارات الدخان (Smoke)
- [ ] `GET /api/health` = 200.
- [ ] `GET /api/public/plans` يُرجِع الخطط النشطة (standard/pro).
- [ ] تسجيل دخول Super Admin → تبويب «الخطط والأسعار» يعرض الكتالوج.
- [ ] تفاصيل مستأجر → تعيين خطة → ظهور «الاستحقاقات المحسوبة» (source=plan) في observe.
- [ ] أدمن مستأجر عادي **لا** يصل `/api/super-admin/*` (403).
- [ ] تأكيد عدم تأثّر تسجيل الدخول/المسارات السريرية/الفواتير (observe لا يمنع).

## 8) قائمة موافقة المالك
- [ ] راجعت النطاق (staging فقط، additive، fail-open).
- [ ] أذنت بالنسخ الاحتياطي + الترحيل + البذور التجريبية.
- [ ] أفهم أن الإنفاذ يبقى observe حتى دفعة لاحقة.
- التوقيع/التاريخ: ____________________

## 9) ملاحظة الإنتاج
- توفير e25 على **production** = runbook منفصل لاحق بإذن مستقل، بعد نجاح staging + فترة مراقبة observe. **خارج نطاق 4A/4B.**
