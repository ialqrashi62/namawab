# WS6 — دليل تشغيل الإنتاج لإعادة هيكلة fail-closed (Runbook)

> **تخطيط فقط — لا نشر، لا تفعيل posting، لا go-live.** يتطلب موافقة go-live منفصلة (WS8).

## ما تغيّر (على فرع الميزة فقط)
- `namaweb/accounting_posting_service.js`: + `runEventWithPosting(pool, ctx, doEvent, doPost)` (fail-closed atomic).
- `namaweb/server.js`: المسارات الثلاثة (issue/pay/cancel) تستخدم النمط الذرّي؛ العلم OFF افتراضياً.
- `namaweb/staging_failclosed_test.js`: اختبارات (10/10).

## خصائص الأمان
- حدث العمل + الترحيل في معاملة واحدة ⇒ لا فاتورة جزئية، لا قيد يتيم.
- العلم OFF ⇒ سلوك إنتاج بلا تغيير (حدث فقط، لا ترحيل).
- idempotency عبر SAVEPOINT + uq_journal_idempotency.
- سياق المستأجر مربوط داخل المعاملة (RLS-safe).

## خطوات النشر (عند موافقة go-live فقط — WS8)
```bash
# 1) مراجعة كود/PR لفرع feature/accounting-posting-wiring-staging
# 2) دمج إلى namaweb master ثم تحديث مؤشّر gitlink الأب (بلا force)
# 3) نشر code-only مع ACCOUNTING_POSTING_ENABLED=false  => لا تغيير سلوك، تأكيد سلامة النشر
# 4) (WS8) تفعيل محكوم: ACCOUNTING_POSTING_ENABLED=true لسيناريو أول واحد، مراقبة، ثم تدرّج
```

## التحقق بعد النشر (code-only، flag OFF)
- التطبيق يقلع (`[REDIS SUCCESS]`)، health 200، جلسات DB = nama_medical_app.
- إنشاء فاتورة (flag OFF) ⇒ فاتورة بلا قيد (سلوك غير متغيّر). journals تبقى 0.

## الاسترجاع
- **العلم**: `ACCOUNTING_POSTING_ENABLED=false` + `pm2 restart nama-app` ⇒ يوقف الترحيل فوراً.
- **الكود**: إعادة gitlink/الفرع إلى e6608ba (بلا force) ⇒ يعيد السلوك السابق.
- لا حذف بيانات.

## شروط التوقف
أي فاتورة جزئية، قيد يتيم، عدم توازن، تكرار، تسريب مستأجر ⇒ تعطيل العلم فوراً + فحص.

## الحالة
```text
FAIL_CLOSED_CODE: READY on feature branch (staging-proven 10/10) | DEPLOYED: NO | POSTING: OFF
NEXT: code review/PR → merge → code-only deploy (flag OFF) → WS8 controlled go-live (separate approval)
```
