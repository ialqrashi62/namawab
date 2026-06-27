# P1 — Gate 6: خطة تنفيذ الإنتاج (Production Execution Plan)

> **تصميم فقط — لا تنفيذ.** يتطلب موافقة صريحة منفصلة (`DDL_AND_COA_SEED_APPROVAL`) قبل أي تطبيق.

## 0) Preflight
- تأكيد نجاح البروفة (Gate 5) بالكامل على staging.
- تأكيد أن مخطط الإنتاج فيه جداول finance فعلاً (تذكير: `NODE_ENV=production` يتخطّى الإنشاء التلقائي — قد تحتاج إنشاء الجداول صراحةً أولاً).
- تشغيل [validate.sql](accounting_candidates/accounting_ddl_candidate_validate.sql) على الإنتاج (read-only) — كل الفحوص 0 (عدا رموز المحرك قبل الـ seed).
- نافذة صيانة مُعلَنة (بسبب `ALTER COLUMN TYPE` المُقفِل).

## 1) Backup (إلزامي قبل أي DDL)
- نسخة كاملة من قاعدة الإنتاج (pg_dump) + التحقق من سلامتها + تخزين آمن.
- تسجيل نقطة استرجاع (restore point) وزمنها.

## 2) تقييم القفل/الصيانة
- `ALTER COLUMN TYPE NUMERIC` على `finance_journal_lines` يأخذ `ACCESS EXCLUSIVE` ⇒ يقفل الجدول طوال إعادة الكتابة. قدّر الحجم والمدة على staging أولاً.
- جدولة في أقل وقت حِملاً؛ إيقاف أي كتابة مالية أثناء النافذة.

## 3) ترتيب DDL
1. `validate.sql` (read-only) — بوابة: أي نتيجة > 0 (عدا رموز المحرك) ⇒ توقف.
2. `accounting_ddl_candidate_up.sql` (داخل معاملة).
3. (اختياري بقرار) قسم trigger التوازن.

## 4) ترتيب Seed
1. `medical_coa_seed_candidate.sql` (tenant_id=1).
2. `account_mapping_seed_candidate.sql`.
3. (لكل مستأجر إضافي) نسخة seed بمعرّفه.

## 5) استعلامات التحقق (بعد التطبيق، read-only)
- رموز المحرك العشرة موجودة (`missing_engine_account_codes = 0`).
- لا قيود غير متوازنة، لا أسطر يتيمة، الفهارس/القيود موجودة (`pg_constraint`, `pg_indexes`).
- عزل المستأجر سليم.

## 6) Rollback
- `accounting_ddl_candidate_down.sql` للتراجع الهيكلي.
- عند أي شك في البيانات: **backup restore** هو المسار المعتمد (أأمن من خفض النوع).

## 7) تسلسل نشر التطبيق (لاحقاً — ليس الآن)
- توصيل `accounting_posting.js` بمسارات الفواتير/السندات **يأتي بعد** نجاح DDL/CoA في الإنتاج، كمرحلة مستقلة بموافقة منفصلة. حتى ذلك الحين المحرك يبقى غير موصول.

## 8) Smoke checks (بعد التوصيل المستقبلي فقط)
- إنشاء فاتورة وهمية ⇒ قيد متوازن واحد، بلا تكرار، بعزل صحيح.

## 9) تحقق محاسبي
- ميزان مراجعة تجريبي = 0 (Σمدين=Σدائن إجمالاً).
- لا ترحيل مزدوج عبر `uq_journal_idempotency`.

## 10) قواعد صارمة
- **لا force push.** نشر code-only منفصل عن DDL. لا بيانات مرضى حقيقية. لا لمس RLS/entitlement/`.gitmodules`/`df893ab` في هذه المرحلة.

## الحالة النهائية المتوقعة لهذه المرحلة (readiness)
```text
DDL_EXECUTED: NO
DATA_CHANGED: NO
PRODUCTION_DEPLOYED: NO
DEPLOYMENT_APPROVAL_REQUIRED: YES
```

## المخرج التالي
Gate 7: سجل المخاطر.
