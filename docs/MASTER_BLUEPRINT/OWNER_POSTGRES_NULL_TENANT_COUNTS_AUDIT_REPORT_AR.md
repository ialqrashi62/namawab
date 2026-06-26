# تدقيق counts صفوف tenant_id IS NULL بدور postgres — حزمة المالك (read-only)

> counts فقط، بدور postgres/migration (BYPASSRLS). لا DDL، لا writes، لا DEPLOY_RUN، لا deploy/restart، لا PHI، لا أسرار.
> التاريخ: 2026-06-26. المهارات: NM_GLOBAL_GATES + NM_GOVERNANCE_CLOSEOUT + NM_FINANCE_ACCOUNTING_GUARD + NM_SECURITY_DR_KEY_MANAGEMENT + NM_OBSERVABILITY_OPS.

## الحالة النهائية
**FINAL_STATUS: NULL_TENANT_COUNTS_WAITING_OWNER_QUERY** — الاستعلام جاهز؛ بانتظار تشغيل المالك بدور postgres وإرسال جدول counts المعقّم.

## تصحيح تعداد
الجداول المستهدفة للـbackfill = **30** (التقرير السابق ذكر 31 — كان زائداً بواحد بسبب احتساب سطر تعليق). القائمة الدقيقة أدناه.

## استعلام المالك (counts فقط، transaction للقراءة فقط)
شغّله بدور `postgres` (أو دور migration). يطبع 3 أعمدة فقط: `table_name, total_rows, null_tenant_rows`. لا PHI، لا SELECT *، لا writes (محاط بـ`BEGIN READ ONLY ... ROLLBACK`).

```bash
export PATH="/c/Program Files/PostgreSQL/16/bin:$PATH"
# المصادقة عبر ~/.pgpass (chmod 600) أو -W تفاعلياً. لا PGPASSWORD.
psql -U postgres -d nama_medical_web -v ON_ERROR_STOP=1 -P pager=off <<'SQL'
BEGIN READ ONLY;
WITH x(t) AS (VALUES
 ('admission_daily_rounds'),('admissions'),('bed_transfers'),('beds'),
 ('blood_bank_crossmatch'),('blood_bank_donors'),('blood_bank_transfusions'),('blood_bank_units'),
 ('cssd_instrument_sets'),('cssd_load_items'),('cssd_sterilization_cycles'),('daily_close'),
 ('emergency_beds'),('emergency_trauma_assessments'),('emergency_visits'),('finance_chart_of_accounts'),
 ('finance_cost_centers'),('finance_journal_entries'),('finance_journal_lines'),('icu_fluid_balance'),
 ('icu_monitoring'),('icu_scores'),('icu_ventilator'),('insurance_claims'),
 ('insurance_companies'),('insurance_contracts'),('insurance_policies'),('inventory_items'),
 ('wards'),('zatca_invoices'))
SELECT x.t AS table_name,
       (xpath('/row/c/text()', query_to_xml(format('SELECT count(*) c FROM %I', x.t), false, true, '')))[1]::text::bigint AS total_rows,
       (xpath('/row/c/text()', query_to_xml(format('SELECT count(*) c FROM %I WHERE tenant_id IS NULL', x.t), false, true, '')))[1]::text::bigint AS null_tenant_rows
FROM x ORDER BY null_tenant_rows DESC, x.t;
ROLLBACK;
SQL
```
> ملاحظة: إن لم تكن صيغة `query_to_xml` مريحة، البديل الأبسط (DO-block) موجود في `NULL_TENANT_READONLY_AUDIT_REPORT_AR.md` ويطبع نفس الـcounts عبر RAISE NOTICE. كلاهما read-only ولا يكتب شيئاً.

### بديل DO-block (إن فضّلته — نفس النتيجة، counts فقط)
```sql
DO $$
DECLARE t text; n bigint; nl bigint;
 tabs text[] := ARRAY['admission_daily_rounds','admissions','bed_transfers','beds','blood_bank_crossmatch','blood_bank_donors','blood_bank_transfusions','blood_bank_units','cssd_instrument_sets','cssd_load_items','cssd_sterilization_cycles','daily_close','emergency_beds','emergency_trauma_assessments','emergency_visits','finance_chart_of_accounts','finance_cost_centers','finance_journal_entries','finance_journal_lines','icu_fluid_balance','icu_monitoring','icu_scores','icu_ventilator','insurance_claims','insurance_companies','insurance_contracts','insurance_policies','inventory_items','wards','zatca_invoices'];
BEGIN
 FOREACH t IN ARRAY tabs LOOP
  EXECUTE format('SELECT count(*), count(*) FILTER (WHERE tenant_id IS NULL) FROM %I', t) INTO n, nl;
  RAISE NOTICE '% total=% nulls=%', rpad(t,32), n, nl;
 END LOOP;
END $$;
```

## ماذا أرسل لي (معقّم فقط)
جدول counts: `table_name | total_rows | null_tenant_rows` — لا شيء غيره (لا صفوف بيانات، لا PHI، لا أسرار).

## كيف أقرّر عند وصول النتائج
- **كل `null_tenant_rows = 0`** → `NULL_TENANT_COUNTS_ALL_ZERO_SAFE_BACKFILL_NOOP` (الـbackfill لا-أثر). **ثم لا DDL مباشرة** — أعرض خيارَي معالجة الحارس (المفضّل: تحسين الحارس ليسمح فقط عند كل nulls=0، بدل bypass) وأطلب موافقتك المنفصلة.
- **أيّ `null_tenant_rows > 0`** → `NULL_TENANT_COUNTS_BLOCKED_MANUAL_MAPPING_REQUIRED` — أُدرج الجداول وأعدادها فقط، ونحدّد التعيين الصحيح للمستأجر يدوياً قبل أيّ backfill.
- **فشل المصادقة/الدور** → `NULL_TENANT_COUNTS_BLOCKED_AUTH_OR_ROLE`.

## توصية الحارس (مسبقاً)
لا أوصي بـ`CONFIRM_MULTITENANT=1` المباشر. إن ثبت أن كل counts صفر، **المفضّل تحسين DEPLOY_RUN.sh** ليجعل الحارس يسمح تلقائياً فقط حين تكون كل صفوف tenant NULL = 0 في الجداول الـ30 (إثبات برمجي بدل تجاوز يدوي).

## ما لم يُنفَّذ (إثبات)
DDL: NO · DEPLOY_RUN: NO · DB writes: NO · deploy: NO · pm2 restart: NO · Docker/Vault/keys: NO · ZATCA/NPHIES: NO · PHI: NO · secrets: NO · CONFIRM_MULTITENANT: NO · force push: NO.

## الثوابت (read-only، سابقاً)
tenants=2 · FORCE_RLS=150 · accounting OFF · journal=0 · live webroot=171b7c2 (لم يُبدَّل) · target=64ac581.
