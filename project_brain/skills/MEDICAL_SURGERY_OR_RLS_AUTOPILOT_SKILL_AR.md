# دليل مهارات أوتوبيلوت العمليات الجراحية وغرف العمليات (Surgery & Operating Rooms RLS Autopilot Skill)
## نظام نما الطبي (NamaMedical) - أمن وحوكمة قواعد البيانات الطبية

يوثق هذا الملف القواعد الفنية والتشغيلية الخاصة بتصميم وفحص وحوكمة سياسات أمان السجلات (RLS) وتأمين نهايات الـ API لموديول العمليات الجراحية وغرف العمليات (Surgery & Operating Rooms).

---

### 1. نطاق الموديول والجداول المستهدفة (Scope & Target Tables)

يغطي هذا الدليل الجداول التالية في قاعدة البيانات:
1. **`surgeries`** (جدول العمليات الجراحية الأساسي).
2. **`surgery_preop_assessments`** (تقييمات ما قبل الجراحة).
3. **`surgery_preop_tests`** (فحوصات ما قبل الجراحة).
4. **`surgery_anesthesia_records`** (سجلات التخدير الجراحي).
5. **`operating_rooms`** (غرف العمليات وتجهيزاتها).

---

### 2. ضوابط حوكمة التصميم (Design & Audit Governance)

- **منع التعديل المباشر**: يُحظر تماماً تفعيل RLS أو تشغيل DDL (ALTER TABLE, CREATE TABLE) أو هجرات البيانات الفعالة خلال مرحلة التصميم.
- **التدقيق الأمني للواجهات (API Security)**: التحقق من وجود الحماية البرمجية `requireTenantScope` و `requireAuth` على كافة المسارات الـ 13 الخاصة بالعمليات وغرف العمليات في `server.js`.
- **التحقق المتقاطع للهوية (Cross-Tenant Verification)**:
  - عند جدولة عملية، يجب مطابقة أن المريض (`patient_id`) ينتمي لنفس المستأجر الفعال (`tenant_id`).
  - يجب التحقق من أن سجلات التخدير والتقييمات والفحوصات مقيدة بالـ `surgery_id` التابع للمستأجر الفعال.

---

### 3. الصياغة الفنية المعتمدة لسياسات RLS (Proposed RLS Policy Blueprint)

عند تطبيق RLS في المراحل اللاحقة، يجب استخدام الصياغة القياسية للتوافق مع جلسة العمل المتعددة للمستأجرين:

```sql
-- تفعيل وحظر RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_name FORCE ROW LEVEL SECURITY;

-- السياسة المعتمدة لعزل المستأجر
CREATE POLICY rls_table_name_tenant_isolation ON table_name
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
```

---

### 4. شروط التوقف الفوري (BLOCKER Rules)

يجب إعلان حالة التعليق (BLOCKED) فوراً في حال:
1. رصد أي حقول أو سجلات في موديول العمليات تفتقر لعمود `tenant_id` أو `facility_id` دون تصميم سبل تعبئتها.
2. وجود تسريب بيانات صريح بين المستأجرين في الكود المكتوب الحالي لـ Express.
3. ظهور أي كلمات مرور أو مفاتيح سرية في التقارير أو الملفات غير المتجاهلة.
