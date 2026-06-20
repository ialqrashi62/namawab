-- ============================================================
-- accounting_ddl_candidate_down.sql
-- CANDIDATE ROLLBACK — DO NOT EXECUTE IN THIS PHASE.
-- يتراجع عن accounting_ddl_candidate_up.sql.
-- ملاحظة: التحويل NUMERIC→REAL مفقود الدقة؛ يُنفَّذ فقط عند ضرورة الاسترجاع الكامل،
--         ويُفضَّل الاسترجاع من backup بدل خفض النوع. آمن: حذف القيود/الفهارس/الأعمدة المضافة.
-- ============================================================
BEGIN;

-- (اختياري) إسقاط مُحفِّز التوازن إن كان مفعّلاً
DROP TRIGGER IF EXISTS trg_entry_balanced ON finance_journal_entries;
DROP FUNCTION IF EXISTS fn_assert_entry_balanced();

-- (5) الفهارس
DROP INDEX IF EXISTS idx_jl_entry;
DROP INDEX IF EXISTS idx_jl_account;
DROP INDEX IF EXISTS idx_jl_tenant;
DROP INDEX IF EXISTS idx_journal_entry_date;
DROP INDEX IF EXISTS uq_journal_idempotency;
DROP INDEX IF EXISTS uq_coa_tenant_code;

-- (4) القيود
ALTER TABLE finance_journal_lines   DROP CONSTRAINT IF EXISTS chk_jl_nonneg;
ALTER TABLE finance_journal_lines   DROP CONSTRAINT IF EXISTS chk_jl_one_side;
ALTER TABLE finance_journal_lines   DROP CONSTRAINT IF EXISTS fk_jl_entry;
ALTER TABLE finance_journal_lines   DROP CONSTRAINT IF EXISTS fk_jl_account;
ALTER TABLE finance_journal_entries DROP CONSTRAINT IF EXISTS fk_je_reversed;

-- (3) أنواع المال — استرجاع REAL (مفقود الدقة؛ يُفضَّل backup restore بدلاً منه)
ALTER TABLE finance_journal_lines ALTER COLUMN debit  TYPE REAL USING debit::real;
ALTER TABLE finance_journal_lines ALTER COLUMN credit TYPE REAL USING credit::real;

-- (2) أعمدة قيود اليومية المضافة
ALTER TABLE finance_journal_entries DROP COLUMN IF EXISTS source_type;
ALTER TABLE finance_journal_entries DROP COLUMN IF EXISTS source_id;
ALTER TABLE finance_journal_entries DROP COLUMN IF EXISTS posting_reference;
ALTER TABLE finance_journal_entries DROP COLUMN IF EXISTS status;
ALTER TABLE finance_journal_entries DROP COLUMN IF EXISTS posted_at;
ALTER TABLE finance_journal_entries DROP COLUMN IF EXISTS posted_by;
ALTER TABLE finance_journal_entries DROP COLUMN IF EXISTS reversed_entry_id;
ALTER TABLE finance_journal_entries DROP COLUMN IF EXISTS is_reversed;

-- (1) أعمدة شجرة الحسابات المضافة
ALTER TABLE finance_chart_of_accounts DROP COLUMN IF EXISTS is_postable;
ALTER TABLE finance_chart_of_accounts DROP COLUMN IF EXISTS normal_balance;
-- ملاحظة: tenant_id/facility_id/branch_id على CoA تُترك إن كانت مستخدمة في مكان آخر؛
--         احذفها فقط إن كنت متأكداً أنها أُضيفت بهذه الترقية حصراً.
-- ALTER TABLE finance_chart_of_accounts DROP COLUMN IF EXISTS tenant_id;
-- ALTER TABLE finance_chart_of_accounts DROP COLUMN IF EXISTS facility_id;
-- ALTER TABLE finance_chart_of_accounts DROP COLUMN IF EXISTS branch_id;

COMMIT;
