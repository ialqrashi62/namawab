# سجل التغييرات (Change Register)

سجل بكافة الملفات المضافة خلال موجة تأمين الكوارث والجاهزية للربط:

| الملف | الإجراء | الوصف |
|---|---|---|
| `docs/runbooks/nama_security_incident_runbook_ar.md` | إضافة | دليل الاستجابة للحوادث الأمنية والتشغيلية (Redis, Docker, KEK, Cross-Tenant). |
| `docs/runbooks/nama_kek_escrow_dr_plan_ar.md` | إضافة | دليل حفظ واستعادة مفتاح التشفير KEK واستعادة الكوارث. |
| `docs/runbooks/nama_mirth_integration_adr_ar.md` | إضافة | مستند القرار المعماري لاعتماد Mirth Connect كخادم تكامل معزول. |
| `docs/runbooks/nama_fhir_sandbox_blueprint_ar.md` | إضافة | مخطط تحويل وهيكلة البيانات لـ FHIR Sandbox المحلي. |
| `public/js/app.js` | تعديل | إصلاح توازن الأقواس وحذف الأخطاء البرمجية المانعة لتحميل واجهة لوحة التحكم، وإصلاح عرض أسماء المرضى باللغتين في قائمة الانتظار. |
| `public/index.html` | تعديل | تحديث رقم نسخة وسم الـ script لـ app.js لكسر التخزين المؤقت (Cache Busting) في Cloudflare إلى النسخة v20260705_2. |
| `migrations/e3_01_lab_samples_up.sql` | تعديل | تصحيح الجدول عبر إسقاطه قبل الإنشاء لتجنب تعارض الأعمدة المكررة. |
| `migrations/e14_ob_maternity_up.sql` | تعديل | إصلاح قيد NOT NULL وتحديث tenant_id مع فرض مفتاح أجنبي للربط بالمرضى والمستأجرين. |
| `migrations/e15_pathology_01_specimens_blocks_slides_reports_up.sql` | تعديل | إزالة قيد المفتاح الأجنبي المشير لجدول visits غير الموجود بالنظام من عمود visit_id. |
| `migrations/ex_03_tenant_id_indexes_up.sql` | تعديل | إزالة الفهارس المرتبطة بجداول غير موجودة أو خالية من عمود tenant_id. |
| `migrations/p1_05_waiting_queue_acuity_up.sql` | إضافة | ملف هجرة لترقية وتحديث جدول قائمة الانتظار بالفرز والأولوية ESI و RLS. |
| `migrations/p1_05_waiting_queue_acuity_down.sql` | إضافة | ملف هجرة تراجعي للتراجع عن ترقيات جدول قائمة الانتظار. |
| `migrations/p1_05_waiting_queue_acuity_validate.sql` | إضافة | ملف تحقق تلقائي من نجاح ترقيات وهجرات قائمة الانتظار. |
| `server.js` | تعديل | تحديث مسارات الـ API (GET, checkin, status, triage, call) وإصلاح قيود تسجيل الوصول الاعتيادي. |
| `public/js/app.js` | تعديل | تطوير شاشة قائمة الانتظار بالكامل، وإضافة ألوان ESI، والنوافذ المنبثقة، والنداء الصوتي الذكي. |
| `public/index.html` | تعديل | ترقية كسر كاش app.js إلى v20260705_3. |
| `DEPLOY_RUN.sh` | تعديل | تضمين هجرة قائمة الانتظار p1_05 في دورة التشغيل والتحقق التلقائي. |
| `waiting_queue_acuity_test.js` | إضافة | اختبار اندماجي متكامل للتحقق التلقائي من مسارات وأولوية قائمة الانتظار. |

