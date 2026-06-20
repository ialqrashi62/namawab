# P1 — أساس ربط ترحيل الفواتير/السندات (Integration Plan Baseline)

> المرحلة: `P1_PATIENT_INVOICE_RECEIPT_POSTING_INTEGRATION_PLAN` — البوابة 0
> التاريخ: 2026-06-21 | النمط: **PLAN_ONLY / READ-ONLY** | لا كود، لا DDL، لا seed، لا تفعيل flag، لا نشر.

## ACTIVE_SKILLS
```text
ACTIVE_SKILLS:
- MEDICAL_AUTOPILOT_CORE_SKILL_AR
- MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR
- MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR
- MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR
- MEDICAL_API_AUDIT_SKILL_AR
- MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR
- MEDICAL_TEST_SCENARIOS_SKILL_AR
- MEDICAL_SECURITY_PRIVACY_AUDIT_SKILL_AR
- MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR
- MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## Gate 0 — التحقق (read-only)
| البند | القيمة | الحالة |
| ----- | ------ | ------ |
| `git status --short` | ملفات Stitch/UI سابقة فقط (خارج النطاق) | ✅ |
| `git log -1` / sync | HEAD = `6a6d2ab` = `origin/master` | ✅ متزامن |
| DDL محاسبي مطبَّق | نعم (single-box prod) | ✅ |
| CoA | **30** | ✅ |
| account mapping | **23** | ✅ |
| journal entries / lines | **0 / 0** | ✅ لا قيود مرحَّلة |
| `ACCOUNTING_POSTING_ENABLED` | **OFF** (غائب من `.env` ⇒ افتراضي؛ `isEnabled()` يتطلّب `=== 'true'`) | ✅ |
| `accounting_posting.js` | موجود ومُختبَر (28/28 + بروفة 63/63) | ✅ |
| `accounting_posting_service.js` | موجود (fail-closed، idempotent، tenant-aware) | ✅ |
| DDL/Seed مطلوبة الآن | **لا** (`DO_NOT_RERUN: YES`) | ✅ |

## اكتشاف جوهري: الربط **موجود جزئياً بالفعل** خلف الـ flag
`server.js` يستورد الخدمة (سطر 15) ويستدعي `runEventWithPosting` في **4 مسارات** نقدية (مفصّلة في تقرير الاكتشاف). أي أن هذه المرحلة **ليست greenfield**؛ بل: توثيق الموجود + سدّ الفجوات + استراتيجية rollout + قرار الفواتير القديمة + خطة اختبار + معايير جاهزية.

## بيانات الفوترة الحالية (read-only)
- `invoices`: **3 صفوف** (منها 2 مدفوعة، 0 استرداد/سالب). لا قيود journal مرتبطة (journal=0).
- أعمدة `invoices` الفعلية: `id, patient_name, total, paid, order_id, service_type, invoice_number, description, amount, vat_amount, patient_id, payment_method, created_at, tenant_id, facility_id`.

## ⚠️ تنبيه أساس (precondition للمراحل اللاحقة، ليس من نطاق هذه الخطة)
يوجد **انحراف مخطط (schema drift)** في جدول `invoices`: كود `server.js` (ef1acf9) يكتب أعمدة **غير موجودة** في تعريف bootstrap (`db_postgres.js:97`) ولا تُضاف عبر ALTER ولا توجد في القاعدة الحالية: `discount, discount_reason, original_amount, created_by` (INSERT 741)، `cancelled, cancel_reason, cancelled_by, cancelled_at` (UPDATE 5611)، `amount_paid, balance_due` (UPDATE 6461). الأثر: مساران/ثلاثة من المسارات الموصولة ستُخفق على هذه القاعدة بصرف النظر عن الـ flag حتى تُسوَّى أعمدة `invoices`. **يُسجَّل كـ precondition للتنفيذ** (مصالحة مخطط الفواتير عبر ALTER محكوم بموافقة منفصلة).

## النتيجة
```text
GATE0_STATUS: BASELINE_VERIFIED
WIRING_PRESENT: PARTIAL (4 routes already call runEventWithPosting, flag OFF)
DDL_SEED_NEEDED: NO (DO_NOT_RERUN)
INVOICE_SCHEMA_DRIFT: YES (precondition — separate controlled ALTER)
NEXT: GATE1_FLOW_DISCOVERY
```

`PATIENT_INVOICE_RECEIPT_POSTING_BASELINE_COMPLETE`
