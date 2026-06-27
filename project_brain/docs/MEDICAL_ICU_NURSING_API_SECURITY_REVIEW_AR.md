# تقرير مراجعة أمن قنوات الـ API والمسارات - الدفعة الرابعة (ICU & Nursing API Security Review)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير المراجعة الأمنية لمسارات ونهايات الـ API الخاصة بالتمريض والعناية المركزة في `server.js` والكشف عن الثغرات المعمارية (مثل IDOR) والمقترحات الفنية لسدها.

---

### 1. تحليل المسارات البرمجية الحالية (API Routes Review)

أظهر فحص الكود البرمجي لمسارات Express وجود الفجوات التالية:

#### أ. مسارات التمريض (Nursing Endpoints)
* **المسارات**:
  - `GET /api/nursing/vitals` (جلب كافة العلامات الحيوية).
  - `GET /api/nursing/vitals/:patientId` (جلب العلامات الحيوية لمريض معين).
  - `POST /api/nursing/vitals` (تسجيل علامات حيوية جديدة).
  - `GET /api/nursing/care-plans` / `POST /api/nursing/care-plans` (خطط الرعاية).
  - `GET /api/nursing/assessments` / `POST /api/nursing/assessments` (تقييمات التمريض).
* **الفجوة المرصودة**:
  - **غياب عزل المستأجر البرمجي**: هذه المسارات محمية بـ `requireAuth` فقط ولكنها **لا تستخدم** البرمجية الوسيطة `requireTenantScope` ولا تقوم بتصفية البيانات بالاستعلام بـ `tenant_id` المشتق من الجلسة في الكود البرمجي الحالي.
  - **مخاطر IDOR**: يستطيع ممرض مصرح له من المستشفى A جلب أو تعديل علامات حيوية لمريض في المستشفى B بمجرد معرفة معرّف المريض (`patient_id`).

#### ب. مسارات العناية المركزة وإعطاء الأدوية (ICU & eMAR Endpoints)
* **المسارات**:
  - `GET /api/icu/patients` (جلب مرضى العناية النشطين).
  - `POST /api/icu/monitoring` / `GET /api/icu/monitoring/:admissionId` (مراقبة العناية).
  - `POST /api/icu/ventilator` / `GET /api/icu/ventilator/:admissionId` (التنفس الميكانيكي).
  - `GET /api/emar/orders` / `POST /api/emar/orders` (وصفات الأدوية).
  - `GET /api/emar/administrations` / `POST /api/emar/administrations` (تنفيذ الجرعات).
* **الفجوة المرصودة**:
  - **غياب التحقق المقيد**: تفتقر هذه المسارات لـ `requireTenantScope`. وتعتمد فقط على تمرير معرّف التنويم (`admission_id`) أو الطلب دون التحقق من مطابقة مستأجر سجل التنويم مع مستأجر المستخدم المتصل.

---

### 2. مخاطر التعديل الجماعي وحقن الهوية (Mass Assignment & Tenant Stamping Risks)

- **قبول معرّفات المستأجرين من جسم الطلب**:
  - في الكود الحالي لـ `POST /api/nursing/vitals` و `POST /api/icu/monitoring`، يتم إدخال البيانات مباشرة دون تطهير أو قفل للـ `tenant_id` و `facility_id` برمجياً في سطر الـ Express.
  - **الحل المقترح**: يجب استخلاص `tenantId` و `facilityId` قسرياً من الجلسة `req.session.user` وحقنهما في استعلام SQL الاسترجاعي مع استبعاد أي قيمة ممررة في جسم الطلب (`req.body`).

---

### 3. تقييم احتمالات كسر النظام عند تفعيل RLS (RLS Enablement Impact)

إذا تم تفعيل RLS على قاعدة البيانات دون تحديث مسارات الـ API لتطبيق سياق المستأجر في اتصال قاعدة البيانات (`app.tenant_id`):
- **الفشل الكلي**: ستفشل كافة استعلامات جلب البيانات وترجع `0` سجلات (لعدم تهيئة سياق المستأجر في الجلسة الموضعية للـ SQL).
- **الحل**: يجب ربط هذه المسارات بالبرمجية الوسيطة `requireTenantScope` التي تقوم بتعيين `app.tenant_id` في معاملة قاعدة البيانات قبل تنفيذ أي استعلام، على غرار جداول الدفعة الأولى والثانية.
