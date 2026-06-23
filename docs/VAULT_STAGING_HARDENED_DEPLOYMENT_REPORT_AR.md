# نشر HashiCorp Vault مُحصَّن في Staging/Sandbox — تقرير

> 2026-06-23 | تنفيذ `APPROVE_VAULT_STAGING_HARDENED_DEPLOYMENT_ONLY`. نشر Vault مُحصَّن **معزول (loopback)** لإثبات نموذج الإنتاج: version-pin + raft + TLS + Shamir unseal + audit + dummy transit، ثم **هدم (ephemeral)**. لا Vault production، لا KEK/DPAPI/escrow، لا re-wrap.

## الحالة النهائية
**`VAULT_STAGING_HARDENED_DEPLOYMENT_PASS`** — كل أهداف الـstaging تحقّقت وأُثبتت ثم هُدمت البيئة وحُذفت كل المواد الحسّاسة. **مع إفصاح مهم:** حدث أثر جانبي غير مقصود (إعادة تشغيل محرّك Docker Desktop بسبب نشاط حاويات Vault) أدّى إلى ارتداد كل الحاويات (منها `nama-redis`) وإعادة تشغيل عملية التطبيق عبر الاسترداد الآلي — **تعافى بالكامل** (انظر §الأثر الجانبي).

## المهارات الفعلية المفعّلة
`NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_OBSERVABILITY_OPS` · `NM_INTEGRATION_SANDBOX` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`.

## Preflight
parent 4c47455 · drift 0/0 · Docker 29.5.3 · المنافذ حرة · لا حاوية Vault سابقة. عزل الأسرار بالتصميم: كل مادة تشغيل حسّاسة (مفتاح TLS الخاص، unseal keys، root token، بيانات raft، سجل audit) في `~/vault_staging` **خارج المستودع** + gitignored؛ المستودع يحوي فقط config + .gitignore + هذا التقرير.

## Staging Architecture
- **الصورة (version-pinned، لا latest):** `hashicorp/vault:1.18` → **Vault v1.18.5** · digest `sha256:750bb37c1638fa194ab37053a81618c61bb0491ddec6fccac87c07a8e6cd8166`.
- **التخزين:** raft (Integrated Storage) — peer واحد `nama-vault-staging-1` (leader/voter)، HA enabled.
- **المنفذ:** `127.0.0.1:8210→8200` (loopback فقط، لا 0.0.0.0 عام).
- **mlock:** enabled (cap IPC_LOCK).
- **config:** `tools/vault-staging/vault-staging.hcl` (raft + TLS listener + tls_min_version=tls12، بلا أسرار).

## TLS
- listener TLS فقط، شهادة self-signed (CN=localhost، SAN DNS:localhost+IP:127.0.0.1، 7 أيام).
- **إثبات:** HTTPS+CA = **200** · HTTP إلى listener TLS = **400 مرفوض** · HTTPS بلا CA = **000 (التحقّق مفروض)**.

## Seal / Unseal
- **Shamir** key-shares=3، threshold=2 (m-of-n). init+unseal عبر سكربت داخل الحاوية؛ **unseal keys + root token كُتِبت إلى `~/vault_staging/init/init.json` (host، gitignored، صلاحية 600) ولم تُطبَع إطلاقاً**. بعد unseal: Sealed=false، Initialized=true.

## Audit
- audit device `file` مُفعّل → `/vault/audit/audit.log` (host، gitignored). الإدخالات HMAC-redacted؛ لم يُلتزَم السجل.

## Policy Model
- `nama-app-kek` (least-privilege، demo): `update` على `transit/encrypt/dummy-kek` + `transit/decrypt/dummy-kek` فقط (لا قراءة مفتاح خام). إلى جانب `default`/`root`.

## Dummy Transit Smoke
- محرّك transit مُفعّل، مفتاح **`dummy-kek`** (لا KEK حقيقي).
- roundtrip: `nama-staging-dummy-payload` → ciphertext `vault:v1:uJH8n...` → فك → `nama-staging-dummy-payload` = **PASS**. (payload/ciphertext وهميان، آمنان للعرض.)

## Teardown / Retention
- **ephemeral:** أُزيلت الحاوية، وحُذف `~/vault_staging` بالكامل (مفتاح TLS الخاص + init.json بالمفاتيح/التوكن + بيانات raft + سجل audit). تحقّق: لا حاوية Vault، لا دليل تشغيل، **لا مادة سرّية في المستودع** (grep لـPRIVATE KEY/hvs./unseal_keys = لا شيء). الصورة المثبّتة بقيت محليّاً (ليست سرّاً).

## الأثر الجانبي غير المقصود (إفصاح كامل)
- **ما حدث:** بالتزامن مع سحب صورة Vault + دورات إنشاء/حذف حاويات متكرّرة، **أُعيد تشغيل محرّك Docker Desktop (~قبل 14 دقيقة)** فارتدّت **كل** الحاويات معاً: `nama-redis` + حاويات مشروع آخر (`complete_project-postgres-1`/`redis-1`). كما أُعيد تشغيل عملية التطبيق (pid 46172→96016، عدّاد restart=0 = ارتداد PM2 daemon عبر الاسترداد الآلي المنشور).
- **الأثر:** انقطاع وجيز محتمل للجلسات النشطة (Redis sessions) ولاستجابة التطبيق وقت الارتداد.
- **التعافي (مؤكَّد):** التطبيق أقلع نظيفاً — PostgreSQL متصل، **Redis SUCCESS reconnected**، health=200، login=200، `redis-cli PING`→PONG.
- **لم يتأثّر:** قاعدة بيانات التطبيق = **PostgreSQL أصلية (Program Files، ليست Docker)** → لم تُمَس؛ FORCE_RLS=150، accounting OFF، journal 0، KEK الحيّ غير متغيّر (262B، mtime 00:05).
- **التصنيف:** `PRODUCTION_CHANGES = INADVERTENT_DOCKER_ENGINE_BOUNCE_RECOVERED` (ليس "NONE"). لم أُصدر أي `pm2 restart` للتطبيق؛ الارتداد غير مباشر عبر محرّك Docker.
- **الدرس:** عمليات Docker الثقيلة على هذا الـsingle-box قد ترتدّ Docker Desktop وتُسقط `nama-redis` المشترَك (مخزن جلسات الإنتاج). يُنصح مستقبلاً بعزل Vault على محرّك/جهاز منفصل أو نافذة صيانة.

## إثباتات الحدود
لا Vault production · لا قراءة KEK/DPAPI/escrow · لا re-wrap · لا تعديل app.js/server.js · لم أُصدر pm2 restart · لا DB/DDL/data · لا ZATCA/NPHIES/external · لا أسرار/tokens/keys في git · لا force push.

## الحقول
```text
FINAL_STATUS: VAULT_STAGING_HARDENED_DEPLOYMENT_PASS
STAGING_ONLY: YES
VAULT_VERSION_PINNED: YES (hashicorp/vault:1.18 -> v1.18.5, digest sha256:750bb37c...)
VAULT_STAGING_DEPLOYED: YES (then torn down)
VAULT_PRODUCTION_DEPLOYED: NO
VAULT_STAGING_TLS: ENABLED (https 200; http 400; no-CA 000)
VAULT_STAGING_AUDIT_ENABLED: YES (file device)
VAULT_STAGING_RAFT_OR_STORAGE: RAFT (HA enabled, 1 peer leader/voter)
DUMMY_TRANSIT_KEY_CREATED: YES (dummy-kek)
DUMMY_TRANSIT_TESTED: YES (roundtrip PASS)
REAL_KEYS_READ: NO
DPAPI_READ: NO
ESCROW_CONTENT_READ: NO
PRODUCTION_REWRAP_RUN: NO
PRODUCTION_CHANGES: INADVERTENT_DOCKER_ENGINE_BOUNCE_RECOVERED (nama-redis + app process bounced ~14m ago; full recovery; native PostgreSQL untouched)
PM2_RESTARTED: NOT_BY_AGENT (indirect Docker engine bounce -> auto-recovery restart; no agent-issued pm2 restart)
DB_CHANGED: NO
DDL: NO
DATA_CHANGED: NO
ZATCA_CALLS: NO
NPHIES_CALLS: NO
EXTERNAL_HEALTHCARE_CALLS: NO (Vault image pull only — Docker registry, not healthcare)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS: 150
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
TOKENS_COMMITTED: NO
PRIVATE_KEYS_COMMITTED: NO
MOJIBAKE_AUDIT: CLEAN
GIT_PARENT: 4c47455 -> (this report commit)
GIT_COMMIT: namaweb 0bb8fa2 (unchanged) / parent (this report commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: APPROVE_VAULT_STAGING_TO_PRODUCTION_DEPLOYMENT_PLAN_ONLY (مع توصية: عزل Vault عن single-box الإنتاج لتفادي ارتداد Docker للجلسات)
```

نُشر Vault مُحصَّن في staging معزول وأُثبت (version-pin/raft/TLS/Shamir-unseal/audit/dummy-transit roundtrip PASS) ثم هُدم مع حذف كل الأسرار، دون لمس KEK/DPAPI/escrow أو production Vault. حدث أثر جانبي غير مقصود (ارتداد محرّك Docker → nama-redis + إعادة تشغيل التطبيق) تعافى بالكامل؛ قاعدة البيانات الأصلية والثوابت سليمة. أُفصِح عنه بالكامل.
