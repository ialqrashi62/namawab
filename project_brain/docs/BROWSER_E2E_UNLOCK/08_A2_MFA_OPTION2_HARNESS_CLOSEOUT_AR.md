# A2 — MFA (TOTP) — إغلاق (OPTION_2: harness/static/Playwright، بلا كلمة مرور ولا أسرار)

> 2026-06-22 | MFA اختياري (opt‑in) بـTOTP، دون تفعيل إجباري شامل على أي مستخدم. نُفِّذ بـcrypto المدمج (بلا أي حزمة خارجية). يُتحقَّق دون كتابة كلمة مرور في المتصفح ودون طباعة كلمة مرور/secret/recovery code/cookie. الأسرار تُولَّد وتُقرأ داخل الـharness فقط.

## ما نُفِّذ
- **DDL** (المُرشَّح المعتمد فقط): `user_mfa` (user_id PK، mfa_enabled افتراضي false، mfa_secret، enrolled_at، last_verified_at) + `user_mfa_recovery_codes` (code_hash، used، فهرس). مفتاحها هوية المستخدم العامّة (لا tenant_id) ⟶ ليست حسّاسة‑مستأجر ⟶ **FORCE_RLS يبقى 150**. صلاحيات `nama_medical_app` ممنوحة تلقائياً (default privileges). validate فوري PASS؛ down.sql جاهز.
- **TOTP بلا تبعية خارجية**: RFC‑6238 عبر `crypto.createHmac('sha1')` + Base32 (توليد سرّ 20 بايت، نافذة ±1). تجنّب إضافة حزمة npm (سطح سلسلة‑توريد) على صندوق إنتاجي واحد.
- **النقاط**:
  - `POST /api/mfa/enroll` — سرّ جديد + `otpauth://` (MFA معطّل حتى التأكيد).
  - `POST /api/mfa/verify` — يؤكّد كوداً حيّاً ⟶ يفعّل MFA + يُصدر **8 recovery codes لمرة واحدة** (تُعاد مرة واحدة؛ تُخزَّن hashes فقط بـbcrypt).
  - `POST /api/auth/login` — **بوابة MFA**: بعد صحّة كلمة المرور، إن كان `mfa_enabled` ⟶ جلسة pending فقط + `{mfaRequired:true}` (لا تُنشأ جلسة مصادَقة). غير‑مفعّلي MFA: دخول طبيعي بلا أي تغيير.
  - `POST /api/auth/mfa` — العامل الثاني (TOTP أو recovery code) ⟶ يكمل الدخول؛ صلاحية التحدّي 5 دقائق؛ recovery code يُستهلك مرّة واحدة.
  - `POST /api/mfa/disable` — تعطيل ذاتي يتطلّب TOTP صالحاً.
  - `POST /api/mfa/admin-reset` — Admin فقط، مُدقّق؛ مسار التعافي الذي يمنع أي قفل دائم (حتى آخر Admin).
- **لا تفعيل إجباري شامل**: لا كود يفعّل MFA على الجميع؛ `mfa_enabled` لكل مستخدم على حدة (افتراضي false).

## التحقّق (OPTION_2)
| الطبقة | النتيجة |
|---|---|
| node --check | OK |
| static guard (a2_mfa_guard_test.js) | **14/14 PASS** |
| harness API (e2e_admin/doctor/nurse، اعتماد داخلي، PASS/FAIL فقط) | **20/20 PASS** |
| Playwright navigation + browser fetch | login RTL يُعرَض؛ `/api/mfa/status` غير مصادق ⟶ 401؛ `/api/auth/mfa` بلا تحدٍّ ⟶ 401 |
| regression | A1 sign endpoint حاضر؛ A3A `/api/phi-files/:id` غير مصادق ⟶ 401؛ `/uploads/radiology/*` ⟶ 404 |

### تغطية الـ20 فحص
دخول كلمة مرور admin/doctor (قبل MFA) · enroll يعيد otpauth+secret · verify يفعّل + يصدر 8 recovery codes · بعد التفعيل الدخول يعيد mfaRequired بلا جلسة · جلسة pending لا تصل لمسار محمي (401) · TOTP يكمل الدخول · TOTP خاطئ مرفوض (401) · recovery code يعمل مرّة · إعادة استخدام recovery مرفوضة (401) · admin‑reset من غير Admin ⟶ 403 · admin‑reset من Admin ⟶ 200 · MFA_ADMIN_RESET مُدقّق · بعد الإعادة الدخول بكلمة المرور يعود (لا قفل) · bad login ⟶ 401 · logout ⟶ 200 · تدقيق FAILED_LOGIN/LOGOUT/MFA_ENABLED/MFA_LOGIN/FAILED_MFA · journal=0.

## الحقول
```text
FINAL_STATUS: A2_MFA_DEPLOYED_AND_VERIFIED_BY_OPTION2
OPTION_USED: SERVER_HARNESS_STATIC_PLAYWRIGHT_NAVIGATION_NO_SECRET_PRINT
A2_MFA_IMPLEMENTED: YES
MFA_DDL_EXECUTED: YES (user_mfa + user_mfa_recovery_codes)
MFA_DDL_VALIDATE: PASS (both exist, flags present, empty)
GLOBAL_MFA_ENFORCEMENT: OFF_OR_OPT_IN
TEST_SCOPE: e2e_accounts_only_or_opt_in
MFA_ENROLL_STATUS: PASS
MFA_VERIFY_STATUS: PASS
BAD_TOTP_STATUS: PASS (denied 401)
RECOVERY_CODE_STATUS: PASS (one-time; reuse denied)
ADMIN_RESET_AUDIT_STATUS: PASS (MFA_ADMIN_RESET; Admin-only, non-admin 403)
LAST_ADMIN_PROTECTION: PASS (recovery codes + admin-reset => MFA never permanently locks out; enforcement opt-in)
NON_MFA_USERS_STATUS: PASS (login path unchanged)
A2_HARNESS_STATUS: 20/20 PASS
STATIC_GUARD_STATUS: 14/14 PASS
PLAYWRIGHT_MODE: navigation/snapshot + browser fetch (NO password fill)
PASSWORD_PRINTED: NO
TOTP_SECRET_PRINTED: NO
RECOVERY_CODES_PRINTED: NO
SESSION_COOKIE_PRINTED: NO
CREDENTIALS_COMMITTED: NO
CODE_DEPLOYED: YES (namaweb 56bd2ee -> 3ffcf7e -> 15e6dfa [+security-review hardening])
PM2_RESTARTED: YES
HEALTH_STATUS: local 5/5, domain 200
RBAC_STATUS: PASS (admin-reset Admin-only; non-admin 403)
RLS_STATUS: FORCE 150 (unchanged; MFA tables global, no tenant_id)
TENANT_ISOLATION_STATUS: UNCHANGED (no tenant-scoped MFA data)
A1_UI_REGRESSION: PASS (sign endpoint present)
A3A_FILE_GUARD_REGRESSION: PASS (401 unauth, 404 legacy public)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_PUSH_USED: NO
TEMP_ACCOUNTS_CLEANUP_REQUIRED: YES_AFTER_OWNER_APPROVAL
GIT_COMMIT: namaweb 3ffcf7e + parent (gitlink+closeout)
GIT_PUSH: FF (namaweb origin/main + parent origin/master)
NEXT_RECOMMENDED_ACTION: APPROVE_CLEANUP_E2E_TEST_ACCOUNTS (or APPROVE_PHASE_A3_FULL_ENCRYPTION_AT_REST)
```

## تصليب مراجعة الأمان (بعد النشر — namaweb 15e6dfa)
المراجعة الآلية رصدت 4 بنود على مسار MFA؛ عولجت كلها (harness 22 فحص + static 19/19):
1. **Brute force على `/api/auth/mfa`** ⟶ عدّاد محاولات لكل تحدٍّ: بعد 5 إخفاقات يُمسح التحدّي ويُعاد 429 (يُفرَض دخول كلمة مرور جديد).
2. **إعادة استخدام TOTP (replay)** ⟶ حارس `mfaConsume` يرفض أي كود استُهلك عدّاده (خريطة عدّاد في الذاكرة لكل مستخدم؛ صلاحية الكود ~90ث ⟶ لا حاجة لتخزين دائم؛ تجنّبنا ALTER غير معتمد على الإنتاج).
3. **Step-up ضعيف على إلغاء التفعيل الذاتي** ⟶ `/api/mfa/disable` صار يتطلّب كلمة المرور (bcrypt) **مع** TOTP صالح. admin-reset يبقى Admin-only + مُدقّق.
4. **Session fixation** ⟶ `req.session.regenerate` عند نجاح المصادقة (login بكلمة المرور و post-MFA) + `saveUninitialized:false`.

## ملاحظات أمنية ومتبقّيات
- **سرّ TOTP يُخزَّن نصاً حالياً** (كما في المُرشَّح المعتمد)؛ التشفير عند الراحة مؤجَّل إلى **PHASE_A3 الكامل (KMS)** — متبقٍّ مفتوح. recovery codes مُجزّأة (bcrypt) بالفعل.
- لم تُستخدم `browser_fill_form` لكلمة مرور؛ لم يُطبَع أي سرّ/كود/كوكي. حسابات `e2e_*` المؤقتة حالتها نُظِّفت بعد الاختبار (user_mfa + recovery حُذفت)؛ الحسابات نفسها تبقى حتى موافقة الحذف.
- beta/R17 لم تُلمس؛ المحاسبة OFF؛ journal=0؛ FORCE_RLS=150؛ لا force push.

تم نشر MFA والتحقق منه عبر harness/static/navigation دون كشف أسرار أو تفعيل إلزامي شامل
