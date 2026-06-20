# P2 — دليل تشغيل توصيل محرك الترحيل في الإنتاج (Runbook)

> **تخطيط فقط — لا تنفيذ ولا نشر.** التنفيذ يتطلب موافقة صريحة منفصلة.
> مبني على نجاح بروفة staging (18/18) — [التقرير](P2_INVOICE_POSTING_ENGINE_WIRING_STAGING_REPORT_AR.md).

## الملفات المتغيّرة (على فرع namaweb `feature/accounting-posting-wiring-staging`)
- `accounting_posting_service.js` (جديد) — طبقة الترحيل المعاملاتية idempotent الوعية بالمستأجر.
- `server.js` — 3 هوكات flag-guarded (إصدار/دفع/إلغاء الفاتورة) + require الخدمة.
- (اختبار) `staging_posting_validation.js` — تحقّق staging.

## الأعلام / متغيّرات البيئة
- `ACCOUNTING_POSTING_ENABLED` — **OFF افتراضياً**. الإنتاج يبقى OFF حتى موافقة go-live منفصلة.

## متطلبات الترحيل (DB)
- لا DDL جديد مطلوب: أساس المحاسبة مُرحَّل ومثبَّت في الإنتاج (P1: numeric، CoA 30، mapping 23، idempotency/FK/CHECK). تحقّق سريع: `SELECT count(*) FROM finance_chart_of_accounts;` = 30، `finance_posting_account_map` = 23.

## خطوات النشر للإنتاج (عند الاعتماد فقط)
1. دمج فرع الميزة إلى namaweb master عبر مراجعة كود/PR (ثم تحديث مؤشّر gitlink الأب — بلا force).
2. النشر مع `ACCOUNTING_POSTING_ENABLED=false` أولاً (لا تغيير سلوك) للتأكد من سلامة النشر.
3. **اختبار فاتورة إنتاج محكوم أولاً**: تفعيل العلم لطلب واحد محكوم/نافذة محدودة، إصدار فاتورة اختبارية واحدة، التحقق من قيد متوازن واحد، ثم تقييم.
4. تفعيل تدريجي بعد التحقق.

## التحقق بعد التفعيل (read-only)
- لكل فاتورة جديدة: قيد واحد، `Σ debit = Σ credit`، tenant_id صحيح، `posting_reference=POST:INVOICE:{id}`.
- لا تكرار عند إعادة الإرسال (idempotency).

## خطة الاسترجاع (Rollback)
- **تعطيل فوري**: `ACCOUNTING_POSTING_ENABLED=false` (يوقف الترحيل فوراً دون مسّ البيانات).
- لا حاجة لحذف قيود إن كانت صحيحة؛ التصحيح المحاسبي بقيد عكسي (`postInvoiceReversal`)، لا حذف.
- استرجاع DB (إن لزم) = backup restore (مسار P1 المعتمد)، لا `down.sql`.

## المراقبة
- عدّ القيود اليومي مقابل عدد الفواتير الجديدة.
- تنبيه على أي `[accounting] ... posting deferred` في السجلّات (يعني فشل ترحيل — يحتاج فحص/إعادة).
- ميزان مراجعة تجريبي = 0 (Σ مدين = Σ دائن إجمالاً).

## شروط التوقف (Stop Conditions)
- أي قيد غير متوازن، أي ترحيل مزدوج، أي تسريب عبر المستأجرين، أي `MISSING_ACCOUNT_MAPPING` متكرر ⇒ تعطيل العلم فوراً + فحص.

## بنود تصلّب موصى بها قبل go-live
1. **RLS** على جداول finance (مسار P0) قبل التفعيل الإنتاجي.
2. إعادة هيكلة مسار الفاتورة لمعاملة موحّدة (fail-closed صارم) بدل نموذج pending-posting الحالي.
3. توصيل بقية الأحداث المؤجَّلة (استرداد/مطالبات تأمين) ببُناة محرك مخصّصة + بروفة staging.

## الحالة المتوقعة عند التنفيذ المعتمد لاحقاً
```text
PROD_WIRING_DEPLOYED: code-only (flag OFF) ثم تفعيل محكوم
DDL_REQUIRED: NO (الأساس مُرحَّل)
ROLLBACK: flag OFF (فوري) + reversal للتصحيح
NEXT: SEPARATE_GO_LIVE_APPROVAL
```
