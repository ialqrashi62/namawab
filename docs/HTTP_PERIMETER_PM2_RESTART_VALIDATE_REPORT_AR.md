# تفعيل HTTP Perimeter (Gate 3) عبر PM2 Restart + تحقّق — تقرير

> 2026-06-23 | تنفيذ `APPROVE_DEPLOY_HTTP_PERIMETER_PM2_RESTART_VALIDATE`. تفعيل تغييرات `server.js` الجاهزة (commit `0bb8fa2`) عبر **إعادة تشغيل PM2 فقط**، ثم تحقّق CORS/CSRF/CSP/الرؤوس. لا تعديل كود إضافي (سوى هذا التقرير)، لا DB/DDL/محاسبة، لا Layer 2.

## الحالة النهائية
**`HTTP_PERIMETER_DEPLOYED_STABLE`** — أُعيد التشغيل بنجاح، التطبيق مستقرّ (online، لا حلقة)، CORS reflect-any مُغلَق حيّاً، CSRF cross-origin محجوب مع بقاء same-origin يعمل، CSP Report-Only حيّ (لا يحجب)، الرؤوس مضبوطة، والثوابت محفوظة. لا rollback.

## المهارات الفعلية المفعّلة
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md`: `NM_GLOBAL_GATES` · `NM_OBSERVABILITY_OPS` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. لا مهارة جديدة/مخترعة.

## Baseline
parent `37fbbd2` (drift 0/0) · namaweb `0bb8fa2` على main (drift 0/0، نظيف) · health/login=200 · PM2 nama-app online pid 38256 restarts=4 uptime ~114min (لا loop). node --check OK.

## قبول المخاطر (Gate 1)
- **AUTHENTICATED_BROWSER_SMOKE: PENDING_OWNER_ACCEPTED** — لم ينفّذه المالك بعد؛ هذا التفعيل server-side فقط ولا يمسّ app.js/تصيير الواجهة، فالخطر على الـperimeter منفصل. **لا أدّعي PASS لفحص المتصفّح ولا أن Layer 2 أُغلق وظيفياً.**
- **CROSS_ORIGIN_CLIENTS: SAME_ORIGIN_ONLY_ACCEPTED** — `CORS_ALLOWED_ORIGINS` = UNSET (عُرض present/empty فقط، بلا طباعة قيمة) ⟹ السياسة same-origin فقط. لا عميل cross-origin شرعي معروف (تطبيق جوال/webview/دومين أمامي منفصل/بوابة تكامل). إن ظهر لاحقاً، يضيف المالك أصله إلى `.env` قبل اعتماده.

## السلامة قبل إعادة التشغيل (Gate 2)
`origin: true`/wildcard = 0 · CSP العام = Report-Only فقط · CSP enforcing الوحيد = sandbox تنزيل PHI (السطر 1497، محصور، لم يُمَس) · CSRF يتخطّى GET/HEAD/OPTIONS · node --check OK · لا secrets في diff. خطة rollback جُهّزت (`git checkout 0bb8fa2~1 -- server.js && pm2 restart nama-app`) ولم تُنفَّذ.

## إعادة التشغيل (Gate 3)
- **PM2 process:** `nama-app` (id 0، fork).
- **الوقت (UTC):** 2026-06-23T05:48:02Z.
- **pid:** 38256 → 46172. **restart count:** 4 → 5 (+1 متوقّع، لا loop).
- **النطاق:** التطبيق فقط — لا Redis، لا PostgreSQL، لا Nginx، لا env، لا deploy إضافي.

## التحقّق
### Gate 4 — Health Smoke
online · restarts=5 ثابت · `/api/health`=200/UP · `/login`=200 · `/js/app.js`=200 · `/js/api.js`=200 · protected unauth (audit-trail)=401 · لا stack trace · boot نظيف (PostgreSQL + Redis متصلان) · لا أسرار في السجلّات.

### Gate 5 — CORS Validation: **PASS_EVIL_ORIGIN_BLOCKED**
- `Origin: https://evil.example` → **لا ACAO** (سابقاً كان يعكسها — M2 مُصلَح حيّاً).
- لا `Access-Control-Allow-Origin: *` · لا wildcard مع credentials.
- same-origin/no-Origin يعمل (انظر Gate 6).

### Gate 6 — CSRF Validation: **ORIGIN_REFERER_COMPATIBILITY_MODE**
| سيناريو | متوقّع | فعلي |
|---|---|---|
| POST بـOrigin خارجي (evil) | 403 | **403** `{"error":"Cross-origin request blocked"}` |
| POST بـOrigin same-origin | يمرّ CSRF ⟶ auth | **401** `Invalid credentials` (لم يُكسر) |
| POST بلا Origin (compat) | يمرّ ⟶ auth | **401** `Invalid credentials` |
GET/HEAD/OPTIONS لا تُفحَص. missing-Origin يمرّ عمداً (وضع توافق، ليس CSRF كاملاً) — sameSite=lax + المصادقة سارية. login flow سليم. لا stack trace.

### Gate 7 — CSP Report-Only Validation: **REPORT_ONLY**
`Content-Security-Policy-Report-Only` حيّ (السياسة الكاملة مضبوطة على الأصول الفعلية). **لا CSP enforcing عام.** CSP تنزيل PHI المحصور (`default-src 'none'; sandbox`) موجود ولم يتغيّر. login/static لا تُكسر. لم تُجمَع تقارير (لا report-uri؛ المتصفّح يسجّل للـconsole فقط).

### Gate 8 — Security Headers Validation
حيّ الآن: `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()` · `Content-Security-Policy-Report-Only` (كامل) · `X-Content-Type-Options: nosniff` · `X-Frame-Options: SAMEORIGIN` · `Referrer-Policy: no-referrer` · `Strict-Transport-Security`.

### Gate 9 — Production Invariants (read-only)
DB_CHANGED: NO · DDL: NO · DATA_CHANGED: NO · accounting OFF (جداول غائبة) · JOURNAL_COUNT: 0 · **FORCE_RLS: 150** · ZATCA_CALLS: NO · NPHIES_CALLS: NO · EXTERNAL_HEALTHCARE_CALLS: NO · لا PM2 loop · لا restart إضافي.

## rollback
لم يُنفَّذ (لم يلزم — كل الفحوص خضراء).

## الحقول
```text
FINAL_STATUS: HTTP_PERIMETER_DEPLOYED_STABLE
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_OBSERVABILITY_OPS, NM_SECURITY_DR_KEY_MANAGEMENT, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
AUTHENTICATED_BROWSER_SMOKE_BEFORE_DEPLOY: PENDING_OWNER_ACCEPTED
CROSS_ORIGIN_CLIENTS_CONFIRMED: NONE (SAME_ORIGIN_ONLY_ACCEPTED)
CORS_ALLOWED_ORIGINS_STATUS: UNSET (same-origin only)
PM2_RESTARTED: YES
PM2_PROCESS: nama-app (id 0, fork) @ 2026-06-23T05:48:02Z, pid 38256->46172, restarts 4->5
HTTP_PERIMETER_LIVE: YES
CORS_VALIDATION: PASS_EVIL_ORIGIN_BLOCKED
CSRF_VALIDATION: PASS (cross-origin 403; same-origin + no-Origin reach auth)
CSRF_MODE: ORIGIN_REFERER_COMPATIBILITY_MODE
CSP_VALIDATION: PASS (Report-Only live; no global enforcing; PHI sandbox intact)
CSP_MODE: REPORT_ONLY
SECURITY_HEADERS_VALIDATION: PASS (Permissions-Policy + helmet defaults live)
HEALTH_STATUS: 200/PONG
LOGIN_STATUS: 200
STATIC_ASSETS_STATUS: 200 (app.js + api.js)
GATE3_EXECUTED: YES
LAYER2_XSS_CHANGED: NO
DB_CHANGED: NO
DDL: NO
DATA_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS: 150
ZATCA_CALLS: NO
NPHIES_CALLS: NO
EXTERNAL_HEALTHCARE_CALLS: NO
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
ROLLBACK_EXECUTED: NO
MOJIBAKE_AUDIT: CLEAN
GIT_PARENT: 37fbbd2 -> (this report commit)
GIT_COMMIT: namaweb 0bb8fa2 (unchanged) / parent (this report commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: OWNER_AUTHENTICATED_BROWSER_SMOKE_CONFIRMATION (أو VERIFY_OWNER_RUN_KEK_ESCROW_AND_CLOSE_DR_GAP / APPROVE_CSP_REPORT_REVIEW_AND_ENFORCEMENT_PLAN_ONLY / APPROVE_CSRF_TOKEN_STRICT_MODE_PLAN_ONLY)
```

فُعِّل تحصين HTTP perimeter حيّاً عبر إعادة تشغيل PM2 فقط: CORS reflect-any مُغلَق، CSRF cross-origin محجوب (same-origin سليم)، CSP Report-Only يسجّل دون كسر، Permissions-Policy مضاف؛ بلا rollback، بلا مساس بـDB/المحاسبة، والثوابت محفوظة (FORCE_RLS=150).
