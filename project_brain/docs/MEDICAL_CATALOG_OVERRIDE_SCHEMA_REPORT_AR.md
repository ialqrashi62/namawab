# تقرير مخطط هيكل تخصيص الكتالوجات (Schema Report)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوضح هذا التقرير التفاصيل البنائية والهندسية للجداول الجديدة والقيود والفهارس التي تمت إضافتها لدعم تخصيص الأسعار وقوالب الأشعة لكل مستأجر.

### 1. مخطط الجداول الجديدة (DDL Schema)

#### أ. جدول تخصيص تحاليل المختبر (`tenant_lab_test_overrides`)
- `id` SERIAL PRIMARY KEY
- `tenant_id` INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE
- `test_id` INTEGER NOT NULL REFERENCES lab_tests_catalog(id) ON DELETE CASCADE
- `custom_price` REAL NOT NULL
- `is_active` INTEGER DEFAULT 1
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- **القيود الفريدة**: `uq_tenant_lab_test` على الأعمدة `(tenant_id, test_id)` لمنع تكرار التخصيص للمستأجر الواحد.
- **الفهارس**: `idx_tenant_lab_overrides` على `(tenant_id, test_id)` لتسريع عمليات الدمج الخارجي.

#### ب. جدول تخصيص الأشعة وكشافة التقارير (`tenant_radiology_overrides`)
- `id` SERIAL PRIMARY KEY
- `tenant_id` INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE
- `radiology_id` INTEGER NOT NULL REFERENCES radiology_catalog(id) ON DELETE CASCADE
- `custom_price` REAL NOT NULL
- `custom_template` TEXT (لحفظ قوالب التقارير المخصصة لكل مستأجر بشكل مستقل)
- `is_active` INTEGER DEFAULT 1
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- **القيود الفريدة**: `uq_tenant_radiology` على الأعمدة `(tenant_id, radiology_id)`.
- **الفهارس**: `idx_tenant_rad_overrides` على `(tenant_id, radiology_id)`.

#### ج. جدول تخصيص الخدمات والإجراءات الطبية (`tenant_service_overrides`)
- `id` SERIAL PRIMARY KEY
- `tenant_id` INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE
- `service_id` INTEGER NOT NULL REFERENCES medical_services(id) ON DELETE CASCADE
- `custom_price` REAL NOT NULL
- `is_active` INTEGER DEFAULT 1
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- **القيود الفريدة**: `uq_tenant_service` على الأعمدة `(tenant_id, service_id)`.
- **الفهارس**: `idx_tenant_svc_overrides` على `(tenant_id, service_id)`.

### 2. مراجعة الجداول الأصلية المشتركة
بناءً على القواعد الصارمة لمنع تعديل الكتالوجات المشتركة، لم يتم إجراء أي تغيير هيكلي على الإطلاق على الجداول الأصلية:
- `lab_tests_catalog` (بدون تعديل)
- `radiology_catalog` (بدون تعديل)
- `medical_services` (بدون تعديل)

بذلك، تم عزل أسعار وقوالب المستأجرين بأمان كامل ودون المساس بالهيكل الأساسي للنظام.
