# تصميم تكامل قراءة audit_trail للسوبر أدمن تحت RLS (Runtime Integration Design)

> المرحلة: `P1_AUDIT_TRAIL_SUPER_ADMIN_RUNTIME_INTEGRATION_CANDIDATE` | التاريخ: 2026-06-21 | candidate فقط — لا DDL/GRANT/deploy على الإنتاج.

## السياق
الدور `nama_audit_reader` (NOLOGIN/NOSUPER/NOBYPASSRLS، SELECT فقط) + سياسة `audit_trail_select_superadmin` (TO nama_audit_reader USING true) مطبَّقان إنتاجياً وخاملان. المطلوب: مسار runtime محكوم لقراءة super-admin العابرة للمستأجر.

## مقارنة الخيارات
| المعيار | A — اتصال login منفصل | B — GRANT + SET ROLE (موصى) | C — SECURITY DEFINER function |
| --- | --- | --- | --- |
| security | عالٍ (عزل اتصال) | جيد (مشروط ببوابة التطبيق) | عالٍ (واجهة ضيقة) لكن خطر search_path |
| tenant isolation | لا تأثير على دور التطبيق | التطبيق يكتسب القدرة (خلف SET ROLE فقط) | لا تأثير |
| blast radius | منخفض | متوسط (لو ثغرة بالتطبيق ⇒ SET ROLE) | منخفض-متوسط |
| operational complexity | يحتاج اتصال/تجمّع ثانٍ + سر | الأدنى (نفس الـ pool عبر SET ROLE/RESET) | كتابة function آمنة + صيانة |
| secret management | **سر جديد لازم** (خارج الشات) | لا سر جديد | لا سر جديد |
| rollback | حذف الاتصال/السر | `REVOKE nama_audit_reader FROM nama_medical_app` | DROP FUNCTION |
| auditability | اتصال مستقل واضح | يتطلب تسجيل كل SET ROLE + سبب | استدعاء الدالة قابل للتسجيل |

## الاختيار المبدئي: **B** (GRANT + SET ROLE خلف تفويض super-admin)
الأسباب: لا سر جديد، أقل تعقيد تشغيلي، rollback لحظي (REVOKE)، يعيد ضبط الدور داخل نفس الطلب. **الشرط الإلزامي**: بوابة `requireSuperAdmin` (role==='Admin') + `SET ROLE nama_audit_reader` داخل **معاملة** ثم `RESET ROLE`/COMMIT حصراً في مسار القراءة العام، مع تسجيل audit للوصول. **لا يُنفَّذ GRANT على الإنتاج في هذه المرحلة** (candidate فقط).

تنبيه على B: منح العضوية يمنح دور التطبيق قدرة SET ROLE؛ التخفيف = البوابة على مستوى التطبيق + اقتصار SET ROLE على المسار الواحد + إعادة الضبط داخل المعاملة + عدم قبول tenant_id من body. إن رغب المالك بأقصى تحفّظ ⇒ الخيار A (اتصال/سر منفصل).

### 🔴 اكتشاف بروفة حاسم: `WITH INHERIT FALSE` إلزامي
البروفة الأولى لخيار B بمنح عادي **فشلت 3/6**: `GRANT nama_audit_reader TO nama_medical_app` (بالوراثة الافتراضية) يجعل سياسة `audit_trail_select_superadmin` (المقيّدة TO nama_audit_reader) **تنطبق على nama_medical_app مباشرةً** (لأنه عضو وارث) ⇒ **كل استعلامات التطبيق العادية على audit_trail ترى كل المستأجرين** (انكسار عزل: العدد العادي = 4 بدل 2).

**الإصلاح**: `GRANT nama_audit_reader TO nama_medical_app WITH INHERIT FALSE` (PostgreSQL 16+). عندها لا وراثة تلقائية، وتنطبق سياسة القارئ **فقط** بعد `SET ROLE` صريح. بعد الإصلاح: البروفة **6/6 PASS** — المسار العادي معزول (=2)، SET LOCAL ROLE يعطي قراءة عابرة (=4)، إعادة ضبط تلقائية بعد COMMIT (لا تسرّب)، القارئ read-only وبلا وصول لـpatients. (المرشّح والـvalidate حُدِّثا ليفرضا INHERIT FALSE والتحقق من inherit_option=false.)

### درس عام (R17)
أدوار PostgreSQL عنقودية؛ البروفة استخدمت أسماء `reh_*` فقط (لا `nama_*`) لأن `nama_audit_reader` موجود إنتاجياً، وأي `DROP ROLE nama_audit_reader` في بروفة كان سيُسقط دور الإنتاج. التنظيف `finally` دائم.

## ⚠️ اكتشاف حوكمة حرج (تشعّب فرعَي namaweb — R17)
فرع namaweb المنشور (**039a7d7**، عمل الجلسة الموازية) **لا يتضمّن commits الأمنية الخاصة بي** (`10ded01` ختم logAudit، `6ecbf4a` ختم blood-bank، `082c07b`...). `10ded01` موجود ككائن لكنه **ليس سلفاً** لـ039a7d7.

النتائج المؤكَّدة على الكود المنشور 039a7d7:
1. **logAudit = 6 أعمدة** (بلا ختم tenant_id) ⇒ صفوف تدقيق جديدة ستكون tenant_id=NULL (غير مرئية لقراءة المستأجر) — **مما يجعل قارئ super-admin هذا ضرورياً لرؤيتها**.
2. **POST /api/blood-bank/units و /donors بـ requireAuth فقط وبلا ختم tenant_id**، بينما الجدولان FORCE-RLS + سياسة tenant في القاعدة ⇒ **إدراج هذين سيُرفض (42501) تحت دور nama_medical_app** (انحدار وظيفي).
3. عزل **القراءة** العابرة مغطّى الآن بـ RLS (طبقة القاعدة) بصرف النظر عن تشعّب حُرّاس التطبيق — لذا الانكشاف ليس تسريب قراءة، بل **كسر كتابة** للجداول FORCE-RLS التي لا يختم كودها tenant_id.

**التوصية (مرحلة منفصلة، خارج نطاق هذه)**: `P0/P1_NAMAWEB_BRANCH_RECONCILIATION` — التوفيق بين فرعَي namaweb: إعادة تطبيق ختم tenant_id لـ logAudit + blood-bank (وأي INSERT آخر على جداول FORCE-RLS لا يختم)، والتحقق من تغطية بقية حُرّاسي ضمن عمل الجلسة الموازية. هذا **لا يُنفَّذ هنا**.

`RUNTIME_INTEGRATION_DESIGN_COMPLETE`
