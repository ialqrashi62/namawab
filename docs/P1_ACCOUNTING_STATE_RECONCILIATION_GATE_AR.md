# P1_ACCOUNTING_STATE_RECONCILIATION_GATE — تقرير الحسم (Read-Only)

> مرحلة تحقق إلزامية read-only. **لم يُنفَّذ:** أي DDL، Seed، تغيير بيانات، كتابة/تعديل كود runtime، تشغيل اختبارات، نشر إنتاج، أو Stitch.
> تاريخ التنفيذ: 2026-06-20.

---

## الحسم النهائي بسطر واحد

التعارض بين التقريرين **ليس تناقضاً في الواقع**، بل اختلاف **سياق git**:
- محرك المحاسبة `accounting_posting.js` **موجود فعلاً ومُختبَر** في commit `e6608ba` داخل مستودع `namaweb`، ومُشار إليه من `origin/master` (وعبر parent commit `a72fd8e`).
- لكنه **غائب عن بيئة العمل المحلية** لأن: parent HEAD المحلي (`6a24358`) فرعٌ **متباعد ومتأخّر 128 commit** عن `origin/master`، ويوجّه gitlink الخاص بـ `namaweb` إلى `df893ab` (**ما قبل المحرك**)، و`namaweb` غير مُسجَّل كـ submodule (لا `.gitmodules`).

النتيجة: **ENGINE موجود، لكن المؤشِّر/الفرع المحلي غير متزامن** ⇒ التصنيف **C: SUBMODULE_POINTER_MISMATCH** (المصحوب بتباعُد فرع الأب).

---

## Gate 0 — حقيقة Git / Submodule

### Parent repo
| العنصر | القيمة |
|---|---|
| `parent HEAD` | `6a24358` (feat: scaffold FastAPI and .NET API controllers…) |
| `git status` | `? namaweb` (يظهر untracked لأن لا يوجد `.gitmodules`) |
| `.gitmodules` | **غير موجود** — `namaweb` gitlink يتيم (orphan gitlink) |
| نوع تتبّع `namaweb` | `160000` (gitlink) عند `df893ab` في tree الخاص بـ HEAD المحلي |
| `a72fd8e` (parent، المذكور) | **موجود** — "docs: medical accounting posting audit + engine foundation (P1)" — **ليس** ضمن نسب HEAD المحلي؛ على `origin/master` |
| `88d4406` (parent، المذكور) | **موجود** — "docs: stitch design transfer analysis…" — على `origin/master` |
| تباعُد الأب | `HEAD` ↔ `origin/master`: **متقدّم 2 / متأخّر 128**؛ merge-base = `b7ffdfe` |

### مؤشّر gitlink لـ `namaweb` في كل سياق
| السياق | يشير إلى |
|---|---|
| local `HEAD` (6a24358) | `df893ab` ← **ما قبل المحرك** |
| `origin/master` | `e6608ba` ← **المحرك** |
| `a72fd8e` | `e6608ba` ← **المحرك** |

### namaweb repo (مستودع مستقل قائم بذاته)
| العنصر | القيمة |
|---|---|
| `namaweb HEAD` | `df893ab` (feat(security): harden server security) |
| `df893ab` | موجود (هو الـ checkout الحالي) |
| `e6608ba` (المذكور) | **موجود** — "feat: medical accounting posting engine foundation (unwired, tested)"؛ مُتاح عبر `remotes/origin/master`؛ **ليس** ancestor لـ `df893ab` (merge-base = `04b5e52`) |
| untracked في namaweb | `jest.config.js`, `public/AppServerPortal/`, `tests/` |

---

## Gate 1 — البحث عن محرك المحاسبة

- **في working tree المحلي (df893ab):** لا يوجد `accounting_posting.js` (مؤكَّد).
- **في commit `e6608ba` (namaweb):** موجود — ملفّان:
  - `accounting_posting.js` — 147 سطراً.
  - `accounting_posting_test.js` — 88 سطراً.
- متتبَّع في git؟ **نعم**، داخل مستودع `namaweb` على `origin/master`، وليس في الـ checkout المحلي.

محتوى المحرك (مقتطفات مؤكَّدة من `e6608ba:accounting_posting.js`):
- `validateBalanced(lines)` ⇒ يفرض `Σ debit == Σ credit && > 0`.
- `buildPostingReference(type,id)` ⇒ مرجع idempotency `POST:TYPE:ID` (يمنع التكرار).
- بناة قيود: فاتورة مريض **نقدية/تأمين**، سند قبض، استرداد، إشعار دائن، فاتورة مورّد، سند صرف، استهلاك مخزون، **قيد عكسي (reversal)**، فصل VAT شامل.
- ملاحظة المؤلف داخل الكود: idempotency على مستوى DB يحتاج `source_type/source_id` + فهرس فريد عبر **DDL** (غير منفّذ بعد).

---

## Gate 2 — التحقق من ادعاءات التقرير السابق

| Claim | Evidence | Status |
|---|---|---|
| `accounting_posting.js` exists | `e6608ba` tree (namaweb) — 147 سطر | **TRUE** |
| tests 28/28 exist | `e6608ba:accounting_posting_test.js` (88 سطر، ~28 `assert(...)`، harness يخرج بـ exit 1 عند الفشل) | **TRUE (موجودة)** — *لم تُعَد تشغيلها في هذه المرحلة read-only* |
| commit `e6608ba` contains engine | `git show --stat e6608ba` = الملفّان فقط (+235 سطر) | **TRUE** |
| parent `a72fd8e` points to that commit | `git ls-tree a72fd8e namaweb` = `e6608ba` | **TRUE** |
| engine is not connected to runtime | رسالة الـ commit نفسها "**unwired**"؛ وغائب عن checkout المحلي؛ لا `require('./accounting_posting')` في server.js المحلي | **TRUE (غير موصول)** |
| CoA = 0 production | لا اتصال DB في هذه البيئة + ممنوع لمس بيانات/إنتاج | **NOT_VERIFIED** |
| journal = 0 production | كما أعلاه | **NOT_VERIFIED** |
| vouchers = 0 production | كما أعلاه | **NOT_VERIFIED** |

**خلاصة Gate 2:** التقرير السابق **صحيح في سياق `origin/master`**. التقرير الجديد **صحيح في سياق الـ checkout المحلي**. لا تناقض واقعي — الفجوة بيئية (الفرع المحلي متأخّر 128 ولا يحوي المحرك).

---

## Gate 3 — حقيقة DDL (read-only، كما في الـ checkout المحلي `df893ab`)

| Table | Exists | tenant_id | Numeric Types | FK Integrity | Unique Constraints | RLS | Notes |
|---|---|---|---|---|---|---|---|
| finance_chart_of_accounts | ✅ | ❌ | n/a (نصوص) | ❌ | ❌ (لا UNIQUE على account_code) | ❌ | parent_id بلا FK |
| finance_journal_entries | ✅ | ❌ | n/a | ❌ | ❌ | ❌ | لا fiscal_year FK |
| finance_journal_lines | ✅ | ❌ | **debit/credit = REAL (عائم — خطأ للنقود)** | ❌ (account_id بلا FK) | ❌ | ❌ | لا ضمان توازن على مستوى DB |
| finance_fiscal_years | ✅ | ❌ | n/a | ❌ | ❌ | ❌ | — |
| finance_cost_centers | ✅ | ❌ | n/a | ❌ | ❌ | ❌ | — |

تحقّقات خاصة:
- debit/credit: **REAL** (يجب `NUMERIC`).
- `UNIQUE(account_code)` أو tenant-aware unique: **غير موجود**.
- FK لـ `journal_lines.account_id`: **غير موجود**.
- ضمان توازن القيد على DB: **غير موجود** (مفروض فقط في كود المحرك عبر `validateBalanced`).
- idempotency / document-posting unique key على DB: **غير موجود** (المرجع نصّي في الكود فقط، بلا قيد فريد في DB).
- multi-tenant-ready: **لا** — لا `tenant_id` ولا RLS على جداول finance.

---

## Gate 4 — القرار

المحرك **موجود ومُختبَر** (شرط الحالة A متحقّق)، **لكن** الـ checkout المحلي لا يحويه: مؤشّر gitlink محلي خاطئ (`df893ab` بدل `e6608ba`)، فرع الأب متأخّر 128، ولا `.gitmodules`. لذلك العائق الحاكم هو عدم التزامن ⇒ **الحالة C تسبق**.

```text
ACCOUNTING_ENGINE_RECONCILIATION_STATUS: SUBMODULE_POINTER_MISMATCH
NEXT_REQUIRED_ACTION: FIX_SUBMODULE_POINTER_AND_PUSH_PARENT
```

العمق الإضافي: ليست مجرد نقلة مؤشّر — يلزم أيضاً **حسم تباعُد فرع الأب** (محلي متقدّم 2 / متأخّر 128 عن origin/master) + **تسجيل `namaweb` كـ submodule صحيح** (`.gitmodules`).

---

## التقرير المطلوب (الحقول)

```text
FINAL_STATUS: RECONCILIATION_DOCS_ONLY_PASS
ACCOUNTING_ENGINE_FOUND: YES
ACCOUNTING_ENGINE_PATH: namaweb/accounting_posting.js (+ accounting_posting_test.js)
ACCOUNTING_ENGINE_COMMIT: e6608ba (namaweb) — reachable via origin/master & parent a72fd8e
TESTS_FOUND: YES (accounting_posting_test.js, 88 lines, ~28 asserts)
TESTS_RESULT: CLAIMED_28_28 — NOT_RE_RUN_IN_READONLY_GATE
PARENT_COMMIT: 6a24358 (local HEAD) | origin/master tip = 88d4406
SUBMODULE_COMMIT: local gitlink=df893ab (pre-engine) | origin/master gitlink=e6608ba (engine)
SUBMODULE_POINTER_VALID: NO (local points to pre-engine df893ab; no .gitmodules)
PREVIOUS_REPORT_VALIDATED: TRUE (in origin/master context)
NEW_REPORT_VALIDATED: TRUE (in local checkout context)
DDL_TABLES_EXIST: YES (5 finance tables)
DDL_INTEGRITY_GAPS: REAL-money-types, no UNIQUE(account_code), no FK(account_id), no DB balance-enforcement, no idempotency-unique, no tenant_id, no RLS
COA_COUNT: NOT_VERIFIED (no DB access; production untouched)
JOURNAL_COUNT: NOT_VERIFIED
VOUCHER_COUNT: NOT_VERIFIED
USER_VISIBLE_ON_WEBSITE: NO
DDL_EXECUTED: NO
DATA_CHANGED: NO
PRODUCTION_DEPLOYED: NO
NEXT_REQUIRED_ACTION: FIX_SUBMODULE_POINTER_AND_PUSH_PARENT (then reconcile divergent parent branch + register .gitmodules) BEFORE any DDL/Seed/Stitch
```
