# تقرير مراجعة أمن نهايات الـ API - موديول التقييمات التمريضية (API Security Review)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير المراجعة الأمنية الشاملة للمسارات البرمجية (Routes) المتعلقة بجدول التقييمات التمريضية `nursing_assessments` والتحقق من آليات منع الـ IDOR والـ Mass Assignment.

---

### 1. تحليل نهايات الـ API المفحوصة (API Endpoints Analysis)

تم فحص الكود الحالي في ملف `server.js` وتوثيق حالته الأمنية كالتالي:

#### أولاً: مسار جلب قائمة التقييمات التمريضية
* **الـ Route**: `GET /api/nursing/assessments`
* **البرمجية الوسيطة الحامية**: `requireAuth, requireTenantScope`.
* **طريقة الفلترة الحالية**:
  يتم استخدام استعلام ربط (`JOIN`) مع جدول المرضى لفلترة السجلات بـ `tenant_id` للجلسة:
  ```javascript
  SELECT a.* FROM nursing_assessments a 
  JOIN patients p ON a.patient_id = p.id 
  WHERE p.tenant_id = $1 
  ORDER BY a.created_at DESC LIMIT 50
  ```
* **أثر تفعيل RLS مستقبلاً**: لن ينكسر هذا المسار، ولكن يمكن تبسيطه وأتمتته بالفلترة المباشرة على حقل `tenant_id` الجديد دون الحاجة لـ `JOIN`.

#### ثانياً: مسار إدراج تقييم تمريضي جديد
* **الـ Route**: `POST /api/nursing/assessments`
* **البرمجية الوسيطة الحامية**: `requireAuth, requireTenantScope`.
* **طريقة التحقق الحالية**:
  قبل الإدخال، يتم فحص المريض الممرر في معطيات الطلب الموجه للتأكد من انتمائه لمستأجر الجلسة الحالي:
  ```javascript
  const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);
  if (patientCheck.rows.length === 0) return res.status(404).json({ error: 'Patient not found' });
  ```
* **أثر تفعيل RLS مستقبلاً**: عند تفعيل RLS، يجب تعديل جملة الإدخال (`INSERT`) لتشمل ختم أعمدة `tenant_id` و `facility_id` المستمدة من الجلسة الآمنة مباشرة، وإلا سيقوم محرك قاعدة البيانات بحظر عملية الإدراج لمخالفتها لسياسة RLS.

---

### 2. تدقيق منع ثغرات الـ Mass Assignment والـ IDOR

* **الـ Mass Assignment**: الـ API لا يقبل ولا يقرأ حقول المستأجر أو المنشأة الطبية من واجهة المستخدم، ويتم فرضها داخلياً عبر الجلسة الآمنة.
* **الـ IDOR**: يتم منع الوصول العشوائي للمرضى عبر إرجاع رمز الخطأ `404` عند محاولة استخدام مريض يتبع مستأجر آخر، مما يضمن أمان المريض وسرية بياناته بالكامل.

**حالة البوابة 7**: **PASS**
