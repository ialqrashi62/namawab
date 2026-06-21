# P1 — تسوية انحراف مخطط الفواتير + خطة DDL آمنة (Invoice Schema Drift Reconciliation)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_ALL_PHASES_GROUPS_AFTER_PHASE_140` — المرحلة المختارة | التاريخ: 2026-06-21
> **read-only + DDL candidate فقط** | لا ALTER/data/deploy/runtime-code. (غير متراكم على backlog الكود.)

## ACTIVE_SKILLS
```text
ACTIVE_SKILLS:
- MEDICAL_AUTOPILOT_CORE_SKILL_AR
- MEDICAL_NEXT_PHASE_SELECTOR_SKILL_AR
- MEDICAL_ULTIMATE_AUTOPILOT_DECISION_ENGINE_SKILL_AR
- MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR
- MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR
- MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR
- MEDICAL_API_AUDIT_SKILL_AR
- MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR
- MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR
- MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## لماذا هذه المرحلة
وجّه المالك بعدم إضافة جولة code-only جديدة على tenant guards (backlog كبير). invoice schema drift هو **precondition موثّق** لمسار المحاسبة وللمسارات المالية، وهو **read-only + DDL candidate** (لا يزيد backlog الكود) ⇒ أعلى عمل آمن قيمةً الآن.

## الانحراف المرصود (read-only)
أعمدة `invoices` الحيّة (15): `id, patient_name, total, paid, order_id, service_type, invoice_number, description, amount, vat_amount, patient_id, payment_method, created_at, tenant_id, facility_id`.

**أعمدة يكتبها `server.js` لكنها مفقودة على الإنتاج (10):**
| العمود | يكتبه (سطر) | النوع المقترح |
| ------ | ----------- | ------------- |
| discount | POST /api/invoices (741) | REAL DEFAULT 0 |
| discount_reason | 741، refund (6540) | TEXT DEFAULT '' |
| created_by | 741، refund (6540) | TEXT DEFAULT '' |
| original_amount | 741 | REAL DEFAULT 0 |
| cancelled | cancel (5658) + WHERE (5531) | INTEGER DEFAULT 0 |
| cancel_reason | cancel (5658) | TEXT DEFAULT '' |
| cancelled_by | cancel (5658) | TEXT DEFAULT '' |
| cancelled_at | cancel (5658) | TIMESTAMP |
| amount_paid | partial-pay (6512) | REAL DEFAULT 0 |
| balance_due | partial-pay (6512) | REAL DEFAULT 0 |

## الأثر (مهم)
المسارات التالية **تُخفق على الإنتاج** بخطأ `column does not exist` عند الاستخدام الفعلي (بصرف النظر عن أي flag أو RLS):
- `POST /api/invoices` (إنشاء فاتورة) — discount/discount_reason/created_by/original_amount.
- `POST /api/invoices/cancel/:id` — cancelled/cancel_reason/cancelled_by/cancelled_at.
- `PUT /api/invoices/:id/partial-pay` — amount_paid/balance_due.
- `POST /api/invoices/:id/refund` — created_by/discount_reason (رغم أن حارس refund منشور، الـINSERT يفشل على عمود مفقود).

⇒ **ربط حَوْكَمي**: نشر الإصلاحات الأمنية المتراكمة (التي تلمس هذه المسارات) **لن يكفي** لتشغيلها على الإنتاج دون تطبيق هذا الـ DDL. لذا يجب أن يُرافق هذا الـ candidate **نشرَ** الكود (بموافقة DDL منفصلة).

## المرشّحات (candidate-only، DO NOT EXECUTE)
- `docs/sql/invoice_schema_drift_candidate_up.sql` — `ALTER TABLE invoices ADD COLUMN IF NOT EXISTS …` للأعمدة العشرة (additive، idempotent، 0 تغيير بيانات).
- `..._validate.sql` — تحقّق read-only (الأعمدة موجودة/مفقودة + ثبات عدد الصفوف).
- `..._down.sql` — تراجع (DROP COLUMN IF EXISTS).

## خطة تنفيذ آمنة (عند الموافقة — منفصلة)
1. backup لجدول invoices (أو لقطة) قبل ALTER.
2. تشغيل validate (قبل) → يُظهر الأعمدة مفقودة.
3. تشغيل up (بروفة staging أولاً إن أمكن، ثم إنتاج بموافقة DDL).
4. تشغيل validate (بعد) → 10/10 موجودة، عدد الصفوف ثابت (3).
5. (اختياري) backfill `original_amount = total`، `balance_due = total - COALESCE(amount_paid,0)` للصفوف القديمة — قرار، غير ضروري للتشغيل.
6. rollback جاهز (down) + اعتماد backup.
> ALTER ADD COLUMN على PostgreSQL مع DEFAULT ثابت = سريع (لا إعادة كتابة جدول كامل في إصدارات حديثة)؛ المخاطرة منخفضة على جدول بـ3 صفوف.

## ملاحظة جانبية (خارج النطاق، مُسجَّلة)
`DELETE /api/patients/:id` (soft-delete) يكتب `is_deleted/deleted_at/deleted_by` على `patients` — قد تكون مفقودة بالمثل؛ تُدقَّق في تسوية مخطط patients منفصلة.

## الإغلاق (Gate 5)
```text
FINAL_STATUS: DOCS_AND_SQL_CANDIDATE_ONLY_PASS
SELECTED_PHASE: P1_INVOICE_SCHEMA_DRIFT_RECONCILIATION_AND_SAFE_DDL_PLAN
PRIORITY_LEVEL: P2 (runtime breakage precondition) — منتقاة لأنها لا تزيد backlog الكود
USER_VISIBLE_ON_WEBSITE: NO ; LOCAL_CHANGES_REMAINING: NO ; COMMITTED: YES ; PUSHED: YES (بلا force)
PRODUCTION_DEPLOYED: NO ; DEPLOYMENT_APPROVAL_REQUIRED: N/A (candidate)
DDL_EXECUTED: NO ; SEED_EXECUTED: NO ; DATA_CHANGED: NO ; RUNTIME_CODE_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: OFF ; JOURNAL_CREATED: NO
RLS_CHANGED: NO ; RLS_RUNTIME_ENFORCEMENT: NOT_YET ; DB_ROLE_BEFORE/AFTER: postgres/postgres
STITCH_MCP_USED: NO ; SECRETS_FOUND: NO ; SECRETS_PRINTED: NO
FILES_CHANGED: 1 report + 3 SQL candidates + 4 master docs + memory ; FILES_DEPLOYED: 0 ; OUT_OF_SCOPE_FILES_PRESENT: NO ; FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: BLOCKED_PENDING_DDL_APPROVAL (تطبيق المرشّح، يُرافق نشر الكود المتراكم)
```

## تدقيق UTF-8
`UTF8_ARABIC_AUDIT: PASS`

`INVOICE_SCHEMA_DRIFT_RECONCILIATION_AND_SAFE_DDL_PLAN_COMPLETE`
