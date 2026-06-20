# مهارة معالجة موجات P0 لعزل المستأجرين في النظام الطبي

## الهدف

هذه المهارة تُستخدم لمعالجة فجوات عزل المستأجرين في الموديولات الطبية الحديثة، خصوصاً الموديولات التي تستخدم requireAuth فقط أو تملك tenant_id بدون فلترة صحيحة.

## التصنيفات

### Class A

جدول حساس لا يحتوي tenant_id أو يحتاج DDL/backfill/RLS/FORCE RLS.

الحكم:

* يحتاج SQL up/validate/down/noop.
* يحتاج backup قبل production.
* لا ينفذ على الإنتاج إلا بموافقة صريحة.
* يحتاج rollback plan.

### Class B

جدول يحتوي tenant_id لكن route/query/handler لا يفلتر tenant_id أو لا يستخدم requireTenantScope.

الحكم:

* غالباً code-only.
* يجب إضافة requireTenantScope.
* يجب إضافة tenant filter.
* يجب ختم tenant_id تلقائياً في create.
* يجب منع IDOR في read/update/delete.
* يمكن نشره بعد tests وsmoke وhygiene إذا لم يحتوي DDL.

## قواعد الإصلاح

لكل route حساس:

1. لا يكفي requireAuth.
2. استخدم requireTenantScope أو wrapper معتمد.
3. كل SELECT يجب أن يقيّد بـ tenant_id.
4. كل INSERT يجب أن يختم tenant_id من tenant context.
5. كل UPDATE/DELETE يجب أن يتحقق من ملكية tenant.
6. غياب tenant context يجب أن يرجع 401/403 أو خطأ آمن.
7. ممنوع الاعتماد على frontend فقط في العزل.
8. ممنوع إعلان P0 مغلق بدون tests.

## الموديولات ذات الأولوية

* telemedicine
* pathology
* social_work
* mortuary
* zatca
* blood_bank
* أي موديول حديث يظهر أنه requireAuth-only
* أي جدول حساس يظهر بلا tenant_id أو بلا RLS

## مخرجات كل موجة

كل موجة يجب أن تنتج:

* تقرير scope.
* تقرير database/sql design.
* تقرير code remediation.
* تقرير tests.
* تقرير regression/smoke.
* تقرير deploy إن نُشر على الموقع.
* تقرير production verification.
* مصفوفة P0 المتبقية.
* تحديث AI_PROJECT_MEMORY.

## SQL المطلوب عند وجود Class A

أنشئ أو حدّث:

* docs/sql/p0_tenant_isolation_waveX_up.sql
* docs/sql/p0_tenant_isolation_waveX_validate.sql
* docs/sql/p0_tenant_isolation_waveX_down.sql
* docs/sql/p0_tenant_isolation_waveX_noop_safety_checks.sql

يجب أن تشمل:

* ADD COLUMN tenant_id إن لزم.
* backfill آمن إن لزم.
* indexes.
* ENABLE RLS.
* FORCE RLS.
* policies.
* validation queries.
* rollback.

## الاختبارات المطلوبة

أنشئ أو حدّث:

* cross_tenant_waveX_modules_test.js

ويجب أن يثبت:

* tenant A لا يرى tenant B.
* update/delete cross-tenant ممنوع.
* create يختم tenant_id الصحيح.
* بدون tenant context يرجع 401/403 أو خطأ آمن.
* app DB user لا يتجاوز RLS.

## قرارات الإغلاق

إذا الموجة اكتملت ونُشرت:
STATUS:
P0_TENANT_ISOLATION_WAVEX_REMEDIATION_AND_DEPLOY_COMPLETED

إذا اكتملت ولم تنشر:
STATUS:
P0_TENANT_ISOLATION_WAVEX_REMEDIATION_READY_FOR_DEPLOY

إذا بقيت فجوات:
STATUS:
P0_TENANT_ISOLATION_WAVEX_REMEDIATION_BLOCKED

## قاعدة الجاهزية

لا تعلن:

PRODUCTION_READY:
YES_MULTI_TENANT_READY

إلا إذا:

* كل موجات P0 مغلقة.
* كل routes الحساسة تستخدم requireTenantScope.
* كل queries الحساسة مفلترة tenant_id.
* كل الجداول الحساسة لديها tenant_id أو قرار موثق أنها global/reference.
* RLS/FORCE RLS متتبعة في version control.
* tenant isolation tests PASS.
* production deploy تم والتحقق منه.
* P0_OPEN = NO.

إذا بقيت موجة:
PRODUCTION_READY:
YES_SINGLE_TENANT_ONLY

P0_OPEN:
PARTIAL
