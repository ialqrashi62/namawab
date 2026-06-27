# بوابة قرار المالك — تدوير الأسرار والنشر إلى Remote (NO PUSH)

**المشروع:** NamaMedical / الطبيب
**الفرع:** `audit/phase-1-critical-remediation`
**التاريخ:** 2026-06-27
**النوع:** بوابة قرار فقط — **لا push · لا تدوير فعلي بواسطة الوكيل · لا history rewrite · لا DB · لا deploy · لا production**
**الموافقة:** `APPROVE_OWNER_SECRET_ROTATION_AND_REMOTE_PUSH_DECISION_GATE_NO_PUSH`

> صرامة: لم تُطبع أي قيمة سرّ. لم يُقرأ `.env` لقيمه. كل ما يلي أسماء فئات وحالة نشر — لا أسرار.

---

## 1. الهدف

تحديد — قبل أي نشر — هل يمكن دفع الفرع الحالي إلى remote، وما أثر الأسرار التاريخية في تاريخ Git، وإعداد قائمة تدوير يدوية للمالك، واختيار المسار الآمن (تدوير أولاً / remote خاص بقبول مخاطر / history purge / إبقاء محلي).

---

## 2. حالة PHASE 2 المحلية

- root HEAD = `ada04fb` · namaweb HEAD = `319c4a5` · gitlink مطابق · لا staged · `npm test` = 92/92 PASS.
- حزمة PHASE 2 (2/2B/2C/2D/2E) مُغلقة محلياً ومُوثَّقة. لم يُنفَّذ أي push بعد.

---

## 3. حالة أسرار الشجرة الحالية (Current Tree)

| الفحص | النتيجة |
|---|---|
| `no_hardcoded_secrets_test.js` | 14/14 PASS |
| `tracked_secret_redaction_test.js` | 2/2 PASS (فحص 4804 ملف متتبَّع) |
| `namaweb/.env` | **غير متتبَّع** (gitignored ✓) — 11 مفتاحاً لا تُطبع قيمها |

**CURRENT_TREE_SECRET_STATUS = CLEAN.** الكود والملفات المتتبَّعة الحالية خالية من أسرار نصّية.

---

## 4. حالة التعرّض التاريخي (Git History)

- تقرير `PHASE_1_CRITICAL_REMEDIATION_REPORT_AR.md` (C-1) يثبت أن أسراراً كانت **مزروعة نصّياً في سكربتات متتبَّعة**، نُظّفت في الكود لكنها **تبقى في تاريخ Git** (لم يُجرَ history rewrite). الحالة المُسجَّلة: `BLOCKED_SECRET_ROTATION_REQUIRED`.
- تقرير `PHASE_1B_TRACKED_SECRET_REDACTION_REPORT_AR.md` (C-1B): نُقِّحت القيمة من ملفات التوثيق المتتبَّعة (استبدال بـ`[REDACTED_SECRET_VALUE]`).
- **تصعيد مهم (فحص metadata بلا مصادقة):** فرع namaweb **منشور سلفاً** على `origin` عند `44f8178`، واستعلام `ls-remote` بلا أي اعتماد **نجح** → المستودع البعيد **مقروء بلا مصادقة (عام على الأرجح)**. بما أن أسلاف `44f8178` تشمل التاريخ القديم الحامل للأسرار، فإن **الأسرار التاريخية لـnamaweb مكشوفة فعلياً على remote عام** — لا مجرد خطر محلي.

**HISTORICAL_SECRET_EXPOSURE_RISK = YES (مُصعَّد: منشور علناً لـnamaweb).**
**SECRET_ROTATION_REQUIRED = YES (إجراء مالك).**
**HISTORY_PURGE_REQUIRED_FOR_PUBLIC_REMOTE = YES.**
**HISTORY_PURGE_OPTIONAL_FOR_PRIVATE_REMOTE_WITH_OWNER_ACCEPTANCE = YES** (لكنه ليس اختيارياً لـnamaweb لأنه عام بالفعل).

---

## 5. قائمة تدوير الأسرار للمالك (أسماء فئات فقط — بلا قيم)

| # | الفئة | أين ظهرت تاريخياً (سكربتات نُظّفت) | تدوير مطلوب |
|---|---|---|---|
| 1 | كلمة مرور **MSSQL `sa`** | restore_db.sh · configure_sql.sh · fix_ldap.sh | YES |
| 2 | كلمة مرور **PostgreSQL** (مستخدم `namasoft` / دور التطبيق `nama_medical_app`) | setup_server.sh · deploy_web.sh · DATABASE_URL | YES |
| 3 | **JWT_SECRET** و**SESSION_SECRET** | deploy_web.sh · redeploy_new.sh | YES |
| 4 | **E2E TEST_PASSWORD** | سكربت الدخان E2E (روجِع في `E2E_CREDENTIAL_ROTATION_REVIEW_AR.md`) | YES |
| 5 | أسرار **خارج Git** (قيم `.env`، `~/nama_medical_app_db_password`، `pgpass.conf`) | مخازن خارج المستودع | اعتبر أي قيمة سبق التزامها «محروقة» وبدّلها |

**ملاحظة (ليست سرّاً):** توجد worktrees محلية مهجورة لبناء الـepics (E0–E9 تحت `.claude/worktrees/feat-*`) — للتنظيف لاحقاً، خارج نطاق هذه البوابة وليست أسراراً.

> الترتيب الآمن (إجراء مالك، ليس هنا): بدِّل 1→2→3→4 على الخوادم/المخازن، اضبط القيم الجديدة خارج Git، ثم أعد التشغيل الآمن. القيم القديمة تُعتبر محروقة بعد النشر العلني.

---

## 6. حالة Remote / Upstream

| المستودع | origin مُهيّأ؟ | upstream tracking | الفرع على origin؟ | قراءة بلا مصادقة |
|---|---|---|---|---|
| root | نعم | **لا** | **لا** (غير منشور) | فشلت → خاص/مُصادَق |
| namaweb | نعم | **لا** | **نعم** عند `44f8178` | **نجحت → عام** |

- root: لا upstream، والفرع غير موجود على origin → الدفع سيُنشئ **فرعاً جديداً يَنشر كامل التاريخ** (بما فيه الأسرار التاريخية) إلى مستودع خاص.
- namaweb: origin يملك الفرع عند `44f8178`، والمحلي **متقدّم 4 commits** و`44f8178` **سلف مُثبَت** لـ`319c4a5` → **FF قابل للإثبات تقنياً**، لكن التاريخ (وأسراره) **منشور علناً سلفاً**.

**REMOTE_DECISION (root) = NO_UPSTREAM_OWNER_REMOTE_REQUIRED.**
**REMOTE_DECISION (namaweb) = CLEAN_FF_ONLY_READY_AFTER_OWNER_SECRET_DECISION.**

---

## 7. لماذا NO_UPSTREAM لا يُثبت جاهزية الدفع

- غياب upstream tracking يعني أن Git **لا يستطيع حساب ahead/behind تلقائياً** ولا إثبات FF بلا تدخل يدوي (كما في root).
- وحتى حيث FF مُثبَت تقنياً (namaweb)، فإن **إمكانية FF خاصية ميكانيكية في Git لا تساوي أماناً للنشر**: الأسرار التاريخية لم تُدوَّر، وتاريخ namaweb مكشوف علناً بالفعل.
- إذن «جاهزية تقنية» ≠ «جاهزية إصدار». الدفع يبقى **محظوراً** حتى قرار المالك بشأن التدوير/قبول المخاطر.

---

## 8. خيارات القرار (المالك)

**Option A — موصى به: `ROTATE_SECRETS_FIRST_THEN_CONFIGURE_REMOTE_AND_FF_PUSH`**
- بدّل كل الفئات (1–5) أولاً، اضبط القيم الجديدة خارج Git، ثم قرّر النشر.
- مناسب لـroot (غير منشور) ولإغلاق المخاطرة بشكل صحيح.

**Option B — `PRIVATE_REMOTE_PUSH_WITH_EXPLICIT_RISK_ACCEPTANCE`**
- دفع إلى remote **خاص** مع قبول موثَّق بأن التاريخ لم يُطهَّر.
- **لا يصلح لـnamaweb الحالي لأن origin عام بالفعل**؛ يلزم أولاً نقل namaweb إلى remote خاص أو تطهير العام.

**Option C — `HISTORY_PURGE_REWRITE_THEN_PUSH`**
- يتطلب موافقة صريحة منفصلة (خارج هذه البوابة).
- قد يكسر hashes/submodule/gitlink؛ ولـnamaweb يتطلب force-push على remote عام منشور.
- **لا يُنفَّذ هنا.**

**Option D — `KEEP_LOCAL_ONLY_AND_CONTINUE_H9_H10_PREFLIGHT_OR_PHASE3_DOCS`**
- بلا نشر؛ متابعة العمل المحلي/التوثيقي. لا يُزيل التعرّض العلني القائم لـnamaweb (يتطلب تدوير على أي حال).

---

## 9. التوصية

**أولوية قصوى = Option A (تدوير فوري)** لأن أسرار namaweb **مكشوفة علناً بالفعل** (ليست افتراضية):
1. نفّذ تدوير الفئات 1–5 الآن (إجراء مالك) — قبل أي push وبصرف النظر عن قرار النشر.
2. لـroot: بعد التدوير، قرّر remote (خاص موصى به) ثم أول دفع.
3. لـnamaweb المنشور علناً: بالإضافة للتدوير، فكّر في Option C (تطهير تاريخ + force-push) أو نقل إلى remote خاص — **بموافقة مالك منفصلة**، خارج هذه البوابة.
4. لا public push قبل history purge.

---

## 10. ما لم يتم (وخارج النطاق)

- لا تدوير فعلي للأسرار (إجراء مالك يدوي).
- لا history rewrite / purge / force-push.
- لا push / fetch مُعدِّل (فقط استعلام metadata بلا مصادقة، قراءة فقط).
- لا DB / DDL / migration / production / deploy / PM2 / Docker / ZATCA / NPHIES / H9-H10 / GL / Phase 3.

---

## 11. تأكيدات السلامة

لا أسرار مطبوعة · لا قيم/كلمات مرور/tokens/مفاتيح · لا قراءة قيم `.env` · لا DB connection · لا external calls عدا metadata بلا مصادقة (قراءة فقط) · لا push · لا deploy · لا history rewrite · لا force push · لا staging خارج النطاق · لا مساس بالعناصر المستثناة.

**الإجراء التالي:** قرار المالك — تدوير الأسرار (Option A) ثم إعداد remote، أو قرار H-9/H-10 DDL.
