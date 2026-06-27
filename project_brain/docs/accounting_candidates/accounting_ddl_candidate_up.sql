-- ============================================================
-- accounting_ddl_candidate_up.sql
-- CANDIDATE ONLY — DO NOT EXECUTE IN THIS PHASE.
-- ترقية مخطط محرك الترحيل المحاسبي الطبي إلى جاهزية الإنتاج.
-- الهدف: PostgreSQL. additive + idempotent. شغّل validate أولاً، ثم staging.
-- تحذير أداء: ALTER COLUMN TYPE يعيد كتابة الجدول ويقفل القراءة/الكتابة —
--            يتطلب نافذة صيانة (انظر خطة التنفيذ Gate 6).
-- ============================================================
BEGIN;

-- ---------- (1) شجرة الحسابات: وعي بالمستأجر + سلامة + تصنيف ----------
ALTER TABLE finance_chart_of_accounts ADD COLUMN IF NOT EXISTS tenant_id      INTEGER;
ALTER TABLE finance_chart_of_accounts ADD COLUMN IF NOT EXISTS facility_id    INTEGER;
ALTER TABLE finance_chart_of_accounts ADD COLUMN IF NOT EXISTS branch_id      INTEGER;
ALTER TABLE finance_chart_of_accounts ADD COLUMN IF NOT EXISTS is_postable    BOOLEAN DEFAULT TRUE;   -- هل يقبل الترحيل المباشر (حساب ورقي)
ALTER TABLE finance_chart_of_accounts ADD COLUMN IF NOT EXISTS normal_balance TEXT;                   -- 'debit' | 'credit'

-- رمز حساب فريد لكل مستأجر (يدعم CoA متعدد المستأجرين)
CREATE UNIQUE INDEX IF NOT EXISTS uq_coa_tenant_code
  ON finance_chart_of_accounts (tenant_id, account_code);

-- ---------- (2) قيود اليومية: idempotency + حالة + بيانات الترحيل + قيد عكسي ----------
ALTER TABLE finance_journal_entries ADD COLUMN IF NOT EXISTS source_type       TEXT;     -- invoice | receipt | refund | credit_note | ...
ALTER TABLE finance_journal_entries ADD COLUMN IF NOT EXISTS source_id         INTEGER;  -- معرّف المستند المصدر
ALTER TABLE finance_journal_entries ADD COLUMN IF NOT EXISTS posting_reference TEXT;     -- POST:TYPE:ID (يطابق buildPostingReference)
ALTER TABLE finance_journal_entries ADD COLUMN IF NOT EXISTS status            TEXT DEFAULT 'draft';  -- draft | posted | reversed
ALTER TABLE finance_journal_entries ADD COLUMN IF NOT EXISTS posted_at         TIMESTAMP;
ALTER TABLE finance_journal_entries ADD COLUMN IF NOT EXISTS posted_by         TEXT;
ALTER TABLE finance_journal_entries ADD COLUMN IF NOT EXISTS reversed_entry_id INTEGER;  -- القيد الذي يعكسه هذا القيد
ALTER TABLE finance_journal_entries ADD COLUMN IF NOT EXISTS is_reversed       INTEGER DEFAULT 0;

-- منع الترحيل المزدوج: قيد واحد لكل (مستأجر، نوع مستند، معرّف مستند)
CREATE UNIQUE INDEX IF NOT EXISTS uq_journal_idempotency
  ON finance_journal_entries (tenant_id, source_type, source_id)
  WHERE source_type IS NOT NULL AND source_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_journal_entry_date ON finance_journal_entries (entry_date);

-- ---------- (3) سلامة المال: REAL → NUMERIC(18,2) ----------
ALTER TABLE finance_journal_lines ALTER COLUMN debit  TYPE NUMERIC(18,2) USING ROUND(debit::numeric, 2);
ALTER TABLE finance_journal_lines ALTER COLUMN credit TYPE NUMERIC(18,2) USING ROUND(credit::numeric, 2);
ALTER TABLE finance_journal_lines ALTER COLUMN debit  SET DEFAULT 0;
ALTER TABLE finance_journal_lines ALTER COLUMN credit SET DEFAULT 0;

-- ---------- (4) قيود السلامة (CHECK) + المفاتيح الأجنبية (FK) — idempotent عبر DO ----------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='chk_jl_nonneg') THEN
    ALTER TABLE finance_journal_lines ADD CONSTRAINT chk_jl_nonneg CHECK (debit >= 0 AND credit >= 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='chk_jl_one_side') THEN
    ALTER TABLE finance_journal_lines ADD CONSTRAINT chk_jl_one_side CHECK (NOT (debit > 0 AND credit > 0));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_jl_entry') THEN
    ALTER TABLE finance_journal_lines ADD CONSTRAINT fk_jl_entry
      FOREIGN KEY (entry_id) REFERENCES finance_journal_entries(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_jl_account') THEN
    ALTER TABLE finance_journal_lines ADD CONSTRAINT fk_jl_account
      FOREIGN KEY (account_id) REFERENCES finance_chart_of_accounts(id) ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='fk_je_reversed') THEN
    ALTER TABLE finance_journal_entries ADD CONSTRAINT fk_je_reversed
      FOREIGN KEY (reversed_entry_id) REFERENCES finance_journal_entries(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ---------- (5) فهارس البحث/الترحيل ----------
CREATE INDEX IF NOT EXISTS idx_jl_entry   ON finance_journal_lines (entry_id);
CREATE INDEX IF NOT EXISTS idx_jl_account ON finance_journal_lines (account_id);
CREATE INDEX IF NOT EXISTS idx_jl_tenant  ON finance_journal_lines (tenant_id, facility_id, branch_id);

COMMIT;

-- ============================================================
-- (6) اختياري — فرض التوازن على مستوى قاعدة البيانات (CHOICE B، دفاع في العمق).
--     الخيار الأساسي المعتمد = تحقق التطبيق (المحرك validateBalanced) — CHOICE A.
--     فعّل هذا القسم فقط بقرار صريح (انظر تقرير تصميم DDL).
-- ============================================================
-- BEGIN;
-- CREATE OR REPLACE FUNCTION fn_assert_entry_balanced() RETURNS trigger AS $f$
-- DECLARE d NUMERIC(18,2); c NUMERIC(18,2);
-- BEGIN
--   IF NEW.status = 'posted' THEN
--     SELECT COALESCE(SUM(debit),0), COALESCE(SUM(credit),0)
--       INTO d, c FROM finance_journal_lines WHERE entry_id = NEW.id;
--     IF d <> c THEN RAISE EXCEPTION 'Unbalanced entry % (debit=% credit=%)', NEW.id, d, c; END IF;
--     IF d = 0 THEN RAISE EXCEPTION 'Zero-value posted entry %', NEW.id; END IF;
--   END IF;
--   RETURN NEW;
-- END; $f$ LANGUAGE plpgsql;
-- CREATE CONSTRAINT TRIGGER trg_entry_balanced
--   AFTER INSERT OR UPDATE ON finance_journal_entries
--   DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION fn_assert_entry_balanced();
-- COMMIT;
