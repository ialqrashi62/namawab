# P1_ACCOUNTING_DDL_AND_COA_SEED — Gate 0: خط الأساس (Baseline)

> مرحلة جاهزية (readiness) — تصميم/وثائق/SQL مرشّح فقط. **لم يُنفَّذ أي DDL/Seed، ولا تغيير بيانات، ولا اتصال بإنتاج، ولا نشر، ولا Stitch.** التاريخ: 2026-06-20.

## ACTIVE_SKILLS
```text
ACTIVE_SKILLS:
- MEDICAL_AUTOPILOT_CORE_SKILL_AR
- MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR
- MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR
- MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR
- MEDICAL_API_AUDIT_SKILL_AR
- MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR
- MEDICAL_TEST_SCENARIOS_SKILL_AR
- MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR
- MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR
- MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## Git baseline (read-only)
- `git status --short`: `? namaweb` فقط (gitlink غير متتبَّع — لا `.gitmodules`؛ خارج النطاق حسب التعليمات).
- parent HEAD = `176807f` = `origin/master` (متزامن، 0/0).
- `git ls-tree HEAD namaweb` → gitlink = `e6608ba`.
- داخل `namaweb`: HEAD = `e6608ba` ✓ ، `accounting_posting.js` موجود ✓ ، `accounting_posting_test.js` موجود ✓ ، الاختبارات أعيد تشغيلها سابقاً **28/28 PASS**.

## محرك المحاسبة (e6608ba) — رموز الحسابات المستخدمة
المحرك يثبّت 10 رموز في `ACCOUNT_CODES` ويستخدمها لبناء قيود متوازنة:
`1000` نقد · `1010` بنك · `1100` ذمم مريض · `1110` ذمم تأمين · `1200` مخزون · `2100` ذمم موردين · `2300` ضريبة · `4000` إيراد · `4090` مردودات · `5000` تكلفة. (VAT 15% شامل).

## حالة الجداول المحاسبية الحالية (من الكود — read-only)
المصدر: `namaweb/db_postgres.js` (PG) و`namaweb/database.js` (SQLite). **لا قراءة من الإنتاج** (لا اتصال DB متاح، وممنوع لمس بيانات الإنتاج).

| الجدول | موجود | الأعمدة الأساسية | tenant_id | ملاحظة |
|---|---|---|---|---|
| finance_chart_of_accounts | ✅ | account_code, names, parent_id, account_level, account_type, is_active | ❌ **مفقود** | لا UNIQUE على الرمز |
| finance_journal_entries | ✅ | entry_number, entry_date, reference, is_auto, fiscal_year_id, is_posted, created_by | ✅ (ALTER ~1925 + index + backfill) | لا source_type/posting_reference/status |
| finance_journal_lines | ✅ | entry_id, account_id, debit REAL, credit REAL, cost_center_id, notes | ✅ (ALTER ~1929 + backfill، بلا index) | debit/credit نوع REAL |
| finance_fiscal_years | ✅ | year_name, start/end, is_closed | ❌ مفقود | — |
| finance_cost_centers | ✅ | center_name, center_code, clinic_id, is_active | ❌ مفقود | — |
| finance_vouchers | ✅ | voucher_number/type, amount REAL, account_id | ✅ (ALTER ~1937 + backfill) | منفصل عن قيد اليومية |

## ملاحظات حرجة على الأساس
1. **الإنتاج لا ينشئ الجداول تلقائياً**: `initDatabase()` يتخطّى إنشاء الجداول والـ ALTER والـ seeding عند `NODE_ENV=production` (db_postgres.js:56-59). ⇒ أي DDL/seed للإنتاج يجب أن يُطبَّق **صراحةً** عبر migration محكومة. حالة مخطط الإنتاج الفعلية **غير معروفة من الكود** ويلزم التحقق منها read-only في staging/preflight.
2. **عدم تماثل tenant**: قيود اليومية وأسطرها نالت `tenant_id` عبر ALTER لاحقة، بينما **شجرة الحسابات لم تنله** ⇒ خلل اتساق متعدد المستأجرين يجب حسمه (Gate 1/2).
3. **سلامة المال**: كل المبالغ `REAL` (عائم) — غير مقبول محاسبياً.
4. **المحرك غير موصول**: لا يوجد `require('./accounting_posting')` في مسارات الإنتاج؛ التوصيل مؤجَّل حتى اكتمال جاهزية DDL/CoA (قرار المرحلة).

## مخاطر/متابعة مُسجَّلة (خارج نطاق هذه المرحلة)
- `REGISTER_GITMODULES_FOR_NAMAWEB_SUBMODULE` — لم يُلمس `.gitmodules`.
- `REVIEW_DF893AB_SECURITY_HARDENING_DELTA` — لم يُدمج شيء من `df893ab`.

## المخرجات اللاحقة
Gate 1 تحليل الفجوات · Gate 2 تصميم DDL مرشّح · Gate 3 CoA · Gate 4 الربط · Gate 5 بروفة · Gate 6 خطة إنتاج · Gate 7 سجل مخاطر · Gate 8 الإغلاق.
