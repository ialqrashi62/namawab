# P1 نقل تصميم Stitch — 03 خطة إعادة التركيب (Section Recomposition Plan)

> التاريخ: 2026-06-20 | خطة تنفّذ **عند توفّر Stitch MCP + المفتاح** في بيئة التطوير. لا تنفيذ كود في هذه المرحلة (لا اختلاق).

## 1. ما يُؤخذ من Stitch (عند توفّر MCP)
- تصاميم **Batch A**: الاستقبال، المواعيد، بوابة المرضى (PENDING).
- تحسينات بصرية لـ: dashboard shell، sidebar، login — ضمن نظام Stitch Premium القائم.
- مكوّنات مشتركة (cards/tables/forms/badges/empty/loading/error states) إن لزم توحيدها.

## 2. ما يبقى من النظام الحالي (لا يُعاد بناؤه)
- نظام التصميم في `styles.css` (8 ثيمات، tokens، glassmorphism) — مُعتمَد ومُطبَّق.
- منطق `app.js` (التنقّل، RBAC في القائمة، تبديل اللغة `tr()`، `FACILITY_ALLOWED`).
- الحزم المطبّقة B/C/D/E.

## 3. ما يُدمج
- استبدال ترميز الصفحات الثلاث (Batch A) بتصميم Stitch مع **إبقاء** استدعاءات الـ API ونماذجها وصلاحياتها كما هي.
- توحيد الـ sidebar/shell بصرياً مع الحفاظ على `buildNav` (الذي يطبّق RBAC + إخفاء حسب facility type في الواجهة) — مع تذكّر أن الإنفاذ الفعلي backend (لا يُكسر).

## 4. ما يجب عدم لمسه
- server.js الأمني/المسارات، accounting_posting.js (لا ربط)، RLS، facility entitlement (fail-closed)، DB، أي بيانات إنتاج.

## 5. كيف نحافظ على الثوابت أثناء الدمج
| الثابت | كيفية الحفاظ |
| ------ | ------------- |
| Auth/session | لا تغيير على تدفّق الدخول/الجلسة؛ login يبقى يستدعي `/api/auth/login` |
| RLS P0 | لا لمس db_postgres.js/الـ wrapper؛ تشغيل binding test بعد أي تغيير |
| Facility Entitlement | الحارس backend يبقى؛ الواجهة تكمّله فقط (إخفاء)، لا تستبدله |
| API paths | كل fetch يبقى لنفس المسار/الطريقة؛ لا تغيير عقود |
| Forms/actions/permissions | إعادة تصميم بصري فقط؛ نفس الحقول والصلاحيات |
| Arabic RTL / English LTR | `dir`/`tr()` + قواعد RTL في styles.css تبقى؛ اختبار RTL إلزامي |
| Responsive | الحفاظ على breakpoints (1024/768/480) + إصلاح فجوات سابقة (بحث الموبايل) |

## 6. منع كسر الأقسام الطبية
- الدمج تدريجي (Batch A أولاً)، لا إعادة كتابة شاملة دفعة واحدة.
- بعد كل قسم: smoke (الصفحة تفتح، الروابط تعمل، المسارات لم تتغيّر) + regression (binding 9/9، entitlement، fail-closed).
- لا نشر إنتاج إلا بموافقة محكومة منفصلة.

## 7. المتطلب المسبق (Blocker)
تفعيل هذه الخطة يحتاج: **ضبط `STITCH_MCP_API_KEY` + `claude mcp add stitch` في بيئة التطوير + إعادة بدء الجلسة**، ثم سحب تصاميم Batch A عبر MCP. حالياً = `BLOCKED_PENDING_MCP_AND_KEY`.

`SECTION_RECOMPOSITION_PLAN_COMPLETE`
