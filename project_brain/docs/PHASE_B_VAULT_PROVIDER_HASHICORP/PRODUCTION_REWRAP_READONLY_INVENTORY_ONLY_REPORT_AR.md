# Production Re-wrap — Read-Only Inventory — تقرير

> 2026-06-23 | بوابة `APPROVE_PRODUCTION_REWRAP_READONLY_INVENTORY_ONLY`. جرد إنتاجي **قراءة فقط** لما هو محمي بـDPAPI/KEK أو مُهيّأ للانتقال إلى HashiCorp Vault: عدّ ومواقع وأنواع ومخاطر — **بلا فك تشفير، بلا قراءة مفاتيح، بلا قراءة ciphertext، بلا re-wrap، بلا تعديل إنتاجي.**

## 1. الحالة النهائية
**FINAL_STATUS: PRODUCTION_REWRAP_READONLY_INVENTORY_READY.** اكتمل الجرد بأوامر read-only فقط (repo grep · filesystem metadata · DB داخل `BEGIN READ ONLY … ROLLBACK`). **اكتشاف رئيسي**: لا يوجد حالياً أي ciphertext at-rest في قاعدة البيانات (كل الأعمدة المرشّحة = 0 صف)؛ الأثر الوحيد القائم هو KEK واحد محمي بـDPAPI على القرص. الإنتاج لم يتغيّر.

## 2. المهارات الفعلية المفعّلة
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md` (أسماء فعلية بلاحقة `_SKILL_AR.md`). المُفعّلة: `NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_INTEGRATION_SANDBOX` · `NM_ZATCA_PHASE2` · `NM_NPHIES` · `NM_OBSERVABILITY_OPS` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. لا مهارة جديدة/مخترعة. **DELTA**: تباين توثيقي فقط؛ بلا أثر أمني.

## 3. ملخص Baseline (Gate 0)
`drift 0/0 · parent 5b0f9f1 · namaweb clean · health 200 · Redis PONG · FORCE_RLS=150 · journal=0`. سلسلة الـcommits متّسقة (c3ef404→d4b2003→ac0515e→5b0f9f1).

## 4. مراجعة الدليل السابق (Gate 1)
متّسق دون تناقض: re-wrap rehearsal (d4b2003) DUMMY_PASS · escrow/DR plan (ac0515e) READY · restore drill (5b0f9f1) DUMMY_PASS · REAL_KEYS/DPAPI_READ/PRIVATE_KEYS/CERTS/RE-WRAP = NO · MOJIBAKE = CLEAN.

## 5. نطاق الجرد وما استُبعد
**ضمن النطاق**: عدّ/مواقع/أنواع/metadata + مراجع الكود + schema الأعمدة المرشّحة. **مستبعَد**: فك تشفير · قراءة محتوى KEK/DPAPI · قراءة ciphertext كامل · `SELECT` لقيم حساسة · `cat/Get-Content` لملفات أسرار · تشغيل Vault · أي كتابة إنتاجية.

## 6. خطة الجرد read-only (Gate 2)
repo grep (أسماء/مواقع فقط) → filesystem metadata (exists/size/mtime/ACL، بلا محتوى) → DB `information_schema` + counts داخل معاملة read-only مع `statement_timeout=5s`/`lock_timeout=1s` ثم `ROLLBACK`. masking لاسم المستخدم في المسارات → `~`/`<user>`.

## 7. Secret-Safety Preflight (Gate 3)
لا أمر يطبع سرّاً؛ لا `cat/Get-Content` لملف سرّ؛ لا `SELECT` لقيم حساسة؛ لا قراءة محتوى `nama_kek.dpapi`؛ لا `ProtectedData.Unprotect`/decrypt؛ لم تُشغَّل أداة DPAPI حقيقية. فحص أطوال ciphertext (length) = metadata غير كاشف، مسموح.

## 8. جرد مراجع المستودع (Gate 4)
| المرجع | الملفات | التصنيف |
|---|---|---|
| `crypto_envelope.js` (AES-256-GCM، DPAPI KEK، ENCv1) | `namaweb/crypto_envelope.js` | KEK handling / envelope |
| استدعاءات `ce.encryptString/decryptString` لـ`mfa_secret` | `namaweb/server.js` (≈أسطر 334/348/380/409) | encrypted payload handling |
| `ce.encrypt/decryptToBuffer` لملفات PHI + عمود `encrypted` | `namaweb/server.js` (≈1411–1456) | encrypted payload handling (on-disk) |
| اختبارات الحارس | `a3_encryption_guard_test.js` · `a3a_phi_guard_test.js` | tests (لا أسرار) |
| `vault/transit/rewrap` | docs + `server.js` (نصوص/تعليقات) | Vault candidate (لا تنفيذ) |
| `zatca/nphies` (38 occ) | `server.js` · `db_postgres.js` · `app.js` · `admin.js` | ZATCA Phase-1 sim / أسماء خدمات (Cohort D/E) |
| `.pem` | `.venv/.../certifi/cacert.pem` | false positive (حزمة CA عامة) |
لا قيمة سرّية طُبعت.

## 9. جرد Filesystem Metadata (Gate 5 — بلا قراءة محتوى)
| Artifact | الحالة | metadata |
|---|---|---|
| `~/nama_kek.dpapi` | موجود | 262B · ACL owner=`DESKTOP-…\<user>` · access entries=1 (مقيّد) |
| أي `*.dpapi` أخرى | العدد=1 (هو نفسه KEK) | — |
| `~/Desktop/NamaMedical/namaweb/phi_vault/` | موجود | 0 ملف (لا PHI مشفّر مخزّن حالياً) |
| `nama_kek_escrow*.enc` | **غائب** (0) | متّسق مع escrow = PENDING_OWNER_ACTION |
| cert/key في repo | pem=1 (certifi) · pfx=0 · key=0 | لا مفتاح خاص/شهادة إنتاجية |
| `namaweb/.env` | موجود | 464B · **لم يُقرأ** (وجود فقط) |
ملاحظة: الطوابع الزمنية عُرضت بتقويم النظام (هجري) — لا يؤثر على الجرد.

## 10. جرد DB Metadata (Gate 6 — schema فقط)
الأعمدة المرشّحة (11) عبر `information_schema`:
`encryption_metadata.key_version` · `integration_settings.api_key` · `integration_settings.api_secret` · `user_mfa.mfa_secret` · `phi_files.encrypted` · `zatca_invoices.zatca_response` (ذات صلة) — و`cme_registrations.certificate_issued` · `company_settings.setting_key` · `tenant_settings.setting_key` · `finance_posting_account_map.process_key` · `mortuary_cases.death_certificate_number` (false positives). لم تُقرأ أي قيمة.

## 11. جرد DB Counts (Gate 7 — أعداد/أطوال فقط، بلا قيم)
| الجدول/العمود | total | non-null / encrypted | ملاحظة |
|---|---|---|---|
| `user_mfa.mfa_secret` | 0 | 0 (ENCv1=0) | لا MFA مُفعّل ⟹ لا ciphertext |
| `phi_files` | 0 | encrypted=0 · plaintext=0 | لا ملفات PHI مخزّنة |
| `integration_settings.api_secret` | 0 | 0 (ENCv1=0) | لا تكاملات مُهيّأة |
| `encryption_metadata` | 0 | distinct versions=0 | لا بيانات نسخ مفاتيح |
| `zatca_invoices` | 0 | — | Phase-1 sim، 0 صف |
**الخلاصة: 0 ciphertext at-rest في قاعدة البيانات حالياً.**

## 12. مجموعات إعادة التغليف (Re-wrap Cohorts) — Gate 8
| Cohort | الوصف | العدد | الموقع | الحساسية | جاهزية re-wrap | Blocker / إجراء المالك |
|---|---|---|---|---|---|---|
| **A** | KEK/DPAPI artifact | 1 | `~/nama_kek.dpapi` | حرجة | عالية (الوحيد القائم) | escrow أولاً + Vault مُقسّى؛ swap حماية KEK فقط |
| **B** | أسرار تطبيق مشفّرة at-rest | **0 صف** (الأعمدة قائمة) | `user_mfa.mfa_secret` · `phi_files` · `integration_settings.api_secret` | عالية | عالية (فارغة الآن) | لا بيانات لترحيلها؛ نافذة الآن مثالية |
| **C** | مراجع شهادات | 0 إنتاجية (1 false) | certifi `cacert.pem` | منخفضة | لا ينطبق | لا شيء |
| **D** | مراجع ZATCA/NPHIES (بلا اتصال) | zatca_invoices=0؛ NPHIES غائب | `zatca_invoices` · `integration_settings` | عالية (تنظيمية مستقبلية) | محجوبة | onboarding + بنية مفاتيح PKI/HSM؛ بلا CSR/OTP/شهادة |
| **E** | false positives | 6 | أعمدة إعدادات/أرقام + certifi | منخفضة | لا ينطبق | لا شيء |
| **F** | يتطلب تأكيد المالك | 1 | `namaweb/.env` (464B، لم يُقرأ) | عالية | — | تأكيد أي أسرار runtime (DB/session/NAMA_KEK_PATH) تنتمي لـVault kv مستقبلاً |

## 13. تصنيف المخاطر
- أعلى خطر قائم: **KEK واحد محمي بـDPAPI (Cohort A)** = نقطة فشل وحيدة حتى escrow مُثبت.
- الترحيل الآن **منخفض المخاطر استثنائياً**: لا ciphertext بيانات (Cohort B=0)، فـre-wrap يمسّ حماية KEK فقط لا بيانات.
- `.env` (Cohort F) أسرار runtime مستوى‑بيئة (ليست enveloped) — قرار حوكمي منفصل لنقلها إلى Vault kv.
- ZATCA/NPHIES (Cohort D) تبقى محجوبة على بنية مفاتيح + onboarding.

## 14. Blockers
1. escrow الـKEK الفعلي لم يُنفَّذ (PENDING_OWNER_ACTION) — يجب أن يسبق أي re-wrap إنتاجي.
2. Vault إنتاجي غير مُقسّى (raft/TLS/unseal/audit) بعد.
3. لا نافذة صيانة / rollback plan معتمدان بعد للـre-wrap.
4. RPO/RTO غير مُثبتين إنتاجياً (PARTIAL من البوابة السابقة).

## 15. إجراءات المالك المطلوبة
- تشغيل `ops/security/nama_kek_escrow.ps1` (passphrase ≥12، نقل الـ.enc خارج الموقع، استبعاد blob من النسخ).
- تأكيد محتوى `.env` (Cohort F) وأي أسرار تكامل مستقبلية لـVault kv.
- اعتماد تقسية Vault الإنتاجي + نافذة صيانة + rollback قبل re-wrap.

## 16. Production Impact Check (Gate 9)
health 200 · Redis PONG · FORCE_RLS=150 · journal=0 · لا حاوية Vault · لا restart/deploy/DB mutation. كل استعلامات DB داخل `READ ONLY` + `ROLLBACK`.

## 17–21. الإثباتات
- **No real keys read** (17): لم يُفتح/يُقرأ محتوى `nama_kek.dpapi`؛ metadata فقط (size/ACL). REAL_KEYS_READ/USED/CREATED = NO.
- **No DPAPI read** (18): لا `ProtectedData`/decrypt؛ لا أداة DPAPI شُغّلت. DPAPI_READ = NO.
- **No decrypt** (19): DECRYPT_ATTEMPTED = NO.
- **No ciphertext dump** (20): لم يُقرأ أي ciphertext؛ فقط counts/أطوال/prefix-format. CIPHERTEXT_VALUES_READ = NO · CIPHERTEXT_DUMPED = NO.
- **No production changes** (21): PRODUCTION_CHANGES = NONE · DDL/DATA/CODE = NO.

## 22. نتائج Hygiene
`git diff --check`: تنبيهات على ملفات STITCH خارج النطاق فقط (غير مُجهّزة). المُجهّز = هذا التقرير فقط (لم تُنشأ أداة جرد — استُخدمت أوامر read-only مباشرة). لا أسرار/ciphertext في الـdiff.

## 23. نتائج Mojibake audit
لا BOM · لا U+FFFD · لا Latin-1 mis-decode. CLEAN.

## 24. Gates المطلوبة قبل Production Re-wrap
escrow فعلي (مالك) · DR معتمد · restore drill مقبول (تم dummy) · **inventory read-only مكتمل (هذه البوابة)** · Vault إنتاجي مُقسّى · backup مُتحقَّق · نافذة صيانة · rollback plan · موافقة صريحة جديدة · ZATCA/NPHIES تبقى مفصولة · المحاسبة OFF.

## 25. الخطوة التالية المقترحة
**NEXT_RECOMMENDED_ACTION: APPROVE_OWNER_KEK_ESCROW_EXECUTION_WINDOW_ONLY** (تنفيذ المالك لـescrow الـKEK — أعلى خطر قائم وشرط مسبق لكل ما بعده). بدائل متوازية: `APPROVE_VAULT_PRODUCTION_HARDENING_PLAN_ONLY` أو `APPROVE_PRODUCTION_REWRAP_DRY_RUN_PLAN_ONLY`. **لا انتقال إلى production re-wrap** إلا بعد اكتمال بنود القسم 24 وموافقة صريحة جديدة.

## الحقول
```text
FINAL_STATUS: PRODUCTION_REWRAP_READONLY_INVENTORY_READY
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_INTEGRATION_SANDBOX, NM_ZATCA_PHASE2, NM_NPHIES, NM_OBSERVABILITY_OPS, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
PREVIOUS_REWRAP_REHEARSAL_REVIEWED: YES (d4b2003)
KEK_ESCROW_DR_PLAN_REVIEWED: YES (ac0515e)
RESTORE_DRILL_DUMMY_REVIEWED: YES (5b0f9f1)
PRODUCTION_INVENTORY_RUN: YES
READ_ONLY_ONLY: YES
REPO_REFERENCE_INVENTORY_DONE: YES
FILESYSTEM_METADATA_INVENTORY_DONE: YES
DB_METADATA_INVENTORY_DONE: YES
DB_COUNT_INVENTORY_DONE: YES
CIPHERTEXT_VALUES_READ: NO
CIPHERTEXT_DUMPED: NO
REAL_KEYS_CREATED: NO
REAL_KEYS_READ: NO
REAL_KEYS_USED: NO
DPAPI_READ: NO
DECRYPT_ATTEMPTED: NO
PRIVATE_KEYS_HANDLED: NO
REAL_CERTIFICATES_USED: NO
VAULT_PRODUCTION_DEPLOYED: NO
VAULT_SANDBOX_RUN: NO
PRODUCTION_REWRAP_RUN: NO
PRODUCTION_CHANGES: NONE
DDL: NO
DATA_CHANGED: NO
CODE_DEPLOYED: NO
ZATCA_CALLS: NO
NPHIES_CALLS: NO
EXTERNAL_HEALTHCARE_CALLS: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS: 150
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
FORCE_PUSH_USED: NO
MOJIBAKE_AUDIT: CLEAN
GIT_PARENT: 5b0f9f1
GIT_COMMIT: (انظر سطر الإغلاق بعد الدفع)
DRIFT: 0/0
NEXT_RECOMMENDED_ACTION: APPROVE_OWNER_KEK_ESCROW_EXECUTION_WINDOW_ONLY
```

تم تنفيذ جرد إنتاجي قراءة فقط حدّد الأثر (KEK واحد بـDPAPI + 0 ciphertext في قاعدة البيانات حالياً) والمخاطر والمجموعات، دون فك تشفير أو قراءة مفاتيح أو ciphertext أو أي تغيير إنتاجي
