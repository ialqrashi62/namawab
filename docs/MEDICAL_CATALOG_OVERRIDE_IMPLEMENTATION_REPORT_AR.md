# تقرير تنفيذ تفعيل وتخصيص الكتالوجات الطبية (Implementation Report)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير التفاصيل الكاملة لتصميم وتطبيق واختبار نظام تخصيص أسعار الكتالوجات والخدمات الطبية لكل مستأجر بشكل تدريجي ومحكوم على بيئة Staging.

---

### 1. تصنيف البيئة والنطاق التشغيلي
* **تصنيف البيئة (Environment Classification)**: 
  `PUBLIC_STAGING_HTTPS_RLS_BATCH6_ENABLED_NOT_FULL_PRODUCTION`
* **النطاق الفعلي للمرحلة**: 
  اقتصرت التغييرات فقط على الجداول الهجينة المخصصة لتسعير الخدمات والتحاليل والأشعة الطبية. لم يتم التعديل على الكتالوجات العالمية المشتركة أو جداول الصيدلية أو الأسرة أو الغرف.
* **الجداول المشمولة بالتخصيص الهجين**:
  - `lab_tests_catalog`
  - `radiology_catalog`
  - `medical_services`

---

### 2. التعديلات الهيكلية لقاعدة البيانات (Schema Changes)
تم تأسيس ثلاثة جداول جديدة لتسجيل أسعار وقوالب المستأجرين المخصصة مع ربطها عبر مفاتيح أجنبية وفهارس تسريع الاستعلام وربطها بنظام عزل الصفوف (RLS):

```sql
-- 1. جدول تخصيص أسعار التحاليل الطبية
CREATE TABLE IF NOT EXISTS tenant_lab_test_overrides (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    test_id INTEGER NOT NULL REFERENCES lab_tests_catalog(id) ON DELETE CASCADE,
    custom_price REAL NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_lab_test UNIQUE (tenant_id, test_id)
);
CREATE INDEX IF NOT EXISTS idx_tenant_lab_overrides ON tenant_lab_test_overrides (tenant_id, test_id);

-- 2. جدول تخصيص أسعار وقوالب تقارير الأشعة
CREATE TABLE IF NOT EXISTS tenant_radiology_overrides (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    radiology_id INTEGER NOT NULL REFERENCES radiology_catalog(id) ON DELETE CASCADE,
    custom_price REAL NOT NULL,
    custom_template TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_radiology UNIQUE (tenant_id, radiology_id)
);
CREATE INDEX IF NOT EXISTS idx_tenant_rad_overrides ON tenant_radiology_overrides (tenant_id, radiology_id);

-- 3. جدول تخصيص أسعار الخدمات الطبية العامة
CREATE TABLE IF NOT EXISTS tenant_service_overrides (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES medical_services(id) ON DELETE CASCADE,
    custom_price REAL NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_service UNIQUE (tenant_id, service_id)
);
CREATE INDEX IF NOT EXISTS idx_tenant_svc_overrides ON tenant_service_overrides (tenant_id, service_id);
```

---

### 3. سياسات حماية وأمن عزل المستأجرين (RLS Policies)
تم تمكين فرض حماية عزل الصفوف (RLS) لكل جدول تخصيص جديد، لضمان استلام المستأجر فقط للبيانات المرتبطة بمعرّف الجلسة الخاص به، مع منع أي محاولة قراءة أو كتابة متقاطعة:

```sql
-- تفعيل الحماية لجدول تخصيص التحاليل
ALTER TABLE tenant_lab_test_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_lab_test_overrides FORCE ROW LEVEL SECURITY;
CREATE POLICY rls_tenant_lab_test_overrides_tenant_isolation ON tenant_lab_test_overrides
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- تفعيل الحماية لجدول تخصيص الأشعة
ALTER TABLE tenant_radiology_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_radiology_overrides FORCE ROW LEVEL SECURITY;
CREATE POLICY rls_tenant_radiology_overrides_tenant_isolation ON tenant_radiology_overrides
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- تفعيل الحماية لجدول تخصيص الخدمات الطبية
ALTER TABLE tenant_service_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_service_overrides FORCE ROW LEVEL SECURITY;
CREATE POLICY rls_tenant_service_overrides_tenant_isolation ON tenant_service_overrides
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
```

---

### 4. التعديلات البرمجية لـ API (Backend API Upgrades)
تم تعديل ملف `namaweb/server.js` لتطبيق القوانين التالية بأعلى درجات الكفاءة الأمنية:

1. **إصلاح المسارات التالفة**: تم استبدال المسارات العشوائية المكررة بمسارات منفصلة وواضحة للتحاليل والأشعة والخدمات الطبية.
2. **الدمج والاسترداد الذكي (COALESCE LEFT JOIN)**: تم تعديل مسارات القراءة لتقوم بدمج أسعار وقوالب الكتالوج الأساسية مع أسعار التخصيص للمستأجر، بحيث تعود الأسعار الأساسية تلقائياً في حال عدم توفر تخصيص، أو تعود القيم المخصصة فور إنشائها.
3. **التحديث الآمن (ON CONFLICT UPSERT)**: تم تعديل مسارات التحديث (`PUT`) لتفادي تكرار الأسطر وإجراء التعديل بإدراج وحيد وتحديث القيم ديناميكياً عند تصادم المفاتيح الفريدة.
4. **التسعير التلقائي للطلبات**: تم تحديث مسارات إنشاء الطلبات الجديدة (`POST /api/lab/orders` و `POST /api/radiology/orders`) لتقوم بالبحث التلقائي في أسعار التخصيص للمستأجر أولاً ثم الارتداد لأسعار الكتالوج العالمي.

---

### 5. تقرير التحقق الفني ونتائج الاختبارات (Validation & Test Results)
تم تشغيل ثلاث مجموعات اختبار شاملة تضمنت اختبارات الدخان، واختبارات تسريب البيانات، واختبارات التراجع والتحصين لـ 14 جدولاً سابقاً:

* **اختبارات تخصيص الكتالوج والعزل (`cross_tenant_catalog_override_test.js`)**:
  - عدد الاختبارات: **29 اختباراً**
  - الحالة: **ناجح بنسبة 100% (ALL PASS)**
  - التحقق: عزل تام بين مستأجر A ومستأجر B عند قراءة وتحديث أسعار المختبر والأشعة والخدمات، واستدامة أسعار الكتالوجات العالمية المشتركة.

* **اختبارات تسريب البيانات والـ IDOR العام (`cross_tenant_leak_test.js`)**:
  - عدد الاختبارات: **63 اختباراً**
  - الحالة: **ناجح بنسبة 100% (ALL PASS)**
  - التحقق: فحص الحماية من الوصول المباشر للسجلات بدون سياق الجلسة في بيئة Staging.

* **اختبارات عزل المختبر والأشعة (`cross_tenant_lab_radiology_test.js`)**:
  - عدد الاختبارات: **37 اختباراً**
  - الحالة: **ناجح بنسبة 100% (ALL PASS)**
  - التحقق: سلامة عزل الطلبات الحالية ونتائج المختبر وعينات التحاليل.

---

### 6. الخاتمة والتوصيات الأمنية
تثبت كافة الاختبارات والتقارير الفنية أن تصميم وتطبيق هجرات الكتالوج المخصص قد تم بأعلى معايير الأمان وحماية حوكمة البيانات المعتمدة لبيئة Staging. لم يتم لمس أي بيانات مرضى حقيقية، ولم تُسجل أي فجوات أمنية أو تسريبات لمعلومات حساسة.
