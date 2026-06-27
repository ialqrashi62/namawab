# خطة معالجة تحذيرات أمان نهايات الـ API - الدفعة الرابعة (ICU & Nursing API Warning Resolution Plan)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا المستند مراجعة مسارات التمريض والعناية المركزة في `server.js` وتصنيف المخاطر وتحديد خطة المعالجة التفصيلية لكل مسار لمنع تسريب البيانات بين المستأجرين.

---

### 1. جدول مصفوفة معالجة مسارات الـ API (API Warnings Matrix)

| المسار (Route) | الخطر الأمني (Vulnerability) | IDOR | Mass Assignment | قبول tenant_id من العميل | استخدام requireTenantScope | التحقق من ملكية المريض/التنويم | القرار (Resolution) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `GET /api/nursing/vitals` | تسريب علامات المرضى الحيوية | نعم | لا | لا | لا | لا | **FIX_NOW** |
| `GET /api/nursing/vitals/:patientId` | عرض علامات مريض آخر | نعم | لا | لا | لا | لا | **FIX_NOW** |
| `POST /api/nursing/vitals` | تسجيل علامات لمريض مستأجر آخر | نعم | نعم | لا | لا | لا | **FIX_NOW** |
| `GET /api/icu/patients` | تسريب قائمة مرضى العناية المركزة | نعم | لا | لا | لا | لا | **FIX_NOW** |
| `POST /api/icu/monitoring` | تسجيل مراقبة لتنويم مستأجر آخر | نعم | نعم | لا | لا | لا | **FIX_NOW** |
| `GET /api/icu/monitoring/:admissionId` | عرض مراقبة تنويم مستأجر آخر | نعم | لا | لا | لا | لا | **FIX_NOW** |
| `POST /api/icu/ventilator` | تسجيل تنفس صناعي لتنويم مستأجر آخر | نعم | نعم | لا | لا | لا | **FIX_NOW** |
| `GET /api/icu/ventilator/:admissionId` | عرض تنفس صناعي لتنويم مستأجر آخر | نعم | لا | لا | لا | لا | **FIX_NOW** |
| `POST /api/icu/scores` | تسجيل مؤشرات حيوية لتنويم مستأجر آخر | نعم | نعم | لا | لا | لا | **FIX_NOW** |
| `GET /api/icu/scores/:admissionId` | عرض مؤشرات حيوية لتنويم مستأجر آخر | نعم | لا | لا | لا | لا | **FIX_NOW** |
| `POST /api/icu/fluid-balance` | تسجيل ميزان سوائل لتنويم مستأجر آخر | نعم | نعم | لا | لا | لا | **FIX_NOW** |
| `GET /api/icu/fluid-balance/:admissionId` | عرض ميزان سوائل لتنويم مستأجر آخر | نعم | لا | لا | لا | لا | **FIX_NOW** |
| `GET /api/emar/orders` | تسريب أوامر الأدوية | نعم | لا | لا | لا | لا | **FIX_NOW** |
| `POST /api/emar/orders` | إضافة أمر دواء لمريض مستأجر آخر | نعم | نعم | لا | لا | لا | **FIX_NOW** |
| `GET /api/emar/administrations` | تسريب سجلات إعطاء الأدوية | نعم | لا | لا | لا | لا | **FIX_NOW** |
| `POST /api/emar/administrations` | صرف جرعة دواء لمستأجر آخر | نعم | نعم | لا | لا | لا | **FIX_NOW** |
| `GET /api/nursing/care-plans` | تسريب خطط الرعاية التمريضية | نعم | لا | لا | لا | لا | **FIX_NOW** |
| `POST /api/nursing/care-plans` | إضافة خطة رعاية لمريض مستأجر آخر | نعم | نعم | لا | لا | لا | **FIX_NOW** |
| `GET /api/nursing/assessments` | تسريب تقييمات التمريض العامة | نعم | لا | لا | لا | لا | **FIX_NOW** |
| `POST /api/nursing/assessments` | إضافة تقييم لمريض مستأجر آخر | نعم | نعم | لا | لا | لا | **FIX_NOW** |

---

### 2. آلية التحصين ومعالجة التحذيرات (Hardening Details)

1. **إدراج البرمجية الوسيطة `requireTenantScope`**:
   - سيتم فرض هذه البرمجية على كافة المسارات الـ 20 المذكورة لتهيئة متغيرات سياق الاتصال بالـ DB وضمان الحماية على مستوى Express.
2. **منع الثقة بالبيانات الواردة من العميل (Stamping)**:
   - يتم استخلاص `tenantId` و `facilityId` تلقائياً من الجلسة الموثقة `req.session.user`.
   - يُمنع قبول `tenant_id` أو `facility_id` من `req.body` أو `req.query` نهائياً.
3. **التحقق من ملكية البيانات المتقاطعة (Cross-Matching & IDOR)**:
   - عند محاولة جلب أو إدخال سجلات للتمريض أو العناية المركزة مرتبطة بـ `patient_id` أو `admission_id`، يجب أولاً التحقق من أن المريض أو التنويم المستهدف ينتمي لنفس المستأجر الفعال. إذا لم يتطابق، يتم إرجاع `404 Not Found` فوراً دون أي إشارة إلى وجود السجل لحماية الخصوصية.
