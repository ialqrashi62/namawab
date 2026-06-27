# تقرير مراجعة أمان نهايات الـ API - موديول العمليات وغرف العمليات
## نظام نما الطبي (NamaMedical) - بيئة Staging

يوثق هذا التقرير نتائج التدقيق والمراجعة الأمنية الشاملة لنهايات الواجهة البرمجية (API Security Review) المتعلقة بجدولة العمليات الجراحية، تقييمات ما قبل الجراحة، سجلات التخدير، غرف العمليات، ونماذج الموافقات الطبية.

---

### 1. نهايات الـ API المؤمنة بنجاح (Secured API Endpoints)

تم التحقق من أن النهايات التالية في [server.js](namaweb/server.js) قد تم تحصينها بالكامل عبر نظام عزل المستأجرين البرمجي (`requireTenantScope`):

1. **`GET /api/surgeries`**: جلب العمليات الجراحية المفلترة بـ `tenant_id` لقفل نطاق الرؤية.
2. **`GET /api/surgeries/:id`**: استرجاع تفاصيل العملية مع منع ثغرة IDOR والتحقق من الهوية.
3. **`POST /api/surgeries`**: إنشاء عملية جديدة وختمها تلقائياً بمعرف المستأجر من الجلسة ومطابقة المريض.
4. **`PUT /api/surgeries/:id`**: تحديث حالة العملية مقيداً بـ `tenant_id`.
5. **`DELETE /api/surgeries/:id`**: إلغاء السجل مقيداً بـ `tenant_id`.
6. **`GET /api/surgeries/:id/preop`** & **`POST /api/surgeries/:id/preop`**: إدارة وتعديل تقييم التحضير مقيداً بـ `tenant_id` والتحقق من ملكية العملية.
7. **`GET /api/surgeries/:id/preop-tests`** & **`POST /api/surgeries/:id/preop-tests`**: إدارة الفحوصات الجراحية مع التحقق من ملكية العملية.
8. **`PUT /api/surgery-preop-tests/:id`**: تحديث حالة الفحص الجراحي الفردي مع حماية IDOR.
9. **`GET /api/surgeries/:id/anesthesia`** & **`POST /api/surgeries/:id/anesthesia`**: إدارة سجل التخدير مقيداً بـ `tenant_id`.
10. **`GET /api/operating-rooms`** & **`POST /api/operating-rooms`**: إدارة غرف العمليات وعزلها بالكامل للمستأجر والفرع.

---

### 2. الفجوات الأمنية المكتشفة (Discovered Security Gaps)

أثناء المراجعة البرمجية الدقيقة لملف [server.js](namaweb/server.js)، تم اكتشاف **فجوة أمنية خطيرة جداً (P1 Vulnerability)** في نهايات الموافقات الطبية (`consent_forms`):

* **نهايات الـ API المصابة**:
  - `GET /api/consent-forms`
  - `POST /api/consent-forms`
  - `GET /api/consent-forms/:id`
  - `PUT /api/consent-forms/:id/sign`
  - `GET /api/consent-forms/render/:type`
* **طبيعة الثغرة (Vulnerability Details)**:
  - هذه المسارات **لا تستخدم** الوسيط الأمني `requireTenantScope` الفعال، وتكتفي فقط بـ `requireAuth` (أي مستخدم مسجل الدخول، حتى لو كان يتبع منشأة طبية منافسة، يمكنه تصفحها).
  - الاستعلامات البرمجية لا تصفّي النتائج بمعرف المستأجر `tenant_id`؛ مما يسمح بسحب كافة الموافقات الموقعة في النظام، أو تمرير `patient_id` عشوائي لسحب تواقيع وخصوصيات مرضى آخرين (IDOR).
  - عملية الـ POST لا تتحقق من هوية المريض أو العملية وتختم الموافقات دون تثبيت `tenant_id` الفعلي من الجلسة.

---

### 3. مصفوفة القرارات لتأمين المسارات (API Security Decision Matrix)

| نهاية الواجهة (API Endpoint) | الحالة الحالية للأمان | القرار الأمني المعتمد | الإجراء المقترح للحل (Proposed Fix) |
| :--- | :---: | :---: | :--- |
| جميع مسارات الجراحة وغرف العمليات (10 مسارات) | محصنة | **ALREADY_ENABLED** | الإبقاء عليها ومراقبة استقرارها. |
| `GET /api/consent-forms` | غير محصنة | **NEEDS_API_FIX** | إضافة `requireTenantScope` وتصفية قاعدة البيانات بـ `tenant_id` المستخلص من الجلسة. |
| `POST /api/consent-forms` | غير محصنة | **NEEDS_API_FIX** | إضافة `requireTenantScope` وختم `tenant_id` و `facility_id` قسرياً من الجلسة ومطابقة المريض. |
| `GET /api/consent-forms/:id` | غير محصنة | **NEEDS_API_FIX** | إضافة `requireTenantScope` والتحقق من ملكية السجل `WHERE id=$1 AND tenant_id=$2`. |
| `PUT /api/consent-forms/:id/sign` | غير محصنة | **NEEDS_API_FIX** | إضافة `requireTenantScope` وحماية IDOR للتواقيع المضافة. |
| `GET /api/consent-forms/render/:type` | غير محصنة | **NEEDS_API_FIX** | إضافة `requireTenantScope` والتحقق من هوية المريض قبل ملء النموذج ورقمنة البيانات. |

---

### 4. التوصية للمرحلة القادمة (Recommendation)

* **التقييم العام للواجهة**: **WARNING** (وجود ثغرات غير معزولة في الموافقات الطبية).
* **التوجيه الفني**: يجب إدراج تحصين مسارات الموافقات الطبية الـ 5 كأولوية قصوى وبوابة أمان إلزامية (Security Gate) تزامناً مع تفعيل RLS لقاعدة البيانات في المرحلة القادمة.
