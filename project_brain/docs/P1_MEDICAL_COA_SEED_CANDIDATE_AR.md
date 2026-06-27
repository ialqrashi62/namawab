# P1 — Gate 3: شجرة الحسابات المرشّحة (CoA Seed Candidate)

> readiness فقط — **seed مرشّح لم يُنفَّذ**. المنشأة: `large_hospital` (tenant_id=1, facility_id=1).
> الملف: [medical_coa_seed_candidate.sql](accounting_candidates/medical_coa_seed_candidate.sql)

## مبدأ التصميم
- الرموز العشرة التي يستخدمها المحرك موجودة كحسابات **ورقية قابلة للترحيل** (`is_postable=TRUE`).
- رؤوس التصنيف (1/2/3/4/5) **غير قابلة للترحيل** (`is_postable=FALSE`).
- `ON CONFLICT (tenant_id,account_code) DO NOTHING` ⇒ إعادة التشغيل آمنة (تعتمد UNIQUE من ملف up).

## شجرة الحسابات

| Account Code | Arabic Name | English Name | Type | Parent | Control/Postable | Used By (محرك) |
|---|---|---|---|---|---|---|
| 1 | الأصول | Assets | asset | — | رأس | — |
| 1000 | الصندوق | Cash | asset | 1 | postable | receipt, refund, payment_voucher |
| 1010 | البنك | Bank | asset | 1 | postable | receipt/refund/payment (toBank) |
| 1100 | ذمم المرضى | Patient AR | asset | 1 | postable | patient_cash_invoice, receipt, credit_note |
| 1110 | ذمم التأمين | Insurance AR | asset | 1 | postable | patient_insurance_invoice |
| 1200 | مخزون الصيدلية | Pharmacy Inventory | asset | 1 | postable | supplier_invoice, inventory_consumption |
| 1210 | مخزون المستلزمات | Medical Supplies Inv. | asset | 1 | postable | (مستقبلي) |
| 2 | الخصوم | Liabilities | liability | — | رأس | — |
| 2100 | ذمم الموردين | Accounts Payable | liability | 2 | postable | supplier_invoice, payment_voucher |
| 2200 | مصروفات مستحقة | Accrued Expenses | liability | 2 | postable | (مستقبلي) |
| 2250 | بضاعة لم تُفوتر | GRNI | liability | 2 | postable | grn_accrual (مستقبلي) |
| 2300 | ضريبة القيمة المضافة | VAT Payable | liability | 2 | postable | كل العمليات ذات الضريبة |
| 3 | حقوق الملكية | Equity | equity | — | رأس | — |
| 3000 | رأس المال/المحتجزة | Capital/Retained | equity | 3 | postable | (افتتاحي) |
| 4 | الإيرادات | Revenue | revenue | — | رأس | — |
| 4000 | إيراد خدمات طبية (عام) | Medical Services Rev. | revenue | 4 | postable | patient invoice (الحالي) |
| 4010 | عيادات خارجية | Outpatient | revenue | 4 | postable | (تفصيل مستقبلي) |
| 4020 | تنويم | Inpatient | revenue | 4 | postable | (تفصيل مستقبلي) |
| 4030 | مبيعات صيدلية | Pharmacy Sales | revenue | 4 | postable | pharmacy_dispensing (مستقبلي) |
| 4040 | مختبر | Lab | revenue | 4 | postable | (تفصيل مستقبلي) |
| 4050 | أشعة | Radiology | revenue | 4 | postable | (تفصيل مستقبلي) |
| 4060 | عمليات/غرف عمليات | Surgery/OR | revenue | 4 | postable | (تفصيل مستقبلي) |
| 4070 | تأمين | Insurance Revenue | revenue | 4 | postable | (تفصيل مستقبلي) |
| 4090 | مردودات وخصومات | Sales Returns/Disc. | revenue (contra, debit) | 4 | postable | refund, credit_note |
| 5 | المصروفات/التكلفة | Expenses/COGS | expense | — | رأس | — |
| 5000 | تكلفة مبيعات صيدلية (عام) | Pharmacy COGS/COGS | expense | 5 | postable | inventory_consumption, supplier_invoice(toCOGS) |
| 5010 | مستلزمات طبية | Medical Supplies Exp. | expense | 5 | postable | (مستقبلي) |
| 5020 | مستهلكات مختبر | Lab Consumables | expense | 5 | postable | (مستقبلي) |
| 5030 | مستهلكات أشعة | Radiology Consumables | expense | 5 | postable | (مستقبلي) |
| 5090 | مصروف تشغيلي عام | General Operating Exp. | expense | 5 | postable | (مستقبلي) |

## ملاحظات اتساق مع المحرك
- المحرك حالياً يرحّل كل الإيراد إلى **4000** والتكلفة إلى **5000** (مستوى مجمّع). حسابات التفصيل (4010–4070, 5010–5090) جاهزة للاستخدام عند توسعة بناة القيود لاحقاً.
- `4090` مردودات هو حساب مقابل (contra-revenue) بطبيعة مدينة (`normal_balance='debit'`).
- المحرك يستخدم `1200` لكل المخزون؛ `1210` للمستلزمات منفصل للاستخدام الصريح المستقبلي.

## تحقق ما بعد الـ seed (read-only)
`missing_engine_account_codes` في `validate.sql` يجب أن يُرجع **0** (الرموز العشرة كلها موجودة لـ tenant_id=1).

## المخرج التالي
Gate 4: خريطة الربط `account_mapping_seed_candidate.sql`.
