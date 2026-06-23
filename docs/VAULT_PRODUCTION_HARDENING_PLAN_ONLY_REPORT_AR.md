# خطة تحصين HashiCorp Vault للإنتاج — Plan-Only — تقرير

> 2026-06-23 | تنفيذ `APPROVE_VAULT_PRODUCTION_HARDENING_PLAN_ONLY`. **خطة/وثائق فقط.** لم يُشغَّل Vault (لا production ولا sandbox)، لا re-wrap، لا قراءة KEK/DPAPI/escrow، لا مفاتيح/tokens، لا تغيير إنتاجي، لا اتصالات ZATCA/NPHIES. يبني على تصاميم `docs/PHASE_B_VAULT_PROVIDER_HASHICORP/` (01–06) دون تكرارها.

## الحالة النهائية
**`VAULT_PRODUCTION_HARDENING_PLAN_READY`** — خطة شاملة جاهزة للمراجعة. لا تفويض لأي تشغيل/migration؛ كل تنفيذ يبقى خلف بوابات منفصلة.

## المهارات الفعلية المفعّلة
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md`: `NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_OBSERVABILITY_OPS` · `NM_INTEGRATION_SANDBOX` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. (ZATCA/NPHIES خارج النطاق هنا.) لا مهارة جديدة/مخترعة.

## مراجعة الأدلة (Gate 1)
- **KEK escrow / DR gap = مُغلق metadata-only** (parent 9a79537): owner attested + agent read-only؛ لا artifact في repo؛ KEK الحيّ غير متغيّر.
- **الوكيل لم يقرأ** KEK/DPAPI/escrow؛ **لم يُشغَّل** Vault production؛ **لم يحدث** production re-wrap.
- البوابات الأمنية الحيّة مستقرّة (Gate1/2/3/4 + Layer2 + browser smoke PASS).
- أدلّة سابقة: `01_PROVIDER_DECISION` · `02_DEPLOYMENT_CANDIDATE` · `03_SECRET_PATHS_AND_POLICIES` · rehearsal 14/14 · restore drill 19/19 · inventory (0 ciphertext at-rest، KEK واحد 262B).
- **عدم يقين موثّق:** RPO/RTO اقتراحيان غير مُتحقَّق منهما إنتاجياً؛ سعة/أداء Vault الإنتاجي غير مُقاسة؛ نموذج HA يعتمد على عدد العُقد المتاح (single-box حالياً).

---

## 1) Architecture (تصميم فقط)
- **التخزين:** Integrated Storage (**raft**) — لا storage خارجي، نسخ snapshot ذاتي. على single-box: عقدة واحدة مع snapshot دوري؛ HA حقيقي يتطلب 3/5 عُقد (raft quorum) في بوابة توسّع لاحقة.
- **طوبولوجيا العُقد:** هدف الإنتاج = 3 عُقد (quorum يتحمّل فقد عقدة) في شبكة إدارة معزولة؛ المرحلة الانتقالية على single-box = عقدة واحدة + snapshot offline (يُوثَّق كقيد توافر).
- **TLS end-to-end:** listener TLS فقط (لا HTTP)، شهادات داخلية (CA خاص)، `tls_min_version = tls12`+، `tls_disable = false`، client-cert اختياري للوصول الإداري؛ تدوير الشهادات مجدول.
- **Listener:** الربط على واجهة إدارة داخلية فقط (لا 0.0.0.0 عام)؛ `api_addr`/`cluster_addr` صريحان؛ تعطيل mlock حسب البيئة موثّق.
- **حدود الشبكة/الجدار الناري:** Vault خلف شبكة إدارة؛ يُسمح فقط: التطبيق→Vault:8200 (TLS)، وبين عُقد raft:8201؛ منع وصول عام؛ افتراض: لا تعريض إنترنت، لا منفذ HTTP.
- **إشراف الخدمة/سياسة إعادة التشغيل:** خدمة مُدارة (systemd/NSSM على ويندوز) `Restart=on-failure`، حدود فتح ملفات، مستخدم خدمة مخصّص أقل امتياز؛ مراقبة liveness/sealed-state.
- **تثبيت الإصدار:** **لا `latest`** — إصدار مثبّت (مثل `vault:1.x.y`) موثّق؛ ترقية عبر canary + snapshot قبل الترقية + اختبار unseal بعدها + مسار rollback لإصدار سابق مع نفس snapshot.
- **النسخ الاحتياطي للتخزين:** raft snapshot مجدول (انظر §5).

## 2) Seal / Unseal (تصميم فقط)
- **القرار:** البداية **Shamir manual unseal** (m-of-n) لتفادي اعتماد KMS/HSM خارجي مبكّراً؛ ترقية لاحقة إلى **auto-unseal** (HSM/Cloud KMS) في بوابة منفصلة عند توفّر مزوّد معتمد. (auto-unseal يبسّط التشغيل لكنه ينقل الثقة للمزوّد.)
- **حضانة مفاتيح الاسترداد/unseal:** توزيع Shamir (مثل 5 حصص، عتبة 3) على **حُرّاس (custodians)** منفصلين، لا يحمل شخص واحد العتبة.
- **m-of-n:** عتبة 3-of-5 (قابلة للضبط)؛ root token يُلغى فور الإعداد؛ التشغيل عبر AppRole/policies فقط.
- **break-glass:** إجراء موثّق بموافقة مزدوجة + سجل تدقيق؛ يتكامل مع KEK escrow المُغلق (حضانة offline منفصلة، passphrase منفصلة).
- **دليل التدقيق:** كل عملية unseal/break-glass تُسجَّل في audit device + مراجعة دورية.

## 3) Policies & Access Model (أسماء/تصميم فقط — لا إنشاء فعلي)
- **least-privilege** (مبني على `03_SECRET_PATHS_AND_POLICIES`): `nama-app-kek` = `update` على `transit/encrypt/nama-kek` + `transit/decrypt/nama-kek` فقط (**لا قراءة للمفتاح الخام**).
- **فصل prod/sandbox:** mounts/namespaces/policies منفصلة تماماً؛ لا مشاركة token/role بين البيئتين.
- **حد محرّك transit:** التطبيق يصل wrap/unwrap فقط؛ لا export، لا قراءة، لا حذف مفاتيح.
- **حدود PKI/ZATCA/NPHIES المستقبلية (تصميم فقط، بلا شهادات حقيقية):** `pki-zatca/`, `pki-nphies/`, `nama-zatca-sign`, `nama-nphies-cert` — معرّفة كأسماء/حدود مستقبلية، **خارج نطاق هذه البوابة وأي تفعيل**.
- **لا root في التشغيل:** root token يُلغى؛ المهام الإدارية عبر policies مخصّصة + موافقة.
- **TTL strategy:** tokens قصيرة العمر (مثل 15–60 دقيقة) + تجديد؛ لا tokens دائمة.
- **AppRole:** role لكل خدمة (`nama-app`)، secret-id قصير العمر يُسلَّم خارج git/.env-داخل-المستودع؛ ربط CIDR اختياري.

## 4) Audit Model (تصميم فقط)
- **audit device مُفعّل** (file + اختياري syslog) قبل أي استخدام إنتاجي.
- **الوجهة:** ملف على وحدة تخزين مقيّدة ACL + شحن إلى مجمّع سجلّات مركزي (إن وُجد).
- **تدوير السجلّات:** rotation مجدول + احتفاظ موثّق + حماية من العبث (append-only حيثما أمكن).
- **redaction:** Vault يجزّئ (HMAC) القيم الحسّاسة في السجل افتراضياً؛ يُمنع تسجيل plaintext؛ افتراض: لا أسرار في السجلّات.
- **مراجعة الوصول:** مراجعة دورية لـpolicies/roles/tokens النشطة + إزالة المهجور.
- **التنبيه/الاستجابة للحوادث:** تنبيهات على sealed-state/فشل unseal/أخطاء audit/طفرة رفض؛ Runbook استجابة مرتبط بـ`NM_OBSERVABILITY_OPS`.

## 5) Backup / DR (تصميم فقط)
- **raft snapshot:** `vault operator raft snapshot save` مجدول (يومي + قبل كل ترقية)؛ التخزين مشفّر ومقيّد ACL.
- **خطة restore:** `snapshot restore` على بيئة معزولة + اختبار unseal + تحقّق سلامة؛ **drill وهمي فقط** قبل أي اعتماد (يبني على restore drill 19/19 السابق).
- **RPO/RTO:** **أهداف مقترحة** (RPO ≤ 24h عبر snapshot يومي، RTO ساعات) — **غير مُتحقَّق منها إنتاجياً**؛ التحقّق في بوابة drill منفصلة.
- **الحضانة offline + علاقة escrow:** snapshots + أي مادة استرداد في حضانة offline منفصلة؛ يتكامل مع **KEK escrow المُغلق** (الخطة لا تتطلب قراءة الـescrow؛ تعتمد فقط على إغلاقه المُثبت metadata-only).
- **الاعتماد على إغلاق KEK escrow:** ✅ مُحقَّق — escrow مُغلق metadata-only (parent 9a79537) شرط مسبق لأي migration.
- **drill دوري:** اختبار recovery دوري مجدول (ربع سنوي مقترح) — بوابة منفصلة.

## 6) Migration Prerequisites (بوابات لاحقة منفصلة)
قبل **dry-run**:
1. Vault production مُحصَّن (raft/TLS/unseal/audit) ومُختبَر smoke.
2. DR مُختبَر (snapshot+restore drill ناجح).
3. rollback جاهز وموثّق.
4. نافذة صيانة محدّدة.
5. موافقات المالك الصريحة.
ثم **dry-run** (dummy فقط): `APPROVE_PRODUCTION_REWRAP_DRY_RUN_PLAN_ONLY` ← الخطوة التالية المقترحة.
ثم **production re-wrap الحقيقي:** بوابة مستقلة تماماً (يلمس طبقة حماية KEK فقط — DPAPI→Vault transit — لا data ciphertext، حسب inventory: 0 ciphertext at-rest اليوم) + rollback إلى DPAPI + escrow مُغلق (✅).
**ZATCA/NPHIES:** خارج النطاق كلياً — لا onboarding/CSR/OTP/شهادات/اتصالات حتى بوابة تأهيل منفصلة.

## 7) Risk Model
| الخطر | التخفيف المخطّط |
|---|---|
| انقطاع Vault | DPAPI fallback (dual-read v1/v2) يبقى أثناء الانتقال؛ HA/raft quorum لاحقاً؛ تنبيه sealed-state |
| فقد مفاتيح unseal | Shamir m-of-n + حُرّاس منفصلون + break-glass + escrow offline |
| اختراق token | tokens قصيرة العمر + AppRole + إلغاء root + مراجعة دورية + audit |
| سوء ضبط policy | least-privilege + فصل prod/sandbox + مراجعة + اختبار في sandbox أولاً |
| تسرّب سجل التدقيق | HMAC redaction + ACL + تدوير + لا plaintext |
| فشل rollback | snapshot قبل أي تغيير + مسار DPAPI fallback مُحتفَظ به أثناء re-wrap |
| re-wrap جزئي | idempotency + dual-read + تحقّق read-back لكل عنصر (أُثبِت في rehearsal 14/14) |
| خطر DPAPI fallback | يبقى صالحاً حتى نجاح migration كامل + تحقّق؛ لا يُزال قبل الإثبات |
| خطأ المشغّل | Runbook + موافقة مزدوجة لعمليات حسّاسة + نافذة صيانة + dry-run أولاً |
| خطر المُطّلِع (insider) | فصل واجبات (custodians) + audit + least-privilege + مراجعة وصول |

## ما لم يُنفَّذ ولماذا
لا تشغيل/init/unseal لـVault، لا سحب صورة، لا mounts/keys/policies/tokens فعلية، لا re-wrap، لا قراءة KEK/DPAPI/escrow، لا اتصالات خارجية — لأن النطاق **plan-only** صراحةً؛ كل تنفيذ خلف بوابة منفصلة.

## إثبات عدم التغيير الإنتاجي
لم تُنفَّذ أوامر تغيير؛ القراءة فقط لوثائق سابقة. الحالة الإنتاجية كما في إغلاق DR قبل قليل: parent 9a79537 · namaweb 0bb8fa2 · drift 0/0 · PM2 restarts=5 (لا restart) · health 200 · FORCE_RLS=150 · محاسبة OFF · لا Vault container يعمل.

## الحقول
```text
FINAL_STATUS: VAULT_PRODUCTION_HARDENING_PLAN_READY
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_OBSERVABILITY_OPS, NM_INTEGRATION_SANDBOX, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
KEK_ESCROW_DR_GAP_REVIEWED: YES (CLOSED_METADATA_ONLY, parent 9a79537)
VAULT_PRODUCTION_DEPLOYED: NO
VAULT_KEYS_CREATED: NO
VAULT_TOKENS_CREATED: NO
REAL_KEYS_READ: NO
DPAPI_READ: NO
ESCROW_CONTENT_READ: NO
PRODUCTION_REWRAP_RUN: NO
PRODUCTION_CHANGES: NONE
PM2_RESTARTED: NO
DB_CHANGED: NO
DDL: NO
DATA_CHANGED: NO
ZATCA_CALLS: NO
NPHIES_CALLS: NO
EXTERNAL_HEALTHCARE_CALLS: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS: 150
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
MOJIBAKE_AUDIT: CLEAN
GIT_PARENT: 9a79537 -> (this report commit)
GIT_COMMIT: namaweb 0bb8fa2 (unchanged) / parent (this report commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: APPROVE_PRODUCTION_REWRAP_DRY_RUN_PLAN_ONLY
```

خطة تحصين Vault للإنتاج جاهزة للمراجعة (architecture/seal-unseal/policies/audit/backup-DR/migration-prereqs/risk)، plan-only تماماً: لا تشغيل Vault، لا re-wrap، لا قراءة مادة مفتاحية، لا تغيير إنتاجي، لا ZATCA/NPHIES. التنفيذ يبقى خلف بوابات منفصلة، والتالي المقترح dry-run وهمي فقط.
