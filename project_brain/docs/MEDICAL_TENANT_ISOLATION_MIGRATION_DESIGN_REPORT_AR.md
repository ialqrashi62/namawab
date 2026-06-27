# تصميم خطة هجرة وعزل المستأجرين والمنشآت (Tenant & Facility Isolation Migration Design Report)

تم إعداد هذا التقرير لتصميم خطة الهجرة المعمارية والبرمجية الهادفة لعزل بيانات نظام **نما الطبي** وفق الهيكل السحابي متعدد المستأجرين (Multi-tenant Healthcare SaaS)، بما يضمن الامتثال الكامل للوائح والتشريعات الطبية المحلية والعالمية، وحماية خصوصية بيانات المرضى ومنع أي احتمالية لتسريب البيانات بين المنشآت الطبية المختلفة.

---

## 1. الملخص التنفيذي (Executive Summary)

ينتقل نظام نما الطبي من كونه تطبيقاً أحادياً للعيادات والمنشآت المنفردة (Single-tenant Monolith) إلى بنية تحتية مرنة تدعم نموذج العمل السحابي المشترك (Healthcare SaaS). يركز هذا التصميم على بناء جدار عزل متين للبيانات والعمليات الطبية والمالية واللوجستية على مستوى الجداول (Database Schema) وواجهات البرمجة (APIs)، بدون المساس بقاعدة البيانات الحالية أو تشغيل أي ترحيلات (Migrations) في هذه المرحلة التحليلية.

تم تحديد نموذج **قاعدة البيانات المشتركة مع العزل المنطقي الهيكلي (Shared Database with Logical Schema Isolation)** كخيار أساسي مناسب للكود والبيانات القائمة، مع إتاحة خيار **قاعدة البيانات المنفصلة (Database-per-tenant)** للمستشفيات والمدن الطبية الكبرى كنموذج هجين (Hybrid Multi-tenancy Model).

---

## 2. سبب أهمية العزل في الأنظمة الطبية (Why Isolation Matters in Healthcare)

يتعدى عزل البيانات في الأنظمة الصحية النواحي الأمنية والتقنية البسيطة ليصل إلى متطلبات قانونية وامتثالية إلزامية:
1. **الامتثال للأنظمة المحلية (Saudi Health Regulations)**: تشريعات وزارة الصحة السعودية، والمركز الوطني للمعلومات الصحية (NHIC)، ومجلس الضمان الصحي (CHI)، ونظام حماية البيانات الشخصية (PDPL) تفرض عقوبات صارمة في حال تسرب أو تداخل السجلات الطبية للمرضى بين الجهات المختلفة.
2. **الامتثال للمعايير العالمية (HIPAA & GDPR)**: اشتراط عزل سجلات المرضى الشخصية (PHI/PHW)، وتوفير سجل تدقيق صارم لا يمكن التلاعب به لتتبع كل عملية اطلاع أو تعديل على الملف الطبي للمريض.
3. **سلامة المريض الطبية (Clinical Safety)**: أي تداخل أو تسريب في الجلسات الطبية قد يؤدي إلى خلط التشخيصات، أو صرف أدوية غير صحيحة، أو تداخل الحساسيات المرضية مما يهدد حياة المرضى بشكل مباشر.
4. **السرية والخصوصية المالية والتعاقدية**: لكل منشأة طبية عقود تأمين خاصة بها، وقوائم أسعار خدمات، وتقارير أرباح وخسائر (P&L) مستقلة تماماً لا يجوز كشفها لباقي المستأجرين.

---

## 3. مقارنة وتقييم نماذج عزل المستأجرين (Isolation Models Comparison)

تمت دراسة وتقييم النماذج الأربعة التالية لعزل البيانات لتحديد الأنسب لنظام نما الطبي:

### أ. قاعدة بيانات لكل مستأجر (Database-per-tenant)
* **الأمان**: أقصى درجات الأمان والعزل المادي للبيانات.
* **سهولة التطوير**: عالية جداً، فالكود البرمجي لا يحتاج لتصفية كل استعلام بـ `tenant_id` لأن الاتصال يتم بقاعدة بيانات مستقلة.
* **التكلفة**: مرتفعة جداً بسبب زيادة استهلاك موارد الخادم وإدارة مئات القواعد المستقلة.
* **النسخ الاحتياطي**: مرن وسهل لكل منشأة بشكل منفصل.
* **الأداء**: ممتاز لعدم وجود جداول ضخمة مشتركة.
* **قابلية التوسع**: صعبة عند نمو عدد المستأجرين لآلاف العيادات الصغيرة.
* **ملاءمته للنظام الحالي**: يحتاج لتعديل آلية الاتصال بالـ DB في `db_postgres.js` لتدعم مجمع اتصالات ديناميكي (Dynamic Connection Pooling).

### ب. مخطط لكل مستأجر (Schema-per-tenant)
* **الأمان**: ممتاز (عزل منطقي على مستوى المخططات داخل نفس قاعدة البيانات).
* **سهولة التطوير**: متوسطة (تحتاج لتوجيه الاستعلامات للمخطط المناسب مثل `SET search_path TO tenant_1`).
* **التكلفة**: منخفضة إلى متوسطة.
* **النسخ الاحتياطى**: متوسط الصعوبة (يمكن أخذ نسخة لمخطط معين).
* **الأداء**: جيد جداً.
* **قابلية التوسع**: جيدة، ولكن تواجه مشاكل في الأداء عند وصول عدد المخططات لأكثر من 1000 مخطط في PostgreSQL.
* **ملاءمته للنظام الحالي**: متوافق، لكنه يعقد عمليات الهجرة وتحديث الجداول وتشغيل الـ migrations المستقبلية على جميع المخططات في نفس الوقت.

### ج. عزل منطقي على مستوى السجل (Row-level tenant isolation)
* **الأمان**: جيد جداً في حال تطبيق قيود PostgreSQL RLS (Row-Level Security) بصرامة، أو فلترة الاستعلامات بالـ Code.
* **سهولة التطوير**: صعبة نسبياً، حيث تتطلب تعديل جميع استعلامات الـ SQL لإضافة شرط `tenant_id` أو ضبط سياسات RLS في قاعدة البيانات.
* **التكلفة**: منخفضة جداً (قاعدة بيانات واحدة وجداول مشتركة لجميع المستأجرين).
* **النسخ الاحتياطي**: معقد عند الرغبة في استعادة بيانات مستأجر واحد دون غيره.
* **الأداء**: ممتاز بشرط استخدام الفهارس المشتركة (Composite Indexes) بشكل صحيح.
* **قابلية التوسع**: عالية جداً للعيادات والمراكز الصغيرة والمتوسطة.
* **ملاءمته للنظام الحالي**: هو الأنسب للكود الحالي المعرف في `server.js` كونه يعتمد على جداول مدمجة واستعلامات SQL مباشرة.

### د. النموذج الهجين (Hybrid Model)
* يجمع بين **قاعدة بيانات لكل مستأجر (Database-per-tenant)** للمستشفيات والمدن الطبية الكبرى لضمان الخصوصية القصوى وتلبية متطلبات الامتثال الخاصة بهم، وبين **العزل على مستوى السجل (Row-level isolation)** للمراكز الصغيرة والعيادات لتقليل التكلفة التشغيلية وتبسيط الصيانة.

---

## 4. النموذج المختار والتبرير (Selected Model & Justification)

تم اختيار **النموذج الهجين (Hybrid Multi-tenancy Model)** كنواة لبنية SaaS في نظام نما الطبي:
* **التبرير**:
  1. **العيادات والمراكز الصغيرة (SMEs)**: سيتم تشغيلها على نموذج **Row-level isolation** داخل قاعدة بيانات مشتركة لتقليص التكاليف وتسهيل عمليات التحديث والصيانة الفورية لكامل النظام.
  2. **المستشفيات والعملاء الكبار (Enterprise)**: سيتم تخصيص **قاعدة بيانات مستقلة (Database-per-tenant)** لكل منهم لتلبية الشروط القانونية الصارمة للمنشآت الطبية الكبرى التي تحظر دمج بياناتها مع جهات أخرى.
  3. **البنية البرمجية الحالية**: يعتمد النظام الحالي في `server.js` على استعلامات SQL خام ومباشرة عبر مجمع اتصالات واحد `pool`. تطبيق العزل المنطقي عبر RLS وحقن `tenant_id` يسمح لنا بالتحول التدريجي دون كسر الوظائف الطبية القائمة، مع سهولة توجيه الاتصال لقواعد بيانات منفصلة للعملاء الكبار عبر تخصيص خيوط اتصال مستقلة.

---

## 5. تصميم الكيانات المقترحة (Proposed Entities Schema)

لتنفيذ هذا العزل، نقترح إدراج الكيانات الحاكمة التالية في قاعدة البيانات المستقبلية:

```sql
-- 1. جدول المستأجرين (Tenants): يمثل المنشأة أو الشركة القابضة المشتركة في SaaS
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL, -- لتوجيه الطلبات تلقائياً (مثال: c1.namamedical.com)
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, trial
    plan_type VARCHAR(50) DEFAULT 'standard', -- standard, premium, enterprise
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول المنشآت الطبية (Facilities): المستشفيات أو المستوصفات التابعة للمستأجر
CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    tax_number VARCHAR(100), -- الرقم الضريبي الخاص بالمنشأة للربط مع ZATCA
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. جدول الفروع (Branches): الفروع الجغرافية التابعة للمنشأة الطبية
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. جدول الأقسام (Departments): الأقسام الطبية والتشغيلية داخل الفرع
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. جدول علاقات المستخدمين بالمستأجرين (User Tenants): لتمكين الكادر من العمل لدى أكثر من مستأجر
CREATE TABLE user_tenants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES system_users(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_tenant UNIQUE(user_id, tenant_id)
);

-- 6. جدول علاقات المستخدمين بالفروع والمنشآت (User Facilities): تحديد الفروع المسموح للموظف العمل بها
CREATE TABLE user_facilities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES system_users(id) ON DELETE CASCADE,
    facility_id INTEGER NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT TRUE, -- الفرع الافتراضي للموظف عند تسجيل الدخول
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_facility_branch UNIQUE(user_id, facility_id, branch_id)
);

-- 7. جدول إعدادات المستأجرين (Tenant Settings): إعدادات مخصصة لكل عيادة أو شركة بشكل منعزل
CREATE TABLE tenant_settings (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT NOT NULL,
    CONSTRAINT uq_tenant_setting_key UNIQUE(tenant_id, setting_key)
);

-- 8. جدول أدوار الصلاحيات المخصصة للمستأجر (Tenant Roles): لتخصيص RBAC لكل منشأة مستقلة
CREATE TABLE tenant_roles (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    permissions JSONB NOT NULL, -- مصفوفة الصلاحيات التفصيلية للموديولات
    CONSTRAINT uq_tenant_role_name UNIQUE(tenant_id, name)
);

-- 9. جدول نطاق المريض والمستأجر (Patient Tenant Scope): لتسجيل مشاركة بيانات المرضى بين المستأجرين عند الإحالات الخارجية
CREATE TABLE patient_tenant_scope (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL, -- مرجع لجدول المرضى
    source_tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    target_tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    granted_by INTEGER REFERENCES system_users(id),
    consent_file_path VARCHAR(500), -- مسار إقرار موافقة المريض الموقعة إلكترونياً
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. جدول نطاق تدقيق تصفح المستأجرين (Audit Tenant Scope): تتبع عمليات قراءة البيانات الطبية عبر المستأجرين والفروع
CREATE TABLE audit_tenant_scope (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    user_id INTEGER NOT NULL,
    accessed_patient_id INTEGER,
    access_reason VARCHAR(255), -- سبب الاطلاع (حالة طارئة، إحالة، استشارة)
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. تصنيف الجداول الحالية البالغ عددها 135 جدولاً (Tables Classification)

تم تصنيف جداول قاعدة البيانات الحالية البالغ عددها 135 جدولاً وفق متطلبات وحقن العزل المنطقي إلى الفئات التالية:

### أ. جداول تحتاج `tenant_id` فقط
جداول الهوية والوصول والبيانات الشخصية العامة التي ترتبط مباشرة بالمستأجر الرئيسي:
* `system_users`, `portal_users`, `user_permissions`, `tenant_roles`, `tenant_settings`.

### ب. جداول تحتاج `tenant_id` و `facility_id`
جداول العمليات الطبية العامة والمالية والمشتركة بين منشآت المستأجر:
* `patients`, `invoices`, `payments`, `insurance_claims`, `medical_records`, `prescriptions`, `lab_results`, `zatca_invoices`, `telemedicine_sessions`.

### ج. جداول تحتاج `tenant_id` و `branch_id` (وعند الحاجة `facility_id` و `department_id`)
الجداول اللوجستية واليومية والتشغيلية التي تتم داخل بيئة جغرافية محددة (الفرع):
* `appointments`, `waiting_queue`, `nursing_vitals`, `medical_certificates`, `patient_referrals`, `surgeries`, `emergency_visits`, `admissions`, `beds`, `wards`, `inventory_items`, `inventory_opening_balances`, `inventory_purchases`, `pharmacy_prescriptions_queue`, `pharmacy_drug_catalog`.

### د. جداول إعدادات عامة (Global) لا تحتاج `tenant_id`
أدلة مرجعية وكتالوجات عالمية مشتركة لجميع مستأجري الخدمة لتقليل المساحة وضمان التوحيد:
* `icd10_codes` (التشخيصات الطبية القياسية)، وكتالوج الأدوية المرجعي العام المدمج بالنظام.

---

## 7. خطة الهجرة المستقبلية والتنفيذ (Migration & Backfill Plan)

سيتم تنفيذ الهجرة مستقبلاً بخطوات أمنية متسلسلة تضمن بقاء النظام قيد التشغيل:

1. **الخطوة 1: تهيئة الهيكل (Structure Setup)**
   * إنشاء الجداول الأساسية (`tenants`, `facilities`, `branches`, `departments`).
   * إدراج مستأجر افتراضي (Default Tenant) برقم `1` ومنشأة افتراضية برقم `1` لتمثيل العيادة الحالية.

2. **الخطوة 2: حقن الحقول القابلة للملء (Nullable Fields Migration)**
   * تشغيل أمر هجرة يضيف حقل `tenant_id INTEGER NULL` وحقل `facility_id INTEGER NULL` إلى كافة الجداول الـ 135 المحددة.
   * إبقاء الحقول `NULL` مؤقتاً لتجنب فشل أي عمليات إدخال تجريها واجهات API القديمة أثناء النشر.

3. **الخطوة 3: ملء البيانات القائمة (Backfill Execution)**
   * تشغيل سكربت تحديث شامل لربط كافة السجلات الحالية بالمستأجر الافتراضي:
     ```sql
     -- مثال لملء جدول المرضى والفواتير
     UPDATE patients SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
     UPDATE invoices SET tenant_id = 1, facility_id = 1 WHERE tenant_id IS NULL;
     ```
   * مراجعة الجداول والتأكد من عدم وجود أي سجلات معزولة أو يتيمة (`orphan records`).

4. **الخطوة 4: فرض القيود وتنشيط الفهارس (Constraint & Index Activation)**
   * تحويل الحقول إلى حقول إلزامية لا تقبل الفراغ:
     ```sql
     ALTER TABLE patients ALTER COLUMN tenant_id SET NOT NULL;
     ALTER TABLE invoices ALTER COLUMN tenant_id SET NOT NULL;
     ```
   * إنشاء فهارس مركبة (Composite Indexes) لضمان سرعة الاستعلامات:
     ```sql
     CREATE INDEX idx_patients_tenant_id_id ON patients (tenant_id, id);
     CREATE INDEX idx_invoices_tenant_id_id ON invoices (tenant_id, id);
     ```

---

## 8. خطة التراجع (Rollback Plan)

في حال حدوث فشل حرج أثناء تفعيل هجرة عزل المستأجرين، سنتبع الخطوات الآتية:
1. **النسخ الاحتياطي الصارم**: أخذ نسخة احتياطية فيزيائية كاملة لقاعدة البيانات باستخدام `pg_dump` قبل البدء في تفعيل أي تعديل هيكلي.
2. **سكربت تراجع تلقائي (Rollback Script)**:
   * يقوم بإسقاط قيود المفاتيح الخارجية (Foreign Key Constraints) المضافة حديثاً.
   * إزالة حقول `tenant_id` و `facility_id` من الجداول الطبية والمالية والتشغيلية.
   * استعادة البنية القديمة.
3. **البيانات التي لا يمكن التراجع عنها بسهولة**:
   * في حال تم تشغيل النظام وبدء المستأجرون الجدد بإدخال بياناتهم الفعلية، فإن التراجع الكامل عن الهيكل سيعني تداخل البيانات وفقدان سجلات المستأجرين الجدد. في هذه الحالة، يجب فصل وحفظ بيانات المستأجرين الجدد أولاً قبل عكس الهيكل، أو تجنب التراجع الكلي والتركيز على إصلاح المشكلة (Forward Fix).

---

## 9. نمط برمجي مستقبلي للاستعلامات (Future API Query Patterns)

لتأمين واجهات البرمجة، سيتم تطبيق نمط تصفية تلقائي في طبقة التوجيه والاستعلام:

```javascript
// 1. برمجية وساطة لاستخراج هوية المستأجر والفرع من الجلسة
function requireTenantScope(req, res, next) {
    if (!req.session || !req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    req.tenantId = req.session.user.tenant_id;
    req.facilityId = req.session.user.facility_id;
    next();
}

// 2. نمط تصفية الاستعلامات بالـ SQL لمنع تسريب البيانات
async function withTenantFilter(queryText, params, tenantId) {
    // حقن tenant_id كمعامل إلزامي في كافة الاستعلامات
    const hasWhere = queryText.toLowerCase().includes('where');
    const separator = hasWhere ? ' AND ' : ' WHERE ';
    const paramIndex = params.length + 1;
    const modifiedQuery = queryText + separator + `tenant_id = $${paramIndex}`;
    const modifiedParams = [...params, tenantId];
    return pool.query(modifiedQuery, modifiedParams);
}

// 3. التحقق الأمني الإضافي لمنع ثغرات IDOR
async function assertTenantAccess(tableName, recordId, tenantId) {
    const query = `SELECT 1 FROM ${tableName} WHERE id = $1 AND tenant_id = $2`;
    const result = await pool.query(query, [recordId, tenantId]);
    if (result.rows.length === 0) {
        throw new Error('Access Denied: Record does not belong to this tenant.');
    }
}
```

---

## 10. خطة تحديث نظام الصلاحيات (RBAC Tenant Scoping)

سيتم تحديث نظام الصلاحيات الحالي ليعمل بالتوازي مع فحص نطاق المستأجر:
* **تداخل الصلاحيات**: وجود دور `Doctor` لدى المستخدم يمنحه حق الوصول لموديول المرضى، ولكن يتم تطبيق شرط `tenant_id = current_tenant` إجبارياً على مستوى قاعدة البيانات، فلا يستطيع رؤية أي مريض لا يقع في نطاقه الجغرافي والمنظماتي.
* **الأدوار المخصصة لكل مستأجر**: يمكن لكل عيادة أو منشأة تحديد صلاحيات خاصة بأطبائها أو محاسبيها وحفظها في جدول `tenant_roles` وتعديلها دون التأثير على المستأجرين الآخرين.

---

## 11. سيناريوهات الاختبار لضمان العزل ومنع التسريب (QA Testing Scenarios)

1. **اختبار منع تسريب الهوية (IDOR prevention)**:
   * محاولة استدعاء واجهة تعديل سجل طبي لمريض ينتمي للمستأجر "أ" باستخدام حساب طبيب ينتمي للمستأجر "ب".
   * **النتيجة المتوقعة**: استجابة برمز الخطأ `403 Forbidden` أو `404 Not Found`.
2. **اختبار تصفية التقارير (Financial Leakage)**:
   * سحب التقرير المالي الإجمالي عبر مالي الاستقبال، والتحقق من أن المخرجات تقتصر حصرياً على فواتير المستأجر الحالي ولا تشمل أي فلس من فواتير منشآت أخرى.
3. **اختبار تسجيل الدخول عبر النطاقات الفرعية (Subdomain Routing)**:
   * محاولة تسجيل دخول مستخدم مسجل في العيادة "أ" عن طريق رابط النطاق الفرعي للعيادة "ب".
   * **النتيجة المتوقعة**: رفض تسجيل الدخول لعدم تطابق نطاق المستأجر.

---

## 12. تحليل المخاطر (Risks Analysis)

* **خطر تأثر أداء قاعدة البيانات**:
  * **الوصف**: نمو أحجام الجداول المشتركة بشكل كبير مما يبطئ استعلامات البحث.
  * **التخفيف**: الاستخدام الصارم للفهارس المركبة (Composite Indexes) وتهيئة خطط الاستعلام (Query Optimization).
* **خطر تسريب البيانات نتيجة خطأ برمجى**:
  * **الوصف**: نسيان إضافة شرط `tenant_id` في أحد المسارات الجديدة أو المعدلة.
  * **التخفيف**: تفعيل PostgreSQL Row-Level Security (RLS) كخط دفاع ثانٍ وجدار حماية على مستوى قاعدة البيانات مباشرة لضمان عدم تمرير أي بيانات لا تطابق سياق الجلسة الحالي.

---

## 13. التوصيات والمرحلة القادمة

نوصي بالانتقال إلى مرحلة:
**تنفيذ عزل المستأجرين (Tenant Isolation Migration Implementation)**

وذلك لإنشاء الجداول الحاكمة وبدء تطبيق الهجرة وحقن الحقول الأمنية وتدقيق الاستعلامات وفق الخطط المصممة في هذا التقرير.
