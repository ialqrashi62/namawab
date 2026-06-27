# تقرير مراجعة أمان النهايات والواجهات البرمجية - الدفعة الثانية (API Security Review)
## نظام نما الطبي (NamaMedical) - بيئة Staging

مراجعة أمنية شاملة لنهايات المسارات الحالية (Endpoints) في `server.js` المتعلقة بالتنويم والتحويلات والـ Discharge، مع تحديد الثغرات المحتملة والوقاية منها.

---

### 1. النهايات الطبية الخاضعة للمراجعة (Reviewed Endpoints)
شملت المراجعة الأمنية المسارات التالية في خادم التطبيق `server.js`:
- `GET /api/admissions` (جلب سجلات التنويم).
- `GET /api/admissions/:id` (تفاصيل تنويم محدد).
- `POST /api/admissions` (إنشاء سجل تنويم جديد).
- `PUT /api/admissions/:id/discharge` (تأكيد خروج المريض).
- `POST /api/admissions/:id/rounds` (إضافة جولة الطبيب اليومية).
- `GET /api/admissions/:id/rounds` (جلب الجولات اليومية للتنويم).
- `POST /api/bed-transfers` (تحويل المريض لسرير آخر).

### 2. مصفوفة أمان المسارات وجودة الحماية (API Security Status)

| المسار (API Endpoint) | برمجيات الحماية النشطة (Middlewares) | الحماية من IDOR (IDOR Defenses) | ختم المستأجر (Tenant Stamping) | تقييم الأمان (Security Assessment) |
| :--- | :--- | :--- | :--- | :---: |
| **`GET /api/admissions`** | `requireAuth`, `requireTenantScope` | مصفى بالكامل بـ `tenant_id` من سياق الطلب. | لا يوجد (استرجاع فقط) | **SECURE** |
| **`GET /api/admissions/:id`** | `requireAuth`, `requireTenantScope` | التحقق من ملكية السجل وتطابق معرف المستأجر. | لا يوجد (استرجاع فقط) | **SECURE** |
| **`POST /api/admissions`** | `requireAuth`, `requireTenantScope` | فحص ملكية المريض والسرير والجناح للمستأجر الحالي. | يختم `tenant_id` و `facility_id` من الجلسة. | **SECURE** |
| **`PUT /api/admissions/:id/discharge`** | `requireAuth`, `requireTenantScope` | تحديث مقيد بـ `tenant_id` من سياق الجلسة. | لا يوجد (تحديث حالة) | **SECURE** |
| **`POST /api/bed-transfers`** | `requireAuth`, `requireTenantScope` | فحص ملكية الأسرة والأجنحة والتنويم المعني. | يختم `tenant_id` و `branch_id` من الجلسة. | **SECURE** |

### 3. تدابير الحماية والتحسين الموصى بها (Recommended Security Hardening)
1. **التحقق المعزز للـ IDOR**:
   - لضمان عدم تسريب البيانات، يجب في كافة مسارات التحديث (UPDATE) أو الإدراج (INSERT) التوثق البرمجي المزدوج من ملكية السجل المعني للمستأجر من سياق معاملة قاعدة البيانات.
2. **عزل سياق النهايات العامة**:
   - تم التأكد من أن نهايات المسارات لا تقبل إدراج `tenant_id` أو تعديله بشكل مباشر من خلال Request Body، بل تعتمد حصرياً على `req.tenantId` المستخرج من مصادقة الجلسة الآمنة.
3. **مراقبة السجلات للتحويلات**:
   - يجب تسجيل عمليات التحويل الداخلي للأسرة والـ Discharge في سجلات الحوكمة وتدقيق الأمان (Audit Logging) باستخدام وظيفة `logAudit` المعتمدة لمنع التلاعب وتتبع حركات المرضى.
