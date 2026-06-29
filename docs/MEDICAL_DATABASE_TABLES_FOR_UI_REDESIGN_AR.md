# جرد وتوصيف قواعد البيانات وهيكلة النماذج لإعادة التصميم عبر Stitch

يوثق هذا التقرير الجرد التفصيلي للجداول ونماذج العلاقات الخاصة بقاعدة البيانات (PostgreSQL) في نظام **نما الطبي (Nama Medical ERP)**، ومطابقتها مع واجهات المستخدم لتقديم فهم دقيق لهيكلية البيانات لبرمجة شاشات Stitch بشكل واقعي.

---

## 1. نموذج المرضى (Model: patients)

### الغرض / Purpose
تخزين البيانات الديموغرافية والطبية والتأمينية الأساسية لكل مريض.

### الوحدة / Module
Patient Administration

### الحقول المهمة / Key Fields
| Field | Type | Meaning | UI usage | Notes |
|---|---|---|---|---|
| id | SERIAL | المعرّف الفريد لقاعدة البيانات | - | مفتاح أساسي |
| file_number | INTEGER | رقم الملف الطبي المتسلسل للمريض | معروض في الاستقبال والبحث | يتم توليده تسلسلياً |
| name_ar / name_en | TEXT | اسم المريض باللغتين | معروض في كل شاشات المرضى | يدعم عرض الاسم المناسب للغة |
| national_id | TEXT | رقم الهوية الوطنية أو الإقامة | الاستقبال والتحقق والربط | - |
| tenant_id | INTEGER | معرّف المستأجر لعزل البيانات | عزل البيانات الخلفي RLS | ربط أمن البيانات |
| facility_id | INTEGER | معرّف المنشأة (مستشفى، عيادة) | عزل البيانات بحسب المنشأة | - |

### العلاقات / Relationships
| Related Model | Relationship Type | Purpose | UI impact |
|---|---|---|---|
| `invoices` | One-to-Many | تتبع فواتير المريض | عرض كشف حساب المريض المالي |
| `appointments` | One-to-Many | تتبع حجوزات المريض | عرض سجل مواعيد المريض |
| `medical_records` | One-to-Many | تتبع الملف الطبي | عرض التطور السريري للمريض |

### الصفحات المرتبطة / Related UI Pages
- شاشة الاستقبال والتسجيل (`#reception`)
- شاشة حسابات المرضى والتحصيل (`#accounts`)
- شاشة محطة عمل الطبيب (`#doctor`)

### APIs المرتبطة / Related APIs
- `GET /api/patients` (جلب المرضى والبحث)
- `POST /api/patients` (تسجيل مريض جديد)
- `PUT /api/patients/:id` (تحديث البيانات)

### هل يظهر في الواجهة؟
نعم (Full)

### هل يحتاج شاشة جديدة؟
لا (موجود حالياً ويحتاج إعادة تصميم المظهر فقط)

### هل مرتبط بالمستأجر؟
Tenant scoped: Yes (عبر سياسة RLS المطبقة على حقل `tenant_id`)

### هل مرتبط بنوع المنشأة؟
نعم (عبر حقل `facility_id` لتمييز المستشفى عن المستوصف)

### حساسية البيانات
Patient-sensitive (بيانات شخصية وطبية حساسة خاضعة لنظام حماية البيانات الشخصية PDPL)

### ملاحظات لـ Stitch
- **عرض الجدول**: يفضل استخدام بطاقات مستخدمين متكاملة للملف المالي والطبي للمريض مع علامات تبويب واضحة.

---

## 2. نموذج الفواتير (Model: invoices)

### الغرض / Purpose
تسجيل كافة المطالبات المالية والفواتير الصادرة للمرضى نظير الخدمات والزيارات والأدوية.

### الوحدة / Module
Billing & Finance

### الحقول المهمة / Key Fields
| Field | Type | Meaning | UI usage | Notes |
|---|---|---|---|---|
| id | SERIAL | المعرّف الفريد للفاتورة | - | مفتاح أساسي |
| invoice_number | TEXT | رقم الفاتورة التسلسلي الرسمي | معروض في السندات والإيصالات | صيغة INV-YYYY-xxxxx |
| total | REAL | الإجمالي الشامل للضريبة والخصم | معروض في شاشات التحصيل | القيمة النهائية للدفع |
| vat_amount | REAL | قيمة ضريبة القيمة المضافة المحتسبة | يظهر في الفاتورة الضريبية | 15% لغير السعوديين |
| paid | INTEGER | مؤشر سداد الفاتورة | يحدد الحالات المعلقة | 1 = سددت، 0 = لم تسدد |
| tenant_id | INTEGER | معرّف المستأجر (عزل مالي) | RLS عزل مالي مائي | لا تتسرب الفواتير بين المستأجرين |

### العلاقات / Relationships
| Related Model | Relationship Type | Purpose | UI impact |
|---|---|---|---|
| `patients` | Many-to-One | تحديد المريض صاحب الفاتورة | عرض اسم المريض وتفاصيله |
| `zatca_invoices` | One-to-One | الربط الضريبي مع هيئة الزكاة | إبراز كود QR الخاص بالفاتورة |

### الصفحات المرتبطة / Related UI Pages
- شاشة حسابات المرضى والتحصيل (`#accounts`)
- لوحة تحكم المالية والمحاسبة (`#finance`)
- شاشة صرف الصيدلية (`#pharmacy` مبيعات POS)

### APIs المرتبطة / Related APIs
- `GET /api/invoices`
- `POST /api/invoices`
- `GET /api/print/invoice/:id`

### هل يظهر في الواجهة؟
نعم (Full)

### هل مرتبط بالمستأجر؟
Tenant scoped: Yes

### حساسية البيانات
Financial (بيانات مالية حساسة للغاية تخضع لتدقيق هيئة الزكاة والضريبة والجمارك ZATCA)

### ملاحظات لـ Stitch
- **تمثيل البيانات**: إتاحة خيار طباعة إيصال حراري ضيق (POS Receipt) متضمناً رمز QR الخاص بالهيئة تلقائياً عند الدفع.

---

## 3. نموذج عقود الموافقات والتأمين (Model: insurance_claims)

### الغرض / Purpose
تسجيل ملفات المطالبات المالية المرسلة لشركات التأمين للحصول على التعويض المالي للخدمات الطبية.

### الوحدة / Module
Insurance

### الحقول المهمة / Key Fields
| Field | Type | Meaning | UI usage | Notes |
|---|---|---|---|---|
| id | SERIAL | معرّف المطالبة | - | مفتاح أساسي |
| claim_amount | REAL | القيمة الإجمالية للمطالبة | معروض في سجل المطالبات | - |
| status | TEXT | حالة معالجة شركة التأمين للمطالبة | تتبع التقييم | Pending, Approved, Rejected |
| waseel_status | TEXT | حالة الإرسال عبر منصة Waseel/NPHIES | تتبع الرفع التقني | Unsent, Sent, Accepted, Rejected |

### العلاقات / Relationships
| Related Model | Relationship Type | Purpose | UI impact |
|---|---|---|---|
| `patients` | Many-to-One | تحديد اسم المريض وملفه | - |
| `insurance_companies`| Many-to-One | تحديد الشركة الموجه لها المطالبة| جلب بيانات الاتصال بالعقد |

### الصفحات المرتبطة / Related UI Pages
- شاشة التأمين والموافقات (`#insurance`)
- شاشة المالية والحسابات (`#finance`)

### APIs المرتبطة / Related APIs
- `GET /api/insurance/claims`
- `POST /api/insurance/claims`
- `PUT /api/insurance/claims/:id`

### هل يظهر في الواجهة؟
نعم (Full)

### حساسية البيانات
Financial / Clinical (بيانات مالية وطبية مدمجة حساسة للغاية)

---

## 4. نموذج سجل التخدير والجراحة (Model: surgeries)

### الغرض / Purpose
جدولة العمليات الجراحية وتتبع كادر العمليات وتفاصيل التخدير وحالة ما قبل العملية للمريض.

### الوحدة / Module
Clinical / Surgical / OR

### الحقول المهمة / Key Fields
| Field | Type | Meaning | UI usage | Notes |
|---|---|---|---|---|
| id | SERIAL | معرّف العملية الجراحية | - | مفتاح أساسي |
| patient_id | INTEGER | المريض الخاضع للجراحة | ربط بيانات المريض | - |
| surgeon_id | INTEGER | الجراح المسؤول عن العملية | تحديد الكادر الجراحي | - |
| status | TEXT | الحالة الحالية للعملية | تتبع التقدم | Scheduled, In Progress, Completed |
| preop_status | TEXT | حالة تجهيز وفحوصات ما قبل الجراحة | مؤشر الأمان | Pending, Completed |

### العلاقات / Relationships
| Related Model | Relationship Type | Purpose | UI impact |
|---|---|---|---|
| `patients` | Many-to-One | جلب اسم المريض وفصيلته | عرض لوحة عمليات اليوم |
| `surgery_preop_assessments`| One-to-One | التحقق من صيام وفحوصات المريض | مؤشر علامة الأمان الخضراء |
| `surgery_anesthesia_records`| One-to-One | تتبع غازات وسوائل التخدير | ملف التخدير الطبي للعملية |

### الصفحات المرتبطة / Related UI Pages
- شاشة العمليات وما قبلها (`#surgery`)
- شاشة بنك الدم والمطابقة (`#bloodbank`)

### APIs المرتبطة / Related APIs
- `GET /api/surgeries`
- `POST /api/surgeries`
- `GET /api/obgyn/stats` (ربط جزئي لولادات القيصرية)

### هل يظهر في الواجهة؟
نعم (Full)

### حساسية البيانات
Clinical (بيانات سريرية عالية الخطورة والحساسية)

### ملاحظات لـ Stitch
- **تصميم واجهة OR Checklist**: تصميم قائمة الفحص (Pre-Op Checklist) ببطاقات مسطحة تتغير ألوانها تلقائياً عند تغيير الكادر الطبي لحالة الصيام أو توقيع الإقرار.

---

## 5. دليل قيود الحسابات وسندات القبض (Model: finance_journal_lines)

### الغرض / Purpose
تسجيل السطور التفصيلية للمدخلات المحاسبية (المدين والدائن) وربطها ببنود الدليل الحسابي ومراكز التكلفة لكل مستأجر.

### الوحدة / Module
Accounting & Finance

### الحقول المهمة / Key Fields
| Field | Type | Meaning | UI usage | Notes |
|---|---|---|---|---|
| id | SERIAL | معرّف سطر القيد المحاسبي | - | مفتاح أساسي |
| entry_id | INTEGER | القيد المحاسبي الرئيسي المرتبط | تجميع القيود | رابط جدول `finance_journal_entries` |
| account_id | INTEGER | البند المالي من شجرة الحسابات | تحديد طبيعة المعاملة | - |
| debit | REAL | القيمة المدينة في المعاملة | حقل الحساب المدين | بالريال السعودي |
| credit | REAL | القيمة الدائنة في المعاملة | حقل الحساب الدائن | بالريال السعودي |
| cost_center_id | INTEGER | مركز التكلفة المرتبط (مثال: عيادة ليزر) | تتبع أداء العيادات | - |

### العلاقات / Relationships
| Related Model | Relationship Type | Purpose | UI impact |
|---|---|---|---|
| `finance_journal_entries`| Many-to-One | ربط السطور برأس القيد | عرض القيود المحاسبية بالكامل |
| `finance_chart_of_accounts`| Many-to-One | ربط بالدليل الحسابي لتسمية البند | عرض اسم الحساب في الأسطر |
| `finance_cost_centers`| Many-to-One | تحديد مركز التكلفة التحليلي | تقارير ربحية العيادات والأقسام |

### الصفحات المرتبطة / Related UI Pages
- شاشة المالية والحسابات (`#finance`)
- شاشة التقارير والمطابقات الضريبية (`#reports`)

### هل يظهر في الواجهة؟
نعم (Full)

### حساسية البيانات
Financial (بيانات محاسبية مالية حساسة تخضع للمطابقة الضريبية)

---

## جدول جرد وتكامل هياكل قواعد البيانات (Master DB Mapping Table)

| DB Table / Model | Purpose | Module | Related UI Pages | Key Fields | Relationships | Tenant Scoped? | Facility Type Relevant? | Used in API? | Used in UI? | Missing UI? | Notes for Stitch |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `patients` | تخزين بيانات المرضى الشخصية والطبية | Patient | الاستقبال، محطة الطبيب، الحسابات | id, file_number, name_ar, national_id, tenant_id | invoices, appointments | نعم (عبر RLS) | نعم | نعم | نعم | لا | بطاقة مريض متكاملة شاملة الأبعاد |
| `invoices` | تسجيل المطالبات والفواتير والضريبة | Billing | الحسابات، المالية، الصيدلية | id, invoice_number, total, vat_amount, paid, tenant_id | patients, zatca_invoices | نعم (عبر RLS) | نعم | نعم | نعم | لا | إيصال دفع POS يحتوي QR ذكي |
| `insurance_claims` | مطالبات التأمين الموجهة لمنصات Waseel/NPHIES | Insurance | التأمين، المالية | id, claim_amount, waseel_status, status | patients, insurance_companies | نعم (عبر RLS) | نعم | نعم | نعم | لا | لوحة تتبع دورة حياة المطالبة كانبان |
| `surgeries` | جدولة العمليات وكادر التخدير والغرف | Surgical | العمليات وما قبلها، بنك الدم | id, patient_id, surgeon_id, status, preop_status | patients, preop_assessments | نعم (عبر RLS) | لا | نعم | نعم | لا | مخطط زمني تفاعلي لأسرة الجراحة والغرف |
| `finance_journal_lines` | سطور القيود التفصيلية للمحاسبة | Accounting | المالية، التقارير | id, entry_id, account_id, debit, credit | journal_entries, chart_of_accounts | نعم (عبر RLS) | لا | نعم | نعم | لا | جدول موازنة المدين والدائن مع الحفظ الفوري |
| `wards` | تخزين أجنحة التنويم وأعداد الأسرة | Inpatient | التنويم (Inpatient ADT)، العناية | id, ward_name_ar, ward_type, total_beds, tenant_id | beds, admissions | نعم (عبر RLS) | لا | نعم | نعم | لا | بطاقات تمثيل الأجنحة وسعتها بصرياً |
| `beds` | توزيع وحالة الأسرة داخل الأجنحة والغرف | Inpatient | التنويم، العناية، الطوارئ | id, ward_id, bed_number, status, current_patient_id | wards, admissions | نعم (عبر RLS) | لا | نعم | نعم | لا | لوحة سحب وإفلات لإشغال الأسرة |
| `admissions` | سجلات إدخال وتنويم المرضى وعلاجاتهم | Inpatient | التنويم، التغذية، العناية | id, patient_id, admission_date, status, expected_los | patients, wards, beds | نعم (عبر RLS) | لا | نعم | نعم | لا | مخطط متابعة مدة الإقامة المتوقعة |
| `blood_bank_units` | تتبع أكياس الدم المتوفرة بالمستودع وصلاحيتها | Blood Bank | بنك الدم، العمليات | id, bag_number, blood_type, status, expiry_date | donors, crossmatch | نعم (عبر RLS) | لا | نعم | نعم | لا | لوحة رادار صلاحية مخزون الدم الملونة |
| `consent_forms` | إقرارات وموافقات المرضى القانونية | Clinical | الإقرارات، العمليات | id, patient_id, form_type, signed_at, signature_data | patients, surgeries | نعم (عبر RLS) | لا | نعم | نعم | لا | بوابة توقيع باللمس تولد مستند PDF محمي |
| `emergency_visits` | تتبع فرز وحالات مرضى طوارئ المستشفى | Emergency | الطوارئ، التمريض | id, patient_id, triage_level, triage_color, status | patients, trauma_assessments | نعم (عبر RLS) | لا | نعم | نعم | لا | طابور فرز الطوارئ بالترميز اللوني النابض |
| `icu_monitoring` | تتبع الأجهزة الحيوية لمرضى العناية المركزة | ICU | العناية المركزة (ICU) | id, admission_id, hr, sbp, map, spo2, recorded_by | admissions, patients | نعم (عبر RLS) | لا | نعم | نعم | لا | مخطط بياني فوري لمراقبة العلامات الخطرة |
| `daily_close` | إغلاق الصناديق اليومي للحسابات والمبيعات | Accounting | المالية، الحسابات | id, close_date, total_cash, total_card, variance, status | system_users (cashier) | نعم (عبر RLS) | نعم | نعم | نعم | لا | واجهة إغلاق مالي تتطلب مطابقة العجز |
| `tenants` | مستأجرو النظام الطبي والاشتراكات (SaaS) | Admin | الإعدادات، شاشة الأدمن الرئيسي | id, name, subdomain, status, plan_type | facilities, user_tenants | لا (مستوى أساسي) | نعم | نعم | نعم | لا | لوحة تحكم Tenant Control لإدارة التراخيص |
| `tenant_service_overrides` | تجاوزات أسعار الخدمات الطبية لكل مستأجر | Settings | الأصناف (Catalog)، الإعدادات | id, tenant_id, service_id, custom_price, is_active | tenants, medical_services | نعم (عبر RLS) | نعم | نعم | نعم | لا | لوحة تعديل أسعار مخصصة للمستأجر جماعياً |
