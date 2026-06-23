# التحقّق من تنفيذ المالك لـ KEK Escrow وإغلاق فجوة DR — تقرير

> 2026-06-23 | تنفيذ `VERIFY_OWNER_RUN_KEK_ESCROW_AND_CLOSE_DR_GAP`. **تحقّق read-only + metadata فقط.** لم يقرأ الوكيل KEK ولا DPAPI ولا محتوى ملف escrow؛ لم يشغّل الأداة ولا recovery ولا فك تشفير؛ لا production re-wrap؛ لا تغيير إنتاجي.

## الحالة النهائية
**`OWNER_KEK_ESCROW_VERIFICATION_PENDING_OWNER_EXECUTION`** — لم يُرفَق في هذا الطلب **إثبات (attestation) من المالك** بتنفيذ الـescrow (لا مسار مقنّع/حجم/وقت تعديل، ولا إثبات recovery/offline custody/passphrase). وبفحص الـmetadata، **لا يوجد ملف escrow محلّي** عند المسار الافتراضي. لذلك **فجوة DR لم تُغلَق** — بانتظار تنفيذ/إثبات المالك.

## المهارات الفعلية المفعّلة
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md`: `NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_OBSERVABILITY_OPS` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. لا مهارة جديدة/مخترعة.

## ملخّص إثبات المالك (Gate 1)
- **لم يُقدَّم إثبات تنفيذ** ضمن هذا الطلب: لا `OWNER_ESCROW_EXECUTED: YES`، ولا مسار/حجم/وقت تعديل، ولا إثبات recovery، ولا offline custody، ولا فصل passphrase.
- **لم يُرسِل المالك أي سرّ/passphrase/محتوى ملف** ⟹ لا حادث (incident) يُسجَّل. لم يُحفَظ أي مادة مفتاحية في هذا التقرير.

## التحقّق من الـMetadata (Gate 2 — بلا فتح أي ملف)
- **ملف escrow الافتراضي** (`~/nama_kek_escrow.enc`): **غير موجود**. لا ملفات بنمط escrow/`*kek*.enc`/`*.escrow` في مجلّد المستخدم.
  - ملاحظة تفسير: الغياب يحتمل أمرين لا يمكن للوكيل التمييز بينهما بلا إثبات المالك: (أ) لم يُنفَّذ بعد، أو (ب) نُفِّذ ونُقِل الملف offline مع حذف النسخة المحلّية (وهو الوضع النهائي المطلوب في الـRunbook). الإغلاق يتطلّب إثبات المالك.
- **KEK الحيّ** (`~/nama_kek.dpapi`): موجود، الحجم 262B، وقت التعديل `2026-06-23 00:05` (يسبق جلسة التحقّق هذه — **لم يتغيّر**). **metadata فقط؛ لم يُقرأ المحتوى.**

## مراجعة إثبات Recovery (Gate 3)
- لم يُشغّل الوكيل recovery. **لا يوجد إثبات recovery من المالك** ⟹ لا يمكن إعلان إغلاق DR. (حتى لو وُجد artifact لاحقاً بلا إثبات recovery، يكون التصنيف `OWNER_KEK_ESCROW_CREATED_RECOVERY_NOT_VERIFIED`.)
- KEK/DPAPI الحيّ لم يتغيّر (وقت التعديل ثابت).

## نظافة Git/Artifact (Gate 4)
- **لا artifact escrow/KEK متتبَّع في git**: المطابقات في التتبّع هي تقارير `.md` + سكربت `nama_kek_escrow.ps1` فقط (السكربت **خالٍ من أي مادة مفتاحية وآمن للالتزام** بنصّه الصريح). لا `.enc`/`.dpapi` مفتاحي ملتزَم.
- **تغطية `.gitignore` شاملة ومُثبَتة بـ`git check-ignore`**: `nama_kek_escrow*.enc` · `*kek*.enc` · `*.escrow` · `*.escrow.enc` · `*dpapi*.backup` · `nama_kek*.dpapi` — جميعها تُحجَب (أُثبِت أن `nama_kek_escrow.enc`/`test.escrow`/`test_kek.enc`/`nama_kek.dpapi` ستُتجاهَل لو وُضعت في المستودع).
- secrets scan على diff التقرير = لا تطابق.

## فحص عدم التغيير الإنتاجي (Gate 5، read-only)
health=200 · login=200 · **PM2 restarts=5 (لا إعادة تشغيل جديدة)** · FORCE_RLS=**150** · جداول المحاسبة=0 (OFF، journal 0) · لا DB/DDL/data · لا ZATCA/NPHIES/external.

## قرار فجوة DR (Gate 6)
**PENDING_OWNER_EXECUTION** — لا إثبات مالك ولا artifact محلّي ⟹ لا تُغلَق الفجوة. لإغلاقها لاحقاً يلزم من المالك إرسال إثبات **معقّم** (بلا أسرار) يتضمّن: تنفيذ escrow + مسار مقنّع + حجم > 0 + وقت تعديل ضمن نافذة التنفيذ + الصلاحيات ليست world-readable + خارج المستودع + recovery تم التحقّق منه إلى مسار مؤقت ثم حُذف + حفظ offline + فصل passphrase.

## إثباتات حدود الوكيل (التزام النطاق)
- **AGENT_REAL_KEYS_READ: NO** — لم يُقرأ أي KEK.
- **AGENT_DPAPI_READ: NO** — لم يُقرأ محتوى `~/nama_kek.dpapi` (metadata فقط: حجم/وقت).
- **AGENT_ESCROW_CONTENT_READ: NO** — لا ملف escrow أصلاً، ولم يُفتح أي ملف بنمط escrow؛ لا hash لمحتوى.
- **AGENT_DECRYPT_ATTEMPTED: NO** · **AGENT_RECOVERY_RUN: NO** · لم يُشغَّل `nama_kek_escrow.ps1` (قُرئ كنصّ برمجي فقط لمعرفة مسار الإخراج الافتراضي).
- **PRODUCTION_REWRAP_RUN: NO** · **VAULT_PRODUCTION_DEPLOYED: NO** · **PRODUCTION_CHANGES: NONE**.

## المخاطر المتبقّية
- **فجوة DR مفتوحة:** KEK الحالي ما زال مربوطاً بـDPAPI (machine/user-bound). فقدان الجهاز/الحساب دون escrow offline = فقدان القدرة على فكّ PHI المشفّر at-rest. **هذا هو الخطر الأساسي المعلّق** ويتطلّب إجراء المالك.
- التخفيف الجاهز: الأداة + الـRunbook + تغطية gitignore + تمرين restore الوهمي — كلها مُعدّة؛ ينقص التنفيذ الفعلي + الإثبات.

## ملاحظة constant-time MAC
الأداة **تستخدم بالفعل** مقارنة constant-time (`CtEqual`، الأسطر 37-43: لا خروج مبكر، XOR/OR تراكمي) — تحسين P2 **مُنفَّذ** لا معلّق (مطابق لتقرير ESCROW_TOOL_CONSTANT_TIME_MAC_HARDENING). لا حاجز.

## الحقول
```text
FINAL_STATUS: OWNER_KEK_ESCROW_VERIFICATION_PENDING_OWNER_EXECUTION
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_OBSERVABILITY_OPS, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
OWNER_ESCROW_EXECUTED: NO_ATTESTATION_PROVIDED
OWNER_ESCROW_METADATA_VERIFIED: NO (no local artifact found)
ESCROW_ARTIFACT_EXISTS: NO (default path absent; may be offline — owner attestation needed)
ESCROW_ARTIFACT_OUTSIDE_REPO: YES (none in repo; gitignore-covered)
ESCROW_ARTIFACT_GIT_IGNORED: YES (proven via git check-ignore)
ESCROW_ARTIFACT_COMMITTED: NO
OWNER_RECOVERY_ATTESTED: NO
OWNER_OFFLINE_CUSTODY_ATTESTED: NO
PASSPHRASE_CUSTODY_SEPARATED: NO_ATTESTATION
DR_GAP_STATUS: OPEN_PENDING_OWNER_EXECUTION
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
GIT_PARENT: 5d75f6a -> (this report commit)
GIT_COMMIT: namaweb 0bb8fa2 (unchanged) / parent (this report commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: المالك ينفّذ ops/security/nama_kek_escrow.ps1 (escrow ثم recover verify إلى مسار مؤقت ثم نقل offline + فصل passphrase)، ثم يرسل إثباتاً معقّماً (بلا أسرار) لإعادة هذه البوابة وإغلاق DR metadata-only
```

لم يُرفَق إثبات تنفيذ من المالك ولا يوجد artifact escrow محلّي ⟹ فجوة DR تبقى مفتوحة. أدوات/خطة/تغطية gitignore جاهزة ومُثبَتة، والـMAC constant-time منفّذ مسبقاً؛ ينقص تنفيذ المالك للـescrow + recovery + الإثبات المعقّم. لم يقرأ الوكيل أي KEK/DPAPI/escrow ولم يشغّل أداة/recovery ولم يغيّر الإنتاج.
