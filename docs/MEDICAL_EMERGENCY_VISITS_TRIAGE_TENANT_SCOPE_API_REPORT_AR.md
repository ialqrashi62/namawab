# تقرير تطبيق عزل المستأجرين على مسارات زيارات الطوارئ والفرز الطبي (Emergency Visits & Triage Tenant Scope API Report)

وثيقة سرية لتوثيق إجراءات الحماية والخصوصية ومنع ثغرات IDOR وتكامل المستأجرين لنظام نما الطبي (NamaMedical) - قسم الطوارئ.

---

## 1. الملخص التنفيذي (Executive Summary)

تم بنجاح إتمام مرحلة عزل مسارات زيارات الطوارئ (Emergency Visits) والفرز الطبي (Triage) والعلامات الحيوية المستعجلة (Triage Vitals) وتوزيع أسرة الطوارئ (Emergency Beds) وتقييمات الحوادث الجسيمة (Trauma Assessments) في خادم Express.js.
أثبتت الاختبارات البرمجية والأمنية المحلية نجاحاً كاملاً بنسبة 100% (41/41 اختباراً) دون إدخال أي تعديلات مدمرة على قاعدة البيانات، ودون أي تأثير على عمل بيئة الإنتاج الفعلي.

---

## 2. نطاق المرحلة (Phase Scope)

اقتصر نطاق هذه المرحلة بدقة على تأمين وعزل مسارات قسم الطوارئ والفرز الطبي:
* **إنشاء وعرض وتعديل وتحديث حالة زيارات الطوارئ** (Emergency Visits).
* **تسجيل العلامات الحيوية المستعجلة والفرز الطبي** (Triage & Vitals).
* **تصفية إحصائيات وأسرة الطوارئ** (Emergency Beds & Stats).
* **تسجيل تقييمات الحوادث الجسيمة** (Trauma Assessments).
* **التحقق من تبعية المرضى والأسرة والزيارات للمستأجر الحالي** لمنع ثغرات الـ IDOR.

### لماذا تم فصل الطوارئ عن التنويم والعمليات؟
* **الحالات الحرجة والسرعة**: طبيعة الحالات الطارئة تطلب وصولاً سريعاً ومعاينة فورية لا تمر بتدفقات التنويم الداخلي الطويل وتجهيز غرف العمليات المعقدة.
* **فصل موارد الأسرة**: أسرة الطوارئ تمثل موارد معزولة مؤقتة في الصالات العاجلة، بينما غرف التنويم والأسرة العادية تتبع الأجنحة والأقسام؛ لذا تم فصل عزل أسرة الطوارئ عن أسرة الأقسام تجنباً لأي تداخل تشغيلي.
* **إدارة الحوادث**: تقييمات الحوادث الجسيمة والفرز ترتبط بالدخول الفوري للمريض من بوابة الإسعاف وتخضع لنظام فرز كندي أو قياسي خاضع لعلامات حيوية عاجلة فقط.

---

## 3. الملفات التي تم فحصها وتعديلها (Checked & Modified Files)

* **الملفات المفحوصة**:
  * [server.js](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/namaweb/server.js) — فحص وتحديد مسارات الطوارئ والفرز ونقاط تسجيل العلامات الحيوية.
  * [db_postgres.js](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/namaweb/db_postgres.js) — تأكيد عدم إجراء أي تعديلات إنشائية.
* **الملفات المعدلة**:
  * [server.js](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/namaweb/server.js) — عزل النهايات البرمجية وتكامل فلاتر `tenant_id` والتحقق من السياقات الأمنية.
* **الملفات الجديدة**:
  * [cross_tenant_emergency_test.js](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/namaweb/cross_tenant_emergency_test.js) — سكربت اختبار محلي شامل للتحقق الأمني والوظيفي.

---

## 4. تفاصيل المسارات المؤمنة والاستعلامات (Secured Routes & SQL Queries)

تم تأمين نهايات المسارات الـ 8 التالية بفرض ميدل وير `requireTenantScope` وفلاتر العزل:

| اسم المسار (Route) | نوع العملية | الجداول المستخدمة | مستوى الخطر | فلتر المستأجر المطبق |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/emergency/visits` | قراءة | `emergency_visits` | P1 | `tenant_id = $1` |
| `GET /api/emergency/visits/:id` | قراءة تفصيلية | `emergency_visits` | P1 | `WHERE id = $1 AND tenant_id = $2` (IDOR Prevention) |
| `POST /api/emergency/visits` | إنشاء | `emergency_visits`, `patients`, `emergency_beds` | P0 | ختم `tenant_id`/`facility_id` والتحقق من تبعية المريض والسرير |
| `PUT /api/emergency/visits/:id` | تعديل | `emergency_visits`, `emergency_beds` | P0 | التحقق من ملكية الزيارة أولاً، ثم التحديث بشرط `tenant_id` |
| `GET /api/emergency/beds` | قراءة | `emergency_beds` | P2 | `tenant_id = $1` |
| `GET /api/emergency/stats` | قراءة | `emergency_visits`, `emergency_beds` | P2 | تصفية كافة استعلامات التجميع بـ `tenant_id = $1` |
| `POST /api/emergency/trauma/:visitId` | إنشاء | `emergency_trauma_assessments`, `emergency_visits`, `patients` | P1 | التحقق من الزيارة والمريض، وختم `tenant_id`/`facility_id` |
| `POST /api/nursing/triage` | إنشاء | `visit_lifecycle`, `nursing_vitals`, `patients`, `emergency_visits` | P1 | التحقق من المريض والزيارة، وتحديث العلامات الحيوية بـ `tenant_id` |

### الاستعلامات المؤجلة (Deferred Queries)
* **سجل دورة زيارات المرضى المشترك**: جدول `visit_lifecycle` لا يحتوي على عمود `tenant_id` ولكنه مؤمن بالكامل عن طريق التحقق من ملكية `visit_id` في جدول `emergency_visits` التابع للمستأجر قبل إجراء أي تحديث لـ triage.

---

## 5. نتائج الاختبارات ومنع التسريب (Leak Prevention Test Results)

تم تشغيل الاختبار الأمني [cross_tenant_emergency_test.js](file:///c:/Users/1/Desktop/11/مجلد%20جديد/NamaMedical/namaweb/cross_tenant_emergency_test.js) محلياً، وجاءت النتيجة كالتالي:

* **إجمالي الاختبارات المجرية**: 41 اختباراً.
* **الاختبارات الناجحة**: 41 اختباراً.
* **الاختبارات الفاشلة**: 0.
* **أبرز النقاط المؤكدة في الاختبارات**:
  1. التحقق من تطبيق `requireTenantScope` على كافة نهايات مسارات الطوارئ والفرز الـ 8.
  2. منع مستأجر 1 من جلب قائمة زيارات أو أسرة طوارئ مستأجر 2.
  3. منع مستأجر 1 من عرض تفاصيل زيارة طوارئ أو تسجيل تقييمات حوادث تخص مستأجر 2 (حماية IDOR).
  4. منع مستأجر 1 من تعديل أو تحديث triage لمرضى وزيارات تخص مستأجر 2.
  5. منع مستأجر 1 من إنشاء زيارات طوارئ لمرضى يتبعون مستأجرين آخرين.
  6. حظر الطلبات المجهولة السياق في بيئة الإنتاج بـ 403 Forbidden.

### نتائج الفحوصات النحوية والتشغيلية:
* تشغيل `node --check namaweb/server.js` 👈 **ناجح (صحيح نحوياً)**.
* تشغيل `node --check namaweb/db_postgres.js` 👈 **ناجح (صحيح نحوياً)**.

---

## 6. المخاطر المتبقية (Remaining Risks)

1. **التحويل غير المؤمن من الطوارئ للتنويم الداخلي**: تكامل تحويل زيارات الطوارئ إلى تنويم داخلي Admissions يحتاج لمزيد من الفحوصات لضمان عدم حدوث تسريب في حال استدعاء نهايات مسارات التنويم القديمة، على الرغم من تأمين التنويم الداخلي بالكامل في المرحلة السابقة.
2. **غياب RLS (Row Level Security)**: العزل يتم برمجياً فقط في طبقة الـ Express API، وهو ما يستدعي عدم الثقة الكاملة في العزل في حال استهداف قاعدة البيانات بشكل مباشر.
3. **غياب E2E كامل للواجهات**: لم يتم إجراء اختبار E2E للواجهات المرئية لقسم الطوارئ بعد.

---

## 7. توصية المرحلة التالية (Next Phase Recommendation)

* **اسم المرحلة الموصى بها**: Pharmacy & Inventory Reports Tenant Scope Implementation.
* **الهدف**: تطبيق فلاتر العزل `tenant_id`/`facility_id` على مسارات تقارير الصيدلية وجرد المخزون الطبي وحركات الاستهلاك المالي والتحليل الاستراتيجي للمستودع الطبي، لمنع تسريب المبيعات والتكلفة وأرصدة الصيدليات بين الفروع والمستأجرين.

---

### قرار الإغلاق (Closeout Status)

STATUS:
MEDICAL_EMERGENCY_VISITS_TRIAGE_TENANT_SCOPE_API_COMPLETED

PRODUCTION_TOUCHED:
NO

DB_CHANGED:
NO

MIGRATIONS_RUN:
NO

RLS_ENABLED:
NO

NOT_NULL_ENFORCED:
NO

FILES_CHANGED:
- namaweb/server.js (تأمين نهايات مسارات الطوارئ والفرز والعلامات الحيوية)
- namaweb/cross_tenant_emergency_test.js (سكربت الاختبارات الأمنية)

TESTS_RUN:
- node --check namaweb/server.js
- node --check namaweb/db_postgres.js
- node namaweb/cross_tenant_emergency_test.js (41/41 PASS)

REPORTS_CREATED:
- docs/MEDICAL_EMERGENCY_VISITS_TRIAGE_TENANT_SCOPE_API_REPORT_AR.md
