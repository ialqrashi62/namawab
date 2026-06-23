# نشر Vault Production على مضيف معزول — تقرير (محجوب)

> 2026-06-23 | تنفيذ `APPROVE_VAULT_PRODUCTION_DEPLOYMENT_ISOLATED_HOST_ONLY`. **توقّف آمن عند شرط البدء:** لا يوجد مضيف معزول جاهز. لم يُنشر Vault، لم يُشغَّل Docker/حاوية، لا تغيير إنتاجي.

## الحالة النهائية
**`VAULT_PRODUCTION_DEPLOYMENT_BLOCKED_NO_ISOLATED_HOST`** — شرط البدء (`VAULT_HOST_READY: YES` + تفاصيل المضيف المعزول) **لم يُستوفَ**: كتلة الإثبات وصلت كقالب فارغ، ولا مضيف منفصل متاح/قابل للوصول. القاعدة الصريحة في التوجيه: التوقّف فوراً وكتابة هذا التصنيف. لم أنشر Vault على الصندوق المشترك (وهو الخطر المُوثَّق نفسه).

## المهارات الفعلية المفعّلة
`NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_OBSERVABILITY_OPS` · `NM_INTEGRATION_SANDBOX` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`.

## سبب الحجب (Gate 1 — Isolated Host Preflight: فشل)
- **الإثبات المطلوب لم يُقدَّم:** `VAULT_HOST_READY`/`VAULT_HOST_TYPE`/`VAULT_HOST_ACCESS`/`VAULT_HOST_OS`/`VAULT_HOST_NETWORK`/`VAULT_HOST_NOT_SHARED_WITH_NAMA_APP_OR_REDIS` وصلت **كقالب فارغ** (لم تُملأ بقيم فعلية).
- **المضيف الوحيد المتاح = الصندوق المشترك:** `DESKTOP-T70LUCJ` (win32/MINGW64) يشغّل **nama-app (online)** + **nama-redis (up)** + **PostgreSQL أصلية** ⟹ ليس معزولاً. `HOST_SHARED_WITH_APP_OR_REDIS: YES`.
- **لا مضيف منفصل قابل للوصول:** لا SSH ولا تفاصيل VM/خادم مستقل.
- **القرار:** النشر على الصندوق المشترك ممنوع نطاقاً ("لا Docker على صندوق NamaMedical المشترك") ويعيد إنتاج خطر ارتداد Docker المُوثَّق (ارتداد محرّك Docker → nama-redis + إعادة تشغيل التطبيق). لذلك توقّفت.

## ما لم يُنفَّذ (بسبب الحجب)
لا تثبيت/تشغيل Vault · لا Docker/حاوية على أي صندوق · لا TLS/raft/unseal/audit/snapshot فعلي · لا dummy transit (يحتاج Vault مُشغَّلاً) · لا keys/tokens · لا ربط تطبيق.

## إثباتات السلامة (read-only)
- **REAL_KEYS_READ: NO · DPAPI_READ: NO · ESCROW_CONTENT_READ: NO · PRODUCTION_REWRAP_RUN: NO.**
- **تطبيق الإنتاج لم يُمَس:** health=200 · nama-redis up · PM2 لم يُعَد تشغيله بفعلي (pid 96016 من تعافي سابق) · لا تعديل .env · DB/DDL/data بلا تغيير · FORCE_RLS=150 · accounting OFF · journal 0.
- **لا Docker شُغِّل هذه البوابة** (تعلّماً من واقعة الارتداد السابقة).

## المخاطر المتبقّية
- **فجوة العزل التشغيلية مفتوحة:** لا يمكن نشر Vault production بأمان حتى يوفّر المالك مضيفاً/VM معزولاً (أو يعتمد صراحةً نافذة صيانة على الصندوق المشترك مع قبول مخاطر ارتداد الجلسات — الخيار B الأقل تفضيلاً).
- KEK يبقى DPAPI محلّياً (التشغيل اليومي سليم؛ DR مُغلق عبر escrow).

## كيف نرفع الحجب (إجراء المالك)
وفّر مضيفاً معزولاً وأرسل إثباتاً فعلياً:
```text
VAULT_HOST_READY: YES
VAULT_HOST_TYPE: DEDICATED_VM_OR_SERVER
VAULT_HOST_ACCESS: SSH_AVAILABLE   (+ كيفية وصول الوكيل، أو نفّذها بنفسك ووثّق)
VAULT_HOST_OS: <linux/windows + إصدار>
VAULT_HOST_NETWORK: INTERNAL_OR_FIREWALLED
VAULT_HOST_NOT_SHARED_WITH_NAMA_APP_OR_REDIS: YES
```
ثم أعِد `APPROVE_VAULT_PRODUCTION_DEPLOYMENT_ISOLATED_HOST_ONLY`. (بديل: `…_MAINTENANCE_WINDOW_SHARED_HOST` صراحةً إن قبلت الخيار B.)

## الحقول
```text
FINAL_STATUS: VAULT_PRODUCTION_DEPLOYMENT_BLOCKED_NO_ISOLATED_HOST
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_OBSERVABILITY_OPS, NM_INTEGRATION_SANDBOX, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
ISOLATED_HOST_READY: NO (attestation template left empty; no separate host reachable)
HOST_SHARED_WITH_APP_OR_REDIS: YES (DESKTOP-T70LUCJ runs nama-app + nama-redis + native PostgreSQL)
DOCKER_RUN_ON_APP_HOST: NO
VAULT_VERSION_PINNED: N/A (not deployed)
VAULT_PRODUCTION_DEPLOYED: NO
VAULT_TLS_ENABLED: N/A
VAULT_AUDIT_ENABLED: N/A
VAULT_RAFT_OR_STORAGE: N/A
VAULT_SNAPSHOT_CREATED: NO
DUMMY_TRANSIT_KEY_CREATED: NO
DUMMY_TRANSIT_TESTED: NO
REAL_KEYS_READ: NO
DPAPI_READ: NO
ESCROW_CONTENT_READ: NO
PRODUCTION_REWRAP_RUN: NO
APP_ENV_CHANGED: NO
PM2_RESTARTED: NO
REDIS_RESTARTED: NO
DB_CHANGED: NO
DDL: NO
DATA_CHANGED: NO
PRODUCTION_CHANGES: NONE
ZATCA_CALLS: NO
NPHIES_CALLS: NO
EXTERNAL_HEALTHCARE_CALLS: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS: 150
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
TOKENS_COMMITTED: NO
PRIVATE_KEYS_COMMITTED: NO
SNAPSHOTS_COMMITTED: NO
MOJIBAKE_AUDIT: CLEAN
GIT_PARENT: f73f031 -> (this report commit)
GIT_COMMIT: namaweb 0bb8fa2 (unchanged) / parent (this report commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: المالك يوفّر مضيفاً معزولاً + إثبات VAULT_HOST_READY ثم يعيد البوابة (أو يعتمد نافذة صيانة على الصندوق المشترك صراحةً). بدائل غير محجوبة: APPROVE_CSP_REPORT_REVIEW_AND_ENFORCEMENT_PLAN_ONLY / APPROVE_CSRF_TOKEN_STRICT_MODE_PLAN_ONLY
```

توقّفت بأمان: لا مضيف معزول ⟹ لم يُنشر Vault، ولم أستخدم الصندوق المشترك (تفادياً لخطر ارتداد Docker المُوثَّق). لا تغيير إنتاجي، لا قراءة KEK/DPAPI/escrow، لا re-wrap. رفع الحجب بإجراء المالك (مضيف معزول + إثبات).
