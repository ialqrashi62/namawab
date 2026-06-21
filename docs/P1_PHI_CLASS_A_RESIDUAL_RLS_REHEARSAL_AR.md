# P1 — بروفة RLS لطبقة PHI Class A المتبقّية (Rehearsal + Closeout)

> المرحلة: `P1_PHI_CLASS_A_RESIDUAL_RLS_REHEARSAL` | التاريخ: 2026-06-21 | تنفيذ على DB معزول throwaway، بلا أي لمس للإنتاج.

## الهدف
التحقق — قبل أي تطبيق إنتاجي — من أنّ مرشّح RLS لطبقة PHI المتبقّية (`docs/sql/phi_class_a_residual_rls_candidate_{up,validate,down}.sql`) يُطبَّق نظيفاً، **ويُنفَّذ فعلاً** تحت دور قاعدة غير-superuser، ويتراجع نظيفاً. هذه الجداول هي الفجوة المتبقّية في تغطية الـ115 FORCE policy.

## الجداول المعنيّة
- **المجموعة 1 (لديها `tenant_id` — تحتاج ENABLE+FORCE+policy فقط):** `portal_users`، `audit_trail`.
- **المجموعة 2 (بلا `tenant_id` — تحتاج ADD column + index ثم ENABLE+FORCE+policy):** `packages`، `blood_bank_donors`، `blood_bank_units`.

## أسلوب البروفة (آمن)
1. إنشاء DB معزول `nama_phi_rehearsal` (حارس يرفض التشغيل لو كان الاسم = DB الإنتاج).
2. إنشاء الجداول الخمسة بخط أساس مطابق (المجموعة 1 بـ tenant_id، المجموعة 2 بدونها).
3. تطبيق `phi_class_a_residual_rls_candidate_up.sql`.
4. التحقق: كل جدول `relforcerowsecurity=true` + سياسة واحدة + عمود `tenant_id` موجود.
5. إنشاء دور **غير-superuser** `phi_rehearsal_app` (NOSUPERUSER NOBYPASSRLS) + منح DML، ثم `SET ROLE` إليه لاختبار الإنفاذ الحقيقي (postgres كـ superuser يتجاوز RLS، لذا لا يصلح للاختبار).
6. اختبار العزل بسياق tenant عبر `set_config('app.tenant_id', …, false)` على مستوى الجلسة.
7. اختبار WITH CHECK ضد إدراج عابر للمستأجر.
8. تطبيق `..._down.sql` والتحقق من التراجع النظيف.
9. إسقاط الـ DB والدور (لا أثر متبقٍ).

## النتيجة — 17/17 PASS
```text
candidate up applied:
  portal_users      : FORCE=true, policy=1, tenant_id=true   PASS
  audit_trail       : FORCE=true, policy=1, tenant_id=true   PASS
  packages          : FORCE=true, policy=1, tenant_id=true   PASS   (tenant_id أُضيف)
  blood_bank_donors : FORCE=true, policy=1, tenant_id=true   PASS   (tenant_id أُضيف)
  blood_bank_units  : FORCE=true, policy=1, tenant_id=true   PASS   (tenant_id أُضيف)
SET ROLE phi_rehearsal_app (current_user=phi_rehearsal_app)  PASS
RLS enforced (غير-superuser):
  portal_users      : tenant1=1, tenant999=0, no-context=0   PASS
  audit_trail       : tenant1=2, tenant999=0, no-context=0   PASS
  packages          : tenant1=1, tenant999=0, no-context=0   PASS
  blood_bank_donors : tenant1=1, tenant999=0, no-context=0   PASS
  blood_bank_units  : tenant1=1, tenant999=0, no-context=0   PASS
WITH CHECK blocks cross-tenant INSERT (SQLSTATE 42501)        PASS
candidate down applied (rollback نظيف):
  packages/donors/units: tenant_id dropped                   PASS×3
  portal_users/audit_trail: RLS disabled                     PASS×2
cleanup: DB + role dropped (no leak)                          ✅
prod nama_medical_web: invoices=3, invoice_cols=25, journal=0 (بلا تغيير) ✅
```

## اكتشاف تشغيلي حرج (للـ role switch لاحقاً)
السياسة **fail-closed بصرامة**: تحت الدور غير-superuser، أي استعلام **بدون `app.tenant_id` مضبوط في نطاق الاستعلام نفسه يعيد صفر صفوف** (ليس كل الصفوف). 

دليل: في المحاولة الأولى استُخدم `set_config(..., true)` (محلي للمعاملة)؛ ومع autocommit انفصل الضبط عن الـ SELECT فظهرت 0 صفوف للجميع. التصحيح لمستوى الجلسة `set_config(..., false)` أظهر النتيجة الصحيحة (tenant1>0). 

**الأثر على `P0_RLS_RUNTIME_ROLE_SWITCH`:** بعد تبديل الدور إلى `nama_medical_app`، يجب أن يضبط التطبيق `app.tenant_id` لكل طلب **في نفس الاتصال/المعاملة** التي تُنفَّذ فيها الاستعلامات، وإلا فكل استعلام يعيد فارغاً (تعطّل وظيفي آمن وليس تسريباً). هذا يستدعي فحص آلية ضبط السياق في `db_postgres.js`/`server.js` كبند precheck قبل التبديل.

## متابعة كود مطلوبة بعد تطبيق المجموعة 2 (packages/donors/units)
بعد إضافة `tenant_id` لهذه الجداول في الإنتاج، تصبح مسارات الإدراج بحاجة لـ **ختم tenant_id** (وإلا ستفشل WITH CHECK أو تُدرج NULL):
- مسارات إنشاء/تعديل `packages`، `blood_bank_donors`، `blood_bank_units` في `server.js` — تُضاف على نمط ختم tenant_id المنشور سابقاً (`requireTenantScope` + INSERT يحوي `tenant_id`).
- هذا بند **code-only لاحق** يُجمَّع مع نشر، لا يُنفَّذ هذه الجولة.

## خطة التطبيق الإنتاجي (تحتاج موافقة `APPROVE_PHI_CLASS_A_DDL`)
1. preflight read-only (أعداد صفوف الجداول الخمسة؛ تأكيد أنّ المجموعة 2 فارغة أو backfill-plan واضح).
2. backup (server.js + لقطات الجداول المعنيّة خارج المستودع).
3. تطبيق `..._up.sql` (additive: ADD COLUMN IF NOT EXISTS + ENABLE/FORCE/policy).
4. validate عبر `..._validate.sql`.
5. **ملاحظة جوهرية:** الإنفاذ الفعلي لهذه السياسات (كبقية الـ115) يبقى مُعلّقاً على `P0_RLS_RUNTIME_ROLE_SWITCH` (لأن app=postgres يتجاوزها). لذا الترتيب المنطقي: PHI DDL ⟶ ختم tenant_id للكود ⟶ نشر ⟶ ثم role switch.
6. rollback جاهز عبر `..._down.sql`.

## الإغلاق
```text
FINAL_STATUS: REHEARSAL_PASS_PRODUCTION_APPROVAL_REQUIRED
SELECTED_PHASE: P1_PHI_CLASS_A_RESIDUAL_RLS_REHEARSAL
USER_VISIBLE_ON_WEBSITE: NO (بروفة معزولة فقط)
PRODUCTION_DEPLOYED: NO
RUNTIME_CODE_CHANGED: NO
DDL_EXECUTED_ON_PROD: NO (DDL نُفِّذ على DB throwaway فقط ثم أُسقط)
DATA_CHANGED: NO
REHEARSAL_DB: nama_phi_rehearsal (أُنشئ وأُسقط)
REHEARSAL_ROLE: phi_rehearsal_app (أُنشئ وأُسقط)
REHEARSAL_RESULT: 17/17 PASS
CANDIDATE_VALIDATED: phi_class_a_residual_rls_candidate_{up,validate,down}.sql
RLS_ENFORCEMENT_UNDER_NONSUPERUSER: PROVEN (fail-closed)
PROD_UNTOUCHED: YES (invoices=3, cols=25, journal=0)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_CREATED: NO
SECRETS_PRINTED: NO
UTF8_AUDIT: PASS
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: APPROVE_PHI_CLASS_A_DDL  أو  SECRET_READY_EXECUTE_SWITCH  أو  MASTER_AUTOPILOT_RESELECT
```

`PHI_CLASS_A_RESIDUAL_RLS_REHEARSAL_COMPLETE`
