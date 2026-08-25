const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeEmarRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/emar/orders', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {
    try {
        const { patient_id } = req.query;
        const { tenantId } = getRequestTenantContext(req);
        if (patient_id) {
            if (tenantId) {
                // Verify patient belongs to tenant
                const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);
                if (patientCheck.rows.length === 0) return res.status(404).json({ error: 'Patient not found' });
            }
            let q = 'SELECT * FROM emar_orders WHERE patient_id=$1';
            let params = [patient_id];
            if (tenantId) {
                q += ' AND tenant_id=$2';
                params.push(tenantId);
            }
            q += ' ORDER BY created_at DESC';
            res.json((await pool.query(q, params)).rows);
        } else {
            let q = 'SELECT * FROM emar_orders WHERE status=$1';
            let params = ['Active'];
            if (tenantId) {
                q += ' AND tenant_id=$2';
                params.push(tenantId);
            }
            q += ' ORDER BY created_at DESC';
            res.json((await pool.query(q, params)).rows);
        }
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/emar/orders', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {
    try {
        const { patient_id, patient_name, medication, dose, route, frequency, start_date } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        if (tenantId) {
            const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);
            if (patientCheck.rows.length === 0) return res.status(404).json({ error: 'Patient not found' });
        }
        const result = await pool.query('INSERT INTO emar_orders (patient_id, patient_name, medication, dose, route, frequency, start_date, prescriber, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
            [patient_id, patient_name || '', medication || '', dose || '', route || 'Oral', frequency || 'TID', start_date || new Date().toISOString().split('T')[0], req.session.user.name, tenantId || null, facilityId || null]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/emar/administrations', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {
    try {
        const { order_id } = req.query;
        const { tenantId } = getRequestTenantContext(req);
        if (order_id) {
            if (tenantId) {
                // Verify order belongs to tenant
                const orderCheck = await pool.query('SELECT id FROM emar_orders WHERE id=$1 AND tenant_id=$2', [order_id, tenantId]);
                if (orderCheck.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
            }
            let q = 'SELECT * FROM emar_administrations WHERE emar_order_id=$1';
            let params = [order_id];
            if (tenantId) {
                q += ' AND tenant_id=$2';
                params.push(tenantId);
            }
            q += ' ORDER BY created_at DESC';
            res.json((await pool.query(q, params)).rows);
        } else {
            let q = 'SELECT * FROM emar_administrations';
            let params = [];
            if (tenantId) {
                q += ' WHERE tenant_id=$1';
                params.push(tenantId);
            }
            q += ' ORDER BY created_at DESC LIMIT 50';
            res.json((await pool.query(q, params)).rows);
        }
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/emar/administrations', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {
    try {
        const { emar_order_id, patient_id, medication, dose, scheduled_time, reason_not_given, notes } = req.body;
        const { tenantId, facilityId } = getRequestTenantContext(req);
        // SECURITY (5-rights): a documented reason is REQUIRED — this route only records a dose that
        // was NOT given. An actual administration has no reason_not_given and must use the safe path.
        const documentedReason = (reason_not_given == null ? '' : String(reason_not_given).trim());
        if (!documentedReason) {
            return res.status(410).json({
                error: 'This endpoint only documents a not-given/held dose. Record administrations via POST /api/mar/administer (5-rights enforced).',
                code: 'MAR_USE_SAFE_PATH',
            });
        }
        if (tenantId) {
            const orderCheck = await pool.query('SELECT id FROM emar_orders WHERE id=$1 AND tenant_id=$2', [emar_order_id, tenantId]);
            if (orderCheck.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
            const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);
            if (patientCheck.rows.length === 0) return res.status(404).json({ error: 'Patient not found' });
        }
        // status is FORCED server-side to 'Not Given' (this route never records an administration).
        const status = 'Not Given';
        const result = await pool.query('INSERT INTO emar_administrations (emar_order_id, patient_id, medication, dose, scheduled_time, actual_time, administered_by, status, reason_not_given, notes, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',
            [emar_order_id, patient_id || 0, medication || '', dose || '', scheduled_time || '', new Date().toISOString(), req.session.user.name, status, documentedReason, notes || '', tenantId || null, facilityId || null]);
        logAudit(req.session.user?.id, req.session.user?.name, 'MAR_NOT_GIVEN', 'Nursing',
            `eMAR (legacy) NOT-given documented: patient #${patient_id} order #${emar_order_id} (${medication || ''} ${dose || ''}) reason=${documentedReason}`, req.ip);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
