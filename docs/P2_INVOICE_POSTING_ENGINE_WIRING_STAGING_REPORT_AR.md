# P2 — توصيل محرك الترحيل بالفواتير (Staging) — تقرير

> المرحلة: `INVOICE_POSTING_ENGINE_WIRING_STAGING_ONLY`. التاريخ: 2026-06-20.
> هدف التنفيذ الوحيد: **staging 127.0.0.1:5433 / nama_medical_staging_rehearsal**.
> **لم يُنفَّذ:** أي قيد إنتاج · أي تشغيل على فواتير الإنتاج · نشر · تغيير متغيّرات إنتاج · توصيل مُفعَّل في الإنتاج.

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## Gate 1 — اكتشاف المحرك ودورة حياة الفاتورة
| الحدث | المسار | الحالة قبل |
|---|---|---|
| إصدار فاتورة | `POST /api/invoices` ، `POST /api/invoices/generate` | لا ترحيل |
| تحصيل دفعة | `PUT /api/invoices/:id/pay` ، `partial-pay` | لا ترحيل |
| إلغاء فاتورة | `POST /api/invoices/cancel/:id` | لا ترحيل |
| استرداد | `POST /api/invoices/:id/refund` | لا ترحيل (يُنشئ فاتورة سالبة) |
| مطالبة تأمين | `POST/PUT /api/insurance/claims` | لا ترحيل |
الدليل: `finance_journal*` يظهر في **قراءة واحدة فقط** (GET /api/finance/journal)؛ لا إنشاء قيود في أي مسار. المحرك `accounting_posting.js` غير مستدعى.

## Gate 2 — تصنيف الأحداث
| الحدث | القرار |
|---|---|
| إصدار فاتورة مريض (نقدي/تأمين) | **مدعوم** (`buildPatientInvoicePosting`) |
| تحصيل دفعة نقدية/بنكية | **مدعوم** (`buildReceiptPosting`) |
| إلغاء فاتورة | **مدعوم** عبر قيد عكسي (`buildReversalLines`) |
| استرداد | مدعوم في المحرك (`buildRefundPosting`) — لم يُوصَل المسار في هذه المرحلة (مؤجَّل) |
| إثبات ذمم تأمين / تقديم مطالبة / اعتماد/تسوية | **مؤجَّل** (لا بُناة محرك بعد — موثّق، لا يُخمَّن) |
| خصم/تسوية، write-off/ديون معدومة | **مؤجَّل** (غير مدعوم بعد) |

## Gate 3 — تصميم القيد والربط
يستخدم CoA والربط المُرحَّلين (tenant_id=1). الرموز: 1000/1010 نقد/بنك، 1100/1110 ذمم مريض/تأمين، 2300 ضريبة، 4000 إيراد، 4090 مردودات، 1200 مخزون، 2100 موردين، 5000 تكلفة. كل العمليات المدعومة: مرجع idempotency = `POST:TYPE:ID`، tenant_id إلزامي، VAT 15% شامل عبر `splitVatInclusive`. تحقّقنا أن الرموز موجودة في staging (10/10).

## Gate 4 — المعاملات وعدم التكرار
- **معاملاتي**: `postEntry` يعمل داخل عميل/معاملة مُمرَّر؛ `postInTransaction` يلفّ BEGIN/COMMIT/ROLLBACK.
- **idempotency**: يعتمد `uq_journal_idempotency(tenant_id,source_type,source_id)`؛ مع **SAVEPOINT** حول إدراج الرأس حتى لا يُجهِض `unique_violation` المعاملةَ — إعادة الترحيل تُرفَض بهدوء (`{idempotent:true}`) دون تكرار ودون كسر المعاملة. (هذا العيب اكتُشف وأُصلح أثناء بروفة staging.)
- **نموذج التوصيل في المسارات**: pending-posting — الترحيل بعد حفظ حدث العمل، غير حاجب، وidempotent (إعادة المحاولة آمنة). ملاحظة جاهزية: للتحقيق الصارم fail-closed في معاملة واحدة يلزم إعادة هيكلة المسار لمعاملة موحّدة (موصى به في runbook الإنتاج).
- **مفاتيح**: `invoice:{id}`, `receipt:{id}`, `invoice_cancel:{id}`.

## Gate 5 — عزل المستأجر / RLS
- كل كتابة ترحيل تحمل `tenant_id`؛ بحث الحساب بـ (tenant_id, account_code) فقط ⇒ يستحيل استخدام حساب مستأجر آخر.
- **أثبتنا** (سيناريو 7): ترحيل بمستأجر 999 (بلا حسابات) يفشل بأمان `MISSING_ACCOUNT_MAPPING` — لا تسريب عبر المستأجرين.
- **RLS**: غير مفعّلة على جداول finance (مسار P0 منفصل). الإثبات هنا على مستوى التطبيق (فلتر tenant_id)، **وليس** اعتماداً على صلاحية superuser. توصية: تفعيل RLS على جداول finance قبل تفعيل الترحيل في الإنتاج (تصلّب إضافي).

## Gate 6 — التنفيذ (خلف flag، افتراضي OFF)
- ملف جديد: `accounting_posting_service.js` (namaweb) — كل المنطق مركزياً.
- `ACCOUNTING_POSTING_ENABLED` افتراضياً **OFF** ⇒ `isEnabled()=false` بلا متغيّر ⇒ **الإنتاج بلا أي تغيير سلوك**.
- هوكات flag-guarded صغيرة في: إصدار الفاتورة، الدفع، الإلغاء (server.js). الكود على فرع `feature/accounting-posting-wiring-staging` في namaweb — **لا يمسّ master ولا مؤشّر gitlink** ⇒ نشر الإنتاج غير متأثّر.

## Gate 7 + 8 — الاختبارات والتحقق على staging
| البند | النتيجة |
|---|---|
| فحص بناء (node --check) للخدمة + server.js | ✅ OK |
| flag افتراضي OFF | ✅ `isEnabled()=false` بلا متغيّر |
| اختبارات المحرك النقية | ✅ **28/28** |
| تحقّق التكامل على staging (`staging_posting_validation.js`) | ✅ **18/18** |
أثبتت سيناريوهات staging: قيد متوازن (115=115)، 3 أسطر، tenant_id=1، **idempotency** (إعادة الترحيل قيد واحد فقط)، سند قبض (50=50)، فاتورة تأمين (Dr 1110)، **قيد عكسي للإلغاء** (متوازن + ذمم تصبح دائنة)، **fail-safe**: mapping مفقود/مستأجر غير صالح/قيد غير متوازن كلها مرفوضة. **كل السيناريوهات داخل معاملات ROLLBACK ⇒ staging journals = 0 (لا بيانات اصطناعية متبقية).**

## السلامة والامتثال
لا قيود إنتاج · لا تشغيل على فواتير الإنتاج · لا نشر · لا تغيير متغيّرات إنتاج · flag افتراضي OFF · الكود على فرع ميزة منفصل (لا master/gitlink) · `.gitmodules`/`df893ab` لم يُمسّا · لا force push · UTF-8 نظيف.

## الحالة
```text
FINAL_STATUS: INVOICE_POSTING_ENGINE_STAGING_WIRING_PASS_PRODUCTION_PENDING_APPROVAL
STAGING_TESTS: 18/18 | ENGINE_UNITS: 28/28
PROD_POSTING_ENABLED: NO (flag default OFF) | DEPLOYED: NO | PROD_JOURNALS_WRITTEN: NO | FORCE_PUSH: NO
CODE_LOCATION: namaweb branch feature/accounting-posting-wiring-staging (NOT master, NOT gitlink)
DEFERRED_EVENTS: refund route, insurance claim recognition/submission/settlement, discount, write-off
NEXT_REQUIRED_ACTION: PRODUCTION_WIRING_APPROVAL (see runbook)
```
