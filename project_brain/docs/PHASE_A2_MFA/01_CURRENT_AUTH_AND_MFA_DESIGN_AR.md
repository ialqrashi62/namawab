# Phase A2 — MFA: الوضع الحالي والتصميم (Candidate Only)

> 2026-06-22 | تصميم فقط. **لا deploy، لا تغيير login، لا DB change.** branch B (لا حساب اختبار E2E بعد).

## 1. الوضع الحالي للمصادقة (من الكود)
- `POST /api/auth/login` (server.js:222) خلف `loginLimiter` (20/15د)؛ `bcrypt.compare(password, password_hash)`؛ يرفض إن لم يبدأ الهاش بـ`$2`.
- جلسة واحدة فعّالة لكل مستخدم (`activeUserSessions` — تدمير الجلسة السابقة)؛ يضبط `req.session.user` (connect-redis).
- `system_users` أعمدة: id, username, password_hash, display_name, role, speciality, permissions, commission*, is_active, created_at, last_ip. **لا أعمدة MFA.**
- `system_users` جدول هوية عام (لا tenant_id — يعرّف التينانسي عبر user_tenants).

## 2. تصميم MFA (TOTP)
**النوع**: TOTP (RFC 6238) متوافق مع Google/Microsoft Authenticator (مكتبة otplib/speakeasy — تبعية مرشّحة).

**التخزين** (candidate): جدول `user_mfa` مفصول (يبقي السر خارج صف system_users):
```
user_mfa(user_id PK→system_users.id, mfa_enabled boolean default false, mfa_secret text, enrolled_at timestamptz, last_verified_at timestamptz)
user_mfa_recovery_codes(id, user_id, code_hash, used boolean default false, created_at)
```
(عام — مفتاحه user_id؛ system_users عام بطبيعته. السر يُخزَّن مشفّراً at-rest — يرتبط ببند تشفير Phase A3؛ كحد أدنى لا يُطبَع أبداً.)

**التدفّق** (يعدّل login لاحقاً عند الموافقة — ليس الآن):
```
1) POST /api/auth/login (username+password) → bcrypt OK
2a) إن mfa_enabled=false: كما هو (set session.user)
2b) إن mfa_enabled=true: لا تُنشئ session.user بعد؛ أعِد {mfa_required:true, challenge_token} (قصير العمر، في الجلسة المؤقتة)
3) POST /api/auth/mfa/verify (challenge + totp_code) → otplib.verify → عند النجاح set session.user
   - فشل متكرر → rate-limit + audit MFA_FAIL
4) recovery code بدل TOTP عند فقد الجهاز (كود لمرة واحدة، يُعلَّم used)
```

**التسجيل (enroll)**:
```
POST /api/auth/mfa/enroll → توليد secret + otpauth URL (QR) → المستخدم يمسح → POST /api/auth/mfa/confirm (totp) → mfa_enabled=true + توليد recovery codes (تُعرَض مرة واحدة، تُخزَّن hash)
```

## 3. الاسترداد و"تجاوز" الأدمن الآمن
- **recovery codes**: لمرة واحدة، hash مخزّن، تُبطَل بعد الاستخدام.
- **admin reset (وليس bypass صامت)**: Admin يستطيع **تعطيل/إعادة تسجيل** MFA لمستخدم عبر إجراء **مُدقَّق** (audit `MFA_RESET_BY_ADMIN`) — لا يقرأ السر ولا يتجاوز TOTP صامتاً؛ فقط يفرض إعادة التسجيل. (يمنع قفل المستخدم خارج النظام عند فقد الجهاز + الرموز.)
- **آخر أدمن**: لا تُعطّل قدرة آخر أدمن على الدخول (حماية مثل last-admin guard القائمة).

## 4. الصلاحيات/العزل
- MFA على مستوى المستخدم (system_users عام)؛ لا أثر على RLS/tenant (لا tenant_id).
- enroll/verify خلف requireAuth (لاحقاً)؛ admin reset خلف Admin-only + audit.

## 5. التراجع (Rollback)
- **feature-flag**: `mfa_enabled` per-user (افتراضي false) ⇒ النشر لا يفرض MFA على أحد حتى التسجيل ⇒ آمن، لا يكسر دخول أحد.
- تعطيل عام طارئ: ضبط كل mfa_enabled=false (أو راية بيئة).
- `down.sql`: إسقاط user_mfa* (فارغة).
- كود: feature-flag + git checkout.

## 6-12
المتطلبات: مكتبة TOTP، تشفير السر (يرتبط Phase A3)، UI enroll/verify (يحتاج E2E). الأولوية P1. المخاطر: قفل المستخدمين (مخفّف بـrecovery + admin reset)؛ نشر تدفّق login حسّاس (يحتاج E2E بحساب اختبار). توصيات: candidate الآن؛ النشر بعد توفّر حساب اختبار + موافقة. Acceptance: تصميم كامل (تدفّق/تخزين/استرداد/تراجع) (✅). Next: SQL candidate + test plan.
