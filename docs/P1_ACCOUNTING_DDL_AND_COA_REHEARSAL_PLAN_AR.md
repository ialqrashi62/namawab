# P1 — Gate 5: خطة البروفة (Rehearsal Plan)

> readiness فقط — خطة لبيئة staging/test معزولة. **لا تُنفَّذ على الإنتاج إطلاقاً.**

## الهدف
إثبات أن DDL + CoA + الربط تعمل، والقيود متوازنة، ولا ترحيل مزدوج، وعزل المستأجر سليم، **قبل** أي اقتراب من الإنتاج.

## المتطلبات المسبقة
- بيئة staging/test بقاعدة Postgres منفصلة تماماً عن الإنتاج (لا بيانات مرضى حقيقية — بيانات وهمية 100%).
- نسخة من مخطط الإنتاج (schema-only) أو schema مماثل لإعادة إنتاج الحالة بدقة.

## الخطوات
1. **لقطة/نسخة**: استرجاع schema الإنتاج (بدون بيانات حقيقية) في staging، وأخذ backup لـ staging قبل البدء.
2. **preflight**: تشغيل [accounting_ddl_candidate_validate.sql](accounting_candidates/accounting_ddl_candidate_validate.sql) — كل الفحوص يجب أن تكون 0 (عدا فحص رموز المحرك الذي يُتوقَّع > 0 قبل الـ seed).
3. **DDL**: تطبيق [accounting_ddl_candidate_up.sql](accounting_candidates/accounting_ddl_candidate_up.sql).
4. **CoA seed**: تطبيق [medical_coa_seed_candidate.sql](accounting_candidates/medical_coa_seed_candidate.sql) (tenant_id=1).
5. **mapping seed**: تطبيق [account_mapping_seed_candidate.sql](accounting_candidates/account_mapping_seed_candidate.sql).
6. **اختبارات المحرك**: `node accounting_posting_test.js` داخل namaweb ⇒ يجب 28/28.
7. **حالات ترحيل وهمية** (بيانات اصطناعية، tenant_id=1):
   - فاتورة نقدية 115 ⇒ Dr 1100=115 / Cr 4000=100 / Cr 2300=15.
   - فاتورة تأمين 115 ⇒ Dr 1110=115 / Cr 4000=100 / Cr 2300=15.
   - سند قبض 50 ⇒ Dr 1000=50 / Cr 1100=50.
   - استرداد 30 ⇒ Dr 4090=30 / Cr 1000=30.
   - فاتورة مورّد 115 ⇒ Dr 1200=100 / Dr 2300=15 / Cr 2100=115.
   - استهلاك مخزون 40 ⇒ Dr 5000=40 / Cr 1200=40.
8. **التحقق بعد الترحيل (read-only)**:
   - كل قيد متوازن: `Σdebit=Σcredit` لكل entry_id.
   - **لا ترحيل مزدوج**: إعادة ترحيل نفس المستند تُرفَض بـ `uq_journal_idempotency`.
   - **عزل المستأجر**: استعلام بمستأجر آخر لا يرى قيود tenant_id=1.
   - **عدم تراجع P0/الاستحقاقات**: تأكيد أن RLS P0 وfacility entitlement لم يتأثرا (لا تغييرات عليهما في DDL هذه).
   - FK/CHECK تعمل: محاولة إدراج سطر بحساب غير موجود/مزدوج الجانب تُرفَض.
9. **بروفة الاسترجاع**: تطبيق [accounting_ddl_candidate_down.sql](accounting_candidates/accounting_ddl_candidate_down.sql) ثم التأكد من عودة المخطط، ثم backup restore كاملة كخطة بديلة.

## معايير نجاح البروفة
- 28/28 اختبارات المحرك.
- الحالات الست متوازنة وصحيحة الحسابات.
- الترحيل المزدوج مرفوض.
- عزل المستأجر مثبت.
- down + restore يعملان.
- لا أي تأثير على RLS/entitlement.

## المخرج التالي
Gate 6: خطة تنفيذ الإنتاج (تصميم فقط).
