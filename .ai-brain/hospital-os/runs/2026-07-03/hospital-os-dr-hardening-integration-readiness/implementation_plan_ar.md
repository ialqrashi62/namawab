# خطة تطوير قائمة الانتظار الذكية (Acuity-Based Waiting Queue Implementation Plan)

توضح هذه الخطة التفاصيل البرمجية الكاملة، الجداول، والتغييرات التي قمنا بتنفيذها بنجاح لتطوير قائمة الانتظار الذكية المبنية على الفرز الطبي والأولويات (Acuity-based Waiting Queue) في قاعدة البيانات والـ Backend والـ Frontend.

---

## 1. التغييرات التي تم تنفيذها (Implemented Changes)

### قاعدة البيانات (PostgreSQL Migrations)
* **[NEW]** [p1_05_waiting_queue_acuity_up.sql](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/migrations/p1_05_waiting_queue_acuity_up.sql)
  * إضافة أعمدة للفرز الطبي `triage_level` و `acuity_notes` ورقم الغرفة `exam_room_id` في جدول `waiting_queue`.
  * إضافة قيود التحقق للحالات `CheckedIn`, `Triage`, `WaitingForProvider`, `InConsultation`, `WaitingForResults`, `ReadyForDischarge`, `NoShow`.
  * إنشاء وجلب جدول دورة الزيارة `visit_lifecycle` لضمان تسجيل وصول المواعيد دون أخطاء.
  * تفعيل سياسة RLS لضمان العزل التام للمستأجرين على الجداول المحدثة.
* **[NEW]** [p1_05_waiting_queue_acuity_down.sql](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/migrations/p1_05_waiting_queue_acuity_down.sql)
  * التراجع عن الإضافات السابقة.
* **[NEW]** [p1_05_waiting_queue_acuity_validate.sql](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/migrations/p1_05_waiting_queue_acuity_validate.sql)
  * التحقق التلقائي من وجود الجداول، الأعمدة الجديدة، قيود الفحص، وسياسة RLS.

### خادم الخلفية (Backend - server.js)
* **[MODIFY]** [server.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/server.js)
  * تحديث مسارات الـ API:
    * `GET /api/queue/patients`: استرجاع الطابور مرتباً حسب مستوى الفرز والأولوية ووقت الوصول مع تصفية المستأجر (`tenant_id`).
    * `POST /api/queue/checkin`: تسجيل وصول مريض جديد للطابور.
    * `PUT /api/queue/:id/triage`: تحديث العلامات الحيوية ودرجة الفرز الطبي.
    * `PUT /api/queue/:id/status`: لتحديث حالة تتبع المريض.
    * `PUT /api/queue/:id/call`: نداء المريض وإطلاق إشارات الـ SSE.
  * إصلاح استعلام تحديث تسجيل وصول المواعيد `/api/appointments/:id/checkin` لحل الأخطاء 500 نهائياً.

### واجهة المستخدم (Frontend - app.js & index.html)
* **[MODIFY]** [app.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/public/js/app.js)
  * تحديث شاشة قائمة الانتظار `renderWaitingQueue`:
    * عرض المرضى مرتبين بالأولويات وتلوين مستويات الفرز (ESI 1-5) بألوان واضحة (أحمر، برتقالي، أخضر) باستخدام بطاقات Glassmorphism.
    * إضافة أزرار تفاعلية للتحكم: نداء، فرز، دخول العيادة، تعليق للنتائج، وخروج.
    * إتاحة شاشة منبثقة (Modal) لإدخال بيانات الفرز الطبي مباشرة وتوجيه المريض.
    * إطلاق النداء الصوتي للمريض بالمتصفح بلغة الواجهة الحالية.
  * تحديث نسخة الكاش في `index.html` لتصبح `v=20260705_3`.

---

## 2. خطة التحقق والاعتماد المنجزة (Completed Verification Plan)

### الاختبارات التلقائية (Automated Tests)
* إنشاء وتشغيل اختبار اندماجي جديد [waiting_queue_acuity_test.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/waiting_queue_acuity_test.js) للتحقق من:
  * الفرز الصحيح للطابور حسب مستوى الفرز ESI (مستوى 1 أولاً، ثم مستوى 2... إلخ).
  * عمل مسارات الـ API بشكل سليم وتوافق القيود البرمجية.
  * النتيجة: **PASS 100%**

### التحقق اليدوي والمرئي (Manual Verification)
* تصفح قائمة الانتظار وإجراء عمليات فرز طبي، ومناداة المريض، ورؤية تحديث الحالات والألوان على خادم الإنتاج بنجاح وتوثيقها بالصور والفيديو في الـ AI Brain.
