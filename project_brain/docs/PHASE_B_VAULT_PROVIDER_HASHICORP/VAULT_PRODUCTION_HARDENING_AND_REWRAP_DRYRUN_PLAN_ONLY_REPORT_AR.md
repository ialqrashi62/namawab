# Vault Production Hardening + Re-wrap Dry-Run — خطة فقط (PLAN-ONLY)

> 2026-06-23 | إكمال البنود الآمنة المتبقّية docs-only: (أ) خطة تقسية Vault الإنتاجي، (ب) خطة re-wrap dry-run. **لا تشغيل Vault إنتاجي، لا مفاتيح/شهادات حقيقية، لا re-wrap، لا تغيير إنتاجي.** المهارات: NM_GLOBAL_GATES · NM_SECURITY_DR_KEY_MANAGEMENT · NM_OBSERVABILITY_OPS · NM_GOVERNANCE_CLOSEOUT.

## أ) خطة تقسية Vault الإنتاجي (قبل أي استخدام إنتاجي)
| المجال | المتطلب (الإنتاج) | مقابل sandbox dev الحالي |
|---|---|---|
| التخزين | Integrated Storage **raft**، ≥3 عقد للنصاب، نسخ raft snapshot دورية مشفّرة | dev in-memory (يُفقد عند الإيقاف) |
| TLS | مستمع TLS بشهادة داخلية صالحة؛ لا HTTP صريح؛ تدوير الشهادة | HTTP loopback dev |
| الختم/الفتح | auto-unseal (مزوّد آمن) أو Shamir؛ حوكمة recovery keys (m-of-n) | dev unsealed تلقائياً |
| التدقيق | audit device مُفعّل (file/syslog) لكل عملية؛ شحن السجلّات | لا audit |
| السياسات | least-privilege؛ فصل مسارات `transit/nama-kek` عن `pki-zatca`/`pki-nphies`؛ سياسة منفصلة لكل تطبيق | root dev token |
| الإصدار | **version pinning** (لا `latest`)؛ سياسة ترقية/تراجع موثّقة | `hashicorp/vault:latest` |
| الشبكة | loopback/شبكة خاصة فقط؛ لا تعريض عام؛ جدار ناري | 127.0.0.1 loopback |
| النسخ/التعافي | snapshot + استرجاع مُختبَر دورياً؛ break-glass | لا شيء |
| الأسرار التشغيلية | tokens/AppRole عبر آلية آمنة، لا في git/.env/سجلّات | dev token وقت التشغيل |

**معايير القبول قبل الإنتاج**: raft HA يعمل + TLS مُثبت + unseal مُختبَر + audit يكتب + policies مطبّقة least-privilege + الإصدار مثبّت + snapshot/restore مُثبت + لا تعريض عام.

## ب) خطة Production Re-wrap Dry-Run (محاكاة بلا تنفيذ إنتاجي)
الهدف: محاكاة re-wrap الإنتاج **بلا لمس KEK حقيقي ولا بيانات** للتحقق من الإجراء والـrollback قبل النافذة الحقيقية.
1. **بيئة**: Vault sandbox loopback (كما في rehearsal السابق) أو نسخة مُقسّاة معزولة — **ليس** الإنتاج.
2. **مدخلات**: KEK وهمي + عيّنة بيانات وهمية (لا KEK إنتاج، لا `~/nama_kek.dpapi`).
3. **خطوات محاكاة**: تفعيل transit → إنشاء `nama-kek` (dummy) → wrap KEK وهمي (v2) → dual-read (v1 DPAPI-sim / v2 Vault) → إثبات ciphertext البيانات ثابت → rollback لـv1 → teardown. (كلها أُثبتت في rehearsal d4b2003 و restore drill 5b0f9f1.)
4. **مخرجات**: تقرير توقيت تقديري + نقاط فشل محتملة + خطة rollback مفصّلة + قائمة تحقق للنافذة الحقيقية.
5. **حدود**: لا KEK إنتاج، لا بيانات إنتاج، لا Vault إنتاج — dry-run فقط.

## ترتيب التنفيذ الآمن قبل re-wrap الإنتاجي (شرط مسبق إلزامي)
1. **المالك ينفّذ KEK escrow** + recover-verify + نقل offline (فجوة DR مفتوحة الآن).
2. إعادة `VERIFY_OWNER_RUN_KEK_ESCROW_AND_CLOSE_DR_GAP` بدليل metadata ⟹ `DR_GAP_CLOSED`.
3. تقسية Vault الإنتاجي (القسم أ) + اعتماد.
4. `APPROVE_PRODUCTION_REWRAP_DRY_RUN` (تنفيذ القسم ب فعلياً على dummy).
5. نافذة صيانة + rollback + backup مُتحقَّق + موافقة صريحة جديدة ⟹ re-wrap إنتاجي.

## المتبقّي المحجوب (لا يستطيع الوكيل إنهاءه)
- **escrow الفعلي** (passphrase المالك) · **تشغيل/تقسية Vault الإنتاجي** (عتاد/شبكة + موافقة) · **re-wrap الإنتاجي** (نافذة + موافقة) · **ZATCA Ph2 / NPHIES** (onboarding + شهادات حقيقية خارجية).

```text
FINAL_STATUS: VAULT_PROD_HARDENING_AND_REWRAP_DRYRUN_PLAN_READY
VAULT_PRODUCTION_DEPLOYED: NO | VAULT_SANDBOX_RUN: NO | PRODUCTION_REWRAP_RUN: NO
REAL_KEYS: NO | REAL_CERTIFICATES_USED: NO | PRIVATE_KEYS_HANDLED: NO | DPAPI_READ: NO
PRODUCTION_CHANGES: NONE | DDL: NO | DATA_CHANGED: NO | CODE_DEPLOYED: NO
ZATCA_CALLS: NO | NPHIES_CALLS: NO | EXTERNAL_HEALTHCARE_CALLS: NO
ACCOUNTING_POSTING_ENABLED: OFF | JOURNAL_COUNT: 0 | FORCE_RLS: 150
SECRETS_PRINTED: NO | KEYS_COMMITTED: NO | FORCE_PUSH_USED: NO | MOJIBAKE_AUDIT: CLEAN
NEXT_RECOMMENDED_ACTION: OWNER_EXECUTES_KEK_ESCROW (critical path) ; then APPROVE_PRODUCTION_REWRAP_DRY_RUN
```

أُكملت خطط تقسية Vault الإنتاجي وre-wrap dry-run كوثائق فقط؛ يبقى التنفيذ الإنتاجي محجوباً على إجراءات المالك والموافقات الصريحة دون أي مساس بالإنتاج أو المفاتيح
