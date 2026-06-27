# خطة تعديلات المخطط الهيكلي للكتالوجات (Catalog Schema Change Plan)
## نظام نما الطبي (NamaMedical)

تقدم هذه الوثيقة خطة هندسية تفصيلية للتعديلات الهيكلية المقترحة على قاعدة البيانات لدعم تخصيص أسعار المستأجرين وعزل الكتالوجات الحساسة بالكامل.
> [!IMPORTANT]
> هذه وثيقة تصميم وتخطيط فقط؛ ولم يتم إجراء أي تعديل فعلي أو تشغيل لهجرات أو تعديل كود السورس في هذه المرحلة، التزاماً بـ `SCHEMA_CHANGED: NO` و `DB_CHANGED: NO`.

---

## 1. تصميم جداول التخصيص الجديدة (New Override Tables)

لحل مشكلة تسعير وتخصيص الفحوصات والخدمات دون تكرار الكتالوج الطري، نقترح بناء الجداول الهيكلية التالية:

### أ. جدول تخصيص أسعار المختبرات (`tenant_lab_test_overrides`)
```sql
CREATE TABLE tenant_lab_test_overrides (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    test_id INTEGER NOT NULL REFERENCES lab_tests_catalog(id) ON DELETE CASCADE,
    custom_price REAL NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_lab_test UNIQUE (tenant_id, test_id)
);
CREATE INDEX idx_tenant_lab_test_overrides ON tenant_lab_test_overrides(tenant_id, test_id);
```

### ب. جدول تخصيص أسعار الأشعة وقوالبها (`tenant_radiology_overrides`)
```sql
CREATE TABLE tenant_radiology_overrides (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    radiology_id INTEGER NOT NULL REFERENCES radiology_catalog(id) ON DELETE CASCADE,
    custom_price REAL NOT NULL,
    custom_template TEXT DEFAULT '', -- تخصيص قالب التقرير
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_radiology UNIQUE (tenant_id, radiology_id)
);
CREATE INDEX idx_tenant_radiology_overrides ON tenant_radiology_overrides(tenant_id, radiology_id);
```

### ج. جدول تخصيص أسعار الخدمات العامة (`tenant_service_overrides`)
```sql
CREATE TABLE tenant_service_overrides (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES medical_services(id) ON DELETE CASCADE,
    custom_price REAL NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_service UNIQUE (tenant_id, service_id)
);
CREATE INDEX idx_tenant_service_overrides ON tenant_service_overrides(tenant_id, service_id);
```

---

## 2. معالجة الجداول الحساسة الخالية من معرف المستأجر (Missing tenant_id Tables)

نقترح تنفيذ الخطوات الإنشائية التالية لإضافة قيد العزل للجداول الستة المحجوبة:

### أ. عقود وشركات التأمين (`insurance_companies`, `insurance_contracts`, `insurance_policies`)
```sql
-- 1. إضافة الهوية للمستندات والعقود
ALTER TABLE insurance_contracts ADD COLUMN tenant_id INTEGER;
ALTER TABLE insurance_policies ADD COLUMN tenant_id INTEGER;

-- 2. ربط المفاتيح الأجنبية مع جدول المستأجرين
ALTER TABLE insurance_contracts ADD CONSTRAINT fk_insurance_contracts_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE insurance_policies ADD CONSTRAINT fk_insurance_policies_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;

-- 3. إنشاء المؤشرات المناسبة لـ RLS سريع
CREATE INDEX idx_insurance_contracts_tenant ON insurance_contracts(tenant_id);
CREATE INDEX idx_insurance_policies_tenant ON insurance_policies(tenant_id);
```

### ب. شجرة الحسابات والنماذج الطبية (`finance_chart_of_accounts`, `form_templates`)
```sql
-- إضافة الأعمدة لضمان عزل النماذج التشخيصية المحاسبية
ALTER TABLE finance_chart_of_accounts ADD COLUMN tenant_id INTEGER;
ALTER TABLE form_templates ADD COLUMN tenant_id INTEGER;

-- ربط المفاتيح والمؤشرات
ALTER TABLE finance_chart_of_accounts ADD CONSTRAINT fk_finance_accounts_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE form_templates ADD CONSTRAINT fk_form_templates_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;

CREATE INDEX idx_finance_accounts_tenant ON finance_chart_of_accounts(tenant_id);
CREATE INDEX idx_form_templates_tenant ON form_templates(tenant_id);
```

---

## 3. استراتيجية الهجرة والتعبئة الآمنة (Backfilling Strategy)
عند الحصول على موافقة تشغيل الهجرة في المستقبل:
1. **تعبئة شجرة الحسابات الافتراضية**:
   سيتم نسخ حسابات المحاسبة القياسية المتاحة وتعبئتها لكل مستأجر نشط بناءً على `tenant_id`.
2. **عقود وبوالص التأمين**:
   ربط العقود القائمة مع المريض التابع لها لختم هوية المستأجر الصحيحة.
3. **تطهير البيانات**:
   تحويل الأعمدة إلى `NOT NULL` بعد اكتمال التعبئة لضمان عدم وجود سجلات يتيمة.
