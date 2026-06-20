-- ============================================================
-- accounting_ddl_candidate_validate.sql
-- CANDIDATE / READ-ONLY PRE-FLIGHT — DO NOT MODIFY DATA.
-- شغّل هذا قبل accounting_ddl_candidate_up.sql للتأكد أن البيانات الحالية
-- لن تكسر قيود FK / CHECK / UNIQUE الجديدة. أي صف بنتيجة > 0 = مانع (blocker).
-- الهدف: قاعدة Postgres (staging أولاً). لا ينفّذ أي تعديل.
-- ============================================================

-- 1) أسطر قيود يتيمة بلا قيد أب (تكسر FK fk_jl_entry)
SELECT 'orphan_lines_no_entry' AS check_name, COUNT(*) AS bad_rows
FROM finance_journal_lines l
LEFT JOIN finance_journal_entries e ON l.entry_id = e.id
WHERE e.id IS NULL;

-- 2) أسطر تشير إلى حساب غير موجود (تكسر FK fk_jl_account)
SELECT 'lines_missing_account' AS check_name, COUNT(*) AS bad_rows
FROM finance_journal_lines l
LEFT JOIN finance_chart_of_accounts a ON l.account_id = a.id
WHERE a.id IS NULL;

-- 3) رموز حسابات مكرّرة لكل مستأجر (تكسر UNIQUE uq_coa_tenant_code)
SELECT 'dup_account_codes' AS check_name, COUNT(*) AS bad_rows
FROM (
  SELECT tenant_id, account_code
  FROM finance_chart_of_accounts
  GROUP BY tenant_id, account_code
  HAVING COUNT(*) > 1
) d;

-- 4) قيود مرحَّلة غير متوازنة (Σ مدين ≠ Σ دائن) — يجب أن تكون 0
SELECT 'unbalanced_posted_entries' AS check_name, COUNT(*) AS bad_rows
FROM (
  SELECT e.id
  FROM finance_journal_entries e
  JOIN finance_journal_lines l ON l.entry_id = e.id
  WHERE COALESCE(e.is_posted, 0) = 1
  GROUP BY e.id
  HAVING ROUND(SUM(l.debit)::numeric, 2) <> ROUND(SUM(l.credit)::numeric, 2)
) u;

-- 5) صفوف finance بلا tenant_id (يجب backfill قبل جعل العمود NOT NULL لاحقاً)
SELECT 'null_tenant_journal_entries' AS check_name, COUNT(*) AS bad_rows
FROM finance_journal_entries WHERE tenant_id IS NULL;
SELECT 'null_tenant_journal_lines' AS check_name, COUNT(*) AS bad_rows
FROM finance_journal_lines WHERE tenant_id IS NULL;
SELECT 'null_tenant_coa' AS check_name, COUNT(*) AS bad_rows
FROM finance_chart_of_accounts WHERE tenant_id IS NULL;

-- 6) أسطر مخالفة لقاعدة الجانب الواحد (مدين ودائن معاً > 0) — تكسر chk_jl_one_side
SELECT 'bad_line_both_sides' AS check_name, COUNT(*) AS bad_rows
FROM finance_journal_lines WHERE debit > 0 AND credit > 0;

-- 7) قيم سالبة (تكسر chk_jl_nonneg)
SELECT 'negative_amounts' AS check_name, COUNT(*) AS bad_rows
FROM finance_journal_lines WHERE debit < 0 OR credit < 0;

-- 8) (بعد الـ seed) تأكيد وجود رموز المحرك العشرة لمستأجر large_hospital (tenant_id = 1)
--    يجب أن تكون النتيجة 0 بعد تطبيق medical_coa_seed_candidate.sql
SELECT 'missing_engine_account_codes' AS check_name, COUNT(*) AS bad_rows
FROM (VALUES ('1000'),('1010'),('1100'),('1110'),('1200'),
             ('2100'),('2300'),('4000'),('4090'),('5000')) v(code)
LEFT JOIN finance_chart_of_accounts a
  ON a.account_code = v.code AND a.tenant_id = 1
WHERE a.id IS NULL;
