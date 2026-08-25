const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeOrdersRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.post('/api/orders', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { patient_id, type, description, quantity, status, notes, urgency } = req.body;
        if (!patient_id || !type || !description) return res.status(400).json({ error: 'patient_id, type, description required' });
        const doctorId = req.session.user?.id;
        const doctorName = req.session.user?.display_name || req.session.user?.username || '';

        // Route to appropriate table based on type
        if (type === 'lab' || type === 'radiology') {
            const isRad = type === 'radiology' ? 1 : 0;
            const result = await pool.query(
                `INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, is_radiology, status, notes, urgency, tenant_id, created_at)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP) RETURNING *`,
                [patient_id, doctorId, type, description, isRad, urgency === 'STAT' ? 'STAT' : (status || 'Pending'), notes || '', urgency || 'Routine', tenantId]
            );
            return res.status(201).json(result.rows[0]);
        }

        if (type === 'medication') {
            // Store in prescriptions table
            const result = await pool.query(
                `INSERT INTO prescriptions (patient_id, drug_name, quantity, notes, status, doctor_name, tenant_id, created_at)
                 VALUES ($1,$2,$3,$4,'Pending',$5,$6,CURRENT_TIMESTAMP) RETURNING *`,
                [patient_id, description, quantity || 1, notes || '', doctorName, tenantId]
            );
            return res.status(201).json(result.rows[0]);
        }

        // For nursing, diet, iv, procedure, referral, discharge — store in medical_records notes with type prefix
        const result = await pool.query(
            `INSERT INTO medical_records (patient_id, diagnosis, treatment, notes, doctor_name, tenant_id, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING *`,
            [patient_id, `[${type.toUpperCase()}] ${description}`, status || 'Pending', notes || '', doctorName, tenantId]
        );
        res.status(201).json(result.rows[0]);
    } catch (e) {
        console.error('[DS] Error creating order:', e);
        res.status(500).json({ error: 'Server error', detail: e.message });
    }
});
router.get('/api/orders/pending-payment', requireAuth, async (req, res) => {
    try {
        // --- TENANT SCOPE: filter pending orders by current tenant_id ---
        const { tenantId } = getRequestTenantContext(req);
        const tenantFilter = tenantId ? ' AND o.tenant_id=$1' : '';
        const queryParams = tenantId ? [tenantId] : [];
        const rows = (await pool.query(`SELECT o.*, p.name_ar as patient_name, p.name_en, p.file_number, p.phone, p.nationality
            FROM lab_radiology_orders o LEFT JOIN patients p ON o.patient_id = p.id
            WHERE o.approval_status = 'Pending Approval'${tenantFilter}
            ORDER BY o.id DESC`, queryParams)).rows;
        res.json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/api/orders/:id/approve-payment', requireAuth, async (req, res) => {
    try {
        const { payment_method, price } = req.body;
        // --- TENANT SCOPE: verify order belongs to current tenant before approve (IDOR prevention) ---
        const { tenantId, facilityId } = getRequestTenantContext(req);
        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
        const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];
        const orderPre = (await pool.query(`SELECT id FROM lab_radiology_orders WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];
        if (!orderPre) return res.status(404).json({ error: 'Order not found' });
        // Update order status
        await pool.query(
            `UPDATE lab_radiology_orders SET status='Requested', approval_status='Paid', approved_by=$1, price=$2 WHERE id=$3`,
            [req.session.user?.display_name || 'Reception', price || 0, req.params.id]
        );
        // Get order details for invoice
        const order = (await pool.query(`SELECT o.*, p.name_ar, p.name_en, p.nationality
            FROM lab_radiology_orders o LEFT JOIN patients p ON o.patient_id = p.id WHERE o.id=$1`, [req.params.id])).rows[0];
        if (order && price > 0) {
            // Calculate VAT for non-Saudi patients
            const vat = await calcVAT(order.patient_id);
            const { total: finalTotal, vatAmount } = addVAT(price, vat.rate);
            const serviceType = order.is_radiology ? 'Radiology' : 'Laboratory';
            const desc = `${serviceType}: ${order.order_type}`;
            await pool.query(
                `INSERT INTO invoices (patient_id, patient_name, total, amount, vat_amount, description, service_type, paid, payment_method, order_id, tenant_id, facility_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8, $9, $10, $11)`,
                [order.patient_id, order.name_ar || order.name_en || '', finalTotal, price, vatAmount, desc, serviceType, payment_method || 'Cash', order.id, tenantId || null, facilityId || null]
            );
        }
        logAudit(req.session.user?.id, req.session.user?.display_name, 'APPROVE_ORDER_PAYMENT', 'Lab/Radiology',
            `Approved payment for order #${req.params.id} amount:${price}`, req.ip);
        res.json({ success: true, order });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
