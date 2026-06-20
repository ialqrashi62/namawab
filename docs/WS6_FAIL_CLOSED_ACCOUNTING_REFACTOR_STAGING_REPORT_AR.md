# WS6 — إعادة هيكلة fail-closed للترحيل المحاسبي (staging) — تقرير

> Workstream 6. التاريخ: 2026-06-20. **فرع الميزة/staging فقط — لا نشر إنتاج، لا تفعيل posting، journals الإنتاج=0.**

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## Gate 0
parent HEAD=`df099a9` متزامن؛ namaweb فرع `feature/accounting-posting-wiring-staging`؛ DB_USER=nama_medical_app؛ flag OFF؛ prod journals 0/0؛ app 200؛ redis PONG. backup `backup/before-ws6-failclosed`.

## Gate 1/2 — اكتشاف المسارات وتصنيف الحالة
| الحدث | المسار | الحالة قبل | القرار |
|---|---|---|---|
| إصدار فاتورة | POST /api/invoices | pending-posting | **مُعاد هيكلته fail-closed** |
| دفعة | PUT /api/invoices/:id/pay | pending-posting | **مُعاد هيكلته fail-closed** |
| إلغاء | POST /api/invoices/cancel/:id | pending-posting | **مُعاد هيكلته fail-closed** (قيد عكسي) |
| توليد فاتورة | POST /api/invoices/generate | بلا ترحيل | غير مُوصَل (لا يُرحّل) — يمكن لاحقاً |
| استرداد | POST /api/invoices/:id/refund | بلا ترحيل | **مؤجَّل** (بانٍ موجود، غير مُوصَل) |
| مطالبة تأمين تقديم/تسوية | /api/insurance/claims | بلا ترحيل | **مؤجَّل** (لا بانٍ/قاعدة) |
| خصم/تسوية، write-off | — | — | **مؤجَّل** (لا قاعدة/mapping) |
**الوضع قبل**: pending-posting / **partial-risk** — كانت الفاتورة تُحفظ بـ autocommit ثم يُرحَّل القيد في معاملة منفصلة غير حاجبة ⇒ احتمال **فاتورة بلا قيد** عند فشل الترحيل.

## Gate 3/4 — التصميم والتنفيذ (مركزي)
- دالة مركزية في `accounting_posting_service.js`: `runEventWithPosting(pool, ctx, doEvent, doPost)`:
  - `BEGIN` → ربط `app.tenant_id` (bindTenant) → تنفيذ حدث العمل → (عند تفعيل العلم) ترحيل القيد في **نفس المعاملة** → `COMMIT`؛ أي فشل ⇒ `ROLLBACK` كامل.
  - idempotency محفوظ عبر SAVEPOINT داخل postEntry.
- أُعيدت هيكلة المسارات الثلاثة لاستخدامها: حدث الفاتورة + الترحيل **يثبّتان معاً أو يتدحرجان معاً**.
- **العلم OFF افتراضياً**: عند OFF يُنفَّذ حدث العمل فقط (لا ترحيل) ⇒ سلوك الإنتاج بلا تغيير. لا hacks، لا superuser كدليل.

## Gate 5/6 — الاختبارات (staging تحت nama_medical_app): **10/10 PASS**
| اختبار | نتيجة |
|---|---|
| نجاح: فاتورة + قيد متوازن في معاملة واحدة (115=115، 3 أسطر) | ✅ |
| tenant_id للقيد = 1 | ✅ |
| **فشل الترحيل ⇒ تدحرج الفاتورة (لا فاتورة يتيمة)** | ✅ |
| idempotency: إعادة المحاولة ⇒ قيد واحد فقط | ✅ |
| flag OFF ⇒ فاتورة بلا قيد | ✅ |
| اختبارات المحرك النقية | ✅ 28/28 |
كل البيانات اصطناعية وحُذِفت؛ staging نظيفة (RLS=35 baseline، الدور محذوف). أداة الاختبار: `namaweb/staging_failclosed_test.js`.

## ملاحظات
- **مغطّى fail-closed الآن**: إصدار الفاتورة، الدفع، الإلغاء (قيد عكسي).
- **مؤجَّل صراحةً** (قاعدة/mapping/بانٍ ناقص): استرداد، مطالبات تأمين (تقديم/تسوية)، خصم/تسوية، write-off — تُنفَّذ في WS5/WS7 لاحقاً.
- لا production journal كُتب؛ posting OFF؛ الكود على فرع الميزة (gitlink e6608ba ثابت، لا نشر).

## الحالة النهائية
```text
FINAL_STATUS: FAIL_CLOSED_REFACTOR_STAGING_PASS_GO_LIVE_PENDING_APPROVAL
PRODUCTION_TOUCHED: NO
DATA_CHANGED: NO (staging synthetic only, cleaned)
DDL_EXECUTED: NO
DEPLOYED: NO
POSTING_ENABLED: NO
PROD_JOURNALS_WRITTEN: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: separate accounting go-live approval (WS8) — do not enable posting now
```
