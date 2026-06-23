# KEK Escrow — Owner Execution Window — تقرير + Runbook

> 2026-06-23 | بوابة `APPROVE_OWNER_KEK_ESCROW_EXECUTION_WINDOW_ONLY`. تجهيز وفتح **نافذة تنفيذ المالك** لـescrow الـKEK: تدقيق الأداة قراءة فقط + تحقق المتطلبات + runbook تنفيذ المالك. **الوكيل لا يشغّل الأداة** (تتعامل مع KEK حقيقي عبر DPAPI وتتطلب passphrase لا يملكها/يحفظها الوكيل). لا KEK حقيقي لمسه الوكيل، لا تغيير إنتاجي.

## 1. الحالة النهائية
**FINAL_STATUS: OWNER_KEK_ESCROW_EXECUTION_WINDOW_READY** — النافذة جاهزة ومُتحقّق منها؛ الأداة مُدقّقة وآمنة؛ runbook المالك جاهز. **تنفيذ الـescrow نفسه = PENDING_OWNER_ACTION** (إجراء المالك داخل النافذة، خارج صلاحية الوكيل).

## 2. المهارات الفعلية المفعّلة
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md` (لاحقة `_SKILL_AR.md`). المُفعّلة: `NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` (الأساس) · `NM_INTEGRATION_SANDBOX` · `NM_ZATCA_PHASE2` · `NM_NPHIES` · `NM_OBSERVABILITY_OPS` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. لا مهارة جديدة/مخترعة. **DELTA**: تباين توثيقي فقط.

## 3. ملخص Baseline
`drift 0/0 · parent 44ec2eb · namaweb clean · health 200 · Redis PONG · FORCE_RLS=150 · journal=0`.

## 4. مراجعة الدليل السابق
سلسلة Vault متّسقة: provider (c3ef404) · rehearsal DUMMY_PASS (d4b2003) · escrow/DR plan READY (ac0515e) · restore drill DUMMY_PASS (5b0f9f1) · inventory READY (44ec2eb، 0 ciphertext في DB، KEK واحد). دون تناقض.

## 5. تدقيق أداة Escrow (قراءة فقط) — `ops/security/nama_kek_escrow.ps1`
| البند | التقييم |
|---|---|
| الخوارزمية | AES-256-CBC + HMAC-SHA256 (Encrypt-then-MAC؛ الـMAC يغطّي salt+iter+iv+ct) ✓ |
| اشتقاق المفتاح | PBKDF2-SHA256، 200,000 تكرار ✓ |
| الـpassphrase | `Read-Host -AsSecureString`، حد أدنى 12، تأكيد بالمطابقة، لا echo/log/تخزين ✓ |
| الـKEK الخام | في الذاكرة فقط (`ProtectedData.Unprotect`, CurrentUser)؛ يُصفّر بـ`Array.Clear` بعد الاستخدام ✓ |
| المخرجات | JSON مشفّر (salt/iv/ct/mac base64)؛ gitignored (`nama_kek_escrow*.enc`)؛ لا مادة مفتاح في السكربت ✓ |
| Recover | يتحقّق من الـMAC قبل فك التشفير ثم يعيد الحماية DPAPI ✓ |
| ملاحظة تحسين (غير حاجبة) | مقارنة الـMAC عبر `SequenceEqual` ليست constant-time — خطر مهمَل لملف escrow غير متصل |
**القرار**: الأداة سليمة وآمنة للالتزام (لا تحتوي أسراراً). تتعامل مع KEK حقيقي ⟹ **owner-run فقط**.

## 6. تحقق المتطلبات (قراءة فقط)
- KEK blob موجود: 262B · owner=`DESKTOP-…\<user>` · ACL entries=1 (مقيّد). ✓
- مخرجات escrow **غائبة** (0 من `nama_kek_escrow*.enc`) ⟹ المالك لم ينفّذ بعد. ✓
- ربط DPAPI = نفس المستخدم/الجهاز ⟹ الـescrow يجب أن يُنفَّذ كنفس مستخدم التطبيق (`<user>@DESKTOP-…`). ✓
- PowerShell متاح (5.1 و7). ✓
- gitignore يغطّي `nama_kek_escrow*.enc`. ✓

## 7. Runbook تنفيذ المالك (داخل النافذة)
> يُنفَّذ المالك بنفسه كـ**نفس مستخدم التطبيق** في شل تفاعلي. لا يشارك الـpassphrase مع أحد، ولا يكتبه في ملف/سجل.

**(أ) التنفيذ — escrow:**
```text
powershell -NoProfile -File ops\security\nama_kek_escrow.ps1 ^
  -Mode escrow -BlobPath %USERPROFILE%\nama_kek.dpapi -OutFile %USERPROFILE%\nama_kek_escrow.enc
```
- أدخل passphrase قوية (≥12، يُفضّل ≥16 مع تنوّع) مرتين.
- النتيجة: ملف `nama_kek_escrow.enc` مشفّر.

**(ب) سياسة الـpassphrase:** ≥12 (موصى ≥16)؛ تُحفظ منفصلة عن الوسيط (مدير أسرار/خزنة)؛ لا تُكتب بجوار الـ.enc؛ تُوزَّع بمعرفة مجزّأة (split knowledge) إن أمكن وفق سياسة الحوكمة.

**(ج) نقل آمن:** انقل `nama_kek_escrow.enc` إلى **تخزين غير متصل (offline)** (وسيط مشفّر/خزنة)؛ احذف النسخة من القرص الحيّ بعد النقل؛ **لا تلتزمه في git** (مُغطّى بالـgitignore أصلاً).

**(د) التحقق بعد الـescrow (بلا إخلال بالإنتاج):** نفّذ recover إلى **مسار مؤقّت** (وليس الـblob الحيّ) لإثبات أن الملف قابل للاسترجاع:
```text
powershell -NoProfile -File ops\security\nama_kek_escrow.ps1 ^
  -Mode recover -EscrowFile <offline>\nama_kek_escrow.enc -BlobPath %TEMP%\nama_kek_verify.dpapi
```
- نجاح + رسالة "Recovered KEK re-protected" ⟹ الـMAC صحيح والـpassphrase صحيحة. **ثم احذف** `%TEMP%\nama_kek_verify.dpapi` فوراً. (لا تكتب فوق `%USERPROFILE%\nama_kek.dpapi` الحيّ.)
- إثبات DR عبر آلة/مستخدم آخر = drill منفصل لاحق (يثبت إزالة ربط DPAPI فعلياً).

**(هـ) استبعاد من النسخ:** استثنِ `nama_kek.dpapi` (وأي نسخة منه) من النسخ الاحتياطية الروتينية؛ الـDR يعتمد على الـescrow + الـpassphrase لا على نسخ الـblob المربوط بالجهاز.

## 8. حوكمة النافذة
- **dual-control**: شاهد ثانٍ يؤكّد التنفيذ والنقل (لا يرى الـpassphrase).
- **separation of duties**: من ينقل الـ.enc ≠ من يحفظ الـpassphrase.
- **سجل تدقيق**: التقط (يدوياً) الوقت + المنفّذ + الشاهد + مسار التخزين (masked) + نجاح التحقق — **بلا أي قيمة سرّية**.
- **حادثة**: افتح سجل إجراء وأغلقه بتأكيد اكتمال النقل والتحقق.

## 9. ما نفّذه الوكيل
تدقيق الأداة (قراءة فقط) · تحقق المتطلبات (metadata فقط) · إعداد runbook + حوكمة النافذة + خطوات التحقق · هذا التقرير. commit docs-only + push FF.

## 10. ما لم ينفّذه الوكيل (حدود)
- **لم يشغّل `nama_kek_escrow.ps1`** (تتعامل مع KEK حقيقي).
- لم يقرأ/يفكّ `nama_kek.dpapi`.
- لم يولّد/يستخدم passphrase.
- لا Vault، لا inventory إضافي، لا re-wrap، لا DDL/بيانات/كود، لا اتصال ZATCA/NPHIES.

## 11. الإثباتات
`REAL_KEYS_READ/USED/CREATED: NO` · `DPAPI_READ: NO` · `ESCROW_TOOL_RUN_BY_AGENT: NO` · `PRIVATE_KEYS_HANDLED: NO` · `REAL_CERTIFICATES_USED: NO` · `PRODUCTION_CHANGES: NONE` · `DDL/DATA/CODE: NO`. health 200 · Redis PONG · FORCE_RLS=150 · journal=0 قبل/بعد.

## 12. نتائج Hygiene + Mojibake
`git diff --check`: تنبيهات على ملفات STITCH خارج النطاق فقط (غير مُجهّزة). المُجهّز = هذا التقرير فقط. mojibake: لا BOM/U+FFFD/Latin-1 mis-decode = CLEAN. لا أسرار/مفاتيح في الـdiff.

## 13. المخاطر المتبقية
- حتى يكمل المالك الـescrow + التحقق، يبقى DPAPI **نقطة فشل وحيدة** (فقدان الجهاز/المستخدم = فقدان القدرة على فك التشفير).
- DR عبر آلة أخرى غير مُثبت بعد (drill منفصل).
- Vault إنتاجي غير مُقسّى؛ re-wrap الإنتاجي محجوب على بنود ما قبل الإنتاج.

## 14. Gates المطلوبة قبل Production Re-wrap
escrow فعلي مُنفّذ + مُتحقَّق (هذه النافذة) · DR معتمد · restore drill مقبول (تم dummy) · inventory مكتمل (تم) · Vault إنتاجي مُقسّى · backup مُتحقَّق · نافذة صيانة · rollback plan · موافقة صريحة جديدة · ZATCA/NPHIES مفصولة · المحاسبة OFF.

## 15. الخطوة التالية المقترحة
بعد تأكيد المالك تنفيذ الـescrow + التحقق: `VERIFY_OWNER_RUN_KEK_ESCROW_AND_CLOSE_DR_GAP` (تحقق read-only من وجود الـ.enc وإغلاق فجوة DR). بالتوازي (لا يحتاج الـescrow): **`APPROVE_VAULT_PRODUCTION_HARDENING_PLAN_ONLY`** أو `APPROVE_PRODUCTION_REWRAP_DRY_RUN_PLAN_ONLY`. **لا production re-wrap** إلا بعد اكتمال القسم 14 + موافقة صريحة جديدة.

## الحقول
```text
FINAL_STATUS: OWNER_KEK_ESCROW_EXECUTION_WINDOW_READY
ESCROW_EXECUTION: PENDING_OWNER_ACTION
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_INTEGRATION_SANDBOX, NM_ZATCA_PHASE2, NM_NPHIES, NM_OBSERVABILITY_OPS, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
ESCROW_TOOL_AUDITED: YES (sound: AES-256-CBC+HMAC, PBKDF2-200k, SecureString, KEK zeroed)
ESCROW_TOOL_RUN_BY_AGENT: NO
PRECONDITIONS_VERIFIED: YES (KEK present 262B/ACL-restricted; escrow output ABSENT; same-user binding; gitignore covers *.enc)
OWNER_RUNBOOK_CREATED: YES
REAL_KEYS_CREATED: NO
REAL_KEYS_READ: NO
REAL_KEYS_USED: NO
DPAPI_READ: NO
DECRYPT_ATTEMPTED: NO
PRIVATE_KEYS_HANDLED: NO
REAL_CERTIFICATES_USED: NO
VAULT_PRODUCTION_DEPLOYED: NO
VAULT_SANDBOX_RUN: NO
PRODUCTION_INVENTORY_RUN: NO
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
GIT_PARENT: 44ec2eb
GIT_COMMIT: (انظر سطر الإغلاق بعد الدفع)
DRIFT: 0/0
NEXT_RECOMMENDED_ACTION: VERIFY_OWNER_RUN_KEK_ESCROW_AND_CLOSE_DR_GAP (أو APPROVE_VAULT_PRODUCTION_HARDENING_PLAN_ONLY بالتوازي)
```

جُهّزت نافذة تنفيذ المالك لـescrow الـKEK مع runbook كامل وتدقيق آمن للأداة، دون أن يلمس الوكيل أي مفتاح حقيقي أو يقرأ DPAPI أو يغيّر الإنتاج؛ تنفيذ الـescrow يبقى إجراء المالك
