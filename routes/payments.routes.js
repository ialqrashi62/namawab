const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePaymentsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, idempotencyGuard, paymentAdapter }) {
    const router = express.Router();
router.post('/api/payments/moyasar/initiate', requireAuth, requireRole('invoices', 'accounts'), idempotencyGuard, async (req, res) => {

    try {

        const { invoiceId } = req.body;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [invoiceId, tenantId] : [invoiceId];

        

        const inv = (await pool.query(`SELECT * FROM invoices WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];

        if (!inv) return res.status(404).json({ error: 'Invoice not found' });

        if (inv.paid) return res.status(400).json({ error: 'Invoice already paid' });

        

        const paymentInit = await paymentAdapter.initiatePayment({

            invoiceId: inv.id,

            amount: inv.total,

            description: inv.description || `Invoice #${inv.invoice_number || inv.id}`,

            source: { type: 'creditcard' }

        });

        

        // Save the payment ID as the gateway reference

        await pool.query('UPDATE invoices SET payment_gateway_ref = $1 WHERE id = $2', [paymentInit.id, inv.id]);

        

        res.json(paymentInit);

    } catch (e) {

        console.error('[Moyasar Initiate Error]', e);

        res.status(500).json({ error: 'Failed to initiate payment' });

    }

});

router.get('/api/payments/moyasar/callback', async (req, res) => {

    try {

        const paymentId = req.query.id || req.query.payment_id;

        if (!paymentId) return res.status(400).send('Missing payment ID');

        

        const result = await paymentAdapter.verifyAndProcessPayment(paymentId);

        

        if (result.success) {

            res.send(`

                <html>

                <head>

                    <meta charset="UTF-8">

                    <title>تم الدفع بنجاح</title>

                </head>

                <body style="font-family:sans-serif;text-align:center;padding:50px;background:#f3f4f6;direction:rtl;">

                    <div style="background:#fff;padding:40px;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);display:inline-block;max-width:400px;">

                        <h2 style="color:#10b981;margin-bottom:10px;">✅ تم الدفع بنجاح!</h2>

                        <p style="color:#4b5563;margin-bottom:20px;">تم سداد الفاتورة بنجاح عبر بوابة ميسر الآمنة.</p>

                        <button onclick="window.close(); if(window.opener){window.opener.location.reload();}" style="background:#3b82f6;color:#fff;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:14px;">إغلاق النافذة</button>

                    </div>

                </body>

                </html>

            `);

        } else {

            res.status(400).send(`Payment verification failed: ${result.error || 'Unknown error'}`);

        }

    } catch (e) {

        console.error('[Moyasar Callback Error]', e);

        res.status(500).send('Server error processing payment callback');

    }

});

router.get('/api/payments/moyasar/verify', requireAuth, async (req, res) => {

    try {

        const paymentId = req.query.id || req.query.payment_id;

        if (!paymentId) return res.status(400).json({ error: 'Missing payment ID' });

        

        const result = await paymentAdapter.verifyAndProcessPayment(paymentId);

        res.json(result);

    } catch (e) {

        console.error('[Moyasar Verify Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
