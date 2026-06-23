# تدقيق أمني شامل (Read-Only) — سجلّ ثغرات مُصنّف

> 2026-06-23 | تدقيق قراءة فقط لكامل قاعدة كود NamaMedical عبر 5 أبعاد (عزل المستأجرين/RLS · authz/RBAC · الأسرار/التشفير · الحقن/XSS · الجلسة/MFA/PHI). **لا تغيير إنتاجي، لا تعديل كود، لا نشر.** كل بند عالي الخطورة تحقّقت منه يدوياً. الإصلاح يتطلب بوابة منفصلة بموافقتك (تغيير كود إنتاجي).

## الملخص التنفيذي
| الخطورة | العدد | أبرزها |
|---|---|---|
| **Critical** | 1 | Stored XSS على مستوى التطبيق (`escapeHTML` مُعرّفة وغير مستخدمة، 172 منفذ innerHTML) |
| **Medium** | 5 | audit-trail بلا حارس دور · CORS يعكس كل الأصول مع credentials · غياب CSRF · XSS في شاشات الإدارة · كلمة مرور بوابة افتراضية 123456 |
| **Low** | 9 | backup-info بلا حارس · CSP معطّل · mfa/verify بلا replay-guard · fallbacks ثابتة (SESSION_SECRET/DB) · Math.random لروابط telemed · permissions لكل مستخدم غير مُنفّذة · bcrypt cost 10 · MemoryStore fallback · رواتب الموظفين مكشوفة للكل |
| **مُتحقَّق سليم** | كثير | RLS/عزل المستأجرين · SQLi (parameterized) · path traversal · command injection · crypto_envelope · KEK escrow · جوهر MFA · حارس تنزيل PHI · session fixation · عدم كشف وجود المستخدم |

> ملاحظة: قاعدة البيانات حالياً **0 صف** في الأعمدة الحسّاسة (تأكيد جرد 44ec2eb)، ما يقلّل الاستغلال الفعلي لبعض البنود حتى إدخال بيانات — لكنها تبقى ثغرات كود يجب إصلاحها قبل التشغيل الحيّ بالبيانات.

## Critical
### C1 — Stored XSS على مستوى التطبيق (العميل)
- **الموقع**: `public/js/app.js` — `makeTable`/`createTable` (≈271-303) + ~172 منفذ `innerHTML`؛ بيانات المرضى/EMR (`patient_name`, `name_ar/en`, `allergies`, `diagnosis`, `doctor_name`) تُدرَج خاماً.
- **الدليل**: `escapeHTML` معرّفة في `app.js:3` لكن **عدد استخداماتها = 1 (التعريف فقط)** عبر 10,900 سطر؛ اسم مريض مثل `<img src=x onerror=...>` يُنفَّذ في متصفّح كل من يعرض القائمة.
- **التصنيف**: REAL_GAP · **Critical** (تخزيني، يصيب كل الطواقم، متجه تصعيد صلاحيات عبر متصفّح الأدمن).
- **الإصلاح**: تمرير كل قيمة مُدرَجة عبر `escapeHTML()` داخل حلقة خلايا `makeTable`/`createTable` وكل منافذ الإدراج المباشر.

## Medium
- **M1 — `GET /api/admin/audit-trail` (server.js:5583)**: `requireAuth` فقط بلا حارس دور ⟹ أي مستخدم مُسجّل يقرأ سجلّ التدقيق كاملاً (أسماء/IP/محاولات دخول). الإصلاح: `requireRole('settings')` أو حارس Admin + tenant-scope.
- **M2 — CORS (server.js:45)**: `cors({ origin: true, credentials: true })` يعكس **أي** Origin مع الاعتماد ⟹ سطح CSRF/cross-origin واسع. الإصلاح: قصر `origin` على دومين التطبيق الرسمي في الإنتاج.
- **M3 — غياب CSRF**: لا توكنات CSRF على الطرق المغيّرة للحالة (مخفّف جزئياً بـ`sameSite=lax`، لكن M2 يقوّضه). الإصلاح: توكن CSRF أو header مخصّص + CORS صارم.
- **M4 — Stored XSS في شاشات الإدارة (`public/js/admin.js` ≈146-184)**: `display_name`/`username`/`speciality`/`last_ip` تُدرَج خاماً؛ مستخدم منخفض الصلاحية يضبط `display_name` لنفسه فيُنفَّذ في متصفّح الأدمن. الإصلاح: HTML-escape قبل innerHTML.
- **M5 — كلمة مرور بوابة افتراضية (server.js:4390)**: `bcrypt.hash(password || '123456', 10)` ⟹ اعتماد افتراضي قابل للتخمين عند عدم تمرير كلمة. الإصلاح: إلزام كلمة مزوّدة أو توليد عشوائية + فرض تغيير.

## Low (مختصر)
- **L1** `GET /api/admin/backup-info` (5628) بلا حارس دور ⟹ كشف اسم DB/الجداول/الأحجام/المستخدم. الإصلاح: حارس Admin (كما في sibling routes).
- **L2** `helmet({ contentSecurityPolicy: false })` (39) ⟹ لا CSP للـSPA (دفاع عمق ضد XSS مفقود). الإصلاح: CSP مخصّص.
- **L3** `/api/mfa/verify` (343-348) يستخدم `mfaVerify` لا `mfaConsume` ⟹ بلا replay-guard (مسار enroll المُوثّق، أثر منخفض). الإصلاح: مرّره عبر `mfaConsume`.
- **L4** fallback ثابت لـ`SESSION_SECRET` (74) و`DB_PASSWORD='postgres'` (db_postgres.js:10) ⟹ مخاطرة إن غاب الـenv. الإصلاح: fail-fast في الإنتاج.
- **L5** `Math.random()` لروابط telemed (4438) ⟹ تخمين روابط. الإصلاح: `crypto.randomBytes`.
- **L6** `requireRole` يتجاهل عمود `permissions` لكل مستخدم (141) ⟹ واجهة تُوحي بصلاحيات دقيقة لا يفرضها الخادم (الأرضية الدنيا للدور مفروضة دائماً، فليس تصعيداً مباشراً). الإصلاح: تقاطع perms الدور مع perms المستخدم، أو إزالة الواجهة المضلِّلة.
- **L7** `bcrypt` cost=10 (موصى 12 لـ2026). · **L8** سقوط صامت لـMemoryStore عند تعذّر Redis (يُضعف single-session/replay عبر العمليات). · **L9** `GET /api/employees` يكشف `salary`/`commission` لكل مستخدم مُوثّق (مقصود للقوائم، لكن يُفضّل إسقاط الأعمدة الحسّاسة لغير HR).

## مُتحقَّق سليم (لا ثغرة)
- **عزل المستأجرين/RLS**: لا فجوة حقيقية؛ wrapper `pool.query` يربط `app.tenant_id` لكل طلب + 147–150 FORCE policy؛ لا طريق يثق بـtenant_id من العميل؛ INSERTs تختم tenant_id؛ معاملة discharge بعميل خام تحمل predicate صريح + تفشل مغلقة. `system_users` عالمي بالتصميم بحراسة Admin.
- **SQL injection**: كل المواقع parameterized (`$1,$2`)؛ الأجزاء الديناميكية أسماء أعمدة ثابتة/رموز placeholder فقط.
- **Path traversal**: تنزيل PHI (`path.resolve` + containment + 404) ونماذج الموافقة (allowlist) ورفع الملفات (اسم مُولّد) — محروسة.
- **Command injection**: `pg_dump` يستخدم `process.env` لا مدخل مستخدم، وAdmin-gated.
- **التشفير**: `crypto_envelope.js` (AES-256-GCM، IV عشوائي، auth tag مفروض) و`nama_kek_escrow.ps1` (AES-CBC+HMAC، PBKDF2-200k، constant-time MAC، SecureString، تصفير) — سليمان.
- **MFA/الجلسة**: session regenerate (anti-fixation)، replay-guard على مسار الدخول، brute-force cap، recovery codes مُجزّأة one-time، admin-reset محروس، عدم كشف وجود المستخدم، rate-limit دخول، cookie httpOnly/sameSite/secure(prod).
- **.gitignore**: يغطّي .env/مفاتيح/escrow؛ لا ملف سرّي متتبَّع.

## ملاحظة عن التشفير at-rest
بنود `mfa_secret`/PHI تُخزَّن مشفّرة **عند تفعيل KEK** (`ce.isEnabled()`)؛ وإلا plaintext. KEK (DPAPI) موجود (`~/nama_kek.dpapi` 262B) و`NAMA_KEK_PATH` في .env. **يُوصى التحقق وقت التشغيل أن `ce.isEnabled()` = true في الإنتاج** قبل إدخال بيانات حسّاسة. حالياً الأعمدة 0 صف.

## خارطة الإصلاح المقترحة (بوابات منفصلة، بموافقتك)
1. **`APPROVE_FIX_XSS_OUTPUT_ENCODING`** (Critical C1+M4) — تطبيق `escapeHTML` على كل منافذ الإخراج. **الأولوية القصوى.**
2. **`APPROVE_FIX_ADMIN_ENDPOINT_GUARDS`** (M1+L1) — حارس دور على audit-trail/backup-info.
3. **`APPROVE_FIX_HTTP_PERIMETER`** (M2+M3+L2) — CORS allowlist + CSRF + CSP.
4. **`APPROVE_FIX_AUTH_HARDENING_BATCH`** (M5+L3+L4+L5+L6+L7) — كلمات/replay/fallbacks/random/permissions/bcrypt.
5. كلها code-only ⟹ ثم بوابة نشر صريحة (`APPROVE_DEPLOY`) + إعادة تشغيل PM2.

```text
AUDIT_STATUS: READ_ONLY_COMPLETE
FINDINGS: 1 Critical · 5 Medium · 9 Low · large "verified-secure" set
EXPLOITABILITY_NOW: reduced (DB sensitive columns = 0 rows) but code gaps stand
CODE_CHANGED: NO | PRODUCTION_CHANGES: NONE | DEPLOYED: NO
ACCOUNTING: OFF | JOURNAL: 0 | FORCE_RLS: 150 | SECRETS_PRINTED: NO | FORCE_PUSH: NO | MOJIBAKE: CLEAN
TOP_PRIORITY: C1 stored XSS (escapeHTML unused, 172 innerHTML sinks)
NEXT_RECOMMENDED_ACTION: APPROVE_FIX_XSS_OUTPUT_ENCODING (then guards, perimeter, auth batch, deploy)
```

أُنجز تدقيق أمني شامل قراءة فقط؛ أبرز نتيجة Critical = XSS تخزيني (دالة الهروب مُعرّفة وغير مستخدمة)، مع توصيات إصلاح مُصنّفة في بوابات منفصلة، دون أي تغيير إنتاجي أو تعديل كود
