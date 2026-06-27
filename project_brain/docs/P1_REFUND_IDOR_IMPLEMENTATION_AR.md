# P1 — تنفيذ إصلاح Refund IDOR (Implementation)

> المرحلة: `P1_REFUND_IDOR_TENANT_GUARD_CODE_FIX` — البوابة 2 | التاريخ: 2026-06-21 | **code-only** (`namaweb/server.js`).

## التغيير
مسار `POST /api/invoices/:id/refund`:
1. أُضيف `requireTenantScope` إلى سلسلة الـ middleware ⇒ في الإنتاج، طلب بلا سياق مستأجر يُرفَض **403** قبل المُعالِج.
2. قراءة الفاتورة أصبحت **tenant-scoped**: `WHERE id=$1 AND tenant_id=$2` بمعاملات `[req.params.id, tenantId]` ⇒ فاتورة مستأجر آخر لا تُطابِق ⇒ **404** دون كشف الوجود.
3. `pctx.tenantId` صار `tenantId` المُتحقَّق (بدل الاشتقاق من الفاتورة).

### قبل
```js
app.post('/api/invoices/:id/refund', requireAuth, requireRole('invoices', 'accounts'), async (req, res) => {
    const invoice = (await pool.query('SELECT * FROM invoices WHERE id=$1', [req.params.id])).rows[0];
    ...
    const { tenantId } = getRequestTenantContext(req);
    const pctx = { tenantId: invoice.tenant_id || tenantId, ... };
```
### بعد
```js
app.post('/api/invoices/:id/refund', requireAuth, requireRole('invoices', 'accounts'), requireTenantScope, async (req, res) => {
    const { tenantId } = getRequestTenantContext(req);
    const invoice = (await pool.query('SELECT * FROM invoices WHERE id=$1 AND tenant_id=$2', [req.params.id, tenantId])).rows[0];
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    ...
    const pctx = { tenantId, ... };
```

## مبادئ الإصلاح المُحقَّقة
- **لا اعتماد على RLS** (التطبيق superuser يتجاوزها) — التحقّق في SQL صراحةً.
- **لا اعتماد على id فقط**؛ لا اعتماد على الواجهة.
- خطأ موحّد **404** (لا يكشف وجود فاتورة مستأجر آخر)؛ و**403** للسياق المفقود (fail-closed).
- `ACCOUNTING_POSTING_ENABLED` يبقى OFF؛ لا journal جديد؛ لا تغيير على `runEventWithPosting`/`postRefund`.

## أثر جانبي مقصود
الإصلاح أصرم من مسارَي pay/cancel (اللذين يسمحان بالسياق المفقود). **توصية متابعة** (خارج النطاق): تطبيق `requireTenantScope` نفسه على `pay`/`partial-pay`/`cancel`/`generate`.

## التحقق
`node --check server.js` = OK. لا تغيير DDL/بيانات/RLS/flag.

```text
GATE2_STATUS: CODE_FIX_APPLIED
FILES: namaweb/server.js (refund route) + namaweb/cross_tenant_refund_idor_test.js (test)
NEXT: GATE3_TESTS
```

`REFUND_IDOR_IMPLEMENTATION_COMPLETE`
