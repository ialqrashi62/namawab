# Phase A3 — Full Encryption at-rest (DPAPI) — إغلاق

> 2026-06-23 | رُفِع حجب A3: نُشِّر تشفير at-rest عبر envelope (AES-256-GCM) مع KEK محمي بـWindows DPAPI. لم يُطبع/يُلتزَم أي مفتاح أو DPAPI blob. تحقّق end-to-end 17/17.

## النموذج المنفّذ (Option E — هجين، المرحلة 1 = DPAPI)
- **KEK**: 32 بايت عشوائية، تُخزَّن **فقط** كـDPAPI-protected blob (`C:\Users\ice\nama_kek.dpapi`، خارج المستودع، ACL مقيّد للمستخدم). المفتاح الخام لا يُكتب على القرص ولا يُطبع. المسار في `NAMA_KEK_PATH` بـ`.env` (gitignored).
- **تحميل lazy**: عند أول عملية تشفير، يُفكّ DPAPI-protect عبر PowerShell (CurrentUser) ويُخزَّن الـKEK في ذاكرة العملية (cached). PowerShell يُستدعى مرة واحدة لكل دورة حياة العملية.
- **التشفير**: `crypto_envelope.js` — AES-256-GCM (IV عشوائي 12 بايت + auth tag) بصيغة مدمجة `ENCv1:iv:tag:ct`. يستخدم `crypto` المدمج (بلا تبعية npm جديدة).
- **graceful/feature-gated**: إن لم يُضبط `NAMA_KEK_PATH`/الـblob، `isEnabled()=false` ويُخزَّن/يُخدَّم النص الصريح (لا انقطاع). فكّ التشفير عند القراءة يمرّر النص الصريح القديم كما هو (أمان التراجع).

## ما شُفِّر
- **`mfa_secret`** (A2): يُشفَّر عند التسجيل، ويُفكّ in-memory عند verify/login-2FA/disable فقط. (otpauth/السرّ يُعاد للمستخدم مرة عند التسجيل كما كان.)
- **ملفات `phi_vault` الجديدة**: تُشفَّر عند الرفع (الملف على القرص يصبح ciphertext `ENCv1`)، `phi_files.encrypted=true`، وتُفكّ عند التنزيل عبر المسار المحمي. `sha256` يبقى للـبايتات الأصلية (نزاهة).

## التحقّق (Gate 4 — 17/17 PASS، حساباتٍ مؤقتة أُنشئت وحُذفت)
دخول · enroll · **mfa_secret مخزَّن ciphertext (ENCv1، ليس النص)** · verify+recovery · mfaRequired · 2FA يكمل (يفكّ السرّ المشفّر) · bad TOTP مرفوض · recovery يعمل/إعادة الاستخدام مرفوضة · رفع PHI · `encrypted=true` · **الملف على القرص ciphertext (ENCv1، ليس PNG magic)** · التنزيل المصرَّح يفكّ للبايتات الأصلية · unauth 401 · tenant2 → 404 · public 404 · journal 0. كذلك: rehearsal معزول 8/8 (round-trip + GCM tamper + legacy passthrough) + static guard 13/13.

## حادثة بنية تحتية أثناء التنفيذ (عُولِجت)
أثناء التحقّق ظهر **توقّف Docker Desktop ⟶ nama-redis غير متاح ⟶ أوامر Redis تنتهي مهلتها**، و`session.regenerate` (تصلّب A2) يكتب جلسة جديدة بشكل متزامن ⟶ كان الدخول يُرجع 500 (حادثة إنتاجية مؤقتة، غير ناتجة عن كود A3). **التعافي**: تشغيل Docker Desktop + `docker start nama-redis` (PONG) + إعادة تشغيل التطبيق ⟹ الدخول 200. ملاحظة متابعة: الدخول يعتمد على Redis (مخزن الجلسات)؛ توقّف Redis = تعذّر الدخول بصرف النظر عن regenerate. الـwatchdog/الإقلاع التلقائي مُسجّلان في ذاكرة البنية التحتية.

## الحقول
```text
FINAL_STATUS: PHASE_A3_FULL_ENCRYPTION_AT_REST_DEPLOYED_AND_VERIFIED_DPAPI
KEY_MODEL: HYBRID_ENVELOPE
PHASE1_KEK_PROVIDER: WINDOWS_DPAPI
DPAPI_FEASIBILITY: PASS (CurrentUser, user=ice@DESKTOP-T70LUCJ)
BACKUP_CREATED: YES (~/nama_deploy_backups/a3_dpapi_enc_20260623/nama_pre_a3enc.dump)
REHEARSAL_STATUS: PASS (8/8 isolated + 17/17 live + 13/13 static)
DDL_EXECUTED: NO (phi_files.encrypted column already existed from A3A candidate)
DATA_CHANGED: NO (0 pre-existing mfa_secret/phi rows to migrate; new data encrypted)
CODE_DEPLOYED: YES (namaweb 15e6dfa -> f9819b6)
PM2_RESTARTED: YES
MFA_SECRET_ENCRYPTED: YES (ENCv1 at-rest, verified)
PHI_VAULT_ENCRYPTION: ENABLED_FOR_NEW_FILES (verified ciphertext on disk)
FILES_ENCRYPTED_COUNT: 0 production files (only test files, deleted); enabled going forward
MFA_REGRESSION: PASS
PHI_FILE_GUARD_REGRESSION: PASS (auth 401, tenant2 404, public 404, content-type pinning intact)
HEALTH_STATUS: local 5/5, domain 200
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS_COUNT: 150
KEY_PRINTED: NO
KEY_COMMITTED: NO
DPAPI_BLOB_COMMITTED: NO (blob outside repo, ACL-restricted)
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
RESTORE_IMPLICATIONS: DPAPI CurrentUser scope is bound to user 'ice' on this machine. A restore to a DIFFERENT machine/user/profile CANNOT unprotect the KEK -> encrypted mfa_secret/PHI become unrecoverable. The owner MUST escrow the raw KEK separately (secure offline) for disaster recovery; current data-loss risk is low (encryption just enabled, no production-critical encrypted data yet). Exclude the KEK blob from backups. Phase 2 (Vault/KMS) removes the machine-binding.
NEXT_RECOMMENDED_ACTION: PHASE_B_D1_OR_D2 (integration engine / FHIR sandbox) — or escrow KEK + plan Phase 2 Vault/KMS for regulatory private keys
```

## ملاحظات سلامة ومتبقّيات
- لم يُطبَع/يُلتزَم أي KEK/DPAPI blob/secret؛ `.env` و الـblob خارج Git.
- **متبقٍّ مهم — escrow الـKEK**: بدون نسخة استرداد آمنة منفصلة، فقدان جهاز/حساب 'ice' = فقدان البيانات المشفّرة. يُوصى بأن ينشئ المالك escrow.
- المفاتيح الخاصة التنظيمية (ZATCA CSID / NPHIES) تبقى موصى لها **Vault/HSM (المرحلة 2)** قبل الإنتاج — لا تُخزَّن بـDPAPI المحلي للإنتاج التنظيمي.
- لا مساس بالمحاسبة (OFF، journal=0) ولا R17.

تم اعتماد نموذج Hybrid DPAPI وتنفيذ تشفير A3 at-rest دون كشف مفاتيح أو تفعيل المحاسبة
