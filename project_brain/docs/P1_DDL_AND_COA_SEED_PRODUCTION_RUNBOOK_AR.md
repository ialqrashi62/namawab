# P1_DDL_AND_COA_SEED — دليل تشغيل الإنتاج (Production Runbook)

> **تخطيط فقط — لا تنفيذ.** التنفيذ يتطلب: (1) نجاح بروفة staging، (2) موافقة صريحة `DDL_AND_COA_SEED_APPROVAL` في التعليمة.
> حالياً كلاهما غير متوفّر ⇒ هذا الـ runbook جاهز للاستخدام لاحقاً فقط.

## نتائج P1B Preflight (2026-06-20) — تُحدِّث تقدير المخاطر
preflight read-only على الإنتاج (`nama_medical_web`@5432) أثبت:
- **كل جداول finance فارغة (0 صف)** — journal_lines/journal_entries/vouchers/chart_of_accounts/cost_centers/fiscal_years/tax_declarations/doctor_commissions = 0؛ حجم كل جدول 16–24 kB؛ حجم القاعدة 16 MB.
- `debit/credit = real`، لكن **0 صف ⇒ ALTER TYPE فوري، بلا إعادة كتابة بيانات، بلا فقد دقة ممكن** (REAL_TO_NUMERIC_SAFE).
- فحوص القيود/المفاتيح كلها 0 (لا أيتام، لا تكرار رموز، لا قيود غير متوازنة، لا null tenant) ⇒ FK/CHECK/UNIQUE ستمرّ.
- لا أقفال على جداول finance، لا معاملات طويلة، اتصال واحد فقط.
- pg_dump 16.14 = الخادم 16.14؛ مساحة حرة 689GB؛ backup الـ16MB لحظي.
**النتيجة:** خطر القفل/إعادة الكتابة الذي حُذِّر منه سابقاً **منتفٍ عملياً** لأن الجداول فارغة. التقدير: مخاطرة منخفضة.

## نطاق الأثر (Blast Radius)
| الجدول | التغيير | المخاطرة |
|---|---|---|
| finance_chart_of_accounts | +5 أعمدة + UNIQUE(tenant_id,account_code) + seed صفوف | متوسطة (DDL خفيف + إدراج) |
| finance_journal_entries | +8 أعمدة + UNIQUE idempotency جزئي + FK + index | متوسطة (جدول قد يكون كبيراً) |
| finance_journal_lines | **ALTER TYPE NUMERIC (إعادة كتابة + قفل)** + CHECK×2 + FK×2 + index×3 | **عالية (قفل ACCESS EXCLUSIVE)** |
| finance_posting_account_map | جدول جديد + seed | منخفضة |
الجداول غير المذكورة (المرضى/الفواتير/التأمين/RLS/entitlement): **لا تُمسّ**.

## المتطلبات المسبقة (Go/No-Go Checklist)
- [ ] بروفة staging (Gates 2–5) **PASS** موثّقة.
- [ ] موافقة صريحة `DDL_AND_COA_SEED_APPROVAL` موجودة في التعليمة.
- [ ] نافذة صيانة معلَنة (بسبب قفل ALTER TYPE).
- [ ] backup إنتاج حديث + تحقق سلامته.
- [ ] `validate.sql` على الإنتاج (read-only) = كل الفحوص 0 (عدا رموز المحرك قبل الـ seed).
- [ ] إصدار PostgreSQL مؤكَّد (≥ 11 إن سيُفعَّل trigger التوازن الاختياري).
- [ ] تأكيد هوية القاعدة الهدف (تفادي الهدف الخاطئ).
- [ ] لا نشر تطبيق مصاحب ما لم يُعتمَد بشكل منفصل.

## الأوامر الدقيقة (للاستخدام عند الاعتماد فقط)

### 1) تأكيد الهوية (تفادي الهدف الخاطئ)
```bash
psql "$PROD_DSN" -c "SELECT current_database(), inet_server_addr(), version();"
# تأكَّد يدوياً أن النتيجة هي قاعدة الإنتاج المقصودة قبل المتابعة.
```

### 2) Backup إلزامي
```bash
pg_dump --no-owner --format=custom --file="namaweb_prod_$(date +%Y%m%d_%H%M%S).dump" "$PROD_DSN"
# تحقق الحجم/السلامة:
pg_restore --list namaweb_prod_*.dump | head
```

### 3) فحوص القفل/الاتصالات
```bash
psql "$PROD_DSN" -c "SELECT count(*) AS active FROM pg_stat_activity WHERE state='active';"
psql "$PROD_DSN" -c "SELECT pid, state, query_start, left(query,60) FROM pg_stat_activity WHERE state<>'idle' ORDER BY query_start;"
psql "$PROD_DSN" -c "SELECT * FROM pg_locks WHERE NOT granted;"
# لا تتابع إن وُجدت معاملات طويلة على جداول finance.
```

### 4) preflight (read-only، بوابة توقف)
```bash
psql "$PROD_DSN" -f docs/accounting_candidates/accounting_ddl_candidate_validate.sql
# أي bad_rows > 0 (عدا missing_engine_account_codes قبل الـ seed) ⇒ توقف.
```

### 5) تطبيق DDL
```bash
psql "$PROD_DSN" -v ON_ERROR_STOP=1 -f docs/accounting_candidates/accounting_ddl_candidate_up.sql
```

### 6) تطبيق CoA seed
```bash
psql "$PROD_DSN" -v ON_ERROR_STOP=1 -f docs/accounting_candidates/medical_coa_seed_candidate.sql
```

### 7) تطبيق خريطة الربط
```bash
psql "$PROD_DSN" -v ON_ERROR_STOP=1 -f docs/accounting_candidates/account_mapping_seed_candidate.sql
```

### 8) التحقق بعد التطبيق (read-only)
```bash
psql "$PROD_DSN" -f docs/accounting_candidates/accounting_ddl_candidate_validate.sql
# الآن missing_engine_account_codes يجب = 0، وكل الفحوص = 0.
psql "$PROD_DSN" -c "SELECT data_type FROM information_schema.columns WHERE table_name='finance_journal_lines' AND column_name IN ('debit','credit');" # expect numeric
psql "$PROD_DSN" -c "SELECT conname FROM pg_constraint WHERE conname IN ('fk_jl_entry','fk_jl_account','chk_jl_one_side','chk_jl_nonneg');"
psql "$PROD_DSN" -c "SELECT indexname FROM pg_indexes WHERE indexname IN ('uq_coa_tenant_code','uq_journal_idempotency','idx_jl_entry','idx_jl_account');"
```

### 9) Rollback (عند الفشل)
```bash
# هيكلي:
psql "$PROD_DSN" -v ON_ERROR_STOP=1 -f docs/accounting_candidates/accounting_ddl_candidate_down.sql
# عند الشك في البيانات (المسار المعتمد، أأمن):
pg_restore --clean --if-exists --no-owner --dbname="$PROD_DSN" namaweb_prod_*.dump
```

## قواعد صارمة أثناء التنفيذ
- لا توصيل `accounting_posting.js` بالفواتير (خارج هذه المرحلة).
- لا نشر تطبيق ما لم يُعتمَد منفصلاً.
- لا force push. لا لمس RLS/entitlement/`.gitmodules`/`df893ab`.
- عند فشل أي تحقق ⇒ توقف + قرار rollback + تقرير.

## الحالة المتوقعة عند التنفيذ المعتمد لاحقاً
```text
DDL_EXECUTED: YES
DATA_CHANGED: YES (seed فقط — لا تعديل بيانات قائمة)
PRODUCTION_DEPLOYED: NO (schema/seed فقط، لا نشر تطبيق)
ENGINE_WIRED_TO_INVOICES: NO
FINAL_STATUS: DDL_AND_COA_SEED_PRODUCTION_EXECUTED_PASS
```
