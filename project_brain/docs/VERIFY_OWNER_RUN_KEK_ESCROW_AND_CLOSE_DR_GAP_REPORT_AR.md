# التحقّق من تنفيذ المالك لـ KEK Escrow وإغلاق فجوة DR — تقرير

> 2026-06-23 | تنفيذ `VERIFY_OWNER_RUN_KEK_ESCROW_AND_CLOSE_DR_GAP` (الجولة الثانية — بعد إثبات المالك). **تحقّق read-only + metadata فقط.** لم يقرأ الوكيل KEK ولا DPAPI ولا محتوى ملف escrow؛ لم يشغّل الأداة ولا recovery ولا فك تشفير؛ لا production re-wrap؛ لا تغيير إنتاجي.

## الحالة النهائية
**`OWNER_KEK_ESCROW_DR_GAP_CLOSED_METADATA_ONLY`** — قدّم المالك إثباتاً معقّماً كاملاً (تنفيذ + recovery + حذف المؤقت + offline custody + فصل passphrase)، وسانَدت فحوص الوكيل الـmetadata/read-only الإثبات دون أي وصول لمادة مفتاحية. **فجوة DR أُغلقت metadata-only.**

## المهارات الفعلية المفعّلة
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md`: `NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_OBSERVABILITY_OPS` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. لا مهارة جديدة/مخترعة.

## ملخّص إثبات المالك المعقّم (Gate 1)
| الحقل | القيمة (كما صرّح المالك) |
|---|---|
| OWNER_ESCROW_EXECUTED | YES_OWNER_ATTESTED |
| ESCROW_ARTIFACT_EXISTS | YES |
| ESCROW_ARTIFACT_MASKED_PATH | OFFLINE_SECURE_STORAGE |
| ESCROW_ARTIFACT_SIZE | OFFLINE_NOT_RETAINED_LOCALLY (نُقل offline، لا نسخة محلّية) |
| ESCROW_ARTIFACT_MODIFIED_TIME | OFFLINE_NOT_RETAINED_LOCALLY |
| ESCROW_ARTIFACT_OUTSIDE_REPO | YES |
| ESCROW_ARTIFACT_GIT_IGNORED | YES |
| OWNER_RECOVERY_ATTESTED | YES_OWNER_ATTESTED |
| TEMP_RECOVERY_OUTPUT_DELETED | YES |
| OWNER_OFFLINE_CUSTODY_ATTESTED | YES_OWNER_ATTESTED |
| PASSPHRASE_CUSTODY_SEPARATED | YES_OWNER_ATTESTED |
| NO_SECRETS_SHARED | YES |

**لم يُرسِل المالك أي passphrase/محتوى ملف/مادة مفتاحية ⟹ لا حادث (incident).** لم تُحفَظ أي مادة حسّاسة في هذا التقرير.

## التحقّق من الـMetadata (Gate 2 — بلا فتح أي ملف)
- المالك صرّح أن الـartifact نُقل بالكامل إلى **OFFLINE_SECURE_STORAGE** ولم تبقَ نسخة محلّية ⟹ قُبِل offline attestation؛ **لم يحاول الوكيل الوصول للوسيط offline** (size/mtime محلّيان غير منطبقين، وهذا متّسق).
- تأكيد read-only أنه **لا توجد نسخة محلّية** من `~/nama_kek_escrow.enc` (متّسق مع النقل offline).
- **لا artifact escrow/KEK متتبَّع في git** (لا `.enc`/`.dpapi`/`.escrow`). لم يُفتح أي ملف ولم يُحسَب hash لمحتوى.

## مراجعة إثبات Recovery (Gate 3)
- المالك صرّح أن recovery تم إلى **مسار مؤقت** (`nama_kek_recover_test.tmp`) ثم حُذف.
- **تأكيد الوكيل (read-only):** لا أثر للملف المؤقت (`~/nama_kek_recover_test.tmp` غير موجود) ⟹ متّسق مع `TEMP_RECOVERY_OUTPUT_DELETED: YES`.
- **KEK الحيّ لم يتغيّر:** `~/nama_kek.dpapi` لا يزال 262B ووقت تعديله `2026-06-23 00:05` (يسبق نافذة هذا التحقّق) ⟹ يثبت أن recovery ذهب إلى مؤقت **وليس فوق** KEK الحيّ، وأن الوكيل لم يمسّه (metadata فقط).

## نظافة Git/Artifact (Gate 4)
- لا artifact escrow/KEK داخل المستودع (المطابقات السابقة كانت تقارير `.md` + السكربت الآمن فقط).
- تغطية `.gitignore` مُثبَتة بـ`git check-ignore`: `nama_kek_escrow.enc` · `test.escrow` · `test_kek.enc` · `nama_kek.dpapi` — جميعها تُحجَب (الأنماط: `nama_kek_escrow*.enc`/`*kek*.enc`/`*.escrow`/`*.escrow.enc`/`*dpapi*.backup`/`nama_kek*.dpapi`).
- secrets scan على diff التقرير = لا تطابق. لم يُلتزَم أي artifact.

## فحص عدم التغيير الإنتاجي (Gate 5، read-only)
health=200 · login=200 · **PM2 restarts=5 (لا إعادة تشغيل)** · FORCE_RLS=**150** · جداول المحاسبة=0 (OFF، journal 0) · لا DB/DDL/data · لا ZATCA/NPHIES/external.

## قرار فجوة DR (Gate 6)
كل شروط الإغلاق متحقّقة: artifact موثّق (offline) + خارج repo + git-ignored + غير ملتزَم + owner recovery attested + temp output deleted + offline custody attested + passphrase separated ⟹ **`CLOSED_METADATA_ONLY`**. الآن KEK محمي بنسخة escrow offline مفصولة عن ربط DPAPI الآلي ⟹ التعافي ممكن على جهاز/مستخدم آخر عبر passphrase المالك.

## تصحيح ملاحظة MAC
الأداة تستخدم بالفعل مقارنة constant-time (`CtEqual`، الأسطر 37-43) ⟹ `CT_EQUAL_PRESENT_NO_OPEN_GAP`. لا فجوة معلّقة.

## إثباتات حدود الوكيل
AGENT_REAL_KEYS_READ: NO · AGENT_DPAPI_READ: NO · AGENT_DECRYPT_ATTEMPTED: NO · AGENT_ESCROW_CONTENT_READ: NO · AGENT_RECOVERY_RUN: NO · لم يُشغَّل `nama_kek_escrow.ps1` · PRODUCTION_REWRAP_RUN: NO · VAULT_PRODUCTION_DEPLOYED: NO · PRODUCTION_CHANGES: NONE.

## المخاطر المتبقّية
- **اعتماد على عهدة المالك:** أمان النسخة offline + سرّية الـpassphrase + فصلهما = مسؤولية تشغيلية مستمرّة للمالك (يُنصح باختبار recovery دوري + تخزين مزدوج offline).
- **المسار الأساسي لم يتغيّر:** KEK ما زال DPAPI CurrentUser محلّياً؛ الـescrow يوفّر التعافي فقط، لا يغيّر نموذج التشغيل اليومي.
- ترقية اختيارية لاحقة: Vault/KMS مركزي (candidate موثّق سابقاً) — بوابة منفصلة.

## الحقول
```text
FINAL_STATUS: OWNER_KEK_ESCROW_DR_GAP_CLOSED_METADATA_ONLY
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_OBSERVABILITY_OPS, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
OWNER_ESCROW_EXECUTED: YES_OWNER_ATTESTED
OWNER_ESCROW_METADATA_VERIFIED: YES_METADATA_ONLY
ESCROW_ARTIFACT_EXISTS: YES
ESCROW_ARTIFACT_MASKED_PATH: OFFLINE_SECURE_STORAGE
ESCROW_ARTIFACT_OUTSIDE_REPO: YES
ESCROW_ARTIFACT_GIT_IGNORED: YES (proven via git check-ignore)
ESCROW_ARTIFACT_COMMITTED: NO
OWNER_RECOVERY_ATTESTED: YES_OWNER_ATTESTED
TEMP_RECOVERY_OUTPUT_DELETED: YES (corroborated: no temp file present)
OWNER_OFFLINE_CUSTODY_ATTESTED: YES_OWNER_ATTESTED
PASSPHRASE_CUSTODY_SEPARATED: YES_OWNER_ATTESTED
DR_GAP_STATUS: CLOSED_METADATA_ONLY
MAC_CONSTANT_TIME_STATUS: CT_EQUAL_PRESENT_NO_OPEN_GAP
AGENT_REAL_KEYS_READ: NO
AGENT_DPAPI_READ: NO
AGENT_DECRYPT_ATTEMPTED: NO
AGENT_ESCROW_CONTENT_READ: NO
AGENT_RECOVERY_RUN: NO
REAL_KEYS_CREATED_BY_AGENT: NO
REAL_KEYS_USED_BY_AGENT: NO
PRIVATE_KEYS_HANDLED_BY_AGENT: NO
VAULT_PRODUCTION_DEPLOYED: NO
PRODUCTION_REWRAP_RUN: NO
PRODUCTION_CHANGES: NONE
PM2_RESTARTED: NO
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
MOJIBAKE_AUDIT: CLEAN
GIT_PARENT: 9c2698f -> (this report commit)
GIT_COMMIT: namaweb 0bb8fa2 (unchanged) / parent (this report commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: اختياري بموافقة منفصلة — APPROVE_VAULT_PRODUCTION_HARDENING_PLAN_ONLY / APPROVE_CSP_REPORT_REVIEW_AND_ENFORCEMENT_PLAN_ONLY / APPROVE_CSRF_TOKEN_STRICT_MODE_PLAN_ONLY / APPROVE_PRODUCTION_REWRAP_DRY_RUN_PLAN_ONLY
```

أُغلقت فجوة DR metadata-only بناءً على إثبات المالك المعقّم وتأكيد الوكيل read-only (لا artifact في repo، gitignore مُثبَت، KEK الحيّ غير متغيّر، لا temp متبقٍّ، الثوابت محفوظة). لم يقرأ الوكيل أي KEK/DPAPI/escrow ولم يشغّل أداة/recovery ولم يغيّر الإنتاج. المتبقّي عهدة تشغيلية على المالك (offline + passphrase).
