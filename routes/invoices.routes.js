const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeInvoicesRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, sendBillingError, crypto, fe, idempotencyGuard, requirePermission }) {
    const router = express.Router();
router.get('/api/invoices', requireAuth, requireRole('invoices', 'accounts'), async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        let rows;

        if (tenantId) {

            rows = (await pool.query('SELECT * FROM invoices WHERE tenant_id = $1 ORDER BY id DESC', [tenantId])).rows;

        } else {

            rows = (await pool.query('SELECT * FROM invoices ORDER BY id DESC')).rows;

        }

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/invoices', requireAuth, requireRole('invoices', 'accounts'), validateBody(RS.invoiceCreate), async (req, res) => {

    try {

        const { patient_id, patient_name, description, service_type, payment_method, discount_reason } = req.body;

        // --- C-2: money is validated & recomputed server-side; client total/discount are NOT trusted as opaque values ---

        const netTotal = parseMoney(req.body.total, { field: 'total' });          // net (post-discount) amount

        const discountAmt = parseMoney(req.body.discount, { field: 'discount' });  // absolute SAR discount

        const grossAmount = Math.round((netTotal + discountAmt) * 100) / 100;      // server-derived original amount

        // --- C-3: enforce per-role discount cap (throws 403 when exceeded) ---

        enforceDiscountCap(req.session.user?.role, discountAmt, grossAmount);

        // --- C-2: server-authoritative VAT (net treated as VAT-inclusive per KSA retail); client vat never trusted ---

        const vatInfo = fe.vatFromInclusive(netTotal);

        const vatAmount = vatInfo ? parseFloat(vatInfo.vat_amount) : 0;

        // Generate sequential invoice number

        const maxInv = (await pool.query("SELECT invoice_number FROM invoices WHERE invoice_number LIKE 'INV-%' ORDER BY id DESC LIMIT 1")).rows[0];

        let nextNum = 1;

        if (maxInv && maxInv.invoice_number) { const parts = maxInv.invoice_number.split('-'); nextNum = parseInt(parts[2]) + 1; }

        const invNumber = 'INV-' + new Date().getFullYear() + '-' + String(nextNum).padStart(5, '0');

        const createdBy = req.session.user?.display_name || '';

        // --- TENANT SCOPE: stamp tenant_id & facility_id from session (never from body) ---

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const result = await pool.query(

            'INSERT INTO invoices (patient_id, patient_name, total, description, service_type, payment_method, discount, discount_reason, invoice_number, created_by, original_amount, vat_amount, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id',

            [patient_id || null, patient_name, netTotal, description || '', service_type || '', payment_method || '', discountAmt, discount_reason || '', invNumber, createdBy, grossAmount, vatAmount, tenantId || null, facilityId || null]);

        logAudit(req.session.user?.id, createdBy, 'CREATE_INVOICE', 'Finance', invNumber + ' - ' + netTotal + ' SAR (VAT ' + vatAmount + ') for ' + patient_name, req.ip);

        if (discountAmt > 0) {

            logAudit(req.session.user?.id, createdBy, 'INVOICE_DISCOUNT', 'Finance',

                `${invNumber}: discount ${discountAmt} SAR (${((discountAmt / grossAmount) * 100).toFixed(1)}%) reason: ${String(discount_reason || '').slice(0, 120)}`, req.ip);

        }

        res.json((await pool.query('SELECT * FROM invoices WHERE id=$1', [result.rows[0].id])).rows[0]);

    } catch (e) { sendBillingError(res, e); }

});

router.post('/api/invoices/generate', requireAuth, requireRole('invoices', 'accounts'), idempotencyGuard, async (req, res) => {

    try {

        const { patient_id, items } = req.body;

        // --- TENANT SCOPE: verify patient belongs to current tenant ---

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const patientCheck = tenantId ? 'WHERE id=$1 AND tenant_id=$2' : 'WHERE id=$1';

        const patientParams = tenantId ? [patient_id, tenantId] : [patient_id];

        const p = (await pool.query(`SELECT * FROM patients ${patientCheck}`, patientParams)).rows[0];

        if (!p) return res.status(404).json({ error: 'Patient not found' });

        // --- C-2: validate each line item & recompute the total SERVER-SIDE (never trust a client-supplied total) ---

        if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'At least one line item is required' });

        let total = 0;

        for (let i = 0; i < items.length; i++) {

            const it = items[i] || {};

            const lineAmount = parseMoney(it.amount, { field: `items[${i}].amount`, allowZero: false });

            if (it.quantity !== undefined) {

                const qty = Number(it.quantity);

                if (!Number.isInteger(qty) || qty <= 0) { const e = new Error(`Invalid items[${i}].quantity: must be a positive integer`); e.statusCode = 400; throw e; }

            }

            total += lineAmount;

        }

        total = Math.round(total * 100) / 100;

        // --- C-2: server-authoritative VAT (line totals treated as VAT-inclusive) ---

        const vatInfo = fe.vatFromInclusive(total);

        const vatAmount = vatInfo ? parseFloat(vatInfo.vat_amount) : 0;

        const description = items.map(i => String(i.description || '')).join(' | ');

        const invNumber = 'INV-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-5);



        // ZATCA Phase 2 Hashing & Chaining

        const crypto = require('crypto');

        const prevInv = (await pool.query(

            'SELECT invoice_hash FROM invoices WHERE tenant_id = $1 ORDER BY id DESC LIMIT 1',

            [tenantId || null]

        )).rows[0];

        const prevHash = prevInv && prevInv.invoice_hash ? prevInv.invoice_hash : '0000000000000000000000000000000000000000000000000000000000000000';

        const invoiceString = `${invNumber}|${total}|${vatAmount}|${prevHash}`;

        const currentHash = crypto.createHash('sha256').update(invoiceString).digest('hex');



        const result = await pool.query('INSERT INTO invoices (patient_id, patient_name, total, description, service_type, invoice_number, vat_amount, original_amount, tenant_id, facility_id, invoice_hash, previous_invoice_hash) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id',

            [patient_id, p.name_en || p.name_ar, total, description, 'Medical Services', invNumber, vatAmount, total, tenantId || null, facilityId || null, currentHash, prevHash]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'GENERATE_INVOICE', 'Finance',

            `Generated ${invNumber} for patient ${p.name_en || p.name_ar} total: ${total} (VAT ${vatAmount})`, req.ip);

        res.json((await pool.query('SELECT * FROM invoices WHERE id=$1', [result.rows[0].id])).rows[0]);

    } catch (e) { sendBillingError(res, e); }

});

router.put('/api/invoices/:id/pay', requireAuth, requireRole('invoices', 'accounts'), idempotencyGuard, async (req, res) => {

    try {

        const { payment_method } = req.body;

        // --- TENANT SCOPE: verify invoice belongs to current tenant before paying (IDOR prevention) ---

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const inv = (await pool.query(`SELECT * FROM invoices WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];

        if (!inv) return res.status(404).json({ error: 'Invoice not found' });

        if (inv.paid) return res.status(400).json({ error: 'Invoice already paid' });

        await pool.query('UPDATE invoices SET paid=1, payment_method=$1 WHERE id=$2', [payment_method || 'Cash', req.params.id]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'PAY_INVOICE', 'Finance',

            `Invoice ${inv.invoice_number} paid (${inv.total} SAR) via ${payment_method || 'Cash'}`, req.ip);

        res.json((await pool.query('SELECT * FROM invoices WHERE id=$1', [req.params.id])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/invoices/cancel/:id', requireAuth, requireRole('invoices', 'accounts'), requireTenantScope, requirePermission('invoices:cancel'), idempotencyGuard, async (req, res) => {

    try {

        const { reason } = req.body;

        // --- TENANT SCOPE: verify invoice belongs to current tenant before cancel (IDOR prevention) ---

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const inv = (await pool.query(`SELECT * FROM invoices WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];

        if (!inv) return res.status(404).json({ error: 'Invoice not found' });

        if (inv.cancelled) return res.status(400).json({ error: 'Already cancelled' });

        await pool.query('UPDATE invoices SET cancelled=1, cancel_reason=$1, cancelled_by=$2, cancelled_at=NOW() WHERE id=$3',

            [reason || '', req.session.user?.display_name || '', req.params.id]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CANCEL_INVOICE', 'Finance', 'Cancelled ' + inv.invoice_number + ' (' + inv.total + ' SAR)', req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/invoices/:id/partial-pay', requireAuth, requireRole('invoices', 'accounts'), requireTenantScope, idempotencyGuard, async (req, res) => {

    const client = await pool.connect();

    try {

        const { amount_paid, payment_method } = req.body;

        const { tenantId } = getRequestTenantContext(req);

        await client.query('BEGIN');

        if (tenantId) await client.query("SELECT set_config('app.tenant_id', $1, true)", [String(tenantId)]);

        // tenant-scoped lock on the invoice row (prevents TOCTOU double-pay races)

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const lockParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const invoice = (await client.query(`SELECT * FROM invoices WHERE id=$1${tenantCheck} FOR UPDATE`, lockParams)).rows[0];

        if (!invoice) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Invoice not found' }); }

        // outstanding is SERVER-COMPUTED (never trusts a client total/outstanding); amount is validated + capped

        const totalMinor = toMinorUnits(invoice.total);

        const prevPaidMinor = toMinorUnits(invoice.amount_paid || 0);

        const outstandingMinor = totalMinor - prevPaidMinor;

        const payMinor = parsePositiveMoneyToMinorUnits(amount_paid, { field: 'amount_paid' });

        assertAmountWithinCap(payMinor, outstandingMinor, 'payment');   // rejects NaN/neg/zero/over-outstanding

        const newPaidMinor = prevPaidMinor + payMinor;

        const balanceMinor = Math.max(0, totalMinor - newPaidMinor);

        const isPaid = (totalMinor - newPaidMinor) <= 0 ? 1 : 0;

        const updParams = tenantId

            ? [newPaidMinor / 100, balanceMinor / 100, isPaid, payment_method || invoice.payment_method, req.params.id, tenantId]

            : [newPaidMinor / 100, balanceMinor / 100, isPaid, payment_method || invoice.payment_method, req.params.id];

        await client.query(

            `UPDATE invoices SET amount_paid=$1, balance_due=$2, paid=$3, payment_method=$4 WHERE id=$5${tenantId ? ' AND tenant_id=$6' : ''}`,

            updParams);

        await client.query('COMMIT');

        logAudit(req.session.user?.id, req.session.user?.display_name, 'PARTIAL_PAYMENT', 'Invoice',

            invoice.invoice_number + ' paid ' + (payMinor / 100) + ' (total paid: ' + (newPaidMinor / 100) + '/' + (totalMinor / 100) + ')', req.ip);

        res.json({ success: true, amount_paid: newPaidMinor / 100, balance_due: balanceMinor / 100, fully_paid: isPaid });

    } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} sendBillingError(res, e); }

    finally { client.release(); }

});

router.post('/api/invoices/:id/refund', requireAuth, requireRole('invoices', 'accounts'), requireTenantScope, validateBody(RS.invoiceRefund), idempotencyGuard, async (req, res) => {

    const client = await pool.connect();

    try {

        const { amount, reason } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        await client.query('BEGIN');

        if (tenantId) await client.query("SELECT set_config('app.tenant_id', $1, true)", [String(tenantId)]);

        // IDOR fix: load+lock the ORIGINAL invoice scoped to the current tenant (never by bare id)

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const lockParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const invoice = (await client.query(`SELECT * FROM invoices WHERE id=$1${tenantCheck} FOR UPDATE`, lockParams)).rows[0];

        if (!invoice) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Invoice not found' }); }

        // refundable computed SERVER-SIDE: amount actually paid minus prior refunds for this invoice (tenant-scoped)

        const paidMinor = toMinorUnits(invoice.amount_paid || 0);

        const refRow = await client.query(

            `SELECT COALESCE(SUM(-total),0) AS refunded FROM invoices WHERE service_type='Refund' AND description LIKE $1${tenantId ? ' AND tenant_id=$2' : ''}`,

            tenantId ? ['Refund for ' + invoice.invoice_number + ':%', tenantId] : ['Refund for ' + invoice.invoice_number + ':%']);

        const alreadyRefundedMinor = toMinorUnits(refRow.rows[0].refunded || 0);

        const refundableMinor = paidMinor - alreadyRefundedMinor;

        const refundMinor = parsePositiveMoneyToMinorUnits(amount, { field: 'refund amount' });

        assertAmountWithinCap(refundMinor, refundableMinor, 'refund'); // rejects NaN/neg/zero/over-refundable/already-fully-refunded

        const refundNum = 'REF-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6);

        // stamp tenant_id & facility_id on the refund row (was previously unscoped)

        await client.query(

            "INSERT INTO invoices (patient_id, patient_name, total, description, service_type, payment_method, invoice_number, created_by, discount_reason, tenant_id, facility_id) VALUES ($1,$2,$3,$4,'Refund',$5,$6,$7,$8,$9,$10)",

            [invoice.patient_id, invoice.patient_name, -(refundMinor / 100), 'Refund for ' + invoice.invoice_number + ': ' + String(reason || ''), invoice.payment_method, refundNum, req.session.user?.display_name || '', String(reason || ''), tenantId || null, facilityId || null]);

        await client.query('COMMIT');

        logAudit(req.session.user?.id, req.session.user?.display_name, 'REFUND', 'Invoice', refundNum + ' amount: ' + (refundMinor / 100) + ' reason: ' + String(reason || '').slice(0, 120), req.ip);

        res.json({ success: true, refund_number: refundNum, refunded: refundMinor / 100, refundable_remaining: (refundableMinor - refundMinor) / 100 });

    } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} sendBillingError(res, e); }

    finally { client.release(); }

});


    return router;
}
