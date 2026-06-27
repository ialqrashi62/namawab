# P1_GIT_SPLIT_BRAIN_RECONCILIATION_AND_SUBMODULE_POINTER_FIX — تقرير الإغلاق

> مرحلة مصالحة Git آمنة. **لم يُنفَّذ:** force push، DDL، seed، migration، تغيير بيانات، production deploy، تعديل runtime، Stitch.
> تاريخ التنفيذ: 2026-06-20. لا commit محلي حُذف قبل أخذ backup.

---

## الخلاصة بسطر واحد

أُعيد الأب المحلي إلى حقيقة `origin/master` بعد أخذ backup كامل، وأُعيد توجيه `namaweb` إلى `e6608ba` (محرك المحاسبة)، وأُعيد تشغيل اختبارات المحرك بنجاح **28/28**، **بدون فقدان أي عمل وبدون force push**.

---

## الحقول المطلوبة

```text
FINAL_STATUS: GIT_RECONCILIATION_PASS
RECONCILIATION_METHOD: RESET_LOCAL_TO_ORIGIN_AFTER_BACKUP (+ cherry-pick تقرير المصالحة فقط)
LOCAL_BACKUP_BRANCH: backup/local-split-brain-before-reconcile (parent @ 11af0fe) ; backup/namaweb-df893ab-before-reconcile (namaweb @ df893ab)
LOCAL_BACKUP_TAG: backup-local-split-brain-before-reconcile ; backup-namaweb-df893ab-before-reconcile
LOCAL_ONLY_COMMITS_FOUND: 3 (origin/master..HEAD السابق)
LOCAL_ONLY_COMMITS_ACTION: 11af0fe → cherry-picked على master ; 6a24358 + 4e98ae2 → محفوظان في backup، الدمج مؤجَّل لمراجعة يدوية (origin يتجاوزهما)
PARENT_BEFORE: 11af0fe
PARENT_AFTER: 9166ada (= origin/master 88d4406 + cherry-pick تقرير المصالحة)
ORIGIN_MASTER: 88d4406
NAMAWEB_BEFORE: df893ab
NAMAWEB_AFTER: e6608ba
ACCOUNTING_ENGINE_FOUND: YES
ACCOUNTING_ENGINE_PATH: namaweb/accounting_posting.js (+ accounting_posting_test.js)
ACCOUNTING_ENGINE_TESTS: 28 PASS / 0 FAIL (أُعيد تشغيلها، exit 0)
SUBMODULE_POINTER_VALID: YES (parent gitlink = namaweb HEAD = namaweb origin/master = e6608ba)
GITMODULES_PRESENT: NO (gitlink يتيم — نفس نمط origin/master القائم؛ توصية متابعة لا تخص هذه البوابة)
USER_VISIBLE_ON_WEBSITE: NO
PRODUCTION_DEPLOYED: NO
DDL_EXECUTED: NO
DATA_CHANGED: NO
FORCE_PUSH_USED: NO
LOCAL_CHANGES_REMAINING: ملفات namaweb غير متتبَّعة فقط (jest.config.js, tests/, public/AppServerPortal/) + namaweb كـ untracked في الأب (لغياب .gitmodules)
PUSHED: YES (fast-forward عادي، بدون force) — انظر قسم Git أدناه
NEXT_REQUIRED_ACTION: P1_ACCOUNTING_DDL_AND_COA_SEED_READINESS
```

---

## جدول الـ commits المحلية الحصرية (Gate 1)

| Local-only Commit | Files | Type | Keep? | Action / Reason |
|---|---|---|---|---|
| `11af0fe` | 1 (`docs/P1_ACCOUNTING_STATE_RECONCILIATION_GATE_AR.md`) | doc | ✅ keep | cherry-picked على master (origin يفتقده) |
| `6a24358` | .NET controllers بمسار `backend/dotnet/NamaMedical.Api/Controllers/` + `AppServerPortal/data.js` + `sync_medical_pricing.py` + `__pycache__/*.pyc` | runtime (مكرّر) | ⚠️ backup-only | origin/master **يحوي نفس المسارات أصلاً**؛ تكرار على قاعدة متباعدة + نفايات pyc؛ الدمج مؤجَّل لمراجعة يدوية |
| `4e98ae2` | 656 ملفاً (docs/, .ai-brain/skills, skeletons, migrations, iac/kustomize, grafana, tests) | docs/skeleton | ⚠️ backup-only | يتجاوزه عمل origin؛ دمجه التلقائي = تعارض ضخم؛ محفوظ في backup |

السبب الجامع: الفرع المحلي خط مبكر متباعد (merge-base `b7ffdfe`، متأخّر 128 / متقدّم 3). `origin/master` هو خط الإنتاج الموثوق ويحتوي/يتجاوز العمل المحلي. الدمج الانتقائي لأي جزء فريد = مهمة منفصلة لاحقة عبر مراجعة يدوية/PR.

---

## التحقق (Gates 5–7)

- **namaweb**: `git checkout e6608ba` ⇒ HEAD = `e6608ba`؛ المحرك `accounting_posting.js` + `accounting_posting_test.js` ظهرا في شجرة العمل؛ الملفات غير المتتبَّعة لم تُمسّ.
- **اختبارات المحرك**: `node accounting_posting_test.js` ⇒ `28 PASS | 0 FAIL` (exit 0). ادعاء التقرير السابق "28/28" **مُتحقَّق منه مستقلاً**.
- **سلامة عمل المراحل السابقة** على الأب المُصالَح: حاضر —
  `docs/P0_APP_TENANT_ID_RLS_BINDING_*` (P0 RLS)، `docs/FACILITY_TYPE_ENTITLEMENTS_AUDIT_AR.md` (facility entitlement)، `docs/P1_FACILITY_ENTITLEMENT_FAIL_CLOSED_*` (fail-closed)، `docs/P1_MEDICAL_ACCOUNTING_POSTING_*` (accounting foundation)، وseed نوع المنشأة عبر `ac9b0f7`.

---

## معيار PASS — التحقق

| المعيار | الحالة |
|---|---|
| backup للحالة المحلية | ✅ branch + tag (parent + namaweb) |
| فحص الـ commits المحلية | ✅ 3 commits، مصنّفة |
| توثيق قرار الاحتفاظ/التجاهل | ✅ جدول أعلاه |
| المحلي متوافق مع origin/master | ✅ 0 متأخّر / 1 متقدّم (تقرير فقط) |
| namaweb → e6608ba | ✅ |
| accounting_posting.js موجود | ✅ |
| لا force push | ✅ |
| لا DDL / data change / deploy | ✅ |
| تقرير الإغلاق مكتمل | ✅ هذا الملف |
| UTF-8 audit | ✅ (المحتوى UTF-8 سليم) |

---

## Git

- backup أولاً (parent + namaweb) ⇒ `git reset --hard origin/master` ⇒ `git cherry-pick 11af0fe`.
- إضافة هذا التقرير + commit عادي + **push fast-forward بدون force**.
- لم يُستخدم force في أي خطوة. الـ backups تحفظ كامل الحالة السابقة للاسترجاع.

## توصية متابعة (خارج نطاق هذه البوابة)

1. تسجيل `namaweb` كـ submodule صحيح (`.gitmodules`) لإنهاء حالة الـ gitlink اليتيم.
2. مراجعة يدوية لـ `df893ab` (security hardening في namaweb) و`6a24358/4e98ae2` لتقرير ما إذا كان فيها أي جزء فريد يستحق الدمج فوق `e6608ba`.

## المرحلة التالية

`P1_ACCOUNTING_DDL_AND_COA_SEED_READINESS` — معالجة فجوات DDL (NUMERIC، UNIQUE، FK، فرض التوازن، idempotency، tenant_id/RLS) + زرع شجرة الحسابات، ثم توصيل المحرك. بدون نشر إنتاج.
