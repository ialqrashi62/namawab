# تقرير استكشاف هيكل جدول التقييمات التمريضية - موديول التقييمات التمريضية (Schema Discovery Report)
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير الفحص الهيكلي التفصيلي لجدول تقييمات التمريض `nursing_assessments` بقاعدة البيانات، والربط البرمجي في خادم الويب، ودراسة نطاقات وأبعاد عزل مستأجري الـ SaaS.

---

### 1. الأعمدة والهيكل الفعلي لجدول تقييمات التمريض (Database Schema)

من خلال فحص كتالوجات وميتا-داتا قاعدة البيانات لبيئة Staging، يمتلك جدول `nursing_assessments` الهيكل الحالي التالي:

| اسم العمود | نوع البيانات (Data Type) | يقبل NULL (Nullable) | الوصف والدور |
| :--- | :--- | :---: | :--- |
| `id` | `integer` | **NO** (Primary Key) | المعرّف الفريد التلقائي للتقييم. |
| `patient_id` | `integer` | **YES** (Foreign Key) | معرّف المريض (رابط مباشر مع جدول `patients`). |
| `patient_name` | `character varying` | **YES** | اسم المريض وقت كتابة التقييم. |
| `assessment_type` | `character varying` | **YES** | نوع التقييم (مثال: General, General Assessment). |
| `fall_risk_score` | `integer` | **YES** | تقييم خطر السقوط. |
| `braden_score` | `integer` | **YES** | مقياس برادن لتقييم قرح الفراش. |
| `pain_score` | `integer` | **YES** | مقياس الألم للمريض. |
| `gcs_score` | `integer` | **YES** | مقياس غلاسكو للوعي. |
| `nurse` | `character varying` | **YES** | اسم الممرض كاتب التقييم (مسترجع من الجلسة). |
| `shift` | `character varying` | **YES** | نوبة العمل (مثال: Morning, Evening, Night). |
| `notes` | `text` | **YES** | الملاحظات الكلينيكالية التفصيلية للتمريض. |
| `created_at` | `timestamp` | **YES** | تاريخ ووقت إنشاء التقييم. |
| `updated_at` | `timestamp` | **YES** | تاريخ ووقت آخر تعديل للتقييم. |

---

### 2. علاقات الجدول والروابط والبيانات الحالية (Relationships & Integrity Check)

* **الروابط المتوفرة**:
  - يحتوي الجدول على `patient_id` كرابط مباشر مع جدول المرضى `patients`.
  - لا يحتوي الجدول على معرّف التنويم `admission_id` أو معرّف الممرض `user_id/nurse_id` أو معرّف المنشأة `facility_id` أو معرّف الفرع `branch_id`.
* **معرّف المستأجر (`tenant_id`)**:
  - الجدول **يفتقر تماماً** لوجود عمود `tenant_id` أو `facility_id`.
* **البيانات الحالية بقاعدة البيانات**:
  - يحتوي جدول `nursing_assessments` على **0 سجلات** حالياً في بيئة Staging، مما يسهل كثيراً عمليات الهجرة المستقبلية وتعبئة البيانات دون مخاطر تعارض أو فقدان للسجلات الحيوية.

---

### 3. الاستخدام والمسارات البرمجية الحالية (API Usage)

* يتم استخدام الجدول في مسارين برمجين نشطين في `server.js`:
  - `GET /api/nursing/assessments`: يسترجع قائمة التقييمات، وتم عزلها في المرحلة السابقة برمجياً بالربط مع المرضى:
    `SELECT a.* FROM nursing_assessments a JOIN patients p ON a.patient_id = p.id WHERE p.tenant_id = $1`
  - `POST /api/nursing/assessments`: ينشئ تقييماً تمريضياً جديداً، ويتم التحقق مسبقاً من ملكية المريض للمستأجر قبل الإدراج.
* **الاستنتاج**: يمكن إحكام وعزل الجدول بالكامل عن طريق الربط المباشر بـ `patient_id` واشتقاق المستأجر منه برمجياً لحين تعديل المخطط.

**حالة البوابة 1**: **PASS**
