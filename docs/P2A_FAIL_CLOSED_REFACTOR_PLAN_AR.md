# P2A — خطة إعادة هيكلة fail-closed لمسار الفاتورة

> **خطة فقط — لا تنفيذ إنتاج.** الهدف: تحويل ترحيل الفاتورة من pending-posting إلى fail-closed صارم قبل go-live.

## الوضع الحالي (مصنَّف)
- مسارات `POST /api/invoices`, `/generate`, `PUT /:id/pay`, `cancel/:id` تستخدم `pool.query` (**autocommit**).
- توصيل P2: الترحيل يحدث **بعد** حفظ الفاتورة، في معاملة منفصلة، غير حاجب (try/catch + سجل "deferred").
- التصنيف: **pending-posting / partial-risk** — قد تُحفظ فاتورة بلا قيد إن فشل الترحيل (لا outbox دائم بعد).

## الهدف (Option A — معتمد)
حفظ حدث العمل + الترحيل في **معاملة واحدة**: كلاهما يُثبَّت أو يُدحرَج. idempotency يبقى آمناً عبر SAVEPOINT (مُطبَّق). أُثبت النمط على staging (3/3).

## التغييرات المطلوبة (لكل مسار مدعوم)
1. استبدال `pool.query(...)` المتسلسلة بـ `client = await pool.connect(); BEGIN; ... COMMIT/ROLLBACK`.
2. ضبط `app.tenant_id` على العميل (للـ RLS) — عبر `postingService` أو `withTenantTransaction`.
3. تنفيذ INSERT/UPDATE حدث العمل ثم استدعاء `postingService.postInvoiceIssued/Payment/Reversal(client, ...)` **بنفس العميل**.
4. عند خطأ الترحيل ⇒ ROLLBACK ⇒ يُرفَض الطلب (4xx/5xx) دون حفظ جزئي.
5. الإبقاء على الحارس `if (postingService.isEnabled())` بحيث يبقى السلوك الإنتاجي OFF حتى go-live.

## مثال نمطي (مُثبَت على staging)
```js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query("SELECT set_config('app.tenant_id',$1,true)", [String(tenantId)]);
  const inv = (await client.query('INSERT INTO invoices (...) VALUES (...) RETURNING *', [...])).rows[0];
  if (postingService.isEnabled()) await postingService.postInvoiceIssued(client, inv, ctx, { insurance });
  await client.query('COMMIT');
  res.json(inv);
} catch (e) { await client.query('ROLLBACK'); res.status(500).json({ error: 'posting_failed' }); }
finally { client.release(); }
```

## النطاق والمخاطر
- ملفات: `namaweb/server.js` (4 مسارات). مخاطرة: تعديل مسارات إنتاجية ⇒ يتطلب مراجعة كود + بروفة staging كاملة + اختبار تكامل قبل أي نشر.
- خطوة آمنة: التنفيذ على فرع الميزة + بروفة staging، والنشر بـ flag OFF أولاً، ثم تفعيل محكوم.

## البديل (Option B — غير مختار الآن)
pending-posting **مع** بنية outbox دائمة (جدول pending_postings) + عامل إعادة محاولة + لوحة تسوية + تنبيهات. أثقل؛ يُعاد النظر فيه فقط إن تعذّر fail-closed الذرّي لأسباب أداء.

## التتابع المقترح
1. (هذه المرحلة) خطة + إثبات نمط على staging ✅.
2. تنفيذ Option A على فرع الميزة + اختبارات + بروفة staging.
3. مراجعة كود/PR.
4. نشر code-only (flag OFF).
5. تفعيل محكوم بعد موافقة go-live منفصلة.

## الحالة
```text
FAIL_CLOSED_PATTERN: PROVEN (staging 3/3)
ROUTE_REFACTOR: REQUIRED (not done — production routes untouched)
NEXT: APPROVE_FAIL_CLOSED_REFACTOR (feature branch + staging rehearsal)
```
