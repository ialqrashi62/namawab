# P1 — مصالحة حالة المحاسبة المطبَّقة غير الموثّقة (Applied-Undocumented Reconciliation)

> المرحلة: `P1_ACCOUNTING_APPLIED_UNDOCUMENTED_RECONCILIATION` | التاريخ: 2026-06-21
> النطاق: **وثائق/ذاكرة فقط**. **لم يُنفَّذ:** DDL، Seed، تغيير بيانات، deploy، restart، تفعيل `ACCOUNTING_POSTING_ENABLED`، ربط المحرك، Stitch، RLS Wave، force push.

## 1. التصحيح الجوهري
```text
Accounting DDL/CoA/Mapping are already applied on the current single-box production
database, discovered read-only during Phase 127. They were not executed in the
readiness/rehearsal/preflight phases by this agent, but the current database state
is fully applied and matches candidates.
```

## 2. التمييز الواضح (Distinction)
```text
EXECUTED_BY_THIS_PHASE: NO
CURRENT_PRODUCTION_STATE: FULLY_APPLIED_UNDOCUMENTED
DO_NOT_RERUN: YES
```
- **EXECUTED_BY_THIS_PHASE: NO** — لم تنفّذ هذه الجلسة (ولا مراحل readiness/rehearsal/preflight) أي DDL أو Seed على الإنتاج. كل عملها كان تصميم/بروفة معزولة/قراءة فقط.
- **CURRENT_PRODUCTION_STATE: FULLY_APPLIED_UNDOCUMENTED** — قاعدة الإنتاج single-box (`nama_medical_web`) تحتوي الحالة النهائية للمرشّحات بالكامل، لكن التطبيق لم يُوثَّق في إغلاق READINESS (الذي قال `DDL_EXECUTED: NO`).
- **DO_NOT_RERUN: YES** — إعادة التنفيذ غير ضرورية (الحالة موجودة) وممنوعة بالسياسة. المرشّحات idempotent على أي حال (`ADD COLUMN IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS` / `ON CONFLICT DO NOTHING`).

## 3. الحالة الواقعية على الإنتاج (من فحص Phase 127 read-only)
| العنصر | القيمة |
| ------ | ------ |
| الطوبولوجيا | single-box (لا remote DB منفصل) — `nama_medical_web` @ ::1:5432، PG 16.14 |
| CoA | 30 حساباً (tenant_id=1)، الرموز العشرة للمحرك مزروعة postable |
| account mapping | 23 صفاً في `finance_posting_account_map` |
| نوع النقود | NUMERIC(18,2) لـ debit/credit |
| tenant_id | على CoA + entries + lines |
| idempotency | أعمدة source_type/source_id/posting_reference/status/reversed_entry_id/is_reversed + فهرس فريد `uq_journal_idempotency` |
| unique/FK/CHECK/indexes | uq_coa_tenant_code + 3 FK + 2 CHECK + 6 فهارس |
| journal_entries / lines / vouchers | 0 / 0 / 0 (لا قيود مرحَّلة) |
| `validate.sql` (read-only) | كل الفحوص العشرة = 0 |
| `ACCOUNTING_POSTING_ENABLED` | OFF (غائب من `.env` ⇒ افتراضي؛ الكود يتطلّب `=== 'true'`) |

## 4. التقارير المحدَّثة في هذه المصالحة (تصحيح ادعاءات «CoA فارغة/غير مطبّق»)
| التقرير | التصحيح |
| ------- | ------- |
| `RISKS_AND_GAPS_REGISTER_AR.md` (R4) | من «OFF + CoA فارغة / تفعيل محكوم» → «مطبَّق فعلاً (CoA=30/map=23/NUMERIC)؛ لا إعادة DDL/Seed؛ المتبقّي ربط المحرك» (خفض الخطورة P1→P2) |
| `DATABASE_SCHEMA_AUDIT_AR.md` | من «بلا tenant_id + CoA=0» → «يحوي tenant_id + مطبَّق (30/23/NUMERIC/قيود/فهارس)» |
| `DATA_FLOW_MAP_AR.md` (صف الترحيل) | من «OFF + CoA فارغة» → «OFF؛ CoA+mapping مطبَّقان (30/23)؛ journal=0» |
| `BUSINESS_LOGIC_AUDIT_AR.md` | من «OFF + CoA فارغة → لا ترحيل» → «OFF؛ CoA+mapping مطبَّقان؛ journal=0» |
| `MODULES_AND_FEATURES_INVENTORY_AR.md` | من «شجرة الحسابات فارغة (CoA=0)» → «مطبَّقتان (30/23)؛ لا إعادة DDL/Seed» |
| `FULL_SYSTEM_SCENARIOS_AR.md` | من «OFF + CoA فارغة → لا قيود» → «OFF؛ مطبَّقان (30/23)؛ journal=0» |
| `NEXT_PHASE_ROADMAP_AR.md` (المرحلة 2) | من «seed شجرة حسابات (خطة)» → «مطبَّقة فعلاً؛ المتبقّي خطة ربط المحرك» |
| `P1_ACCOUNTING_DDL_AND_COA_SEED_READINESS_FINAL_CLOSEOUT_AR.md` | أُضيف صندوق تصحيح أعلى التقرير يميّز EXECUTED_BY_THIS_PHASE:NO عن CURRENT_PRODUCTION_STATE:FULLY_APPLIED |

> التقارير التاريخية الأخرى (preflight/rehearsal) **تصف الحقيقة بالفعل** ولم تُعدَّل. حقول `DDL_EXECUTED: NO` في مراحل غير المحاسبة (facility/RLS/PM2/git) صحيحة لنطاقها ولم تُمسّ.

## 5. الذاكرة
- `.ai-brain/AI_PROJECT_MEMORY.md`: أُضيف Phase 128 (هذه المصالحة).
- ذاكرة الوكيل (memory ledger): حُدِّثت لتعكس أن الإنتاج FULLY_APPLIED وأن DO_NOT_RERUN.

## 6. الحقول
```text
FINAL_STATUS: DOCS_ONLY_RECONCILIATION_PASS
TOPOLOGY_CONFIRMED: SINGLE_BOX
CURRENT_DB_STATE: FULLY_APPLIED_UNDOCUMENTED
DDL_CURRENTLY_APPLIED: YES
COA_CURRENTLY_APPLIED: YES
MAPPING_CURRENTLY_APPLIED: YES
JOURNAL_COUNT: 0
POSTING_ENGINE_ENABLED: OFF
EXECUTED_BY_THIS_PHASE: NO
SHOULD_RERUN_DDL: NO
SHOULD_RERUN_SEED: NO
DOCS_UPDATED: YES (7 تقارير current-state + إضافة هذا التقرير)
MEMORY_UPDATED: YES (.ai-brain Phase 128 + agent memory ledger)
PRODUCTION_DEPLOYED: NO
DATA_CHANGED: NO
DDL_EXECUTED: NO
NEXT_REQUIRED_ACTION: P1_PATIENT_INVOICE_RECEIPT_POSTING_INTEGRATION_PLAN
```

`ACCOUNTING_APPLIED_UNDOCUMENTED_RECONCILIATION_COMPLETE`
