# تدقيق صفوف tenant_id IS NULL — read-only (integration/all-epics)

> فحص read-only فقط: SELECT + catalog/information_schema. لا DDL، لا writes، لا set_config، لا DEPLOY_RUN، لا deploy/restart، لا PHI (counts فقط)، لا أسرار.
> التاريخ: 2026-06-26. المهارات: NM_GLOBAL_GATES + NM_GOVERNANCE_CLOSEOUT + NM_FINANCE_ACCOUNTING_GUARD + NM_SECURITY_DR_KEY_MANAGEMENT + NM_OBSERVABILITY_OPS.

## الحالة النهائية
**FINAL_STATUS: NULL_TENANT_AUDIT_INCOMPLETE** — العدّ الفعلي لصفوف `tenant_id IS NULL` يتطلّب دور **BYPASSRLS/superuser** (`postgres`). الدور المتاح للوكيل (`nama_medical_app`) محكوم بـFORCE RLS بلا `app.tenant_id` (و`set_config` ممنوع في هذا النطاق) → كل count يرجع 0 كأثر RLS لا كقيمة حقيقية.

## نطاق الـbackfill (static من origin/integration/all-epics @ 64ac581)
31 جدولاً قائماً فيها `UPDATE <t> SET tenant_id = 1 WHERE tenant_id IS NULL;` (لا توجد جداول جديدة في هذه القائمة — الجداول الجديدة تُنشأ بـtenant_id NOT NULL بلا backfill):
admission_daily_rounds, admissions, bed_transfers, beds, blood_bank_crossmatch, blood_bank_donors, blood_bank_transfusions, blood_bank_units, cssd_instrument_sets, cssd_load_items, cssd_sterilization_cycles, daily_close, emergency_beds, emergency_trauma_assessments, emergency_visits, finance_chart_of_accounts, finance_cost_centers, finance_journal_entries, finance_journal_lines, icu_fluid_balance, icu_monitoring, icu_scores, icu_ventilator, insurance_claims, insurance_companies, insurance_contracts, insurance_policies, inventory_items, wards, zatca_invoices.

## نتيجة بنيوية مطمئنة (read-only، information_schema + pg_class)
- **كل الـ31 جدولاً تملك عمود `tenant_id` بالفعل** (`tenant_id_col=true`) و**FORCE RLS مفعّل عليها** (`force_rls=true`).
- **لا جدول يحصل على عمود tenant_id جديد** → لا إسناد جماعي للصفوف القائمة إلى tenant=1. أثر الـbackfill الوحيد محصور في صفوف يتيمة `tenant_id IS NULL`.
- بما أن FORCE RLS + WITH CHECK مفعّلان أصلاً (التطبيق لا يستطيع كتابة صف بـtenant فارغ)، فالمتوقّع أن عدد الصفوف اليتيمة = صفر أو شبه صفر — **لكن يجب إثباته بدور مخوّل، لا افتراضه.**

## برهان حدّ RLS (لماذا لا أستطيع العدّ)
`current_user=nama_medical_app, rolbypassrls=false`. `patients` (force_rls=true) → `count=0` كدور التطبيق رغم وجود بيانات؛ `admissions` → `count=0`. الـ31 جدولاً كلها `visible_count=0` لنفس السبب (RLS لا فراغ فعلي).

## القرار
**MULTI_TENANT_AUDIT_INCOMPLETE** — لا توصية بـ`CONFIRM_MULTITENANT=1`. لا DDL. الخطوة الحاسمة: يشغّل المالك العدّ التالي بدور `postgres` (read-only)، ويرسل النتائج المعقّمة (counts فقط).

### استعلام التدقيق read-only للمالك (بدور postgres / BYPASSRLS — counts فقط، بلا PHI)
```bash
export PATH="/c/Program Files/PostgreSQL/16/bin:$PATH"
psql -U postgres -d nama_medical_web -v ON_ERROR_STOP=1 <<'SQL'
DO $$
DECLARE t text; n bigint; nl bigint;
  tabs text[] := ARRAY['admission_daily_rounds','admissions','bed_transfers','beds',
    'blood_bank_crossmatch','blood_bank_donors','blood_bank_transfusions','blood_bank_units',
    'cssd_instrument_sets','cssd_load_items','cssd_sterilization_cycles','daily_close',
    'emergency_beds','emergency_trauma_assessments','emergency_visits','finance_chart_of_accounts',
    'finance_cost_centers','finance_journal_entries','finance_journal_lines','icu_fluid_balance',
    'icu_monitoring','icu_scores','icu_ventilator','insurance_claims','insurance_companies',
    'insurance_contracts','insurance_policies','inventory_items','wards','zatca_invoices'];
BEGIN
  FOREACH t IN ARRAY tabs LOOP
    EXECUTE format('SELECT count(*), count(*) FILTER (WHERE tenant_id IS NULL) FROM %I', t) INTO n, nl;
    RAISE NOTICE '% total=% nulls=%', rpad(t,32), n, nl;
  END LOOP;
END $$;
SQL
```
- **إن كانت كل `nulls=0`** → الـbackfill عملية لا-أثر (no-op) → آمن رغم تعدّد المستأجرين؛ يبقى عائق وحيد: الحارس سيوقف عند tenants=2 (يتطلّب موافقة مالك منفصلة على تجاوزه بأمان، أو تحسين الحارس ليسمح عند nulls=0).
- **إن وُجد أيّ `nulls>0`** → BLOCKED: تحديد التعيين الصحيح للمستأجر يدوياً لتلك الصفوف قبل أيّ backfill.

## إرشاد الدور/PATH/.pgpass (بلا أسرار)
- DDL والتدقيق المخوّل يحتاجان `postgres` أو دور migration — **ليس** `nama_medical_app`.
- `export PATH="/c/Program Files/PostgreSQL/16/bin:$PATH"` (الأدوات مُثبَّتة خارج PATH).
- جهّز `~/.pgpass` (chmod 600) لدور postgres، أو استخدم `-W`. لا تُرسل كلمة المرور.

## الثوابت (read-only)
tenants=2 · FORCE_RLS=150 · policies=152 · accounting OFF · journal=0 · live webroot=171b7c2 (لم يُبدَّل) · target=64ac581.

## ما لم يُنفَّذ (إثبات)
DDL: NO · DEPLOY_RUN: NO · DB writes: NO · set_config: NO · deploy: NO · pm2 restart: NO · Docker/Vault/keys: NO · ZATCA/NPHIES: NO · PHI printed: NO · secrets: NO · CONFIRM_MULTITENANT: NO · force push: NO.

## الخطوة التالية
المالك يشغّل استعلام التدقيق أعلاه بدور postgres ويرسل النتائج المعقّمة (counts) → عندها أحسم: آمن للتشغيل (مع معالجة الحارس) أو يحتاج تعيين يدوي.
