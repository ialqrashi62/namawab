# P1 — مقارنة الإنتاج مع المرشّحات (Production vs Candidates)

> المرحلة: `P1_ACCOUNTING_PRODUCTION_PREFLIGHT_AND_APPROVAL_GATE` — البوابة 2
> التاريخ: 2026-06-21 | read-only | الهدف: تصنيف حالة الإنتاج مقابل المرشّحات المعتمدة.

## 1. المقارنة عنصراً بعنصر
الإنتاج = `nama_medical_web` (single-box). المقارنة مع `docs/accounting_candidates/`.

### أ) `accounting_ddl_candidate_up.sql`
| عنصر المرشّح | في الإنتاج | مطابق؟ |
| ----------- | --------- | ------ |
| CoA: `tenant_id/facility_id/branch_id/is_postable/normal_balance` | موجودة | ✅ |
| `uq_coa_tenant_code (tenant_id, account_code)` | موجود | ✅ |
| entries: `source_type/source_id/posting_reference/status/posted_at/posted_by/reversed_entry_id/is_reversed` | موجودة | ✅ |
| `uq_journal_idempotency (tenant_id, source_type, source_id)` | موجود | ✅ |
| `idx_journal_entry_date` | موجود | ✅ |
| lines: `debit/credit → NUMERIC(18,2)` | NUMERIC | ✅ |
| CHECK: `chk_jl_nonneg`, `chk_jl_one_side` | موجودان | ✅ |
| FK: `fk_jl_entry`, `fk_jl_account`, `fk_je_reversed` | موجودة | ✅ |
| `idx_jl_entry/account/tenant` | موجودة | ✅ |

### ب) `accounting_ddl_candidate_validate.sql`
- يعمل read-only على الإنتاج، كل الفحوص العشرة = 0 (بما فيها `missing_engine_account_codes=0`). ✅ (يؤكّد أن الرموز العشرة مزروعة وأن البيانات سليمة.)

### ج) `medical_coa_seed_candidate.sql`
| | المرشّح | الإنتاج | مطابق؟ |
| - | ------ | ------- | ------ |
| عدد حسابات CoA | 30 | 30 | ✅ |
| رموز المحرك العشرة (1000…5000) | موجودة postable | موجودة (validate=0) | ✅ |
| tenant_id للـ seed | 1 | tenants={1} | ✅ |

### د) `account_mapping_seed_candidate.sql`
| | المرشّح | الإنتاج | مطابق؟ |
| - | ------ | ------- | ------ |
| `finance_posting_account_map` | يُنشأ | موجود | ✅ |
| عدد الصفوف | 23 | 23 | ✅ |
| `uq_posting_map (tenant_id, process_key, role)` | يُنشأ | (مفترض موجود مع الجدول) | ✅ |

## 2. التصنيف
كل عناصر المرشّحات الأربعة (DDL + CoA seed + mapping seed) **مطبَّقة بالكامل** على قاعدة الإنتاج، **مطابِقة** للحالة النهائية المتوقّعة، والبيانات نظيفة (validate كله صفر، لا قيود مرحَّلة بعد). لكن هذا التطبيق **غير موثّق** في إغلاق `READINESS` (الذي سجّل `DDL_EXECUTED: NO` و`SEED_EXECUTED: NO`)، والأرجح أنه تمّ عبر الجلسة الموازية (R17).

```text
PRODUCTION_ACCOUNTING_SCHEMA_STATUS: FULLY_APPLIED_UNDOCUMENTED
```

> ملاحظة طوبولوجيا: هذا التصنيف يخصّ قاعدة الإنتاج الوحيدة القابلة للوصول (single-box). إن وُجد إنتاج بعيد منفصل خارج هذا الصندوق فحالته `UNVERIFIED_FROM_THIS_ENVIRONMENT`.

## 3. النتيجة
```text
GATE2_STATUS: COMPARISON_COMPLETE
PRODUCTION_ACCOUNTING_SCHEMA_STATUS: FULLY_APPLIED_UNDOCUMENTED
DATA_RISK: LOW (journal=0/lines=0/vouchers=0 → لا خطر ترحيل مزدوج على بيانات قائمة)
NEXT: GATE3_DECISION
```

`ACCOUNTING_PRODUCTION_CANDIDATE_COMPARISON_COMPLETE`
