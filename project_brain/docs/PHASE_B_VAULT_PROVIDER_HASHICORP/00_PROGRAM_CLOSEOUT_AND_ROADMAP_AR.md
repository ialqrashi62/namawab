# Vault / KEK / DR — إغلاق المسار وخارطة الطريق (Program Closeout)

> 2026-06-23 | إغلاق موحّد لمسار HashiCorp Vault + KEK escrow + DR. **كل ما يمكن للوكيل تنفيذه بأمان مكتمل ومُختبَر.** الباقي محجوب حصراً على إجراء المالك أو onboarding خارجي — لا يفتحه أي إذن للوكيل. (تم تجاوز NPHIES بطلب المالك.)

## ما اكتمل (agent-side DONE) — بالترتيب
| # | البوابة | الحالة | commit |
|---|---|---|---|
| 1 | اختيار المزوّد (HashiCorp Vault on-prem) | READY | c3ef404 |
| 2 | Re-wrap rehearsal (dummy، Vault loopback) | DUMMY_PASS 14/14 | d4b2003 |
| 3 | KEK escrow / DR plan | PLAN_READY | ac0515e |
| 4 | Restore drill (dummy، Shamir 2-of-3 + tamper) | DUMMY_PASS 19/19 | 5b0f9f1 |
| 5 | Production read-only inventory | READY (0 ciphertext، 1 KEK) | 44ec2eb |
| 6 | Owner KEK escrow execution window + runbook | WINDOW_READY | 97d6880 |
| 7 | Verify owner escrow | PENDING_OWNER_EXECUTION | 53930a0 |
| 8 | Escrow tool constant-time MAC hardening + test sweep | DONE (6/6 + 24/26) | d55bc93 |
| 9 | Vault prod hardening + re-wrap dry-run **plan** | PLAN_READY | 3b120c1 |
| 10 | Production re-wrap **dry-run** (dummy، timed) | DUMMY_PASS 7/7، swap 2ms | (هذا) |

ثوابت طوال المسار: لا KEK حقيقي لُمس · لا DPAPI قُرئ · لا re-wrap إنتاجي · لا تغيير إنتاجي · accounting OFF · journal 0 · FORCE_RLS 150 · لا force push · mojibake CLEAN · health 200/200.

## المحجوب على المالك (المسار الحرج — لا يستطيع الوكيل)
1. **تنفيذ KEK escrow** — يتطلب passphrase المالك (`ops/security/nama_kek_escrow.ps1`). فجوة DR مفتوحة حتى يتم. ← **الأولوية القصوى**.
2. إعادة `VERIFY_OWNER_RUN_KEK_ESCROW_AND_CLOSE_DR_GAP` بدليل metadata معقّم ⟹ `DR_GAP_CLOSED`.

## المحجوب على عتاد/موافقة/خارجي
3. **تشغيل + تقسية Vault إنتاجي** (raft/TLS/unseal/audit/policies/version-pinning) — عتاد + شبكة + موافقة.
4. **re-wrap إنتاجي** — بعد 1–3 + نافذة صيانة + rollback + backup مُتحقَّق + موافقة صريحة. (الـdry-run أثبت الإجراء؛ swap الـKEK دون الثانية.)
5. **ZATCA Phase 2** — CSID/CSR/OTP + Fatoora onboarding (شهادات حقيقية خارجية).
6. **NPHIES** — مُتجاوَز بطلب المالك؛ يبقى محجوباً على onboarding + شهادة CCHI عند الحاجة.

## خارطة الطريق التنفيذية (الترتيب الإلزامي)
```
[أنت] تنفيذ escrow + recover-verify + offline  ─┐
                                                 ├─► VERIFY gate ⟹ DR_GAP_CLOSED
[أنت/فريق] تقسية Vault إنتاجي + اعتماد ──────────┘
        │
        ▼
   APPROVE_PRODUCTION_REWRAP_DRY_RUN (تم dummy) ⟹ نافذة صيانة + rollback + backup
        │
        ▼
   re-wrap إنتاجي (swap حماية KEK، ~ثوانٍ) ⟹ إبطال DPAPI v1 بعد التحقق
        │
        ▼
   (لاحقاً) ZATCA Ph2 / NPHIES عبر Vault-PKI/HSM + onboarding
```

## حالة الرفع/النشر
- **Git**: كل شيء مدفوع FF (origin/master، origin/main)، drift 0/0.
- **النشر الإنتاجي**: **لم يحدث** — لا PM2 restart، التطبيق يشغّل الكود المنشور سابقاً (health 200/200). تغييرات المسار docs/tools/اختبارات فقط، لا تحتاج نشراً.

```text
PROGRAM_STATUS: VAULT_DR_TRACK_AGENT_SIDE_COMPLETE
AGENT_COMPLETABLE_ITEMS: ALL DONE (10/10) | OWNER_OR_EXTERNAL_BLOCKED: escrow exec, Vault prod, prod re-wrap, ZATCA/NPHIES
CRITICAL_PATH_NEXT: OWNER_EXECUTES_KEK_ESCROW
PRODUCTION_CHANGES: NONE | ACCOUNTING: OFF | JOURNAL: 0 | FORCE_RLS: 150
REAL_KEYS: NO | REAL_CERTS: NO | DPAPI_READ: NO | FORCE_PUSH: NO | MOJIBAKE: CLEAN
```

اكتمل مسار Vault/DR من جانب الوكيل بالكامل ومُختبَراً؛ الباقي محجوب حصراً على تنفيذك للـescrow أو على onboarding/عتاد خارجي، دون أي مساس بالإنتاج أو المفاتيح أو المحاسبة
