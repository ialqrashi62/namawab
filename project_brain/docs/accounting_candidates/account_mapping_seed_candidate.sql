-- ============================================================
-- account_mapping_seed_candidate.sql
-- CANDIDATE ONLY — DO NOT EXECUTE IN THIS PHASE.
-- خريطة الحسابات لكل عملية يرحّلها محرك accounting_posting.js.
-- الوضع الحالي: المحرك يثبّت الرموز في ACCOUNT_CODES (in-code). هذا الملف يقترح
-- جدول خريطة DB-driven (finance_posting_account_map) للسماح بضبط الربط لكل مستأجر
-- مستقبلاً دون تعديل الكود. مرشّح فقط — لا ينفّذ الآن.
-- ============================================================
BEGIN;

CREATE TABLE IF NOT EXISTS finance_posting_account_map (
    id SERIAL PRIMARY KEY,
    tenant_id     INTEGER NOT NULL,
    facility_id   INTEGER DEFAULT 0,
    process_key   TEXT NOT NULL,   -- patient_cash_invoice | patient_insurance_invoice | receipt | refund | credit_note | ...
    role          TEXT NOT NULL,   -- debit | credit | vat | inventory | cogs | ar | ap | revenue
    account_code  TEXT NOT NULL,   -- يطابق finance_chart_of_accounts.account_code
    notes         TEXT DEFAULT '',
    is_active     INTEGER DEFAULT 1
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_posting_map
  ON finance_posting_account_map (tenant_id, process_key, role);

-- العمليات المغطّاة بالمحرك حالياً (تطابق دوال build*Posting):
INSERT INTO finance_posting_account_map (tenant_id, process_key, role, account_code, notes) VALUES
 (1,'patient_cash_invoice','debit','1100','Dr ذمم مريض (إجمالي شامل الضريبة)'),
 (1,'patient_cash_invoice','revenue','4000','Cr إيراد (صافٍ)'),
 (1,'patient_cash_invoice','vat','2300','Cr ضريبة'),
 (1,'patient_insurance_invoice','debit','1110','Dr ذمم تأمين'),
 (1,'patient_insurance_invoice','revenue','4000','Cr إيراد'),
 (1,'patient_insurance_invoice','vat','2300','Cr ضريبة'),
 (1,'receipt','debit','1000','Dr نقد (أو 1010 بنك)'),
 (1,'receipt','credit','1100','Cr ذمم مريض'),
 (1,'refund','debit','4090','Dr مردودات/خصومات'),
 (1,'refund','credit','1000','Cr نقد (أو 1010 بنك)'),
 (1,'credit_note','debit','4090','Dr مردودات (صافٍ)'),
 (1,'credit_note','vat','2300','Dr ضريبة (عكس)'),
 (1,'credit_note','credit','1100','Cr ذمم مريض (إجمالي)'),
 (1,'supplier_invoice','inventory','1200','Dr مخزون (أو 5000 تكلفة)'),
 (1,'supplier_invoice','vat','2300','Dr ضريبة'),
 (1,'supplier_invoice','credit','2100','Cr ذمم موردين'),
 (1,'payment_voucher','debit','2100','Dr ذمم موردين'),
 (1,'payment_voucher','credit','1000','Cr نقد (أو 1010 بنك)'),
 (1,'inventory_consumption','cogs','5000','Dr تكلفة'),
 (1,'inventory_consumption','inventory','1200','Cr مخزون'),
 -- بدائل البنك (toBank=true في المحرك): تجعل رمز 1010 صريحاً بدل ملاحظة نصية فقط
 (1,'receipt','debit_bank','1010','Dr بنك (بديل النقد عند toBank)'),
 (1,'refund','credit_bank','1010','Cr بنك (بديل النقد عند fromBank)'),
 (1,'payment_voucher','credit_bank','1010','Cr بنك (بديل النقد عند fromBank)')
ON CONFLICT (tenant_id, process_key, role) DO NOTHING;

-- عمليات مطلوبة مستقبلاً لكنها غير مغطّاة ببناة المحرك بعد (فجوة محرك — انظر تقرير الربط):
--   insurance_claim_approval, insurance_claim_rejection, pharmacy_dispensing,
--   grn_accrual, purchase_return, stock_adjustment
-- تُضاف خرائطها هنا عند إضافة الدوال المقابلة في accounting_posting.js.

COMMIT;
