# تقرير C-1B — تنقيح أسرار التوثيق المتتبَّعة + بوّابة أدلة ما قبل الالتزام
## Tracked Documentation Secret Redaction + Pre-Commit Evidence Gate

**الفرع:** `audit/phase-1-critical-remediation` (الريبوين)
**النطاق:** إغلاق تسريب الأسرار في **working tree المتتبَّع بالكامل** (وليس السكربتات فقط) — بلا history rewrite، بلا commit، بلا طباعة قيم، مع الحفاظ على الأدلة.

---

## 1. SECRET_CURRENT_TREE_STATUS

**نظيفة — `CLEAN`.** مُسح **4698 ملفاً متتبَّعاً** عبر الريبوين (namaweb + الجذر) لكل الأنواع (sh/js/md/txt/json/yml/Makefile/docs/project_brain). **صفر قيم أسرار حقيقية** متبقية (التحقق آلي عبر `tracked_secret_redaction_test.js`).

طريقة الكشف: بالشكل (connection strings / `WITH PASSWORD` / `-P` / `JWT_SECRET`/`SESSION_SECRET`/`*_PASSWORD`)، مع استثناءات **per-match** فقط: `$VAR`/`${VAR}`/`${{ secrets.X }}`، `__CHANGE_ME__`، `[REDACTED…]`، `<placeholder>`، الـfallback التطويري المعروف، و`postgres:postgres@localhost`.

> الاختبار **لا يستثني docs/project_brain**؛ الاستثناءات الوحيدة: ملفات `*.example`، ملفات `*_test.js` (تحوي أنماط الكشف نفسها)، والقيم المُعلَّمة كـplaceholder/REDACTED.

---

## 2. FILES_REDACTED

استُبدلت كل قيمة سر بـ`[REDACTED_SECRET_VALUE]` (مع إبقاء النص التوضيحي: نوع السر/الموضع/السبب). **لم تُطبع أي قيمة في أي خطوة.**

| # | الملف (+ نسخة `project_brain/` المطابقة) | نوع السر | السبب |
|---|---|---|---|
| 1 | `docs/PHASE5_SECURITY_DELTAS_AND_GATE_STOP_AR.md` ×2 | `SESSION_SECRET` (بادئة الـfallback) | إشارة لسرّ الجلسة المكشوف |
| 2 | `docs/PHASE_B_D0_SECRETS_KEY_MANAGEMENT/01_CURRENT_SECRETS_SURFACE_AR.md` ×2 | `SESSION_SECRET` fallback | توثيق سطح الأسرار |
| 3 | `docs/dev-tooling/Makefile` ×2 (سطرا 43/51) | كلمة مرور MSSQL `sa` | hardcoded في أمر sqlcmd |
| 4 | `docs/dev-tooling/docker-compose.dev.yml` ×2 (سطرا 12/19) | MSSQL `SA_PASSWORD` | env + healthcheck نصّيان |
| 5 | `docs/ci-cd/github-actions.yml` ×2 (سطر 69) | CI `SA_PASSWORD` | خدمة CI نصّية |
| 6 | `docs/MEDICAL_PRODUCTION_RUNBOOKS_AR.md` ×2 (سطر 188) | كلمة مرور `nama_app_user` | `ALTER USER … WITH PASSWORD '…'` |
| 7 | `docs/MEDICAL_FULL_PRODUCTION_FINAL_EXECUTION_COMMAND_PLAN_AR.md` ×2 (سطر 52) | `SESSION_SECRET` (قيمة كاملة) | runbook نشر |
| 8 | `docs/governance/.../E2E_LOCAL_SMOKE_SCRIPT_SAFETY_REVIEW_AR.md` (سطر 21) | كلمة مرور اختبار e2e مقتبسة | اقتباس literal في مراجعة |

**إجمالي:** 15 ملف توثيق متتبَّع نُقّح (8 أصول + 7 نسخ `project_brain`) + 19 قيمة سر مُنقّحة. كما نُظّفت بقايا لاحقة ملتصقة بالرمز (مثل `…]6`) لتنقيح تام.

### إيجابيات كاذبة تم تأكيدها واستبعادها (بلا تعديل):
- كل سكربتات `.sh` (حُرّاس `${VAR:?msg}` خاصتي من C-1) — ليست أسراراً.
- `PHASE5:47` سطر `node -e … crypto.randomBytes` — **كود توليد** سرّ، لا قيمة ثابتة.

### تحديث C-1B+ (تصحيح):
- `namaweb/e2e_local_smoke_test.js` **لا يحوي أي literal** — مُتحقَّق في C-1B+: يقرأ `process.env.E2E_TEST_PASSWORD` مع حارس fail-closed (`process.exit(1)` برسالة آمنة لا تطبع القيمة). تقرير التدقيق السابق (T-6) كان مبنياً على نسخة قديمة. أُضيف placeholder `E2E_TEST_PASSWORD=__CHANGE_ME__` في `.env.example`، وشُدّد استثناء الماسح لملفات `*_test.js` ليرفض أي literal password حقيقي.

---

## 3. TEST_RESULTS

| الفحص | النتيجة |
|---|---|
| `node tracked_secret_redaction_test.js` (جديد، 4698 ملف) | ✅ 0 انتهاك |
| `node no_hardcoded_secrets_test.js` | ✅ نظيف |
| `node billing_integrity_test.js` | ✅ 26/26 |
| `npm test` (89 ملف) | ✅ **89 passed, 0 failed** |
| `node --check server.js` | ✅ |
| `bash -n` للسكربتات الستة المعدّلة | ✅ 6/6 |
| `git diff --check` (ملفاتي) | ✅ نظيف *(تحذير مسافة وحيد في `STITCH_DESIGN_…md` = تعديل سابق ليس لي)* |
| `git status --short` / `--name-only` | ✅ روجِعت؛ فُصلت ملفاتي عن تغييرات سابقة غير متعلقة |

---

## 4. OWNER_ROTATION_REQUIRED

> كل قيمة كانت مكشوفة في الشجرة المتتبَّعة (أو في التاريخ) تُعدّ **محروقة** ويجب تدويرها. لا قيمة مذكورة هنا.

1. كلمة مرور MSSQL `sa` (deploy/restore + dev-tooling + CI) — **ROTATE_REQUIRED**.
2. كلمة مرور PostgreSQL لمستخدم التطبيق (`namasoft` / `nama_app_user`) — **ROTATE_REQUIRED**.
3. `JWT_SECRET` و`SESSION_SECRET` (كل القيم في السكربتات والـrunbooks) — **ROTATE_REQUIRED**.
4. كلمة مرور اختبار e2e (`TEST_PASSWORD`) — **ROTATE/REPLACE_WITH_ENV** (تعدّل admin الحيّ).
5. ضبط كل القيم الجديدة **خارج Git** (متجر أسرار / `.env` مُستثنى).
6. **history rewrite/purge** لاحقاً (خارج C-1B) — حتى ذلك الحين تبقى القيم في تاريخ Git.
7. نسخ `.claude/worktrees/wf_*` (غير متتبَّعة) تحوي نسخاً قديمة من السكربتات بالسرّ على القرص — تُحذف محلياً (خارج Git، لن تُلتزَم).

---

## 5. COMMIT_READINESS_DECISION

**جاهز للالتزام — مشروط بـstaging انتقائي.** عند الالتزام تُدرَج **ملفاتي فقط**:

**namaweb:** `server.js`, `package.json`, `.env.example`, `billing_integrity.js`, `billing_integrity_test.js`, `no_hardcoded_secrets_test.js`, `tracked_secret_redaction_test.js`.

**الجذر (C-1 + C-1B):** `.gitignore`, `configure_sql.sh`, `deploy_web.sh`, `fix_ldap.sh`, `redeploy_new.sh`, `restore_db.sh`, `setup_server.sh`, `.env.example`, التقريران، و15 ملف توثيق مُنقّح.

**تُستثنى صراحةً (تغييرات سابقة ليست من عملي):** `docs/STITCH_DESIGN_IMPLEMENTATION_REPORT_AR.md`, `migrate.ps1` (محذوف), `protocol_x.ps1` (محذوف), مؤشّر `namaweb`, وملفات `STITCH_*/MEDICAL_UI_*` غير المتتبَّعة.

**لن أُنفّذ commit أو push حتى موافقتك الصريحة** (حسب التعليمات).

---

## 6. FINAL_STATUS

### `C1B_CURRENT_TREE_SECRETS_REDACTED_READY_FOR_COMMIT`

الشجرة المتتبَّعة في الريبوين **خالية من قيم الأسرار** (مُتحقَّق آلياً عبر 4698 ملفاً)، والاختبارات **89/89 خضراء**، والأدلة محفوظة بلا قيم. يبقى **تدوير الأسرار** إجراء مالك يدوياً (القسم 4). بانتظار موافقتك الصريحة لتنفيذ الـcommit الانتقائي.
