# P1 — أساس بيئة العمل لبروفة المحاسبة (Rehearsal Workspace Baseline)

> المرحلة: `P1_ACCOUNTING_DDL_AND_COA_SEED_REHEARSAL` — البوابة 0 (التحقق من وحدة بيئة العمل)
> التاريخ: 2026-06-21 | الحالة: `WORKSPACE_VERIFIED` | لا تنفيذ على الإنتاج.

## 1. المسار الوحيد المعتمد (Single Workspace)
| البند | القيمة | الحالة |
| ----- | ------ | ------ |
| مسار العمل | `C:\Users\ice\Desktop\NamaMedical` | ✅ مطابق للقرار المعتمد |
| الفرع | `HEAD` (detached) | معلوم |
| `git rev-parse HEAD` | `f8bd3a4d8a044498883df84bede578eaa7627d0f` | ✅ |
| `origin/master` | `f8bd3a4…` | ✅ **local == origin/master** (لا split-brain) |
| آخر commit | `f8bd3a4 docs(memory): Phase 125 — verify accounting readiness already complete` | متزامن |

### `git status --short` (لقطة)
ملفات Stitch/UI سابقة فقط (خارج نطاق هذه المرحلة، لا تُلمَس):
```
 M docs/STITCH_DESIGN_IMPLEMENTATION_REPORT_AR.md
 M docs/STITCH_MODULE_BATCH_PROGRESS_AR.md
?? docs/MEDICAL_*_FOR_STITCH_AR.md (4 ملفات)
?? docs/STITCH_*_AR.md (3 ملفات)
```
**لا توجد ملفات SQL محاسبية مكررة غير متتبعة** (تنظيف النسخ المكررة من `docs/sql/` سابقاً صحيح ومستقر).

## 2. حالة الـ submodule (namaweb)
| البند | القيمة | الحالة |
| ----- | ------ | ------ |
| `namaweb` HEAD | `ef1acf9 fix(startup): skip dev bootstrap seeders in production` | ✅ commit صحيح |
| working tree | نظيف | ✅ |
| `.gitmodules` mapping لـ namaweb | **غير مسجّل** (`no submodule mapping found`) | ⚠️ متابعة معروفة `REGISTER_GITMODULES_FOR_NAMAWEB_SUBMODULE` — خارج نطاق هذه المرحلة (ممنوع لمس `.gitmodules`) |

## 3. وحدة الجلسة (منع التعدد) — قرار الحوكمة
- تأكيد العمل من نسخة واحدة فقط: `C:\Users\ice\Desktop\NamaMedical`.
- **دليل مادي على نشاط جلسة موازية**: انظر §5 (الحالة المُكتشَفة على قاعدة التطبيق المحلية تطابق المرشّحات بدقّة، ولم تُنفَّذ في هذه الجلسة).
- التوصية القائمة (R17): إيقاف أي جلسة/وكيل كتابة آخر على نفس المستودع، أو جعله قراءة فقط.

## 4. خريطة قواعد البيانات المحلية
| قاعدة | الدور | المعاملة في هذه البروفة |
| ----- | ----- | ---------------------- |
| `nama_medical_web` | قاعدة التطبيق المحلية (نوع منشأة large_hospital، tenant 1) | **لا تُلمَس** — لقطة قراءة فقط قبل/بعد لإثبات عدم التغيّر |
| `nama_acct_rehearsal` | قاعدة بروفة منفصلة (تُنشأ وتُحذف ضمن هذه المرحلة) | هدف كل عمليات DDL/seed/الاختبار |
| الإنتاج البعيد (remote) | غير متاح من هذه البيئة | **لا يُلمَس إطلاقاً** |

محرك PostgreSQL محلي: خدمة `postgresql-x64-16` (Running). `psql.exe` متاح ضمن PG16. Docker daemon متوقف (غير مطلوب — نستخدم Postgres المحلي بقاعدة منفصلة).

## 5. ⚠️ اكتشاف حَوْكَمي مهم: المرشّحات مُطبَّقة مسبقاً على قاعدة التطبيق المحلية
فحص **قراءة فقط** لقاعدة `nama_medical_web` أظهر أن **مرشّحات المحاسبة الثلاثة مُطبَّقة عليها بالكامل بالفعل** (ليس ضمن هذه الجلسة، وغير موثّق في إغلاق مرحلة READINESS الذي ذكر `DDL_EXECUTED: NO` و`SEED_EXECUTED: NO`):

| الدليل (قراءة فقط) | القيمة المرصودة | المصدر المرشّح المطابق |
| ------------------ | --------------- | --------------------- |
| أعمدة CoA | تتضمّن `tenant_id, facility_id, branch_id, is_postable, normal_balance` | `accounting_ddl_candidate_up.sql` (1) |
| أعمدة `finance_journal_entries` | تتضمّن `source_type, source_id, posting_reference, status, posted_at, posted_by, reversed_entry_id, is_reversed` | up.sql (2) |
| نوع `debit`/`credit` في `finance_journal_lines` | **NUMERIC** (لا REAL) | up.sql (3) |
| القيود | `chk_jl_nonneg, chk_jl_one_side, fk_jl_entry, fk_jl_account, fk_je_reversed` (الخمسة) | up.sql (4) |
| الفهارس | `uq_coa_tenant_code, uq_journal_idempotency, idx_jl_tenant` | up.sql (1,2,5) |
| عدد صفوف CoA | **30** (= 5 رؤوس + 25 حساب) | `medical_coa_seed_candidate.sql` (30 بالضبط) |
| رموز CoA النموذجية (tenant_id=1) | `1,1000,1010,1100,1110,1200,1210,2,2100,2200,2250,2300…` | يطابق الـ seed حرفياً |
| جدول `finance_posting_account_map` | موجود، **23 صفاً** | `account_mapping_seed_candidate.sql` (23 بالضبط) |

**الاستنتاج**: مرشّحات DDL + CoA seed + account mapping نُفِّذت بالفعل على قاعدة التطبيق المحلية `nama_medical_web`. هذا يقوّي R17 (جلسة موازية)، ويُسجَّل كأثر حَوْكَمي يجب أن يحسمه المالك:
- إن كانت `nama_medical_web` تُعتبر بيئة محلية/تطوير ⇒ لا ضرر إنتاجي، لكن يلزم توثيق ما جرى.
- حالة **الإنتاج البعيد** (هل طُبّقت عليه؟) **مجهولة من هذه البيئة** ويجب التحقق منها بشكل مستقل قبل أي قرار. **لم تُلمَس** من هذه الجلسة لا المحلية ولا البعيدة.

البروفة الحالية تتجاهل هذه الحالة المُكتشَفة وتجري على قاعدة **نظيفة منفصلة** (`nama_acct_rehearsal`) لتقديم تحقّق مستقل من سلامة المرشّحات.

## 6. النتيجة
```text
GATE0_STATUS: WORKSPACE_VERIFIED
SINGLE_WORKSPACE: C:\Users\ice\Desktop\NamaMedical (local==origin/master f8bd3a4)
NAMAWEB_COMMIT: ef1acf9 (clean)
DUP_UNTRACKED_SQL_IN_DOCS_SQL: NONE
REHEARSAL_DB_PLAN: nama_acct_rehearsal (separate, throwaway)
APP_DB_TOUCHED: NO (read-only snapshot only)
GOVERNANCE_FINDING: candidates already applied to local nama_medical_web (parallel session; not by this session; remote-prod state UNKNOWN)
NEXT: GATE1_CANDIDATE_REVIEW
```

`ACCOUNTING_REHEARSAL_WORKSPACE_BASELINE_COMPLETE`
