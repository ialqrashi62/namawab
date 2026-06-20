# P1 — لقطة الإنتاج للقراءة فقط (Production Read-only Snapshot)

> المرحلة: `P1_ACCOUNTING_PRODUCTION_PREFLIGHT_AND_APPROVAL_GATE` — البوابة 1
> التاريخ: 2026-06-21 | **read-only صِرف** (`SET default_transaction_read_only = on` + `SET TRANSACTION READ ONLY`). لا `ALTER/INSERT/UPDATE/DELETE`.

## 0. ⚠️ تحديد هدف «الإنتاج» (حقيقة الطوبولوجيا)
فحص شامل لكل إعدادات الاتصال في المستودع (read-only) أثبت أنه **لا توجد قاعدة إنتاج بعيدة (remote) مُهيّأة أو قابلة للوصول من بيئة العمل هذه**:

| المصدر | قيمة الاتصال | النوع |
| ------ | ------------ | ----- |
| `namaweb/.env` | `DB_HOST=localhost:5432` / `nama_medical_web` | محلي |
| `namaweb/server.js:7059` (افتراضي) | `postgresql://postgres:postgres@localhost:5432/nama_medical_web` | محلي |
| `namaweb/ecosystem.config.js` | `NODE_ENV=production` + الاعتماد على `.env` (محلي) | محلي بوضع إنتاج |
| اختبارات staging | `127.0.0.1:5433` / `nama_medical_staging_rehearsal` | **staging غير مُشغَّل الآن** |
| بحث عن cloud/RDS/SSH/DATABASE_URL بعيد | **لا نتائج** (لا amazonaws/rds/render/railway/supabase/neon/IP عام/ssh deploy) | — |

**الخلاصة**: نموذج النشر **أحادي الصندوق (single-box)**؛ التطبيق (PM2 `nama-app`, `NODE_ENV=production`) يتصل بقاعدة **محلية واحدة** `nama_medical_web`. لذلك **قاعدة الإنتاج الفعلية = `nama_medical_web` على `localhost:5432`** (محرك PostgreSQL 16.14). لا توجد قاعدة بعيدة منفصلة في أي إعداد.

> إن كان لدى المالك إنتاج بعيد مستقل **خارج** هذا الصندوق، فهو **غير قابل للتحقق من هذه البيئة** ويجب تشغيل نفس استعلامات القراءة على مضيفه (انظر العائق الثانوي في الإغلاق).

## 1. هوية البيئة
| البند | القيمة |
| ----- | ------ |
| `server_version` | 16.14 |
| `current_database` | `nama_medical_web` |
| عنوان الخادم/المنفذ | `::1` (loopback) : `5432` |
| قواعد البيانات الموجودة | `nama_medical_web`, `postgres` فقط (لا قاعدة إنتاج/staging أخرى) |

## 2. جدول الفحص (قراءة فقط)
| Check | Expected (candidate end-state) | Actual | Status | Notes |
| ----- | ------------------------------ | ------ | ------ | ----- |
| قاعدة الإنتاج فعلاً `nama_medical_web` | نعم | نعم | ✅ | الوحيدة التي يتصل بها التطبيق |
| البيئة remote أم local | — | **local single-box** | ⚠️ | لا remote منفصل |
| `finance_chart_of_accounts` count | 30 (5 رؤوس + 25) | **30** | ✅ | tenant_id = {1} |
| `finance_posting_account_map` | موجود، 23 | موجود، **23** | ✅ | يطابق mapping seed |
| `finance_journal_entries` count | (غير مُقيَّد) | **0** | ✅ | لا قيود مرحَّلة بعد |
| `finance_journal_lines` count | — | **0** | ✅ | لا بيانات قيود |
| `finance_vouchers` count | — | **0** | ✅ | لا سندات |
| نوع `debit`/`credit` | NUMERIC | **NUMERIC** | ✅ | تم تحويل REAL→NUMERIC |
| `tenant_id` على CoA/entries/lines | موجود على الثلاثة | **موجود على الثلاثة** | ✅ | |
| أعمدة idempotency على entries | source_type/source_id/posting_reference/status/reversed_entry_id/is_reversed | **الستة موجودة** | ✅ | |
| unique constraints | uq_coa_tenant_code + uq_journal_idempotency | **كلاهما** | ✅ | |
| كل الفهارس المرشّحة (6) | 6 | **6** | ✅ | idx_jl_entry/account/tenant + idx_journal_entry_date + الفريدان |
| foreign keys | fk_jl_entry + fk_jl_account + fk_je_reversed | **الثلاثة** | ✅ | |
| CHECK constraints | chk_jl_nonneg + chk_jl_one_side | **كلاهما** | ✅ | |
| seed مطبّق سابقاً | — | **نعم (CoA+mapping)** | ⚠️ | غير موثّق في READINESS |
| `validate.sql` ينجح read-only | كل الفحوص = 0 | **كل الـ10 = 0** (incl. missing_engine_account_codes=0) | ✅ | بيانات نظيفة |
| `ACCOUNTING_POSTING_ENABLED` موجود وOFF | OFF | **غائب ⇒ OFF افتراضياً** | ✅ | الكود يتطلّب `=== 'true'` |

## 3. نتيجة `validate.sql` (read-only) على الإنتاج
`orphan_lines_no_entry=0, lines_missing_account=0, dup_account_codes=0, unbalanced_posted_entries=0, null_tenant_journal_entries=0, null_tenant_journal_lines=0, null_tenant_coa=0, bad_line_both_sides=0, negative_amounts=0, missing_engine_account_codes=0` ⇒ **سلامة كاملة، لا بيانات يتيمة، الرموز العشرة مزروعة**.

## 4. النتيجة
```text
GATE1_STATUS: PRODUCTION_READONLY_SNAPSHOT_CAPTURED
PRODUCTION_TARGET: local single-box nama_medical_web @ ::1:5432 (no remote prod configured/reachable)
PRODUCTION_TOUCHED: READ_ONLY
SCHEMA_STATE: candidate end-state present (NUMERIC + tenant_id + idempotency + FK/UNIQUE/CHECK/indexes)
DATA_STATE: CoA=30, mapping=23, journal=0, lines=0, vouchers=0 (validate all-zero)
ACCOUNTING_POSTING_ENABLED: OFF
NEXT: GATE2_CANDIDATE_COMPARISON
```

`ACCOUNTING_PRODUCTION_PREFLIGHT_SNAPSHOT_COMPLETE`
