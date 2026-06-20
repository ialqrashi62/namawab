# P1 — إغلاق فحص الإنتاج المحاسبي (Production Preflight Final Closeout)

> المرحلة: `P1_ACCOUNTING_PRODUCTION_PREFLIGHT_AND_APPROVAL_GATE` — البوابة 3 (قرار) + البوابة 4 (إغلاق)
> التاريخ: 2026-06-21 | **read-only فقط** | لم يُنفَّذ DDL/Seed/تغيير بيانات/deploy/restart.

## البوابة 3 — القرار
حالة الإنتاج (القاعدة الوحيدة القابلة للوصول، single-box `nama_medical_web`) = **FULLY_APPLIED_UNDOCUMENTED**: المرشّحات الأربعة مطبَّقة بالكامل ومطابِقة، البيانات نظيفة (validate كله صفر)، لكن التطبيق غير موثّق في إغلاق READINESS.

```text
FINAL_DECISION: PRODUCTION_ALREADY_APPLIED_RECONCILIATION_REQUIRED   (الحالة B)
```

**لا يُعاد تنفيذ DDL/Seed.** إعادة التنفيذ غير ضرورية (الحالة النهائية موجودة)، وآمنة-تقنياً لو حدثت (المرشّحات idempotent: `ADD COLUMN IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS` / `ON CONFLICT DO NOTHING`) — لكن السياسة: **لا تنفيذ بلا موافقة، ولا تكرار لحالة قائمة**.

### تقرير المصالحة (من/متى/كيف — بقدر ما يسمح الدليل)
- **ماذا**: طُبِّقت `accounting_ddl_candidate_up.sql` + `medical_coa_seed_candidate.sql` + `account_mapping_seed_candidate.sql` على `nama_medical_web` (دليل: تطابق دقيق — CoA=30، map=23، NUMERIC، كل القيود/الفهارس/الأعمدة).
- **متى**: بين لقطة READINESS (2026-06-20، قاسَت حالة ما-قبل-المرشّح: REAL، بلا tenant_id) وهذه اللقطة (2026-06-21). نافذة ~24 ساعة.
- **من/كيف**: الأرجح الجلسة الموازية (R17) — يقوّيه وجود بنية staging موازية (`127.0.0.1:5433 / nama_medical_staging_rehearsal`) وتقارير الجلسة الموازية (`P1_DDL_AND_COA_SEED_STAGING_REHEARSAL_REPORT_AR`, `P1_ACCOUNTING_STATE_RECONCILIATION_GATE_AR`).
- **قيد الدليل**: لا يوجد سجل تدقيق زمني داخل القاعدة (لا `created_at`/منفّذ على صفوف CoA) لتثبيت الـ commit/التوقيت الدقيق — لذلك «من/متى» استدلالي لا قطعي.

### ⚠️ عائق ثانوي — طوبولوجيا الإنتاج
لا توجد قاعدة إنتاج **بعيدة** مُهيّأة أو قابلة للوصول من بيئة العمل (كل الاتصالات localhost؛ لا cloud/RDS/SSH/DATABASE_URL بعيد؛ staging على 5433 غير مُشغَّل). إن كان المالك يحتفظ بإنتاج بعيد مستقل خارج هذا الصندوق، فحالته **`UNVERIFIED_FROM_THIS_ENVIRONMENT`** ويلزم تشغيل نفس استعلامات القراءة على مضيفه. يجب على المالك **تأكيد الطوبولوجيا**: single-box (فالقرار B نهائي) أم يوجد remote منفصل (فيلزم فحصه مستقلاً قبل أي قرار).

## البوابة 4 — الحقول
```text
FINAL_STATUS: PRODUCTION_PREFLIGHT_READ_ONLY_PASS
PRODUCTION_TOUCHED: READ_ONLY
REMOTE_PRODUCTION_VERIFIED: NO_SEPARATE_REMOTE_FOUND (de-facto single-box prod nama_medical_web verified READ_ONLY; any external remote = UNVERIFIED_FROM_THIS_ENVIRONMENT)
DDL_EXECUTED: NO (by this session — already present from prior parallel session)
SEED_EXECUTED: NO (by this session — already present)
DATA_CHANGED: NO
PRODUCTION_DEPLOYED: NO
PM2_RESTARTED: NO
ACCOUNTING_POSTING_ENABLED: OFF (absent from .env ⇒ default OFF; code requires === 'true')
COA_COUNT: 30
ACCOUNT_MAPPING_COUNT: 23
JOURNAL_COUNT: 0
JOURNAL_LINES_COUNT: 0
MONEY_TYPE_STATUS: NUMERIC (debit & credit)
FK_STATUS: PRESENT (fk_jl_entry, fk_jl_account, fk_je_reversed)
UNIQUE_STATUS: PRESENT (uq_coa_tenant_code, uq_journal_idempotency)
IDEMPOTENCY_STATUS: PRESENT (source_type/source_id/posting_reference cols + uq_journal_idempotency)
CANDIDATE_COMPARISON_STATUS: FULLY_APPLIED_UNDOCUMENTED
FINAL_DECISION: PRODUCTION_ALREADY_APPLIED_RECONCILIATION_REQUIRED
NEXT_REQUIRED_ACTION: OWNER_CONFIRM_TOPOLOGY_THEN_RECONCILE_DOCS (do NOT re-run DDL/Seed; keep ACCOUNTING_POSTING_ENABLED=OFF until separate wiring-approval phase)
```

## معيار PASS — مُستوفى
- تحقّق read-only من حالة الإنتاج ✅ · لا DDL ✅ · لا Seed ✅ · لا تغيير بيانات ✅ · لا restart ✅ · لا deploy ✅ · تحديد حالة الإنتاج مقابل المرشّحات (FULLY_APPLIED_UNDOCUMENTED) ✅ · قرار واضح للخطوة التالية (Case B) ✅ · UTF-8 ✅ · push بدون force ✅.

## التقارير المنتَجة
`..._PREFLIGHT_WORKSPACE_GUARD_AR.md` · `..._PREFLIGHT_SNAPSHOT_AR.md` · `..._CANDIDATE_COMPARISON_AR.md` · هذا الإغلاق.

`ACCOUNTING_PRODUCTION_PREFLIGHT_FINAL_CLOSEOUT_COMPLETE`
