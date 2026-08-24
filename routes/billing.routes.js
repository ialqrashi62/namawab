const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeBillingRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, assignTenantPlanHelper }) {
    const router = express.Router();
router.get('/api/billing/summary/:patient_id', requireAuth, requireRole('invoices', 'accounts'), async (req, res) => {

    try {

        const pid = req.params.patient_id;

        const invoices = (await pool.query('SELECT * FROM invoices WHERE patient_id=$1 ORDER BY id DESC', [pid])).rows;

        const byType = {};

        invoices.forEach(inv => {

            const t = inv.service_type || 'Other';

            if (!byType[t]) byType[t] = { count: 0, total: 0, paid: 0 };

            byType[t].count++;

            byType[t].total += parseFloat(inv.total) || 0;

            if (inv.paid) byType[t].paid += parseFloat(inv.total) || 0;

        });

        const totalBilled = invoices.reduce((s, i) => s + (parseFloat(i.total) || 0), 0);

        const totalPaid = invoices.filter(i => i.paid).reduce((s, i) => s + (parseFloat(i.total) || 0), 0);

        res.json({ invoices, byType, totalBilled, totalPaid, balance: totalBilled - totalPaid });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/billing/webhooks/moyasar', async (req, res) => {

    try {

        const payload = req.body;

        // Verify payment is paid or captured

        if (payload.status === 'paid' || payload.status === 'captured') {

            const tenantId = payload.metadata?.tenant_id || req.query.tenant_id;

            const planKey = payload.metadata?.plan_key || req.query.plan_key;



            if (!tenantId || !planKey) {

                return res.status(400).json({ error: 'Missing tenant_id or plan_key' });

            }



            await assignTenantPlanHelper(parseInt(tenantId), planKey, 'manual');

            logAudit(null, 'Moyasar Webhook', 'WEBHOOK_PAYMENT_SUCCESS', 'Billing', `Tenant ${tenantId} assigned to plan ${planKey} via Moyasar`, req.ip);

            return res.json({ success: true, processed: true });

        }

        res.json({ success: true, processed: false, reason: 'Status not captured/paid' });

    } catch (e) {

        console.error('[Moyasar Webhook Error]', e.message);

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/billing/webhooks/stripe', async (req, res) => {

    try {

        const payload = req.body;

        const type = payload.type;



        // Stripe events can be checkout.session.completed or invoice.payment_succeeded

        if (type === 'checkout.session.completed' || type === 'invoice.payment_succeeded') {

            const session = payload.data?.object || {};

            const tenantId = session.metadata?.tenant_id || req.query.tenant_id;

            const planKey = session.metadata?.plan_key || req.query.plan_key;



            if (!tenantId || !planKey) {

                return res.status(400).json({ error: 'Missing tenant_id or plan_key' });

            }



            await assignTenantPlanHelper(parseInt(tenantId), planKey, 'manual');

            logAudit(null, 'Stripe Webhook', 'WEBHOOK_PAYMENT_SUCCESS', 'Billing', `Tenant ${tenantId} assigned to plan ${planKey} via Stripe`, req.ip);

            return res.json({ success: true, processed: true });

        }

        res.json({ success: true, processed: false, reason: `Ignored event type: ${type}` });

    } catch (e) {

        console.error('[Stripe Webhook Error]', e.message);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
