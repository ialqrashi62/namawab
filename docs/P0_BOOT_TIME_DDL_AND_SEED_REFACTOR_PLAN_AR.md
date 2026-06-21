# P0 — خطة إعادة هيكلة DDL/Seed أثناء الإقلاع (Refactor Plan)

> المرحلة: `P0_REMOVE_BOOT_TIME_DDL_AND_SEEDING_FOR_RESTRICTED_ROLE_CANDIDATE` — Gate 2 | التاريخ: 2026-06-21 | تخطيط؛ التطبيق في Gate 3 (code candidate فقط، بلا نشر).

## المبدأ المعتمد
```
لا يوجد DDL أو seed أثناء startup في الإنتاج نهائياً.
أي schema migration = SQL migration منفصل خارج runtime (يُنفَّذ بدور superuser بموافقة).
أي seed = seed script منفصل لا يعمل تلقائياً.
```

## القرار الهندسي (أقل تغيير، متّسق مع القائم)
الحارس الموجود أصلاً في `initDatabase` يستخدم `process.env.NODE_ENV === 'production'`. للاتساق ومنع إدخال متغيّر بيئة جديد، نستخدم نفس النمط:

1. **الدوال السبع (seed/populate) في `startServer()` (4663–4669)**: تُغلَّف بـ
   `if (process.env.NODE_ENV !== 'production') { … } else { console.log('skipping seed+catalog'); }`
   ⇒ تعمل في dev فقط (هي بيانات عرض/أول-تشغيل)؛ تُتخطّى في الإنتاج. `initDatabase()` (4662) يبقى كما هو (يحرس نفسه).
2. **IIFEs الهجرة الثلاث (7024/7026/7028–7033)**: تُغلَّف كتلةً واحدة بـ `if (process.env.NODE_ENV !== 'production') { … }` ⇒ لا ALTER إقلاعي في الإنتاج (كانت تبتلع الأخطاء — وهو ممنوع صراحةً).
3. **DDL مستوى المسارات (البند R في الجرد)**: لا يُلمس (ليس startup). يُوثَّق كمتبقٍّ يحتاج معالجة لاحقة قبل أن تعمل تلك المسارات تحت الدور المقيَّد.

### لماذا `NODE_ENV !== 'production'` وليس `RUN_BOOT_MIGRATIONS`؟
- اتساق مع حارس `initDatabase` القائم (نمط واحد في كل الكود).
- لا متغيّر بيئة جديد ⇒ لا تغيير `.env` ولا مخاطرة تفعيل عرضي.
- البذور بيانات عرض/مرجعية لأول تشغيل؛ في الإنتاج القائم موجودة فعلاً، وفي إنتاج جديد تُزرع خارج-النطاق عبر script. (النمط `RUN_BOOT_MIGRATIONS` مقبول أيضاً لكنه أقل اتساقاً هنا.)

## مسموح في الكود (مُطبَّق)
- تعطيل boot DDL/seed افتراضياً في الإنتاج.
- إبقاء موديولات seed (`seed_*.js`) كما هي (تُستدعى في dev أو عبر script خارجي لاحقاً) — لا تعديل منطقها.
- health لا يعتمد على DDL (مسار `/api/health` مستقل عن الإقلاع/الهجرة).
- startup لا يفشل بسبب هجرة مرفوضة (لم تعد تُشغَّل أصلاً في الإنتاج).

## ممنوع (مُلتزَم)
- ابتلاع أخطاء DDL مع استمرار غامض (نُزيله بالتعطيل، لا بإضافة catch صامت جديد).
- تشغيل DDL بدور التطبيق.
- منح CREATE على public لـ nama_medical_app (GRANT محظور).
- إرجاع التطبيق إلى postgres كحل دائم (postgres الآن حلٌّ مؤقت للخدمة فقط).
- seed بيانات أثناء startup.
- تعديل `.env` أو `DB_USER/DB_PASSWORD`.
- المساس بربط `app.tenant_id` (ALS + غلاف pool.query في db_postgres.js + middleware في server.js — يُحفَظ كما هو).
- تفعيل المحاسبة / journal / audit-reader.

## مخرجات Gate 4 (candidate SQL، بلا تنفيذ)
- `docs/sql/boot_time_schema_cleanup_candidate_up.sql`: DDL idempotent يضمن الأعمدة التي كانت IIFEs تضيفها (system_users.last_ip, pharmacy_prescriptions_queue.doctor, audit_trail.user_name, audit_trail.details) — يُنفَّذ خارج-النطاق بدور superuser عند الحاجة.
- `_validate.sql`: يثبت وجود تلك الأعمدة (information_schema) — إن كانت موجودة بالفعل (وهي كذلك في الإنتاج) يمر.
- `_down.sql`: additive ⇒ تراجع موثَّق (noop آمن؛ لا DROP COLUMN تلقائي حفاظاً على البيانات).

## التحقق
- Gate 5 ثابت: لا CREATE/ALTER/INDEX/POLICY/seed في مسار الإقلاع؛ الربط والغلاف محفوظان.
- Gate 6 محاكاة: تحميل مسار الإقلاع بـ NODE_ENV=production كـ nama_medical_app (بلا الاستماع على 3000، بلا restart، بلا تغيير .env دائم) ⇒ لا أخطاء DDL.
- Gate 7: الخدمة الحالية (postgres) تبقى online، health=200، restarts ثابتة، لا تنفيذ DDL.

`REFACTOR_PLAN_READY — NODE_ENV-GUARD AT CALL SITES + EXTRACT MIGRATION CANDIDATES + ROUTE DDL DEFERRED`
