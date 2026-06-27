# تفعيل Gate 2 + Gate 4 عبر إعادة تشغيل PM2 — تقرير النشر

> 2026-06-23 | تنفيذ `APPROVE_DEPLOY_GATE2_GATE4_PM2_RESTART`. تفعيل إصلاحات server.js/db_postgres.js الجاهزة (commit `7f8742b`) عبر **إعادة تشغيل PM2 فقط** — بلا تعديل ملفات، بلا DB/DDL/migration/محاسبة، بلا Gate 3 ولا Layer 2 ولا CORS/CSRF/CSP، بلا force push.

## الحالة النهائية
**`GATE2_GATE4_PM2_RESTART_DEPLOYED_STABLE`** — أُعيد التشغيل بنجاح، التطبيق مستقرّ (online، لا حلقة إعادة تشغيل)، جميع الفحوص خضراء، والثوابت الإنتاجية محفوظة. لم يُنفَّذ rollback.

## المهارات الفعلية المفعّلة
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md`: `NM_GLOBAL_GATES` · `NM_OBSERVABILITY_OPS` (PM2/health) · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. لا مهارة جديدة/مخترعة.

## ما تم تفعيله (delta التي فعّلها restart — `f9819b6..7f8742b`، محصورة في Gate 2/4)
**Gate 2 — حُرّاس الأدمن (server.js):**
- `GET /api/admin/audit-trail` + `GET /api/admin/backup-info`: حارس **Admin-only 403** (كانا `requireAuth` فقط).

**Gate 4 — تقوية المصادقة:**
- كلمة البوابة الافتراضية `'123456'` → عشوائية `crypto.randomBytes`.
- رابط telemedicine: `Math.random` → `crypto.randomBytes(16)`.
- `/api/mfa/verify`: `mfaVerify` → `mfaConsume` (حماية replay).
- `SESSION_SECRET` (server.js:74) و`DB_PASSWORD` (db_postgres.js:10): fail-fast في الإنتاج + إزالة السلسلة الثابتة المُلتزَمة.

تأكيد ما قبل التشغيل: `dotenv.config()` يعمل في server.js:1 وdb_postgres.js:3 **قبل** قراءة الأسرار؛ القيمتان موجودتان وغير فارغتين في `.env` (SESSION_SECRET len=61، DB_PASSWORD len=64، NODE_ENV=production) → fail-fast **لن** يُطلَق، ولا إبطال جلسات (نفس سرّ `.env` كان مستخدماً أصلاً، والسلسلة المحذوفة كانت fallback ميتاً).

## إعادة التشغيل
- **PM2 process:** `nama-app` (id 0، fork).
- **وقت إعادة التشغيل (UTC):** 2026-06-23T03:53:18Z.
- **pid:** 35120 → 38256. **restart count:** 3 → 4 (زيادة متوقّعة +1، بلا حلقة).
- **النطاق:** restart للتطبيق فقط — لا Redis، لا DB، لا Nginx، لا env، لا deploy جديد.

## نتائج Health Smoke (بعد إعادة التشغيل)
| فحص | النتيجة |
|---|---|
| PM2 status | online، restarts=4 ثابت، uptime يتزايد (لا loop) |
| `/api/health` | **200** · `{"status":"UP"}` |
| `/` | 200 |
| `/login` | 200 |
| boot logs | dotenv (11)، **Redis connected**، **PostgreSQL connected** (nama_medical_web)، production، بلا stack trace، بلا أسرار |

## نتائج Security Smoke
**Gate 2 (حُرّاس الأدمن):**
- `GET /api/admin/audit-trail` (بلا مصادقة) = **401** · body = `{"error":"Unauthorized"}` (بلا stack trace).
- `GET /api/admin/backup-info` (بلا مصادقة) = **401**.
- طبقة **Admin-only 403** (لمستخدم مُصادَق غير Admin): مؤكَّدة **ستاتيكياً** في الكود (`if (role !== 'Admin') return 403`)؛ لم تُختبَر حيّاً لعدم توفّر حساب اختبار غير-أدمن → انظر Gate المتصفّح.

**Gate 4 (تقوية المصادقة):**
- login يعمل (200).
- محاولة دخول خاطئة واحدة → **401** · `{"error":"Invalid credentials"}` — رسالة عامة، لا كشف وجود مستخدم/تفصيل حساس.
- default password الخطر `'123456'` غير نشط (مؤكَّد ستاتيكياً = 0).
- `Math.random` في مواضع auth/security المستهدفة مُزال (مؤكَّد ستاتيكياً).
- لا أسرار في السجلّات.

## الثوابت الإنتاجية (read-only، بعد إعادة التشغيل)
| ثابت | القيمة |
|---|---|
| health | 200/UP |
| ACCOUNTING_POSTING_ENABLED | OFF (جداول المحاسبة غائبة) |
| JOURNAL_COUNT | 0 |
| FORCE_RLS | **150** |
| DB_CHANGED / DDL / DATA_CHANGED | NO / NO / NO |
| ZATCA_CALLS / NPHIES_CALLS / EXTERNAL_HEALTHCARE_CALLS | NO / NO / NO |
| restart loop / error spike | لا / لا |

## ما لم يُنفَّذ (محجوب بطلبك)
- **Gate 3 (CORS/CSRF/CSP):** NO.
- **Layer 2 XSS (المُصيّرات المخصّصة):** NO.
- أي تعديل DB/DDL/migration/محاسبة: NO.

## تذكير المتصفّح (Gate 7)
`AUTHENTICATED_BROWSER_SMOKE: PENDING_OWNER` — لا تتوفّر حسابات اختبار للوكيل. يُرجى من المالك فحص الشاشات للتأكد أن إصلاح Gate 1 XSS (حيّ بالفعل) لا يعرض HTML حرفياً:
- patients · records · lab · admin users.

## النظافة و Git
- لم يتغيّر أي ملف برمجي هذه الجولة (تفعيل runtime فقط)؛ التغيير الوحيد = هذا التقرير.
- namaweb يبقى على `7f8742b` (لا commit كود جديد) · drift 0/0.
- التقرير يُلتزَم على الأب فقط بعد: `git diff --check` نظيف · mojibake audit · secrets scan على الـdiff. push FF فقط، بلا force.

## الحقول
```text
FINAL_STATUS: GATE2_GATE4_PM2_RESTART_DEPLOYED_STABLE
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_OBSERVABILITY_OPS, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
PM2_RESTARTED: YES
PM2_PROCESS: nama-app (id 0, fork) @ 2026-06-23T03:53:18Z, pid 35120->38256, restarts 3->4
SERVER_JS_CHANGES_LIVE: YES
HEALTH_AFTER_RESTART: 200/PONG (status UP)
LOGIN_ROUTE_STATUS: 200
ADMIN_GUARDS_SMOKE: unauth 401 (no stack trace); Admin-only 403 layer verified statically (no non-admin test acct)
AUTH_HARDENING_SMOKE: bad-login 401 generic; no '123456'; no Math.random in target auth paths; no secret leak
GATE3_EXECUTED: NO
LAYER2_XSS_EXECUTED: NO
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
GIT_PARENT: 69111c2 -> (this report commit)
GIT_COMMIT: namaweb 7f8742b (unchanged) / parent (this report commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: APPROVE_FIX_XSS_LAYER2_CUSTOM_RENDERERS (أو APPROVE_FIX_HTTP_PERIMETER_VALIDATE) + المالك: AUTHENTICATED_BROWSER_SMOKE + تشغيل KEK escrow
```

تم تفعيل Gate 2 وGate 4 على الإنتاج عبر إعادة تشغيل PM2 فقط؛ التطبيق مستقرّ، الفحوص خضراء، الثوابت محفوظة (FORCE_RLS=150، محاسبة OFF، journal 0)، بلا rollback وبلا تجاوز للنطاق.
