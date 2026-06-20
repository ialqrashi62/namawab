# P3 — توسعة RLS: المجموعات B / C / D (staging + تصنيف) — تقرير

> Workstream 1 (تكملة) + WS2. التاريخ: 2026-06-20. **staging/candidate/docs فقط — لا لمس إنتاج.**
> الترحيل المحاسبي معطّل؛ journals=0؛ لم تُطبَّق أي RLS على الإنتاج في هذه المرحلة.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## Global Gate 0
HEAD=`874543e` متزامن؛ gitlink e6608ba؛ DB_USER=nama_medical_app؛ flag OFF؛ app 200؛ redis PONG. backup `backup/before-ws1-bcd`.

## Group B — تشغيلي (23 جدولاً، tenant_id مباشر): STAGING PASS
الجداول: inventory_* (10)، pharmacy_purchase_orders/items/opening_balances/suppliers (4)، maintenance_equipment/pm_schedules/work_orders (3)، infection_outbreaks/surveillance، hand_hygiene_audits، doctor_inventory_requests/_items، quality_kpis، transport_requests.
| فحص | نتيجة |
|---|---|
| تطبيق up + validate | 23 RLS+FORCE / 23 سياسات |
| عزل تحت nama_medical_app (inventory_items) | t1=1، t2=1 |
| إدراج عبر-المستأجر | **مرفوض** (row-level security) |
| rollback (down) | RLS عادت 0 |
ملفات: [up](accounting_candidates/rls_group_B_candidate_up.sql) · [down](accounting_candidates/rls_group_B_candidate_down.sql) · [validate](accounting_candidates/rls_group_B_candidate_validate.sql).
**الحالة: RLS_GROUP_B_STAGING_PASS_PRODUCTION_PENDING_APPROVAL** (نفس بوابة A: smoke مُصادَق/موافقة).

## Group C — إعدادات/مرجعية مختلطة (6 جداول): PARTIAL_DEFERRED
الجداول: company_settings, integration_settings, tenant_settings, facilities, pharmacy_drug_catalog, queue_advertisements.
- **خطر**: company_settings يقود حارس استحقاق المنشأة، ويُقرأ بـ `tenant_id = $1 OR tenant_id IS NULL` (صفوف عالمية). سياسة صارمة تخفي العالمية ⇒ **fail-closed lockout**. لذلك صُمّمت سياسة **global-aware**: `USING (tenant_id=ctx OR tenant_id IS NULL)` + `WITH CHECK (tenant_id=ctx)`.
- staging: الكل **فارغ** (0 صف) ⇒ تطبيق candidate نجح (6/6 سياسات)، و**WITH CHECK رفض الكتابة عبر-المستأجر** (مُثبت). لكن منطق القراءة global-aware **لم يُثبَّت بعدد صفوف** (PK على setting_key منع بذراً اصطناعياً متعدد الصفوف).
- ملفات: [up](accounting_candidates/rls_group_C_candidate_up.sql) (global-aware) · [down](accounting_candidates/rls_group_C_candidate_down.sql) · [validate](accounting_candidates/rls_group_C_candidate_validate.sql).
- **مؤجَّل للإنتاج**: يتطلب فحص توزيع بيانات الإنتاج (صفوف عالمية NULL مقابل per-tenant) + تأكيد عدم كسر حارس الاستحقاق قبل التطبيق.
**الحالة: RLS_GROUP_C_PARTIAL_DEFERRED** (candidate global-aware جاهز؛ التطبيق يحتاج تحقّق بيانات إنتاج).

## Group D — خاص/عالمي/فجوة-مخطط: PARTIAL_DEFERRED (لا RLS أعمى)
| الفئة | الجداول (أمثلة) | القرار |
|---|---|---|
| auth/mapping (RLS يكسر الدخول/حلّ المستأجر) | `user_tenants`, `portal_users` | **مؤجَّل** — تصميم خاص؛ لا tenant RLS (دائري مع المصادقة) |
| audit (append-only) | `audit_trail` | **مؤجَّل** — سياسة خاصة (admin-only أو tenant-scoped للقراءة) |
| عالمي/مرجعي (بلا tenant_id — لا حاجة RLS مستأجر) | icd10_codes, medications, lab_tests_catalog, radiology_catalog, medical_services, drug_interactions, insurance_companies, departments, branches, tenants, system_users | **لا RLS** (مرجعي عام مقصود) |
| بيانات مستأجر بلا عمود tenant_id (تحتاج إضافة عمود + backfill = مرحلة مخطط منفصلة) | blood_bank_*, cssd_*, cme_*, packages/package_sessions, approvals, daily_close, internal_messages, form_templates, discount_rules, employees, cosmetic_procedures, insurance_contracts/policies, user_facilities, user_permissions | **مؤجَّل** — يتطلب ALTER ADD tenant_id + backfill (مرحلة DDL مستقلة) أو استدلال FK مُثبت |
**الحالة: RLS_GROUP_D_PARTIAL_DEFERRED** (تصنيف موثّق؛ لا تطبيق أعمى؛ يحتاج تصميم خاص/مخطط منفصل).

## WS2 — Authenticated HTTP Smoke
`AUTHENTICATED_SMOKE_BLOCKED_CREDENTIALS_REQUIRED`: لا تتوفّر بيانات اعتماد إنتاج/اختبار آمنة، وممنوع إنشاء مستخدمين إنتاج اصطناعيين. أُثبت بديلاً: 401 لكل المسارات المحمية (لا تسريب مجهول) + إنفاذ RLS على طبقة DB (مُثبت). القراءات المُصادَقة بسياق مستأجر = **خطوة مشغّل** ببيانات اعتماد صالحة، وهي شرط بوابة الإنتاج لكل مجموعات RLS.

## خطة دفعات الإنتاج الموحّدة (Consolidated Production Batch Plan) — تنفيذ فقط بموافقة
الأساس الأماني: التطبيق يربط app.tenant_id لكل pool.query (AsyncLocalStorage + pool مغلّف؛ يشغّل 42 جدولاً حياً).
لكل دفعة: backup → preflight → apply up → validate → **smoke مُصادَق على مسار من الدفعة** → مراقبة صحة/سجلات → (فشل ⇒ down للدفعة أو إعادة DB_USER إلى postgres مؤقتاً).
- **الدفعة 1**: Group A (40 PHI/HR/مالي) — الأعلى أولوية.
- **الدفعة 2**: Group B (23 تشغيلي).
- **الدفعة 3**: Group C (6، global-aware) — بعد فحص بيانات الإنتاج وتأكيد حارس الاستحقاق.
- **مؤجَّل**: Group D (auth/audit/مخطط) — مراحل تصميم/DDL منفصلة.
الاسترجاع لكل دفعة: `rls_group_<X>_candidate_down.sql` (يزيل سياسات الدفعة فقط، لا حذف بيانات) أو إعادة DB_USER=postgres (فوري).

## السلامة
لا لمس إنتاج · لا posting · لا تغيير بيانات إنتاج · staging رُجِعت نظيفة (RLS=35 baseline، الدور محذوف) · لم يُمنح BYPASSRLS · DB_USER=nama_medical_app ثابت · `.gitmodules`/`df893ab` لم يُمسّا · لا force push · UTF-8 نظيف.

## الحالة النهائية
```text
FINAL_STATUS: RLS_GROUP_B_STAGING_PASS + RLS_GROUP_C_PARTIAL_DEFERRED + RLS_GROUP_D_PARTIAL_DEFERRED + AUTHENTICATED_SMOKE_BLOCKED_CREDENTIALS_REQUIRED
PRODUCTION_TOUCHED: NO
DATA_CHANGED: NO
DDL_EXECUTED: NO (staging only)
DEPLOYED: NO
POSTING_ENABLED: NO
PROD_JOURNALS_WRITTEN: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: operator authenticated smoke OR explicit prod-RLS risk-accept => apply A,B then C (after prod-data check) per batch plan ; Group D = separate design/DDL phases
```

## نقطة توقف الأوتوبايلوت
كل المراحل المتبقّية الآمنة (staging/candidate/docs) لـ RLS اكتملت: A (سابقاً)، B، C، D مصنّفة. **كل تقدّم إضافي يتطلب إمّا** (1) إنتاج RLS (يحتاج smoke مُصادَق/موافقة)، (2) Group D مراحل DDL/تصميم منفصلة، (3) runtime-grants hardening (يحتاج رصد استخدام عبر الجلسات)، (4) fail-closed refactor (تعديل runtime + نشر)، (5) go-live محاسبي (موافقة مخصّصة). تتوقّف هنا بانتظار قرارك.
