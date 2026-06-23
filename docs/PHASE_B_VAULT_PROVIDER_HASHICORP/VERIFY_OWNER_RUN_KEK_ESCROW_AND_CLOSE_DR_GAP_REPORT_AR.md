# التحقق من تنفيذ المالك لـKEK Escrow وإغلاق فجوة DR — تقرير

> 2026-06-23 | بوابة `VERIFY_OWNER_RUN_KEK_ESCROW_AND_CLOSE_DR_GAP`. تحقق **read-only** فقط من تنفيذ المالك للـescrow. **شرط بدء التحقق لم يتحقق**: لم يُقدّم المالك في هذه البوابة تصريحاً بأنه نفّذ escrow ولا دليل metadata معقّم، والملف الناتج غائب. لذا تُغلق هذه البوابة على فرع **PENDING_OWNER_EXECUTION** (ليست فشلاً). الوكيل لم يلمس KEK/DPAPI/escrow.

## 1. الحالة النهائية
**FINAL_STATUS: OWNER_KEK_ESCROW_VERIFICATION_PENDING_OWNER_EXECUTION** — لا يوجد escrow artifact، ولا تصريح مالك. لم تُغلق فجوة DR بعد. الإنتاج لم يتغيّر.

## 2. المهارات الفعلية المفعّلة
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md` (لاحقة `_SKILL_AR.md`). المُفعّلة: `NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` (الأساس) · `NM_INTEGRATION_SANDBOX` · `NM_ZATCA_PHASE2` · `NM_NPHIES` · `NM_OBSERVABILITY_OPS` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. لا مهارة جديدة/مخترعة. **DELTA**: تباين توثيقي فقط.

## 3. مراجعة الدليل السابق
سلسلة Vault متّسقة دون تناقض: provider (c3ef404) · rehearsal DUMMY_PASS (d4b2003) · escrow/DR plan READY (ac0515e) · restore drill DUMMY_PASS (5b0f9f1) · inventory READY مع 0 ciphertext + KEK واحد (44ec2eb) · execution window READY مع ESCROW_EXECUTION=PENDING_OWNER_ACTION (97d6880). لا KEK/DPAPI قرأه الوكيل، لا decrypt، لا re-wrap، mojibake نظيف.

## 4. Owner Attestation Summary (بلا أسرار)
- تصريح المالك بتنفيذ escrow في هذه البوابة: **غير مُقدَّم**.
- دليل metadata معقّم من المالك: **غير مُقدَّم**.
- لم يُرسَل أي سرّ/مفتاح/passphrase/محتوى ملف (لا حادثة تسريب).

## 5. Metadata Verification (read-only)
- `~/nama_kek_escrow*.enc`: **العدد = 0 (غائب)**؛ `~/nama_kek_escrow.enc` ABSENT.
- لم يُفتح أي ملف، لم يُقرأ محتوى، لم يُحسب hash محتوى.
- (مرجعي) KEK الحيّ ما زال موجوداً 262B بـACL مقيّد — لم يُقرأ محتواه.

## 6. Git Exclusion Check
- لا escrow artifact في `git status` (غير موجود أصلاً).
- تقوية دفاعية لـ`.gitignore` (guard config آمن): أُضيفت أنماط `*kek*.enc` · `*.escrow` · `*.escrow.enc` · `*dpapi*.backup` · `nama_kek*.dpapi` فوق التغطية القائمة (`nama_kek_escrow*.enc` · `*.kek.escrow`). لا كسر لملفات مشروعة (لا `*.enc` مشروعة في المستودع).

## 7. Owner Recovery Evidence Review
- لم يُشغّل الوكيل أي recovery.
- لا تصريح مالك بأن recover verification تم إلى مسار مؤقت (لعدم تنفيذ escrow بعد).
- التصنيف: **لم يُنشأ escrow بعد** ⟹ ليس ESCROW_CREATED_RECOVERY_NOT_VERIFIED بل PENDING_OWNER_EXECUTION.

## 8. Production No-change Check
health 200 · Redis PONG · FORCE_RLS=150 · journal=0 · لا restart/deploy/DB mutation · لا Vault. كل الفحوص read-only.

## 9. DR Gap Decision
**DR_GAP_STATUS: OPEN_PENDING_OWNER_EXECUTION.** لا يوجد escrow artifact ⟹ DPAPI يبقى نقطة فشل وحيدة حتى ينفّذ المالك الـescrow ويتحقق منه (recover إلى مسار مؤقت) وينقله offline مع فصل الـpassphrase.

## 10–15. إثباتات حدود الوكيل
`AGENT_REAL_KEYS_READ: NO` · `AGENT_DPAPI_READ: NO` · `AGENT_DECRYPT_ATTEMPTED: NO` · `AGENT_ESCROW_CONTENT_READ: NO` · `AGENT_RECOVERY_RUN: NO` · `PRODUCTION_REWRAP_RUN: NO` · `PRODUCTION_CHANGES: NONE` (التغيير الوحيد = هذا التقرير + تقوية `.gitignore`) · `DDL/DATA/CODE: NO`.

## 16. نتائج Hygiene
`git diff --check`: تنبيهات على ملفات STITCH خارج النطاق فقط. المُجهّز = هذا التقرير + `.gitignore` (guard آمن) فقط. لا أسرار/escrow artifact في الـdiff.

## 17. نتائج Mojibake audit
لا BOM/U+FFFD/Latin-1 mis-decode = CLEAN.

## 18. المخاطر المتبقية
- **فجوة DR مفتوحة**: DPAPI نقطة فشل وحيدة حتى يكمل المالك الـescrow + التحقق + النقل offline.
- DR عبر آلة أخرى غير مُثبت (drill منفصل لاحق).
- Vault إنتاجي غير مُقسّى؛ re-wrap الإنتاجي محجوب.

## 19. ملاحظة constant-time MAC
أداة `nama_kek_escrow.ps1` تقارن الـMAC عبر `SequenceEqual` (ليست constant-time). خطر مهمَل لملف escrow غير متصل، لكن يُستحسن تحويلها إلى مقارنة ثابتة الزمن قبل أي استخدام متكرر/آلي — بوابة `APPROVE_ESCROW_TOOL_CONSTANT_TIME_MAC_HARDENING_ONLY`.

## 20. الخطوة التالية المقترحة
**ينفّذ المالك الـescrow** وفق Runbook القسم 7 من `OWNER_KEK_ESCROW_EXECUTION_WINDOW_ONLY_REPORT_AR.md`، ثم يقدّم تصريحاً + دليل metadata معقّم (exists/size/mtime/permissions/outside-repo/recover-verified/offline-custody/passphrase-separated). عندها يُعاد تشغيل `VERIFY_OWNER_RUN_KEK_ESCROW_AND_CLOSE_DR_GAP` لإغلاق الفجوة (DR_GAP_CLOSED_METADATA_ONLY).
بالتوازي (لا يحتاج الـescrow): `APPROVE_ESCROW_TOOL_CONSTANT_TIME_MAC_HARDENING_ONLY` أو `APPROVE_VAULT_PRODUCTION_HARDENING_PLAN_ONLY` أو `APPROVE_PRODUCTION_REWRAP_DRY_RUN_PLAN_ONLY`. **لا production re-wrap** قبل إغلاق فجوة DR + بقية بنود ما قبل الإنتاج + موافقة صريحة جديدة.

## الحقول
```text
FINAL_STATUS: OWNER_KEK_ESCROW_VERIFICATION_PENDING_OWNER_EXECUTION
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_INTEGRATION_SANDBOX, NM_ZATCA_PHASE2, NM_NPHIES, NM_OBSERVABILITY_OPS, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
OWNER_WINDOW_REVIEWED: YES (97d6880)
OWNER_ESCROW_EXECUTED: NO_NOT_ATTESTED
OWNER_ESCROW_METADATA_VERIFIED: NOT_APPLICABLE_ARTIFACT_ABSENT
ESCROW_ARTIFACT_EXISTS: NO
ESCROW_ARTIFACT_OUTSIDE_REPO: N/A (absent; target path is outside repo)
ESCROW_ARTIFACT_GIT_IGNORED: YES (patterns in place + hardened)
ESCROW_ARTIFACT_COMMITTED: NO
OWNER_RECOVERY_ATTESTED: NO
OWNER_OFFLINE_CUSTODY_ATTESTED: NO
PASSPHRASE_CUSTODY_SEPARATED: NO_NOT_ATTESTED
DR_GAP_STATUS: OPEN_PENDING_OWNER_EXECUTION
AGENT_REAL_KEYS_READ: NO
AGENT_DPAPI_READ: NO
AGENT_DECRYPT_ATTEMPTED: NO
AGENT_ESCROW_CONTENT_READ: NO
AGENT_RECOVERY_RUN: NO
REAL_KEYS_CREATED_BY_AGENT: NO
REAL_KEYS_USED_BY_AGENT: NO
PRIVATE_KEYS_HANDLED_BY_AGENT: NO
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
GIT_PARENT: 97d6880
GIT_COMMIT: (انظر سطر الإغلاق بعد الدفع)
DRIFT: 0/0
NEXT_RECOMMENDED_ACTION: OWNER_EXECUTES_ESCROW_THEN_RERUN_VERIFY (بالتوازي: APPROVE_ESCROW_TOOL_CONSTANT_TIME_MAC_HARDENING_ONLY / APPROVE_VAULT_PRODUCTION_HARDENING_PLAN_ONLY)
```

تعذّر التحقق من escrow لعدم تنفيذ المالك له بعد وغياب الملف الناتج؛ أُغلقت البوابة على فرع PENDING_OWNER_EXECUTION دون أن يلمس الوكيل أي مفتاح أو يقرأ DPAPI أو يغيّر الإنتاج، مع تقوية دفاعية لمنع التزام أي artifact escrow
