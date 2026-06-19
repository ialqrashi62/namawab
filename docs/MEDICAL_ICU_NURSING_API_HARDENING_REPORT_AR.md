# تقرير تحصين واجهات الـ API ونهايات الاتصال - الدفعة الرابعة (ICU & Nursing API Hardening Report)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير التعديلات البرمجية التي تم تطبيقها على خادم Express.js (`namaweb/server.js`) لتأمين مسارات العناية والتمريض وعزلها بالكامل بمستأجر الجلسة.

---

### 1. نهايات الـ API التي تم تحصينها (Hardened Endpoints)

تم تحصين المسارات الـ 20 التالية بشكل كامل في `server.js`:

#### أ. مسارات العلامات الحيوية والتقييمات وخطط الرعاية التمريضية:
1. `GET /api/nursing/vitals` - تصفية القائمة بـ `tenant_id`.
2. `GET /api/nursing/vitals/:patientId` - التحقق من تبعية المريض للمستأجر الفعال أولاً.
3. `POST /api/nursing/vitals` - التحقق من ملكية المريض وختم الجلسة وتأمين تحديث حالة المريض.
4. `GET /api/nursing/care-plans` - تصفية القائمة بـ `tenant_id`.
5. `POST /api/nursing/care-plans` - التحقق من ملكية المريض والختم الآلي.
6. `GET /api/nursing/assessments` - فلترة القائمة ديناميكياً بـ `JOIN` مع جدول المرضى لضمان العزل التام للمستند بدون تعديل المخطط.
7. `POST /api/nursing/assessments` - التحقق من تبعية المريض للمستأجر لمنع حقن السجلات المتقاطعة.

#### ب. مسارات العناية المركزة (ICU Endpoints):
8. `GET /api/icu/patients` - تصفية المرضى النشطين في العناية المركزة بـ `tenant_id`.
9. `POST /api/icu/monitoring` - التحقق من سياق المريض والتنويم والختم الآلي.
10. `GET /api/icu/monitoring/:admissionId` - التحقق من سياق التنويم والفلترة بـ `tenant_id`.
11. `POST /api/icu/ventilator` - التحقق والختم التلقائي لجرعات ومراقبة التنفس الميكانيكي.
12. `GET /api/icu/ventilator/:admissionId` - التحقق والفلترة بـ `tenant_id`.
13. `POST /api/icu/scores` - التحقق والختم التلقائي لمؤشرات APACHE II / SOFA.
14. `GET /api/icu/scores/:admissionId` - التحقق والفلترة بـ `tenant_id`.
15. `POST /api/icu/fluid-balance` - التحقق والختم التلقائي لميزان السوائل المدخل.
16. `GET /api/icu/fluid-balance/:admissionId` - التحقق والفلترة بـ `tenant_id`.

#### ج. مسارات إعطاء الأدوية (eMAR Endpoints):
17. `GET /api/emar/orders` - تصفية أوامر الأدوية وعزل المرضى بـ `tenant_id`.
18. `POST /api/emar/orders` - التحقق من المريض وختم الجلسة.
19. `GET /api/emar/administrations` - تصفية عمليات إعطاء الجرعات بـ `tenant_id`.
20. `POST /api/emar/administrations` - التحقق من المريض والأمر قبل إدخال تنفيذ الجرعة وختمهما بالـ `tenant_id`.

---

### 2. التدابير الأمنية المفروضة (Enforced Security Controls)

* **البرمجية الوسيطة `requireTenantScope`**: تم تفعيلها على جميع المسارات الـ 20 لضمان صحة سياق الجلسة البرمجي للـ DB ومنع الاستدعاءات مجهولة المصدر.
* **منع التعديل الجماعي وحقن الهوية (Mass Assignment Prevention)**: يتم استخلاص `tenantId` و `facilityId` قسرياً من الجلسة وتمريرهما كمعاملات استعلامية آمنة ($N)، مع تجاهل أي قيم مرسلة في جسم الطلب (`req.body`).
* **مكافحة ثغرات الـ IDOR**: في حال محاولة قراءة أو إدخال سجل مرتبط بمريض أو تنويم من مستأجر آخر، يقوم الخادم بإرجاع `404 Not Found` قسرياً لحظر اكتشاف السجلات.
