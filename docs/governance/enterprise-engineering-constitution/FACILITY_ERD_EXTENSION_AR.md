# امتداد وتوسيع مخطط قاعدة البيانات ورسم العلاقات (Facility ERD Extension)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** منصة المنشآت الصحية المتعددة (PHASE_ENTERPRISE_FACILITY_PLATFORM_WITH_MEDICAL_CITY_SELECTOR)
* **المستند:** امتداد وتوسيع مخطط قاعدة البيانات (FACILITY_ERD_EXTENSION_AR)
* **الحالة:** معتمد ✅

---

## 1. مخطط قاعدة البيانات المقترح للـ 18 جدولاً الجديدة

لتسهيل ودعم ترقية النظام، تم صياغة مخطط قاعدة البيانات (DDL/ERD) الموسع لإضافة الجداول الحاكمة الجديدة، مع تفعيل قيود الحماية وضمان عزل المستأجرين (Tenant RLS):

```sql
-- 1. جدول الشبكات الصحية للمستأجرين (Health Networks)
CREATE TABLE health_networks (
    id SERIAL PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول المناطق والمدن الجغرافية (Regions)
CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    network_id INTEGER REFERENCES health_networks(id),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. جدول المدن الطبية والتجمعات الصحية (Medical Cities)
CREATE TABLE medical_cities (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. جدول أنواع المنشآت الصحية المعيارية (Facility Types)
CREATE TABLE facility_types (
    code VARCHAR(10) PRIMARY KEY, -- GH, MC, PC, PHC...
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT
);

-- 5. جدول المنشآت الطبية الفردية (Facilities)
CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES medical_cities(id),
    type_code VARCHAR(10) REFERENCES facility_types(code),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    tenant_id INTEGER NOT NULL, -- للربط بعزل المستأجر RLS
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. جدول قوالب الأقسام الطبية للمنشآت (Facility Templates)
CREATE TABLE facility_templates (
    id SERIAL PRIMARY KEY,
    type_code VARCHAR(10) REFERENCES facility_types(code),
    template_name TEXT NOT NULL
);

-- 7. جدول أقسام القوالب الافتراضية (Facility Template Departments)
CREATE TABLE facility_template_departments (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES facility_templates(id),
    department_id INTEGER NOT NULL
);

-- 8. جدول الأقسام الطبية المفتوحة والمفعلة فعلياً بالمنشأة (Facility Enabled Departments)
CREATE TABLE facility_enabled_departments (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id),
    department_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_modified_by INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. جدول مباني المنشآت الصحية (Facility Buildings)
CREATE TABLE facility_buildings (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. جدول الطوابق والأجنحة الطبية (Facility Floors / Wards)
CREATE TABLE facility_floors (
    id SERIAL PRIMARY KEY,
    building_id INTEGER REFERENCES facility_buildings(id),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    floor_number INTEGER
);

-- 11. جدول الغرف والعيادات (Facility Rooms)
CREATE TABLE facility_rooms (
    id SERIAL PRIMARY KEY,
    floor_id INTEGER REFERENCES facility_floors(id),
    room_number TEXT NOT NULL,
    type TEXT -- Clinic, ICU Room, Ward Bed Room...
);

-- 12. جدول الأسرة الطبية بالمستشفى (Facility Beds)
CREATE TABLE facility_beds (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES facility_rooms(id),
    bed_number TEXT NOT NULL,
    status TEXT DEFAULT 'Available' -- Available, Occupied, Maintenance
);

-- 13. جدول الخدمات الطبية المخصصة للمنشأة وأسعارها (Facility Services)
CREATE TABLE facility_services (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id),
    service_code TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    price REAL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 14. جدول أوقات العمل الرسمية للمنشآت (Facility Operating Hours)
CREATE TABLE facility_operating_hours (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id),
    day_of_week INTEGER, -- 0 to 6
    start_time TIME,
    end_time TIME
);

-- 15. جدول شهادات واعتمادات المنشأة (Facility Accreditations)
CREATE TABLE facility_accreditations (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id),
    accreditation_name TEXT, -- CBAHI, JCI...
    expiry_date DATE,
    status TEXT
);

-- 16. جدول عقود شركات التأمين الطبي (Facility Insurance Contracts)
CREATE TABLE facility_insurance_contracts (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id),
    insurance_company_id INTEGER,
    contract_number TEXT,
    discount_percentage REAL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 17. جدول ودجات لوحة التحكم المخصصة (Facility Dashboard Widgets)
CREATE TABLE facility_dashboard_widgets (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id),
    widget_key TEXT NOT NULL,
    display_order INTEGER,
    is_visible BOOLEAN DEFAULT TRUE
);

-- 18. جدول عناصر شريط التنقل المخصصة (Facility Navigation Items)
CREATE TABLE facility_navigation_items (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id),
    role_id INTEGER,
    nav_title_ar TEXT,
    nav_title_en TEXT,
    route_path TEXT
);
```

---

## 2. قواعد الحماية وعزل البيانات (Security & Tenant Isolation)
* يتم تمكين وحظر سياسات حماية مستوى الصف (Row Level Security - RLS) على كافة الجداول التي تحتوي على المعرف `tenant_id`.
* يُمنع استخدام حسابات التطبيق الممتلكة لصلاحيات `rolsuper` أو `rolbypassrls` وقت تشغيل المنصة في بيئات الاختبار أو الإنتاج لضمان عزل بيانات المرضى بالكامل.
