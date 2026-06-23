# مراجعة CSP وخطة التحويل إلى Enforcing — Plan-Only — تقرير

> 2026-06-23 | تنفيذ `APPROVE_CSP_REPORT_REVIEW_AND_ENFORCEMENT_PLAN_ONLY`. **مراجعة + خطة فقط.** لا تفعيل enforcing، لا تعديل كود، لا deploy/restart/DB/Docker/Vault، لا لمس KEK/DPAPI/escrow.

## الحالة النهائية
**`CSP_ENFORCEMENT_PLAN_READY`** — مراجعة كاملة + جرد + تصنيف مخاطر + خطة 6 مراحل + rollback + اختبارات. لا تفويض لتفعيل enforcing؛ يبقى خلف بوابة منفصلة.

## المهارات الفعلية المفعّلة
`NM_GLOBAL_GATES` · `NM_OBSERVABILITY_OPS` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`.

## 1) CSP الحالي
- **الوضع: Report-Only فقط** (حيّ): `Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self'`.
- **لا endpoint لتجميع التقارير** (`report-uri`/`report-to` غير موجود) ⟹ المتصفّح يسجّل المخالفات في console فقط، لا تجميع مركزي.
- **CSP منفصل enforcing على تنزيل PHI** (server.js:1497: `default-src 'none'; sandbox`) — مقصود ومحصور، **لا يُمَس**.

## 2) Inventory (جرد سطح المتصفّح)
| العنصر | النتيجة |
|---|---|
| inline `<script>` | `index.html`=0 · `admin.html`=0 · **`login.html`=1 (≈61 سطراً)** |
| inline event handlers (onclick/onchange/…) | **347 في app.js** (يولّدها innerHTML) |
| eval / new Function / setTimeout-string | **0** (لا حاجة `unsafe-eval`) ✅ |
| inline `style=` | **785 في app.js** |
| سكربتات/أنماط CDN | `cdn.jsdelivr.net` (chart.js/jsbarcode/flatpickr) · `fonts.googleapis.com` (CSS) · `fonts.gstatic.com` (خطوط) |
| مصادر صور خارجية | **`lh3.googleusercontent.com` + `res.cloudinary.com`** مُشار إليهما في index.html (غير مغطّيين في img-src الحالي) |
| connect-src (fetch/ws) | **same-origin فقط** (لا hosts خارجية، لا websockets) ⟹ `connect-src 'self'` كافٍ ✅ |
| iframe/object/embed | index.html=0 · app.js: ~8 مطابقات `document.write`/إطار (دوال الطباعة تفتح نافذة وتكتب) |
| صفحات خاصة | تنزيل PHI له CSP enforcing مستقل (سليم) |

## 3) تصنيف المخاطر (ما يمنع enforcing الآن)
| Blocker | الأثر عند enforcing الصارم | التصنيف |
|---|---|---|
| **347 inline handlers** | بدون `'unsafe-inline'` في script-src-attr → كل الأزرار تتعطّل | **حاجب رئيسي** — يحتاج refactor (event delegation) أو قبول `'unsafe-inline'` للمعالجات |
| **785 inline styles** | بدون `'unsafe-inline'` في style-src → تنسيق مكسور | متوسط — مقبول إبقاء `style-src 'unsafe-inline'` (خطر XSS أقل) أو refactor لاحق |
| **login.html inline script** | يُحجب → صفحة الدخول تتعطّل | منخفض — قابل للإصلاح بسهولة (externalize إلى `.js` أو sha256-hash) |
| **img-src ناقص** | صور `googleusercontent`/`cloudinary` تُحجب (صور رمزية) | منخفض — إصلاح بإضافة hosts إلى img-src |
| **لا report endpoint** | لا أدلّة مخالفات قبل enforcing | متوسط — يُضاف endpoint تجميع أولاً |
| **document.write (طباعة)** | نوافذ الطباعة بسياق CSP منفصل | منخفض — تحقّق smoke للطباعة |
| eval/unsafe-eval | — | **لا حاجب** (0) ✅ |
| connect/object/base/frame-ancestors | متوافقة مسبقاً | **جاهز** ✅ |

**ما يمكن إصلاحه بلا أثر:** img-src hosts · report endpoint · login inline script (externalize). **ما يحتاج refactor:** 347 inline handlers (للوصول إلى script-src بلا `'unsafe-inline'`). **مقبول إبقاؤه:** style-src `'unsafe-inline'`.

## 4) خطة التحويل (مراحل)
- **Phase 1 — تحسين Report-Only:** إضافة `report-uri`/`report-to` + endpoint تجميع (server.js، code-readiness لاحقة)؛ إضافة img-src `https://lh3.googleusercontent.com https://res.cloudinary.com`؛ مراقبة المخالفات الحقيقية فترة.
- **Phase 2 — إزالة inline منخفض المخاطر:** externalize سكربت login.html إلى ملف `.js` (أو sha256)؛ تثبيت قائمة CDN. (لا يزال Report-Only.)
- **Phase 3 — script-src أقوى:** قرار: إما (أ) refactor 347 handler إلى event delegation تدريجياً ثم nonce-based script-src بلا `'unsafe-inline'`، أو (ب) قبول `script-src-attr 'unsafe-inline'` للمعالجات مع تشديد كل ما عداه (قرار حوكمة موثّق — الدفاع الأساسي ضد XSS هو ترميز Layer1+2 المنشور).
- **Phase 4 — enforce على صفحات منخفضة المخاطر:** صفحات بلا handlers (مثل login بعد externalize) أولاً عبر CSP enforcing مقيّد لتلك المسارات.
- **Phase 5 — enforce عام:** بعد ثبات Report-Only بلا مخالفات حرجة + smoke كامل.
- **Phase 6 — مراقبة + rollback:** نافذة مراقبة، وعودة فورية إلى Report-Only عند أي كسر.

## 5) Rollback
- العودة إلى **Report-Only** (تبديل اسم الرأس `Content-Security-Policy` → `…-Report-Only`).
- **env flag مقترح:** `CSP_ENFORCE=true|false` يتحكّم بالوضع (code-readiness لاحقة) — تبديل بلا إعادة نشر كود.
- لا re-deploy للعودة؛ smoke تحقّق بعد كل تبديل (health/login/static 200).

## 6) خطة الاختبار
- unauth smoke (health/login/static 200).
- **owner authenticated smoke:** patients · records · lab · radiology · ER · inpatient · billing · admin — أزرار/شارات/مودالات/عربية تعمل.
- console خالٍ من أخطاء CSP حرجة.
- مراجعة تقارير المخالفات (بعد إضافة endpoint) — بلا PHI/أسرار.
- الطباعة (document.write windows) تعمل.

## ما لم يُنفَّذ ولماذا
لا تفعيل enforcing · لا تعديل كود (حتى Phase 1) · لا report endpoint مُضاف بعد · لا refactor للمعالجات · لا deploy/restart — النطاق review/plan-only. كل خطوة تنفيذ خلف بوابة (`APPROVE_CSP_ENFORCEMENT_CODE_READINESS_ONLY` ثم تفعيل منفصل).

## إثبات عدم التغيير الإنتاجي
قراءة فقط. parent 7c77410 · namaweb 0bb8fa2 · drift 0/0 · CSP يبقى Report-Only حيّاً · لا code/deploy/restart/DB/Docker/Vault · FORCE_RLS=150 · accounting OFF.

## الحقول
```text
FINAL_STATUS: CSP_ENFORCEMENT_PLAN_READY
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_OBSERVABILITY_OPS, NM_SECURITY_DR_KEY_MANAGEMENT, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
CURRENT_CSP_MODE: REPORT_ONLY
CSP_ENFORCING_ENABLED: NO
INLINE_SCRIPT_INVENTORY_DONE: YES (login.html 1 / ~61 lines; index+admin 0)
INLINE_HANDLER_INVENTORY_DONE: YES (347 in app.js)
CDN_DEPENDENCIES_REVIEWED: YES (jsdelivr, fonts.googleapis, fonts.gstatic; img: googleusercontent+cloudinary need img-src)
CONNECT_SRC_REVIEWED: YES (same-origin only; 'self' sufficient)
PHI_DOWNLOAD_CSP_REVIEWED: YES (separate enforcing default-src 'none'; sandbox, intact)
ENFORCEMENT_BLOCKERS_FOUND: YES (347 inline handlers main; 785 inline styles; login inline script; img-src gap; no report endpoint)
PLAN_CREATED: YES
CODE_CHANGED: NO
PRODUCTION_DEPLOYED: NO
PM2_RESTARTED: NO
DB_CHANGED: NO
DDL: NO
DATA_CHANGED: NO
DOCKER_RUN: NO
VAULT_TOUCHED: NO
REAL_KEYS_READ: NO
DPAPI_READ: NO
ESCROW_CONTENT_READ: NO
ZATCA_CALLS: NO
NPHIES_CALLS: NO
EXTERNAL_HEALTHCARE_CALLS: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS: 150
SECRETS_PRINTED: NO
MOJIBAKE_AUDIT: CLEAN
GIT_PARENT: 7c77410 -> (this report commit)
GIT_COMMIT: namaweb 0bb8fa2 (unchanged) / parent (this report commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: APPROVE_CSP_ENFORCEMENT_CODE_READINESS_ONLY (Phase 1+2: report endpoint + img-src + externalize login script + CSP_ENFORCE env flag — code-only, no enforce) أو APPROVE_CSRF_TOKEN_STRICT_MODE_PLAN_ONLY
```

CSP حاليّاً Report-Only؛ الحاجب الرئيسي لـenforcing الصارم = 347 inline handler (إضافة 785 inline style + سكربت login + نقص img-src + غياب report endpoint). لا eval، وconnect/object/base/frame-ancestors جاهزة. خطة 6 مراحل + rollback (env flag) + اختبارات جاهزة؛ plan-only، لا تغيير إنتاجي.
