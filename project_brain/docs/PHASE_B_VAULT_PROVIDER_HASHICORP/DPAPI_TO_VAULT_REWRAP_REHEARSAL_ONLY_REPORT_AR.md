# DPAPI → Vault — Re-wrap Rehearsal (DUMMY-ONLY) — تقرير

> 2026-06-23 | بوابة `APPROVE_DPAPI_TO_VAULT_REWRAP_REHEARSAL_ONLY`. rehearsal آمن على بيانات وهمية فقط لإثبات أن خطة تحويل حماية الـKEK من DPAPI إلى HashiCorp Vault transit سليمة — **قبل** أي re-wrap إنتاجي. لا مفاتيح حقيقية، لا شهادات، لا اتصال ZATCA/NPHIES، لا تغيير إنتاجي.

## 1. الحالة النهائية
**FINAL_STATUS: DPAPI_TO_VAULT_REWRAP_REHEARSAL_DUMMY_PASS** — 14/14 فحص PASS على Vault sandbox محلي (loopback)، ثم هُدم الـsandbox. الإنتاج بقي 200/PONG طوال الوقت.

## 2. المهارات الفعلية المفعّلة من Skill Pack
قُرئ الفهرس `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md` واكتُشف أن أسماء الملفات الفعلية تحمل لاحقة `_SKILL_AR.md` (لا `_AR.md`). المُفعّلة:
- `NM_GLOBAL_GATES_SKILL_AR.md` — Global Gates / Baseline.
- `NM_SECURITY_DR_KEY_MANAGEMENT_SKILL_AR.md` — Security / DR / Key Management.
- `NM_INTEGRATION_SANDBOX_SKILL_AR.md` — Integration Sandbox.
- `NM_ZATCA_PHASE2_SKILL_AR.md` — ZATCA Phase 2.
- `NM_NPHIES_SKILL_AR.md` — NPHIES.
- `NM_OBSERVABILITY_OPS_SKILL_AR.md` — Observability / Ops.
- `NM_FINANCE_ACCOUNTING_GUARD_SKILL_AR.md` — Finance / Accounting Guard.
- `NM_GOVERNANCE_CLOSEOUT_SKILL_AR.md` — Governance / Closeout.

لم يُنشأ أي Skill جديد ولم تُخترع أسماء. **DELTA**: تباين توثيقي فقط — الفهرس يستخدم الأسماء المختصرة بينما الملفات الفعلية بلاحقة `_SKILL_AR`؛ لا أثر أمني (استُخدمت الأسماء الفعلية مباشرة).

## 3. ملخص Baseline (Gate 0)
`drift 0/0 · parent c3ef404 · namaweb clean (f9819b6) · health محلي 200 · عام 200 · Redis PONG · Docker 29.5.3 · FORCE_RLS=150 · finance_journal_entries=0`. الملفات المتسخة كلها STITCH/UI/migrate سابقة خارج النطاق — لم تُلمَس ولم تُجهَّز.

## 4. ملخص Preflight (Gate 1)
مراجعة قراءة فقط لـ`tools/vault-sandbox/docker-compose.candidate.yml`: ربط `127.0.0.1:8200` فقط، `restart:"no"`، بلا ربط ملفات env إنتاجية، بلا ربط مفاتيح/شهادات، بلا token مُلتزَم، وضع dev/sandbox. مجلد الـsandbox لا يحتوي أسراراً. لا containers/volumes vault سابقة. المنفذ 8200 حر. صورة Vault لم تكن مخزّنة → احتاجت pull.

## 5. هل شُغّل Vault sandbox؟
**نعم** — `hashicorp/vault:latest` (مسحوب ضمن نطاق هذه البوابة) في وضع dev، الاستماع داخل الحاوية `0.0.0.0:8200` والنشر على المضيف **`127.0.0.1:8200` فقط** (مؤكَّد عبر `docker port`). dev root token وُلِّد عشوائياً في الذاكرة وقت التشغيل، لم يُطبع ولم يُكتب على القرص ولم يُلتزَم. بعد الـrehearsal هُدمت الحاوية (`docker rm -f`).

## 6. إثبات أن التنفيذ dummy-only
- KEK وهمي 32 بايت (`crypto.randomBytes`) — بصمة `39fd1249e902`، **ليس** KEK الإنتاج.
- payload وهمي `DUMMY-PHI-PLACEHOLDER:patient=TEST-0000:not-real` — لا PHI حقيقي.
- مصدر "DPAPI" = محاكاة محلية (`DPAPISIM:`) بمفتاح وهمي داخل الذاكرة — **لا استدعاء DPAPI حقيقي**.
- المخرجات معقّمة: بصمات SHA-256 مقصوصة + أطوال + بادئة الـciphertext فقط؛ لا plaintext KEK ولا token في أي سطر.

## 7–10. إثباتات السلامة
- **No real keys**: لا قراءة لـ`~/nama_kek.dpapi`، لا توليد مفتاح إنتاجي (`REAL_KEYS_CREATED/USED: NO`).
- **No private keys handled**: لا تعامل مع أي مفتاح خاص (`PRIVATE_KEYS_HANDLED: NO`).
- **No real certificates**: لا شهادات (`REAL_CERTIFICATES_USED: NO`).
- **No production changes**: لا app/DB/PM2/Redis/.env؛ `node --check` فقط؛ DDL=NO · DATA_CHANGED=NO · CODE_DEPLOYED=NO. الإنتاج بقي 200/PONG قبل وبعد.

## 11. نتائج wrap/re-wrap (Gate 3)
| فحص | نتيجة |
|---|---|
| `v1_dpapi_sim_roundtrip` | PASS (fp 39fd1249e902) |
| `transit_enabled` | PASS (http 204) |
| `transit_key_created` | PASS (http 200) |
| `rewrap_v1_to_v2` | PASS (provider_prefix `vault:v1`, ct.len 89) |
| `data_ciphertext_unchanged_by_rewrap` | PASS (DEK/payload لم يُعَد تشفيره) |
| `v2_unwrap_recovers_kek` | PASS (نفس البصمة) |
| `rewrap_idempotent_semantics` | PASS |
| `tampered_ciphertext_rejected` | PASS (http ≥ 400) |

المبدأ مُثبَت: re-wrap = تبديل مزوّد حماية الـKEK فقط؛ ciphertext البيانات ثابت (بصمة `068623251ecd` لم تتغيّر).

## 12. نتائج dual-read (Gate 4)
`dualread_v1_path` (DPAPI-sim) PASS · `dualread_v2_path` (Vault transit) PASS · `dualread_both_agree` PASS · `dualread_fallback_to_v1` PASS (محاكاة Vault معطّل → رجوع آمن لـv1). القارئ يفكّ نفس payload عبر المصدرين.

## 13. نتائج rollback (Gate 5)
`rollback_to_v1_recovers_data` PASS · `rollback_nondestructive_v2_still_valid` PASS. الـrollback = إيقاف استخدام v2 والعودة لـv1 كمصدر حقيقة؛ لا حذف أسرار، لا لمس قاعدة بيانات، مفتاح Vault يبقى صالحاً (غير مدمِّر).

## 14. نتائج Teardown
`docker rm -f nama-vault-sbx` → 0 حاويات vault متبقية · 0 volumes · المنفذ 8200 محرَّر · لا artifacts حساسة.

## 15. نتائج Hygiene
`git diff --check`: التنبيهات الوحيدة على ملفات STITCH خارج النطاق (لم تُجهَّز). التغيير ضمن النطاق = ملف واحد فقط `tools/vault-sandbox/rewrap_rehearsal.js` (untracked). فحص الأنماط الحساسة (token/private key/password/GUID) على الأداة = لا تطابق.

## 16. نتائج Mojibake audit
لا علامات UTF-8 مكسورة (Latin-1 mis-decode / BOM / U+FFFD) في هذا التقرير ولا في الأداة.

## 17. نتائج git diff/check
نظيف ضمن النطاق؛ لا أسرار/مفاتيح/شهادات في الـdiff؛ الملفات المجهّزة = الأداة + هذا التقرير فقط.

## 18. المخاطر المتبقية قبل production re-wrap
- DPAPI مرتبط بالمستخدم/الجهاز ⟹ فقدان الصندوق قبل اكتمال الهجرة = فقدان قدرة فك التغليف ما لم يكتمل **KEK escrow** أولاً (شبكة أمان إلزامية).
- dual-read الإنتاجي يضاعف مسارات القراءة ⟹ يلزم header لتمييز النسخة + منطق fallback مُختبَر + مراقبة.
- Vault الإنتاجي يحتاج بنية صلبة (raft + TLS + unseal آلي/Shamir + audit device)؛ وضع dev غير مقبول للإنتاج.
- تشغيل/إتاحة Vault = نقطة فشل جديدة ⟹ سياسة تدوير + نسخ + break-glass.

## 19. Gates المطلوبة قبل أي production re-wrap
1. `APPROVE_KEK_ESCROW_DR_PLAN_ONLY` — تنفيذ/توثيق escrow الـKEK (مالك) كشبكة أمان **أولاً**.
2. `APPROVE_PRODUCTION_REWRAP_READONLY_INVENTORY_ONLY` — جرد قراءة فقط لما هو مشفّر بـDPAPI.
3. Vault إنتاجي مُقسّى (raft/TLS/unseal/audit) + موافقة منفصلة.
4. بوابة re-wrap إنتاجي مخصّصة + نافذة صيانة + خطة rollback + drift drill.
5. إبطال DPAPI v1 فقط بعد إثبات نجاح v2 + اكتمال DR.

## 20. توصية بخصوص KEK escrow / DR
**escrow الـKEK يسبق أي re-wrap إنتاجي.** طالما DPAPI machine/user-bound، فالصندوق هو نقطة فشل وحيدة؛ يجب على المالك تشغيل `ops/security/nama_kek_escrow.ps1` (passphrase، إخراج خارج الموقع) وإثبات restore drill قبل لمس الإنتاج. الـescrow يبقى شبكة أمان حتى اكتمال الهجرة إلى Vault وإثبات الاسترجاع منه.

## 21. الخطوة التالية المقترحة
**NEXT_RECOMMENDED_ACTION: APPROVE_KEK_ESCROW_DR_PLAN_ONLY** (ثم `APPROVE_PRODUCTION_REWRAP_READONLY_INVENTORY_ONLY`). لا انتقال إلى production re-wrap إلا بموافقة صريحة جديدة + نافذة صيانة + rollback + DR مكتمل.

## الحقول
```text
FINAL_STATUS: DPAPI_TO_VAULT_REWRAP_REHEARSAL_DUMMY_PASS
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_INTEGRATION_SANDBOX, NM_ZATCA_PHASE2, NM_NPHIES, NM_OBSERVABILITY_OPS, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
VAULT_SANDBOX_RUN: YES (hashicorp/vault dev, 127.0.0.1:8200 loopback-only, torn down)
DUMMY_ONLY: YES
REAL_KEYS_CREATED: NO
REAL_KEYS_USED: NO
PRIVATE_KEYS_HANDLED: NO
REAL_CERTIFICATES_USED: NO
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
GIT_PARENT: c3ef404
GIT_COMMIT: (انظر سطر الإغلاق بعد الدفع)
DRIFT: 0/0
NEXT_RECOMMENDED_ACTION: APPROVE_KEK_ESCROW_DR_PLAN_ONLY
```

تم تنفيذ rehearsal آمن على بيانات وهمية فقط لإثبات سلامة تحويل حماية الـKEK من DPAPI إلى Vault transit، دون مفاتيح حقيقية أو شهادات أو اتصال تنظيمي أو تغيير إنتاجي
