# P0 عزل المستأجرين — 04 تصميم المعالجة (Remediation Design)

> التاريخ: 2026-06-20 | يُكتب قبل أي تنفيذ DB DDL (التزام بالـ Hard Stop).

---

## 1. مبدأ السلامة الأساسي (Production Coupling Rule)

- **Class A** (جدول بلا `tenant_id`): إضافة `WHERE tenant_id=$N` في الكود **مقترنة إلزامياً** بـ `ADD COLUMN tenant_id`. نشر الكود وحده على إنتاج تنقصه الأعمدة **يكسر الموديول**. لذلك:
  - يُضاف `ADD COLUMN IF NOT EXISTS tenant_id` (idempotent) إلى كتلة تهيئة `db_postgres.js` → بيئات dev/التنصيب الجديد تحصل على العمود تلقائياً.
  - الإنتاج **يتخطّى التهيئة** (المرحلة 106) → لا يتأثّر تلقائياً → يحتاج نشر DDL مُعتمَد منفصل (Gate 9).
  - النتيجة: الكود + DDL يُنشران **معاً** تحت موافقة → الحالة النهائية `READY_FOR_CONTROLLED_PRODUCTION_DEPLOY`.
- **Class B** (جدول به `tenant_id`): إصلاح الاستعلام **آمن للنشر فوراً** (العمود موجود).

---

## 2. نمط العزل القياسي (يُحتذى من `/api/surgeries`)

```
app.METHOD('/api/x', requireAuth, requireTenantScope, async (req,res) => {
  const { tenantId, facilityId } = getRequestTenantContext(req);
  // SELECT: شرط tenant_id = $N عند وجود tenantId
  // INSERT: ختم tenant_id, facility_id من السياق
  // UPDATE/DELETE: تحقق ملكية ثم WHERE id=$X AND tenant_id=$Y
  // IDOR: تحقق تبعية patient_id للمستأجر قبل الربط
});
```

- الشرط `if (tenantId)` يحافظ على التوافق: في dev (tenantId=1) يُطبّق الفلتر؛ في الإنتاج `requireTenantScope` يضمن وجود tenantId أو 403.

---

## 3. الجداول التي تحتاج `tenant_id` (الموجة 1)

medical_records_files, medical_records_requests, medical_records_coding, clinical_pharmacy_reviews, patient_drug_education, rehab_patients, rehab_sessions, rehab_goals, rehab_assessments, portal_users, diet_orders, diet_meals, nutrition_assessments.

- **facility_id**: يُضاف حيثما يفيد (medical_records_*, clinical_pharmacy_*, rehab_*) أسوة بالجداول السريرية؛ اختياري للبقية.
- **backfill**: `UPDATE ... SET tenant_id = 1 WHERE tenant_id IS NULL` (المستأجر الافتراضي الوحيد حالياً) — آمن لأن الإنتاج single-tenant.

---

## 4. السياسات المطلوبة (RLS)

لكل جدول Class A:
```
ALTER TABLE t ENABLE ROW LEVEL SECURITY;
ALTER TABLE t FORCE ROW LEVEL SECURITY;
CREATE POLICY rls_t_tenant_isolation ON t
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
CREATE INDEX idx_t_tenant ON t(tenant_id);
```
- لا تستخدم `USING(true)`. تعتمد GUC `app.tenant_id` (نفس آلية الجداول المُفعّلة).

---

## 5. التعديلات في المسارات

- استبدال `requireAuth` بـ `requireAuth, requireTenantScope` في ~28 مساراً للموجة 1.
- إضافة فلتر/ختم/تحقق ملكية/IDOR لكل handler.
- `clinical-pharmacy/interactions` و`drug_interactions`: تبقى مرجعية عالمية بلا عزل.

---

## 6. استراتيجية الاختبار

- اختبار static + simulation موحّد `cross_tenant_modern_modules_test.js` (نفس أسلوب الاختبارات الـ17 القائمة — لا يحتاج قاعدة بيانات).
- يثبت: وجود `requireTenantScope`، فلتر SELECT، ختم INSERT، تحقق UPDATE/DELETE، رفض الإنتاج بلا سياق.
- + تشغيل كل اختبارات العزل القائمة (regression) + `node --check server.js` (سلامة الصياغة).

---

## 7. استراتيجية التراجع (Rollback)

- SQL `down`: `DROP POLICY` + `DISABLE/NO FORCE RLS` + (اختياري) `DROP COLUMN tenant_id`.
- الكود: عبر Git revert للـ commit (لا history rewrite).

---

## 8. استراتيجية نشر الإنتاج (Gate 9)

1. نسخة احتياطية كاملة قبل أي DDL.
2. تطبيق `up.sql` (ADD COLUMN + backfill + RLS + FORCE RLS + indexes).
3. تشغيل `validate.sql`.
4. نشر كود `server.js` المُحدّث + إعادة تشغيل PM2.
5. smoke + اختبارات عزل.
6. عند الفشل: `down.sql` + revert الكود.

> **لا يُنفّذ أي من ذلك في هذه المرحلة** — يحتاج موافقة إنتاج صريحة منفصلة.

`REMEDIATION_DESIGN_COMPLETE — لا تنفيذ DB DDL إنتاجي`
