# جاهزية كود CSP — Phase 1+2 (Code-Readiness) — تقرير

> 2026-06-23 | تنفيذ `APPROVE_CSP_ENFORCEMENT_CODE_READINESS_ONLY`. **code-readiness فقط — CSP enforcing غير مفعّل.** لا deploy/restart، لا DB/DDL/data، لا Docker/Vault، لا KEK/DPAPI/escrow، لا ZATCA/NPHIES.

## الحالة النهائية
**`CSP_ENFORCEMENT_CODE_READINESS_READY`** — أُضيف report endpoint + img-src/media-src + `CSP_ENFORCE` flag (افتراضي Report-Only) في server.js (خامل حتى إعادة تشغيل)، وفُصِل سكربت login المضمّن إلى ملف خارجي (client حيّ). enforcing لم يُفعَّل.

## المهارات الفعلية المفعّلة
`NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_OBSERVABILITY_OPS` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`.

## العناصر الـPRE_EXISTING_OUT_OF_SCOPE_DIRTY (لم تُلمَس)
`docs/STITCH_*` (معدّلة/جديدة) · `migrate.ps1` (محذوف) · `protocol_x.ps1` (محذوف) · `.playwright-mcp/` · عدة `docs/MEDICAL_*`/`STITCH_*`/`WWW_SSL_*` غير متتبَّعة — موجودة منذ بداية الجلسة، **لم أضِفها ولا عدّلتها ولا أصلحتها**؛ خارج النطاق.

## ما تم تغييره (3 ملفات في النطاق)
| الملف | التغيير | حيّ الآن؟ |
|---|---|---|
| `namaweb/server.js` | CSP report endpoint + img-src/media-src + `CSP_ENFORCE` flag | **لا** (يُحمَّل عند الإقلاع — خامل حتى restart معتمد) |
| `namaweb/public/login.html` | استبدال `<script>` المضمّن (≈59 سطراً) بـ`<script src="/js/login-ui.js">` | **نعم** (static serving) |
| `namaweb/public/js/login-ui.js` | ملف جديد يحوي منطق واجهة login (modal/scroll-reveal) المنقول حرفياً | **نعم** (static serving) |

### 1) CSP report endpoint (آمن، بلا PHI، بلا DB)
`POST /api/csp-report` — مُسجَّل **قبل** session/CSRF فيُقبل تقرير المتصفّح غير المُصادَق دائماً. rate-limited (60/دقيقة). يسجّل **ملخّصاً مقتطعاً فقط** (document-uri/violated-directive/blocked-uri، كلٌّ مقصوص) عبر `console.warn`. **لا يسجّل** cookies/Authorization/body/PHI · **لا DB** · يردّ 204. body parser محصور بأنواع csp-report/reports+json/json بحدّ 16kb.

### 2) تحديث CSP Report-Only
أُضيف للسياسة: `img-src ... https://lh3.googleusercontent.com` (صورة لوحة في login.html) · **`media-src 'self' https://res.cloudinary.com`** (فيديو ترويجي mp4 في login.html) · `report-uri /api/csp-report`. **لا wildcard، لا unsafe جديد.** (التحقّق أثبت الاستخدام الفعلي: `lh3.googleusercontent.com` = `<img>`، `res.cloudinary.com` = `<source>` فيديو.)

### 3) externalize سكربت login
نُقل المنطق المضمّن (modal toggle + scroll-reveal IntersectionObserver) إلى `public/js/login-ui.js` بنصّ مطابق، وأُشير إليه `<script src="/js/login-ui.js">` قبل `<script src="/js/login.js">` (ترتيب التحميل محفوظ، الدوال العامة openModal/closeModal تبقى متاحة لـlogin.js). **لا تغيير سلوك.** login.html لم يعد يحوي أي `<script>` مضمّن.

### 4) CSP_ENFORCE flag (code-ready، افتراضي OFF)
`const CSP_ENFORCE = process.env.CSP_ENFORCE === 'true';` ⟹ عند الغياب/أي قيمة غير 'true' = **Report-Only** (الرأس `Content-Security-Policy-Report-Only`). التبديل إلى enforcing مستقبلاً عبر env فقط، **بلا تعديل كود** و**بلا تعديل .env الإنتاجي الآن**.

## الفحوص (Gate 3)
`node --check` server.js + login-ui.js = OK · CSP_ENFORCE الافتراضي Report-Only (مُثبَت: السطر 51/67) · login.html بلا inline script (refs فقط) · LIVE: `/login.html`=200 يشير لكلا السكربتين، `/js/login-ui.js`=200، `/js/login.js`=200 · الرأس الحيّ ما زال `Content-Security-Policy-Report-Only` (server.js خامل — report-uri/media-src غير حيّين بعد = متوقّع) · `git diff --check` نظيف · secrets scan لا تطابق · mojibake CLEAN.

## ما لم يُنفَّذ
لا CSP enforcing (افتراضي Report-Only) · لا refactor للـ347 inline handler (بوابة لاحقة) · لا تعديل .env · لا deploy/restart (server.js خامل) · لا لمس العناصر خارج النطاق.

## إثبات عدم التفعيل/النشر
- **CSP enforcing: OFF** (Report-Only افتراضي؛ الرأس الحيّ لم يتغيّر).
- **server.js: خامل** (التغييرات تحتاج restart معتمد لاحقاً).
- **PM2 لم يُعَد تشغيله** (restarts=0 status online — من تعافي ارتداد Docker السابق، مستقرّ) · health 200.
- لا DB/DDL/data · لا Docker/Vault · لا KEK/DPAPI/escrow · لا ZATCA/NPHIES · FORCE_RLS=150 · accounting OFF.

## الحقول
```text
FINAL_STATUS: CSP_ENFORCEMENT_CODE_READINESS_READY
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_OBSERVABILITY_OPS, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
PRE_EXISTING_OUT_OF_SCOPE_DIRTY_ITEMS: STITCH_* docs, migrate.ps1(D), protocol_x.ps1(D), .playwright-mcp/, MEDICAL_*/WWW_SSL_* untracked (untouched)
CODE_CHANGED: YES
FILES_CHANGED: namaweb/server.js, namaweb/public/login.html, namaweb/public/js/login-ui.js
CSP_REPORT_ENDPOINT_ADDED: YES (POST /api/csp-report, rate-limited, 204)
CSP_REPORT_ENDPOINT_STORES_PHI: NO (truncated summary to console only; no cookies/auth/body/DB)
CSP_REPORT_ONLY_UPDATED: YES (img-src googleusercontent + media-src cloudinary + report-uri)
IMG_SRC_UPDATED: YES (https://lh3.googleusercontent.com; + media-src https://res.cloudinary.com)
LOGIN_SCRIPT_EXTERNALIZED: YES (public/js/login-ui.js)
CSP_ENFORCE_FLAG_ADDED: YES
CSP_ENFORCE_DEFAULT: REPORT_ONLY (env unset/false)
CSP_ENFORCING_ENABLED: NO
PRODUCTION_DEPLOYED: NO (server.js dormant; login client change is live via static serving)
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
KEYS_COMMITTED: NO
TOKENS_COMMITTED: NO
MOJIBAKE_AUDIT: CLEAN
DIFF_CHECK: CLEAN
GIT_PARENT: 025d201 -> (this commit)
GIT_COMMIT: namaweb (this commit) / parent (this commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: APPROVE_CSP_CODE_READINESS_DEPLOY_AND_SMOKE (تفعيل server.js report endpoint + report-uri عبر restart، CSP يبقى Report-Only؛ + smoke متصفّح المالك لـ/login.html)
```

أُنجزت جاهزية كود CSP Phase 1+2: report endpoint آمن + img-src/media-src + `CSP_ENFORCE` flag (افتراضي Report-Only، خامل حتى restart) + externalize سكربت login (client حيّ، سلوك مطابق). enforcing لم يُفعَّل، لا نشر/إعادة تشغيل خادمي، لا مساس بالعناصر خارج النطاق. التالي: بوابة نشر+smoke منفصلة.
