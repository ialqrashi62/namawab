# تحصين HTTP Perimeter (Gate 3) — Code-Only (بلا نشر) — تقرير

> 2026-06-23 | تنفيذ `APPROVE_FIX_HTTP_PERIMETER_VALIDATE`. تعديلات `namaweb/server.js` فقط (CORS/CSRF/CSP/security headers) **ككود فقط — خاملة حتى إعادة تشغيل PM2**. لا DB/DDL/migration/محاسبة/إعادة تشغيل/نشر. لا Layer 2 إضافي. بُنيت ودُقّقت ثم دُفعت FF.

## الحالة النهائية
**`HTTP_PERIMETER_CODE_ONLY_READY_FOR_VALIDATE_DEPLOY`** — التغييرات متدرّجة ومنخفضة المخاطر، CSP في وضع **Report-Only** (لا يكسر شيئاً)، CORS مقيّد بـallowlist لا يؤثّر على same-origin، وحارس CSRF متحفّظ وقابل للعكس. جاهزة لبوابة تحقّق/نشر منفصلة.

## ملاحظة ما قبل البدء
`AUTHENTICATED_BROWSER_SMOKE_BEFORE_GATE3: PENDING_OWNER_ACCEPTED` — لم يُنفِّذ المالك فحص المتصفّح المُصادَق لإصلاح Layer 2 بعد. بدأتُ Gate 3 **ككود فقط (غير حيّ)** فقط، فالخطر مقبول لأن لا شيء يُفعَّل قبل بوابة النشر المنفصلة. **لا أدّعي أن Layer 2 أُغلق وظيفياً بالكامل** — يبقى فحص المتصفّح مطلوباً من المالك.

## المهارات الفعلية المفعّلة
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md`: `NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_OBSERVABILITY_OPS` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. لا مهارة جديدة/مخترعة.

## الوضع الحالي (جرد read-only)
- **helmet** مُفعّل بإعداداته الافتراضية (CSP مُعطّل فقط). الرؤوس الحيّة الحالية تشمل بالفعل: `X-Content-Type-Options: nosniff` · `X-Frame-Options: SAMEORIGIN` · `Referrer-Policy: no-referrer` · `Strict-Transport-Security` · `Cross-Origin-Opener-Policy: same-origin` · `Cross-Origin-Resource-Policy: same-origin` · `X-DNS-Prefetch-Control: off` · `X-Download-Options: noopen` · `X-Permitted-Cross-Domain-Policies: none`.
- **ناقص:** `Permissions-Policy` (غير مضبوط) و**CSP** (مُعطّل).
- **CORS (خطر M2):** `cors({ origin: true, credentials: true })` → يعكس **أي** أصل مع credentials (مؤكَّد حيّاً: `Access-Control-Allow-Origin: https://evil.example`). التطبيق same-origin (يقدّم أصوله /js/app.js وapi.js من نفس المضيف) فلا يحتاج CORS متساهلاً.
- **CSRF:** لا توكنات؛ الحماية الحالية = cookie `sameSite=lax` (+ httpOnly + secure في الإنتاج).
- **أصول/سكربتات:** يعتمد على CDN (cdn.jsdelivr.net: chart.js/jsbarcode/flatpickr) + خطوط Google + **معالجات inline (onclick) يولّدها app.js بكثرة** + أنماط inline (`style=`). ⟹ CSP **enforcing** سيكسر الواجهة بالكامل.

## نموذج المخاطر
| خطر | التقييم/التخفيف |
|---|---|
| كسر login/session | لا — لم يُمَس session secret/cookie؛ same-origin لا يحتاج CORS |
| كسر static JS/CSS | لا — CSP Report-Only لا يحجب؛ الأصول مسموحة في السياسة |
| كسر API نفس الأصل | لا — same-origin لا يخضع لـCORS؛ حارس CSRF يمرّر same-origin دائماً |
| كسر التكاملات الخارجية | محتمل عند النشر إن وُجد عميل cross-origin — يُضاف عبر `CORS_ALLOWED_ORIGINS` |
| تعارض CSP مع inline | مُعالَج: Report-Only + `'unsafe-inline'` في script/style |
| CORS credentials | مُصلَح: لا wildcard مع credentials؛ allowlist صريحة |
| CSRF bypass | مُحسَّن: فحص Origin/Referer للطلبات المتغيّرة + sameSite=lax |
| mixed content/HTTPS | لا افتراض جديد؛ HSTS موجود مسبقاً |

## التغييرات المطبَّقة (code-only، متدرّجة)
**المرحلة A — رؤوس منخفضة الخطر:** أُضيف `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()`. باقي الرؤوس مغطّاة بـhelmet (بما فيها X-Frame-Options: SAMEORIGIN).

**المرحلة B — CORS allowlist:** استُبدل `origin: true` بدالة allowlist:
- لا Origin (same-origin/غير-متصفّح) → يُسمح (لا حاجة ACAO).
- Origin ضمن `CORS_ALLOWED_ORIGINS` → يُسمح مع credentials.
- Origin غير مسموح → لا يُصدَر ACAO → المتصفّح يحجب. **لا wildcard مع credentials.** الافتراضي (allowlist فارغة) = same-origin فقط، لا يكسر الـSPA.

**المرحلة C — CSRF (دفاع متعمّق، server-only):** middleware يفحص Origin/Referer للطرق المتغيّرة (POST/PUT/PATCH/DELETE):
- الطرق الآمنة (GET/HEAD/OPTIONS) تمرّ.
- غياب Origin (عميل غير-متصفّح/health) يمرّ (auth + sameSite سارية).
- same-origin (host مطابق) يمرّ دائماً.
- cross-origin متغيّر يُحجب 403 ما لم يكن ضمن allowlist. متحفّظ وقابل للعكس، بلا تغييرات client.

**المرحلة D — CSP Report-Only (ليس enforcing):** أُضيف `Content-Security-Policy-Report-Only` بسياسة مطابقة للأصول الفعلية (`default-src 'self'`؛ `script-src 'self' 'unsafe-inline' cdn.jsdelivr.net`؛ `style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.jsdelivr.net`؛ `font-src 'self' fonts.gstatic.com data:`؛ `img-src 'self' data: blob:`؛ `connect-src 'self'`؛ `frame-ancestors 'self'`؛ `object-src 'none'`؛ `base-uri 'self'`). **لا يحجب شيئاً** — للمراقبة قبل التفعيل لاحقاً. لم يُمَس CSP الـenforcing الموجود مسبقاً على مسار تنزيل PHI (`default-src 'none'; sandbox` السطر ~1497 — مقصود ومحصور بذلك المسار).

## أسئلة الحالة
- **CSP:** Report-Only (لا enforcing عام).
- **CORS:** allowlist (لا reflect-any؛ لا wildcard مع credentials).
- **CSRF:** تغيّر — أُضيف فحص Origin/Referer للطرق المتغيّرة (server-only، فوق sameSite=lax).
- **يحتاج PM2 restart للتفعيل:** نعم (server.js يُحمَّل في الذاكرة عند الإقلاع).
- **هل أُعيد التشغيل:** لا (restarts=4 دون تغيير، uptime ~102min).
- **هل التغييرات حيّة:** لا — مؤكَّد: الرؤوس الجديدة غائبة حيّاً، وCORS ما زال يعكس السلوك القديم.

## نتائج الفحوص
`node --check server.js` = OK · `origin: true`/wildcard ACAO = 0 · CSP العام = Report-Only فقط (الـenforcing الوحيد = sandbox تنزيل PHI الموجود مسبقاً) · helmet دون تغيير · `git diff --check` نظيف · secrets scan = لا تطابق · mojibake (U+FFFD) = 0 · health=200 · login=200.

## الحقول
```text
FINAL_STATUS: HTTP_PERIMETER_CODE_ONLY_READY_FOR_VALIDATE_DEPLOY
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_OBSERVABILITY_OPS, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
AUTHENTICATED_BROWSER_SMOKE_BEFORE_GATE3: PENDING_OWNER_ACCEPTED (code-only, not live)
HTTP_PERIMETER_INVENTORY_DONE: YES
CORS_CHANGED: YES (reflect-any -> env allowlist; no wildcard+credentials)
CSRF_CHANGED: YES (Origin/Referer check for mutating methods; server-only; sameSite=lax retained)
CSP_CHANGED: YES (added global Report-Only)
CSP_MODE: REPORT_ONLY
SECURITY_HEADERS_CHANGED: YES (added Permissions-Policy; helmet defaults retained)
SERVER_JS_CHANGED: YES
PM2_RESTARTED: NO
CODE_DEPLOYED_LIVE: NO (server.js changes dormant until restart)
DB_CHANGED: NO
DDL: NO
DATA_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS: 150
HEALTH_STATUS: 200/PONG
LOGIN_STATUS: 200
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
MOJIBAKE_AUDIT: CLEAN
GIT_PARENT: 484304a
GIT_COMMIT: namaweb (this commit) / parent (this report commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: المالك ينفّذ AUTHENTICATED_BROWSER_SMOKE، ثم APPROVE_DEPLOY_HTTP_PERIMETER_PM2_RESTART_VALIDATE (مع التحقّق بعد التفعيل: same-origin login/API يعمل، CORS cross-origin محجوب، CSP-Report-Only يُسجّل دون كسر)
```

نُفّذ تحصين HTTP perimeter ككود فقط: Permissions-Policy، CORS allowlist (بدل reflect-any)، حارس CSRF عبر Origin/Referer، وCSP Report-Only؛ بلا نشر/إعادة تشغيل/مساس بـDB/المحاسبة. التفعيل ببوابة منفصلة بعد فحص متصفّح المالك.
