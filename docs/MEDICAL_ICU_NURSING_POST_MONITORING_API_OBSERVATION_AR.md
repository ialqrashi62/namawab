# تقرير مراقبة وتدقيق نهايات الـ API - الدفعة الرابعة (ICU & Nursing API Observation)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير مراجعة التحصين البرمجي لنهايات الـ API العشرين لموديول العناية المركزة والتمريض، والتحقق من آليات عزل مستأجري الـ SaaS ومنع ثغرات الوصول العشوائي (IDOR).

---

### 1. نهايات الـ API المفحوصة والتحصينات المطبقة (Hardened API Endpoints)

تم التحقق من تطبيق الحماية والفلترة البرمجية على المسارات التالية في `server.js`:

| اسم المسار (Route) | البرمجية الوسيطة الحامية | آلية فلترة المستأجر (Tenant Filter) | منع الـ IDOR والـ Mass Assignment |
| :--- | :---: | :---: | :---: |
| `GET /api/nursing/vitals` | `requireTenantScope` | تصفية بـ `tenant_id` من الجلسة | نعم |
| `GET /api/nursing/vitals/:patientId` | `requireTenantScope` | التحقق من ملكية المريض للمستأجر | نعم، إرجاع `404` عند المخالفة |
| `POST /api/nursing/vitals` | `requireTenantScope` | ختم تلقائي لـ `tenant_id` و `facility_id` | نعم، التحقق من مريض المستأجر وحظر التلاعب بالجسد |
| `GET /api/icu/patients` | `requireTenantScope` | الربط مع التنويم المفلتر بـ `tenant_id` | نعم |
| `POST /api/icu/monitoring` | `requireTenantScope` | ختم تلقائي لـ `tenant_id` و `facility_id` | نعم، التحقق من ملكية التنويم للمستأجر |
| `GET /api/icu/monitoring/:admissionId` | `requireTenantScope` | التحقق من التنويم قبل الجلب | نعم، إرجاع `404` عند المخالفة |
| `POST /api/icu/ventilator` | `requireTenantScope` | ختم تلقائي لـ `tenant_id` و `facility_id` | نعم، التحقق من التنويم |
| `GET /api/icu/ventilator/:admissionId` | `requireTenantScope` | التحقق من التنويم | نعم، إرجاع `404` |
| `POST /api/icu/scores` | `requireTenantScope` | ختم تلقائي لـ `tenant_id` و `facility_id` | نعم |
| `GET /api/icu/scores/:admissionId` | `requireTenantScope` | التحقق من التنويم | نعم |
| `POST /api/icu/fluid-balance` | `requireTenantScope` | ختم تلقائي لـ `tenant_id` و `facility_id` | نعم |
| `GET /api/icu/fluid-balance/:admissionId` | `requireTenantScope` | التحقق من التنويم | نعم |
| `GET /api/emar/orders` | `requireTenantScope` | تصفية بـ `tenant_id` | نعم |
| `POST /api/emar/orders` | `requireTenantScope` | ختم تلقائي لـ `tenant_id` و `facility_id` | نعم، التحقق من المريض والتنويم |
| `GET /api/emar/administrations` | `requireTenantScope` | تصفية بـ `tenant_id` أو التحقق من أمر الدواء | نعم |
| `POST /api/emar/administrations` | `requireTenantScope` | ختم تلقائي لـ `tenant_id` و `facility_id` | نعم، التحقق من الأمر والمريض للمستأجر |
| `GET /api/nursing/care-plans` | `requireTenantScope` | تصفية بـ `tenant_id` | نعم |
| `POST /api/nursing/care-plans` | `requireTenantScope` | ختم تلقائي للمستأجر | نعم، التحقق من المريض |
| `GET /api/nursing/assessments` | `requireTenantScope` | ربط (`JOIN`) برمجياً مع جدول المرضى | نعم، معزول برمجياً بالكامل |
| `POST /api/nursing/assessments` | `requireTenantScope` | ختم وتدقيق مريض المستأجر | نعم، منع الإدراج خارج نطاق المستأجر |

---

### 2. مراجعة عزل مسار تقييمات التمريض (`nursing_assessments`)

* **تحدي الهيكل**: لا يحتوي جدول `nursing_assessments` على عمود `tenant_id` بقاعدة البيانات حالياً (API Only).
* **آلية المعالجة والتأمين**:
  - عند الجلب (`GET`): تم استخدام استعلام SQL مع ربط الصفوف بجدول المرضى المفلتر:
    `SELECT a.* FROM nursing_assessments a JOIN patients p ON a.patient_id = p.id WHERE p.tenant_id = $1`
  - عند الإضافة (`POST`): يتم التحقق من أن المريض الممرر ينتمي لنفس المستأجر الفعلي للجلسة قبل الشروع في عملية الإدخال:
    `SELECT id FROM patients WHERE id=$1 AND tenant_id=$2`
    وفي حال عدم التطابق، يتم رفض الطلب فوراً بـ `404 Not Found`.

---

### 3. خلاصة فحص الـ API الأمنية (Conclusion)

* تم التحقق من عدم قبول نهايات الـ API لأي قيم `tenant_id` مرسلة من العميل في طلبات الإدخال، ويتم الختم الأمني إجبارياً من الخادم من سياق الجلسة الآمنة `getRequestTenantContext(req)`.
* **حالة البوابة 3**: **PASS**
