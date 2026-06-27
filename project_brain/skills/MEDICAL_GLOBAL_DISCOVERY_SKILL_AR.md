# مهارة الاكتشاف الشامل للنظام الطبي (Global Discovery)

## Purpose
اكتشاف النظام الطبي بالكامل (بنية، صفحات، APIs، نماذج DB، auth/RBAC، tenant، أنواع المنشآت، الموديولات السريرية/المالية/الصيدلية/المخزون، التقارير، الاختبارات، التوثيق) كأساس لأي تدقيق لاحق.

## When to Use
في بداية أي تدقيق أو مرحلة جديدة، أو عند الحاجة لخريطة محدّثة للنظام.

## Inputs Needed
`namaweb/` (server.js, db_postgres.js, public/js/app.js)، `package.json`، `docs/`، `.ai-brain/AI_PROJECT_MEMORY.md`.

## Procedure
1. قراءة فقط: `git status`، الفرع، آخر التزامات.
2. حصر المسارات: `grep app.(get|post|put|delete)` في server.js.
3. حصر الجداول: `CREATE TABLE` + `ALTER ... tenant_id` في db_postgres.js.
4. حصر موديولات الواجهة من `NAV_ITEMS` في app.js.
5. تصنيف كل موديول: UI/API/DB/permissions/tenant/tests/docs موجود أو ناقص.
6. توثيق المكدّس الفعلي (Express + pg، ليس Next/Prisma).

## Safety Rules
قراءة فقط. لا تعديل كود/إنتاج. لا طباعة أسرار من `.env`. أي سياق ناقص يُعلَّم `NEEDS_CONFIRMATION`.

## Output Format
- `docs/MEDICAL_PROJECT_FULL_MAP_AR.md`
- `docs/MEDICAL_MODULES_AND_FEATURES_INVENTORY_AR.md` (جدول: موديول | UI | API | DB | صلاحيات | منطق | tenant | tests | docs | الحالة).

## Done Criteria
خريطة كاملة + جرد موديولات بحالات (Complete/Partial/UI only/API only/DB only/Missing) مدعومة بأدلة (مسارات/أسطر).
