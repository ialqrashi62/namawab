# P1 نقل تصميم Stitch — 01 الفحص المسبق (Preflight)

> المرحلة: `P1_STITCH_DESIGN_TRANSFER_AND_SECTION_RECOMPOSITION` | التاريخ: 2026-06-20
> ACTIVE_SKILLS: AUTOPILOT_CORE, STITCH_DESIGN_SYSTEM, UX_UI_AUDIT, UX_UI_DASHBOARDS, FACILITY_TYPE_ENTITLEMENTS, RBAC_TENANT_ISOLATION, SECURITY_PRIVACY_AUDIT, TEST_SCENARIOS, REPORTS_HYGIENE, ARABIC_UTF8.

## 1. حالة Git
- parent HEAD: `a72fd8e` ✓ ؛ namaweb HEAD: `e6608ba` ✓.

## 2. توفّر MCP والمفتاح (حاسم لنطاق التنفيذ)
| الفحص | النتيجة |
| ----- | ------- |
| `STITCH_MCP_API_KEY` في البيئة | **NOT SET** |
| Stitch MCP مُسجّل/متاح كأداة | **لا** (غير مُسجّل) |
| القدرة على السحب الحيّ من Stitch عبر MCP | **غير متاحة** |

> **النتيجة**: السحب الحيّ للتصميم من Stitch (Gate 1) وأي تنفيذ UI جديد مبني عليه **غير قابل للتنفيذ في هذه الجلسة**. **لن أختلق أي محتوى تصميمي** (نزاهة). ربط MCP يتطلب من المستخدم ضبط المتغيّر + `claude mcp add` في بيئة التطوير وإعادة بدء الجلسة. لن أطلب لصق المفتاح (قاعدة أمنية).

## 3. فحص الأسرار (Gate 8 المُبكّر)
- بحث عن `X-Goog-Api-Key` / `AIza...` / `AQ.` / `STITCH_MCP_API_KEY` في ملفات الكود/JSON/env → **لا مفاتيح صريحة**.
- **SECRETS_FOUND: NO** ؛ **STITCH_MCP_KEY_COMMITTED: NO**.
- توصية أمنية: إذا سبق لصق مفتاح Stitch في محادثة/طرفية/تقرير → **يجب تدويره/إلغاؤه** واستبداله بمفتاح جديد يُحقن عبر متغير بيئة فقط.

## 4. عمل Stitch الموجود مسبقاً في المستودع (تصميم مُعتمَد ومُطبَّق جزئياً)
- مصدر التصميم المعتمد رسمياً: Google Stitch (موثّق في `MEDICAL_STITCH_DESIGN_SYSTEM_ADOPTION_REPORT_AR.md`).
- نظام التصميم مُطبَّق في `namaweb/public/css/styles.css` (Stitch Premium، 8 ثيمات، Neon Glow Glassmorphism).
- حالة الحزم (من `STITCH_MODULE_BATCH_PROGRESS_AR.md`): **Batch B/C/D/E = COMPLETED**؛ **Batch A (الاستقبال/المواعيد/بوابة المرضى) = PENDING**.
- مجلدات تصميم: `.ai-brain/skills/stitch-health-ui`, `stitch-batch-d-...`, `stitch-batch-e-...` + تقارير `docs/STITCH_*`.

## 5. ملفات خارج النطاق (لن تُلمس/تُلتزَم)
`public/js/app.js`, `public/js/login.js`, `public/login.html`, `walkthrough.md` (معدّلة سابقاً، trailing whitespace)؛ ملفات `docs/STITCH_*`/`MEDICAL_*_FOR_STITCH` القديمة (untracked)؛ `tmp/*`؛ `public/AppServerPortal/`.

## 6. قرار النطاق
نظراً لعدم توفّر MCP/المفتاح وعدم جواز الاختلاق: هذه المرحلة تُسلّم **تحليلاً وتخطيطاً (DOCS_ONLY)** مبنياً على الواجهة الحالية الفعلية + عمل Stitch الموجود؛ والسحب الحيّ + تنفيذ Batch A الجديد = **BLOCKED_PENDING_MCP_AND_KEY**. لا تغيير على UI code (لا اختلاق). لا نشر.

`PREFLIGHT_COMPLETE — LIVE MCP BLOCKED, SECRETS CLEAN`
