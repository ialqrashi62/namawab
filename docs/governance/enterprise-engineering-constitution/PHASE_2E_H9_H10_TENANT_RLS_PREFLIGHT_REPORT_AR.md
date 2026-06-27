# تقرير المرحلة 2E — H-9/H-10: تمهيد عزل المستأجر و RLS (Preflight — Docs Only)

**المشروع:** NamaMedical / الطبيب
**الفرع:** `audit/phase-1-critical-remediation`
**التاريخ:** 2026-06-27
**النوع:** تحليل قراءة-فقط + قرار هندسي — **لا DDL · لا migration · لا backfill · لا تعديل كود · لا اتصال DB · لا production · لا deploy · لا push**
**الموافقة:** `APPROVE_PHASE_2E_H9_H10_TENANT_RLS_PREFLIGHT_LOCAL_DOCS_ONLY`

> ملاحظة منهجية: هذا التحليل ساكن (static) من المصدر المُلتزَم على هذا الفرع فقط. **لم يُتصل بأي قاعدة بيانات** ولم تُنفَّذ أي استعلامات حيّة؛ كل أرقام الصفوف مقتبسة من تعليقات الـcandidate المُلتزَمة، لا من DB حيّ.

---

## 1. الهدف

تحديد — قبل أي تنفيذ — ما إذا كانت جداول الهوية/الدليل (`employees`, `system_users`, `users`) **عالمية (global)** أم **مُقيَّدة بالمستأجر (tenant-scoped)**، وهل عزل RLS لها موجود في **migration مُلتزَمة idempotent** أم في **runbook / DDL يُشغّله المالك فقط**؛ ثم إصدار قرار هندسي واحد دون تنفيذ.

---

## 2. الوضع الحالي (آلية العزل على هذا الفرع)

الربط بسياق المستأجر **مُثبَت في الكود** (لا يُوثَق به من العميل):

| الآلية | الموقع | الدور |
|---|---|---|
| `getRequestTenantContext(req)` | server.js:352 | يشتق `tenantId/facilityId` من **الجلسة الموثوقة** `req.session.user`؛ fallback=1 في dev/test فقط، أبداً في production |
| `requireTenantScope` | server.js:368 (مُستخدَم **382** مرة) | في production: **403** عند غياب tenant context (deny-by-default) |
| `AsyncLocalStorage` + patched `pool.query` | server.js:254 | يحقن `app.tenant_id` على اتصال DB قبل كل استعلام عبر `tenantStore.run({tenantId, facilityId})` |
| `set_config('app.tenant_id', …)` | 16 موضعاً (مثل 2995/3041/3077) | ضبط/تفريغ السياق تحت client يدوي (للمعاملات و FOR UPDATE) |
| نمط سياسة RLS المعياري | migrations/*_rls_up.sql | `tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer` (USING + WITH CHECK) |

- **CLIENT_TENANT_ID_TRUSTED = NO** (السياق من الجلسة الخادمية).
- **APP_TENANT_CONTEXT_BINDING_FOUND = YES**.
- **FORCE_RLS_PATTERN_FOUND = YES**.
- افتراض الدور: تطبيق الإنتاج يعمل بدور `nama_medical_app` **NOBYPASSRLS** (موثَّق حوكمياً؛ هذا التمهيد لا يُعيد التحقق الحيّ).

---

## 3. جدول `employees` (الدليل القديم)

- **المخطّط الأساسي** (db_postgres.js:85–91): `id, name, name_ar, name_en, role, department_ar, department_en, status, salary, created_at` — **لا يوجد `tenant_id`**. (تُضاف لاحقاً `commission_type/commission_value` فقط عبر ALTER في db_postgres.js:1190/1194 — وليس tenant_id.)
- موثَّق صراحةً كخطر مؤجَّل: `cross_tenant_dashboard_test.js:243` → *"Employees table has no tenant_id filter (deferred risk)"*.
- تخفيف موجود على طبقة التطبيق (المرحلة 2B / OPTION_C): GET `/api/employees` يُسقِط `salary/commission_*` لغير HR/Admin، لكن **الجدول نفسه بلا `tenant_id`**.
- يوجد **candidate owner-run** يُغلق الفجوة (انظر §7): إضافة `tenant_id` + backfill (3 صفوف → tenant 1) + FORCE RLS + policy، مع فهرس مُلتزَم يفترض العمود (`migrations/ex_03_tenant_id_indexes_up.sql:45`).

> تمييز مهم: تُوجد وحدة HR منفصلة بجدول **`hr_employees`** (E18) وهو **مُقيَّد بالمستأجر بالفعل**: `tenant_id` مُضاف+مفهرس+مُعبَّأ (db_postgres.js:1973/2105) وحارس IDOR `WHERE id=$1 AND tenant_id=$2` (e18_hr_workforce_test.js:60). الفجوة محصورة في `employees` القديم لا في `hr_employees`.

---

## 4. جدولا `system_users` / `users`

- **`system_users`** (db_postgres.js:520–529): `id, username, password_hash, display_name, role, speciality, permissions, commission_type, commission_value, is_active, created_at` — **لا `tenant_id`، وهذا بالتصميم**:
  - هوية عالمية (global identity)، والربط بالمستأجر عبر **جدول وصل `user_tenants`** (db_postgres.js:1691، `INSERT INTO user_tenants (user_id, tenant_id)` 1813) — علاقة many-to-many (مستخدم واحد قد يخدم أكثر من مستأجر).
  - موثَّق صراحةً: `docs/PHASE_A2_MFA/sql/001_mfa_candidate_up.sql:3` → *"system_users.id (global identity table, no tenant_id)"*.
  - اختبار يؤكّد عدم استعلامه بـtenant_id: `e6_mar_5rights_test.js:66` يتحقق أن المصدر **لا** يحتوي `FROM system_users WHERE id=$1 AND tenant_id=$2`.
  - (الـ`tenant_id` الظاهر في `cross_tenant_e12_surgery_or_test.js:38` هو **mock** اختباري، لا المخطّط الفعلي.)
- **`users`** (جدول مستقل): **غير موجود** — لا توجد `CREATE TABLE users`. جدول المصادقة هو `system_users` فقط.

---

## 5. عالمي مقابل مُقيَّد بالمستأجر (خلاصة)

| الجدول | tenant_id؟ | التصنيف | الدليل |
|---|---|---|---|
| `system_users` (مصادقة) | لا — **بالتصميم** | **GLOBAL_OK_DOCUMENTED** | user_tenants junction + توثيق MFA + اختبار e6 |
| `users` (مستقل) | — | غير موجود | grep فارغ |
| `hr_employees` (E18) | نعم (مُعبَّأ+مفهرس) | مُقيَّد بالمستأجر بالفعل (لا فجوة) | db_postgres.js:1973/2105؛ e18 IDOR |
| `employees` (الدليل القديم) | لا (أساسي) | **TENANT_ID_REQUIRED** (فجوة؛ candidate جاهز) | db_postgres.js:85؛ "deferred risk"؛ docs/sql/14 |

---

## 6. فجوات H-9/H-10

- **H-9 (ملكية البيانات):**
  - `system_users` → **GLOBAL_OK_DOCUMENTED** (لا إجراء؛ عزل المستأجر عبر user_tenants + RBAC + حُرّاس المسار P0 على PUT/DELETE/POST-create-Admin).
  - `employees` القديم → **TENANT_ID_REQUIRED** (فجوة مؤكَّدة على مستوى المخطّط؛ مخاطرة عملية منخفضة حالياً لوجود مستأجر تشغيلي واحد فقط، لكنها فجوة معمارية يجب إغلاقها قبل أي تعدّد مستأجرين فعلي).
- **H-10 (RLS migration مقابل runbook):**
  - **موجود ومُلتزَم وidempotent** لجداول الوحدات: **44** ملف `*_up.sql` في `namaweb/migrations/` (e0/e7/e10/e16/ex…) بنمط ENABLE+FORCE+policy، آمنة لإعادة التشغيل (`DROP POLICY IF EXISTS` قبل `CREATE`).
  - **لكن** تفعيل RLS + إضافة `tenant_id` لجدول `employees` (وحزمة الـ14 جدولاً الحسّاسة) ليس migration تلقائياً، بل **DDL يُشغّله المالك** عبر `docs/sql/14_table_rls_backfill_candidate_*.sql` (+ موافقات `docs/APPROVE_FULL_REMAINING_RLS_DDL_AND_BACKFILL_FINAL_CLOSEOUT_AR.md`). المُلتزَم تلقائياً لـ`employees` هو **الفهرس فقط** (ex_03) الذي **يفترض** وجود العمود.
  - الخلاصة لهذه الفجوة: **RLS_RUNBOOK_ONLY → RLS_NEEDS_OWNER_RUN_DDL** بالنسبة لـ`employees`؛ و**RLS_MIGRATION_PRESENT_AND_IDEMPOTENT** لجداول الوحدات.

---

## 7. خطة DDL الآمنة (يُشغّلها المالك فقط — غير مُنفَّذة هنا)

الـcandidate جاهز ومُراجَع: `docs/sql/14_table_rls_backfill_candidate_up.sql` — كتلة `BEGIN…COMMIT` ذرّية واحدة:

1. **ملكية البيانات:** `employees` = دليل طاقم لكل مستأجر → `tenant_id` مطلوب؛ `system_users` = هوية عالمية (يبقى عالمياً)؛ `hr_employees` = مُقيَّد سلفاً.
2. **إضافة العمود (idempotent):** `ALTER TABLE employees ADD COLUMN IF NOT EXISTS tenant_id INTEGER` (ضمن الـ14).
3. **precheck لعدّ القيم الفارغة:** `SELECT count(*) FILTER (WHERE tenant_id IS NULL) FROM employees;` قبل أي FORCE.
4. **Backfill محدود:** `UPDATE employees SET tenant_id=1 WHERE tenant_id IS NULL;` — **3 صفوف** فقط (مستأجر تشغيلي وحيد مُثبَت؛ المستأجر 2 بلا بيانات). الـ12 جدولاً الفارغة لا تُمسّ. لا seed/delete/GRANT/role change.
5. **DEFAULT + ENABLE/FORCE RLS + policy:** `tenant_id DEFAULT (NULLIF(current_setting('app.tenant_id', true), ''))::integer` + `ENABLE/FORCE ROW LEVEL SECURITY` + `rls_employees_tenant_isolation` (USING+WITH CHECK بنفس نمط الـ150 سياسة).
6. **فهرس:** `migrations/ex_03_tenant_id_indexes_up.sql` (`idx_employees_tenant_id`) بعد توفّر العمود.
7. **staging dry-run:** تطبيق الحزمة على staging أولاً + تشغيل اختبارات `cross_tenant_*`.
8. **نقطة نسخ احتياطي/استرجاع:** `pg_dump` كامل قبل DDL (نمط `backups/full_backup_before_*`).
9. **rollback:** `docs/sql/14_table_rls_backfill_candidate_down.sql` (NO FORCE + DROP POLICY + إسقاط ما يلزم).
10. **validation SQL:** `docs/sql/14_table_rls_backfill_candidate_validate.sql` (PASS = الـ14 لديها tenant_id+FORCE+policy+DEFAULT؛ employees بلا nulls، tenant_id=1).
11. **دور التطبيق:** `nama_medical_app` يجب أن يبقى **NOBYPASSRLS**.
12. **deny-by-default:** `requireTenantScope` (403 production) + RLS تُرجع 0 صف عند غياب `app.tenant_id`.

---

## 8. مخاطر DDL

- **منخفضة-متوسطة، مُحتواة:** الـcandidate idempotent وذرّي وبـbackfill محدود (3+1 صفوف) ومستأجر وحيد مُثبَت → خطر تضارب/تسريب أدنى.
- **خطر التتابع:** تطبيق الفهرس (ex_03) قبل إضافة العمود يفشل → يجب تشغيل حزمة الـ14 قبل فهارس tenant_id.
- **خطر القفل:** `ALTER TABLE … ENABLE/FORCE` يأخذ قفلاً قصيراً؛ مقبول على جداول صغيرة. الفهارس candidate تستخدم `CREATE INDEX CONCURRENTLY` (خارج المعاملة).
- **خطر التطبيق-بعد-التفعيل:** أي مسار يكتب `employees` بلا `app.tenant_id` مضبوط سيُرفَض (WITH CHECK) — يتطلب تأكيد أن كل كتابة تمر عبر مسار مربوط بالـALS قبل التفعيل في production.
- **لا history/secrets/PHI exposure** في هذا التمهيد.

---

## 9. خطة الاختبارات (بعد قرار المالك، خارج هذه المرحلة)

- تشغيل مجموعة `cross_tenant_*` بعد التفعيل (عزل القراءة/الكتابة عبر المستأجرين).
- اختبار حارس IDOR على مسارات `employees` (id + tenant predicate) إن رُبط الجدول.
- precheck/validate SQL أعلاه على staging ثم production.
- اختبار انحدار `npm test` الكامل بعد أي تغيير كود مصاحب.
- إثبات runtime: تطبيق `nama_medical_app` يرى صفوف tenant 1 فقط بعد ضبط `app.tenant_id=1`، و0 بلا سياق.

---

## 10. القرار النهائي

**DECISION: `H9_H10_READY_FOR_OWNER_DECISION_NO_CODE`**

- `system_users` = عالمي موثَّق (لا تغيير).
- الفجوة المتبقّية الحقيقية = `employees` القديم تحتاج `tenant_id` + FORCE RLS، وهي **تغيير schema/DDL يُشغّله المالك** (خارج نطاق code-only)؛ والـcandidate + validate + down **جاهزة ومُوافَق عليها حوكمياً**.
- لا مبرر لتغيير كود أو إضافة اختبار في هذه المرحلة (لا يمكن إثبات عزل RLS بلا العمود)؛ القرار قرار مالك لتشغيل DDL على staging→production.

---

## 11. تأكيدات السلامة

لا DB · لا DDL · لا migration · لا backfill · لا تعديل كود · لا production · لا deploy · لا PM2 · لا ZATCA/NPHIES · لا external calls · لا أسرار · لا PHI · لا history rewrite · لا force push · لا push. **الإجراء التالي = قرار المالك بشأن تشغيل DDL لـ H-9/H-10، أو الانتقال إلى تمهيد PHASE 3 (DR).**
