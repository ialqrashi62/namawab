-- ============================================================
-- medical_coa_seed_candidate.sql
-- CANDIDATE ONLY — DO NOT EXECUTE IN THIS PHASE.
-- شجرة حسابات أولية لمنشأة: large_hospital (tenant_id = 1, facility_id = 1).
-- يعتمد على uq_coa_tenant_code من accounting_ddl_candidate_up.sql (ON CONFLICT).
-- الرموز العشرة التي يستخدمها المحرك (1000/1010/1100/1110/1200/2100/2300/4000/4090/5000)
-- موجودة كحسابات ورقية قابلة للترحيل (is_postable = TRUE).
-- ============================================================
BEGIN;

-- إعداد قيم المستأجر/المنشأة كمتغيرات منطقية (مضمّنة كقيم ثابتة هنا = 1).

-- ---------- رؤوس التصنيف (غير قابلة للترحيل) ----------
INSERT INTO finance_chart_of_accounts (tenant_id, facility_id, account_code, account_name_ar, account_name_en, parent_id, account_level, account_type, normal_balance, is_postable, is_active) VALUES
 (1,1,'1','الأصول','Assets',0,1,'asset','debit',FALSE,1),
 (1,1,'2','الخصوم','Liabilities',0,1,'liability','credit',FALSE,1),
 (1,1,'3','حقوق الملكية','Equity',0,1,'equity','credit',FALSE,1),
 (1,1,'4','الإيرادات','Revenue',0,1,'revenue','credit',FALSE,1),
 (1,1,'5','المصروفات وتكلفة الإيراد','Expenses / COGS',0,1,'expense','debit',FALSE,1)
ON CONFLICT (tenant_id, account_code) DO NOTHING;

-- ---------- الأصول (Assets) ----------
INSERT INTO finance_chart_of_accounts (tenant_id, facility_id, account_code, account_name_ar, account_name_en, parent_id, account_level, account_type, normal_balance, is_postable, is_active) VALUES
 (1,1,'1000','الصندوق (النقدية)','Cash',                 (SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='1'),2,'asset','debit',TRUE,1),
 (1,1,'1010','البنك','Bank',                              (SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='1'),2,'asset','debit',TRUE,1),
 (1,1,'1100','ذمم المرضى المدينة','Patient Accounts Receivable',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='1'),2,'asset','debit',TRUE,1),
 (1,1,'1110','ذمم شركات التأمين المدينة','Insurance Accounts Receivable',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='1'),2,'asset','debit',TRUE,1),
 (1,1,'1200','مخزون الصيدلية','Pharmacy Inventory',       (SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='1'),2,'asset','debit',TRUE,1),
 (1,1,'1210','مخزون المستلزمات الطبية','Medical Supplies Inventory',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='1'),2,'asset','debit',TRUE,1)
ON CONFLICT (tenant_id, account_code) DO NOTHING;

-- ---------- الخصوم (Liabilities) ----------
INSERT INTO finance_chart_of_accounts (tenant_id, facility_id, account_code, account_name_ar, account_name_en, parent_id, account_level, account_type, normal_balance, is_postable, is_active) VALUES
 (1,1,'2100','ذمم الموردين الدائنة','Accounts Payable',   (SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='2'),2,'liability','credit',TRUE,1),
 (1,1,'2200','مصروفات مستحقة','Accrued Expenses',         (SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='2'),2,'liability','credit',TRUE,1),
 (1,1,'2250','بضاعة مستلمة لم تُفوتر (GRNI)','Goods Received Not Invoiced',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='2'),2,'liability','credit',TRUE,1),
 (1,1,'2300','ضريبة القيمة المضافة المستحقة','VAT Payable',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='2'),2,'liability','credit',TRUE,1)
ON CONFLICT (tenant_id, account_code) DO NOTHING;

-- ---------- حقوق الملكية (Equity) ----------
INSERT INTO finance_chart_of_accounts (tenant_id, facility_id, account_code, account_name_ar, account_name_en, parent_id, account_level, account_type, normal_balance, is_postable, is_active) VALUES
 (1,1,'3000','رأس المال / الأرباح المحتجزة','Capital / Retained Earnings',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='3'),2,'equity','credit',TRUE,1)
ON CONFLICT (tenant_id, account_code) DO NOTHING;

-- ---------- الإيرادات (Revenue) ----------
INSERT INTO finance_chart_of_accounts (tenant_id, facility_id, account_code, account_name_ar, account_name_en, parent_id, account_level, account_type, normal_balance, is_postable, is_active) VALUES
 (1,1,'4000','إيرادات الخدمات الطبية (عام)','Medical Services Revenue',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='4'),2,'revenue','credit',TRUE,1),
 (1,1,'4010','إيراد العيادات الخارجية','Outpatient Revenue',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='4'),2,'revenue','credit',TRUE,1),
 (1,1,'4020','إيراد التنويم','Inpatient Revenue',         (SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='4'),2,'revenue','credit',TRUE,1),
 (1,1,'4030','إيراد مبيعات الصيدلية','Pharmacy Sales Revenue',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='4'),2,'revenue','credit',TRUE,1),
 (1,1,'4040','إيراد المختبر','Lab Revenue',               (SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='4'),2,'revenue','credit',TRUE,1),
 (1,1,'4050','إيراد الأشعة','Radiology Revenue',          (SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='4'),2,'revenue','credit',TRUE,1),
 (1,1,'4060','إيراد العمليات وغرف العمليات','Surgery/OR Revenue',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='4'),2,'revenue','credit',TRUE,1),
 (1,1,'4070','إيراد التأمين','Insurance Revenue',         (SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='4'),2,'revenue','credit',TRUE,1),
 (1,1,'4090','مردودات وخصومات الإيراد','Sales Returns & Discounts',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='4'),2,'revenue','debit',TRUE,1)
ON CONFLICT (tenant_id, account_code) DO NOTHING;

-- ---------- المصروفات / تكلفة الإيراد (Expenses / COGS) ----------
INSERT INTO finance_chart_of_accounts (tenant_id, facility_id, account_code, account_name_ar, account_name_en, parent_id, account_level, account_type, normal_balance, is_postable, is_active) VALUES
 (1,1,'5000','تكلفة مبيعات الصيدلية (عام)','Pharmacy COGS / COGS',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='5'),2,'expense','debit',TRUE,1),
 (1,1,'5010','مصروف المستلزمات الطبية','Medical Supplies Expense',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='5'),2,'expense','debit',TRUE,1),
 (1,1,'5020','مصروف مستهلكات المختبر','Lab Consumables Expense',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='5'),2,'expense','debit',TRUE,1),
 (1,1,'5030','مصروف مستهلكات الأشعة','Radiology Consumables Expense',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='5'),2,'expense','debit',TRUE,1),
 (1,1,'5090','مصروف تشغيلي عام','General Operating Expense',(SELECT id FROM finance_chart_of_accounts WHERE tenant_id=1 AND account_code='5'),2,'expense','debit',TRUE,1)
ON CONFLICT (tenant_id, account_code) DO NOTHING;

COMMIT;

-- تحقق سريع (read-only) بعد التطبيق: يجب أن تكون 0
-- SELECT COUNT(*) FROM (VALUES ('1000'),('1010'),('1100'),('1110'),('1200'),('2100'),('2300'),('4000'),('4090'),('5000')) v(code)
--   LEFT JOIN finance_chart_of_accounts a ON a.account_code=v.code AND a.tenant_id=1 WHERE a.id IS NULL;
