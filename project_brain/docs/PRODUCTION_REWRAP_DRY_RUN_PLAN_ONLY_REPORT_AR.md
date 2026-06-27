# خطة Production Re-wrap Dry-run — Plan-Only — تقرير

> 2026-06-23 | تنفيذ `APPROVE_PRODUCTION_REWRAP_DRY_RUN_PLAN_ONLY`. **خطة/وثائق فقط.** لا re-wrap، لا تشغيل Vault، لا إنشاء keys/tokens، لا قراءة KEK/DPAPI/escrow، لا فك تشفير، لا تعديل .env/runtime/DB، لا PM2 restart، لا ZATCA/NPHIES. يبني على rehearsal (14/14)، dry-run dummy، inventory، خطة التحصين.

## الحالة النهائية
**`PRODUCTION_REWRAP_DRY_RUN_PLAN_READY`** — خطة dry-run + نموذج التنفيذ المستقبلي + go/no-go + حزمة موافقة جاهزة للمراجعة. لا تفويض لأي تنفيذ؛ كل خطوة فعلية خلف بوابة منفصلة.

## المهارات الفعلية المفعّلة
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md`: `NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_OBSERVABILITY_OPS` · `NM_INTEGRATION_SANDBOX` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. (ZATCA/NPHIES خارج النطاق.) لا مهارة جديدة/مخترعة.

## مراجعة الأدلة (Gate 1)
- **Vault hardening plan** = COMMITTED_AND_PUSHED (parent 1820dce، `docs/VAULT_PRODUCTION_HARDENING_PLAN_ONLY_REPORT_AR.md`).
- **KEK escrow / DR gap** = CLOSED_METADATA_ONLY (parent 9a79537).
- **production inventory** = **0 ciphertext at-rest** اليوم (mfa_secret/phi_files/api_secret/encryption_metadata/zatca=0)؛ الأثر الوحيد = KEK واحد (`~/nama_kek.dpapi`، 262B).
- **re-wrap لم يحدث** · **Vault production لم يُشغَّل** (لا حاوية تعمل) · أدوات `tools/vault-sandbox/{rewrap_rehearsal.js,rewrap_dry_run.js}` موجودة وغير مُشغَّلة هذه البوابة.
- **rehearsal سابق 14/14** (loopback dummy، تم هدمه) أثبت سلامة منطق provider-swap.
- **gap موثّق:** Vault production غير مُحصَّن/مُشغَّل بعد؛ RPO/RTO غير مُتحقَّق إنتاجياً؛ نموذج HA single-box.

---

## 1) Preconditions (شروط مسبقة قبل أي تنفيذ مستقبلي)
| الشرط | الحالة |
|---|---|
| KEK escrow مغلق metadata-only | ✅ (9a79537) |
| Vault production hardening plan موجود | ✅ (1820dce) |
| inventory يثبت zero ciphertext at-rest | ✅ (KEK واحد فقط) |
| current impact = KEK واحد | ✅ |
| backups verified قبل التنفيذ | ⏳ مطلوب وقت التنفيذ |
| maintenance window | ⏳ مطلوبة لاحقاً |
| rollback plan جاهزة + مُتمرَّن عليها | ⏳ مطلوبة لاحقاً |
| Vault production مُحصَّن + smoke-tested | ⏳ بوابة لاحقة (staging/sandbox أولاً) |

## 2) Dry-run Scope (مراجعة readiness فقط — لا تنفيذ)
الـdry-run **لا** يقرأ KEK الحقيقي · **لا** يفك DPAPI · **لا** يكتب Vault · **لا** يعدّل DB · **لا** يغيّر runtime. يراجع فقط:
- **الأوامر المخطّطة:** تهيئة transit (`transit/keys/nama-kek`، non-exportable)؛ من جانب التطبيق: استدعاء provider B (`crypto_envelope.js`) لـwrap/unwrap بدل DPAPI — **مُحاكاة منطقية** عبر `tools/vault-sandbox/rewrap_dry_run.js` على dummy فقط (loopback، يُهدَم).
- **المدخلات المتوقّعة:** مفتاح DPAPI-protected (لا يُقرأ في dry-run؛ يُحاكى بـdummy 32B)، endpoint Vault loopback، policy `nama-app-kek`.
- **المخرجات المتوقّعة:** envelope ENCv2 (Vault-wrapped) مكافئ منطقياً لـv1؛ **data ciphertext دون تغيير**.
- **فحوص التحقّق:** wrap→unwrap يعيد نفس الـDEK/المحتوى؛ idempotency؛ dual-read v1(DPAPI)+v2(Vault)؛ tamper-reject؛ زمن swap.
- **معايير الإيقاف (abort):** أي عدم تطابق read-back، فشل MAC/tamper، انحراف زمن، فشل اتصال Vault.
- **معايير rollback:** أي abort ⟹ يبقى DPAPI هو المسار الفعّال (لا تغيير أصلاً في dry-run).

## 3) Future Actual Re-wrap Design (بوابة منفصلة لاحقاً)
- **التحويل:** حماية KEK من **DPAPI → Vault transit** (طبقة الحماية فقط). **data ciphertext يبقى كما هو** (وحالياً = صفر، أنظف نافذة).
- **dual-read compatibility:** التطبيق يقرأ v1(DPAPI) وv2(Vault) أثناء الانتقال؛ يكتب v2 الجديد.
- **fallback:** إن فشل Vault، يعود لـDPAPI تلقائياً (dual-read) حتى نجاح كامل.
- **rollback إلى DPAPI:** الاحتفاظ بـDPAPI wrapper نشطاً حتى الإثبات الكامل؛ rollback = تعطيل provider B واستعادة DPAPI.
- **idempotency:** إعادة التشغيل آمنة (لا re-wrap مزدوج)؛ نسخة versioned.
- **audit trail:** كل عملية wrap/unwrap في Vault audit device (HMAC redaction، لا plaintext).
- **failure handling:** abort + إبقاء DPAPI + تنبيه + لا حالة جزئية ملتزمة.

## 4) Validation Model
- **pre-checks:** Vault sealed-state=unsealed، policy/AppRole جاهزة، backup مُتحقَّق، escrow مُغلق ✅، health 200.
- **dry-run checks:** §2 (read-back/idempotency/dual-read/tamper) على dummy.
- **post-checks (بعد التنفيذ الفعلي مستقبلاً):** كل عنصر يفك عبر v2؛ DPAPI fallback يعمل؛ health/login 200؛ لا أخطاء.
- **owner attestation مطلوب** قبل الإغلاق.
- **حظر:** لا أسرار في السجلّات/التقارير · لا ciphertext dumps · الثوابت (FORCE_RLS=150، journal=0، accounting OFF) تبقى.

## 5) Rollback Model
العودة إلى DPAPI wrapper · الحفاظ على escrow (لا يُمَس) · **لا تغيير في data ciphertext** · abort فوري عند أي mismatch · الاستعادة من backup كملاذ أخير فقط · **موافقة المالك مطلوبة**.

## 6) Go/No-go Checklist (قبل التنفيذ الفعلي)
- [ ] Vault مُحصَّن + smoke-tested (staging أولاً).
- [ ] transit policy جاهزة (`nama-app-kek` wrap/unwrap فقط).
- [ ] app policy/AppRole جاهزة.
- [ ] backup مُتحقَّق.
- [ ] escrow مُتحقَّق ✅.
- [ ] rollback مُتمرَّن عليه.
- [ ] maintenance window معتمدة.
- [ ] المالك حاضر.
- [ ] لا ZATCA/NPHIES calls.
- [ ] accounting OFF · journal 0 · FORCE_RLS 150.
**stop conditions:** أي بند غير محقّق ⟹ no-go.

## 7) Production Re-wrap Approval Package (للبوابة المستقبلية)
- **سلسلة الموافقة المستقبلية المقترحة:** `APPROVE_PRODUCTION_KEK_REWRAP_DPAPI_TO_VAULT_EXECUTION` (بوابة مستقلة تماماً).
- **الأوامر المتوقّعة:** init/unseal Vault مُحصَّن (مُنفَّذ مسبقاً في بوابة النشر)، تهيئة transit، تفعيل provider B، re-wrap KEK، تحقّق read-back، إبقاء DPAPI fallback.
- **الحقول المتوقّعة:** REWRAP_RUN، DUAL_READ_OK، DPAPI_FALLBACK_RETAINED، DATA_CIPHERTEXT_UNCHANGED، ROLLBACK_READY، HEALTH 200، FORCE_RLS 150.
- **الأدلة المطلوبة:** backup مُتحقَّق + escrow مُغلق + Vault smoke + rollback rehearsed + owner attestation.
- **stop conditions:** أي mismatch/فشل MAC/فقد Vault/انحراف ثابت ⟹ توقف + rollback إلى DPAPI.
- **post-rewrap monitoring:** مراقبة wrap/unwrap errors + sealed-state + health لفترة محدّدة.

## ما لم يُنفَّذ ولماذا
لا dry-run فعلي، لا تشغيل Vault/sandbox، لا keys/tokens، لا re-wrap، لا قراءة KEK/DPAPI/escrow، لا فك تشفير، لا تغيير runtime/DB/.env — النطاق **plan-only** صراحةً. كل تنفيذ خلف بوابة منفصلة.

## إثبات عدم التغيير الإنتاجي
قراءة فقط لوثائق سابقة. parent 1820dce · namaweb 0bb8fa2 · drift 0/0 · PM2 restarts=5 (لا restart) · health 200 · FORCE_RLS=150 · accounting OFF · لا Vault container يعمل.

## الحقول
```text
FINAL_STATUS: PRODUCTION_REWRAP_DRY_RUN_PLAN_READY
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_OBSERVABILITY_OPS, NM_INTEGRATION_SANDBOX, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
VAULT_HARDENING_PLAN_REVIEWED: YES (parent 1820dce)
KEK_ESCROW_DR_GAP_REVIEWED: YES (CLOSED_METADATA_ONLY, 9a79537)
PRODUCTION_INVENTORY_REVIEWED: YES (zero ciphertext at-rest; 1 KEK)
DRY_RUN_PLAN_CREATED: YES
PRODUCTION_REWRAP_RUN: NO
VAULT_PRODUCTION_DEPLOYED: NO
VAULT_KEYS_CREATED: NO
VAULT_TOKENS_CREATED: NO
REAL_KEYS_READ: NO
DPAPI_READ: NO
ESCROW_CONTENT_READ: NO
DECRYPT_ATTEMPTED: NO
PM2_RESTARTED: NO
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
MOJIBAKE_AUDIT: CLEAN
GIT_PARENT: 1820dce -> (this report commit)
GIT_COMMIT: namaweb 0bb8fa2 (unchanged) / parent (this report commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: APPROVE_VAULT_PRODUCTION_DEPLOYMENT_SANDBOXED_OR_STAGING_ONLY (أو APPROVE_CSP_REPORT_REVIEW_AND_ENFORCEMENT_PLAN_ONLY / APPROVE_CSRF_TOKEN_STRICT_MODE_PLAN_ONLY)
```

خطة dry-run لإعادة لفّ KEK (DPAPI→Vault transit) جاهزة للمراجعة: preconditions/dry-run-scope/future-design/validation/rollback/go-no-go/approval-package — plan-only تماماً، لا تنفيذ ولا تشغيل Vault ولا قراءة مادة مفتاحية ولا تغيير إنتاجي. التنفيذ يبقى خلف بوابات منفصلة؛ التالي المقترح = نشر Vault في staging/sandbox أولاً.
