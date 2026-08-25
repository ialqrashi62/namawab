'use strict';
// Wave 83 — Medical Records: chart pull/release/return tracking
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_STATUS = ['requested','in_transit','delivered','returned','overdue','cancelled','lost'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'medical-records',
        endpoints: [
            'GET /requests',
            'GET /requests/:id',
            'POST /requests',
            'POST /requests/:id/deliver',
            'POST /requests/:id/return',
            'POST /requests/:id/cancel',
            'GET /requests/patient/:patientId',
            'GET /requests/active',
            'GET /requests/overdue',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

function deriveStatus(current, hasDelivered, hasReturned) {
    if (current === 'cancelled') return 'cancelled';
    if (hasReturned) return 'returned';
    if (hasDelivered) return 'delivered';
    return 'requested';
}

router.get('/requests', requireAuth, requireTenantScope, requireRole('records_clerk'), async (req, res) => {
    try {
        const { patient_id, status, department, requested_by, limit = 100, offset = 0 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT r.*, p.full_name AS patient_name, p.mrn, u.full_name AS requester_name FROM medical_records_requests r
                   LEFT JOIN patients p ON p.id = r.patient_id LEFT JOIN users u ON u.id = r.requested_by WHERE r.tenant_id = $1`;
        if (patient_id) { sql += ` AND r.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (status) { sql += ` AND r.status = $${params.length + 1}`; params.push(status); }
        if (department) { sql += ` AND r.department = $${params.length + 1}`; params.push(department); }
        if (requested_by) { sql += ` AND r.requested_by = $${params.length + 1}`; params.push(requested_by); }
        sql += ` ORDER BY r.requested_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/requests/:id', requireAuth, requireTenantScope, requireRole('records_clerk'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT r.*, p.full_name AS patient_name, p.mrn, u.full_name AS requester_name FROM medical_records_requests r
             LEFT JOIN patients p ON p.id = r.patient_id LEFT JOIN users u ON u.id = r.requested_by
             WHERE r.tenant_id = $1 AND r.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'request_not_found' });
        const row = r.rows[0];
        const transitDays = row.delivered_at && !row.returned_at ? Math.floor((Date.now() - new Date(row.delivered_at).getTime()) / 86400000) : null;
        res.json({ ok: true, request: row, transit_days: transitDays });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/requests', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, file_number, department, purpose, notes, requested_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!department) return res.status(400).json({ ok: false, error: 'department_required' });
        if (!purpose) return res.status(400).json({ ok: false, error: 'purpose_required' });

        const r = await db.query(
            `INSERT INTO medical_records_requests (patient_id, file_number, requested_by, department, purpose, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,'requested',$6,$7) RETURNING *`,
            [patient_id, file_number || null, requested_by || req.user?.id || null, department, purpose, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, request: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/requests/:id/deliver', requireAuth, requireTenantScope, requireRole('records_clerk'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE medical_records_requests SET status = 'delivered', delivered_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status = 'requested' RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_deliver' });
        res.json({ ok: true, request: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/requests/:id/return', requireAuth, requireTenantScope, requireRole('records_clerk'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE medical_records_requests SET status = 'returned', returned_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status IN ('delivered','in_transit','overdue') RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_return' });
        const transitDays = r.rows[0].delivered_at && r.rows[0].returned_at ? Math.floor((new Date(r.rows[0].returned_at) - new Date(r.rows[0].delivered_at)) / 86400000) : null;
        res.json({ ok: true, request: r.rows[0], transit_days: transitDays });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/requests/:id/cancel', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { reason } = req.body;
        const r = await db.query(
            `UPDATE medical_records_requests SET status = 'cancelled', notes = COALESCE(notes,'') || ' [Cancelled: ' || $3 || ']'
             WHERE tenant_id = $1 AND id = $2 AND status IN ('requested','in_transit','delivered') RETURNING *`,
            [req.tenantId, req.params.id, reason || 'not specified']
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_cancel' });
        res.json({ ok: true, request: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/requests/patient/:patientId', requireAuth, requireTenantScope, requireRole('records_clerk'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT r.*, u.full_name AS requester_name FROM medical_records_requests r LEFT JOIN users u ON u.id = r.requested_by
             WHERE r.tenant_id = $1 AND r.patient_id = $2 ORDER BY r.requested_at DESC LIMIT 50`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, latest: r.rows[0] || null, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/requests/active', requireAuth, requireTenantScope, requireRole('records_clerk'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT r.*, p.full_name AS patient_name, p.mrn, u.full_name AS requester_name FROM medical_records_requests r
             LEFT JOIN patients p ON p.id = r.patient_id LEFT JOIN users u ON u.id = r.requested_by
             WHERE r.tenant_id = $1 AND r.status IN ('requested','in_transit','delivered') ORDER BY r.requested_at ASC LIMIT 200`,
            [req.tenantId]
        );
        const withTransit = r.rows.map(x => ({
            ...x,
            transit_days: x.delivered_at ? Math.floor((Date.now() - new Date(x.delivered_at).getTime()) / 86400000) : null
        }));
        res.json({ ok: true, count: withTransit.length, rows: withTransit });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/requests/overdue', requireAuth, requireTenantScope, requireRole('records_clerk'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT r.*, p.full_name AS patient_name, u.full_name AS requester_name,
                    EXTRACT(DAY FROM NOW() - r.delivered_at)::INT AS transit_days
             FROM medical_records_requests r LEFT JOIN patients p ON p.id = r.patient_id LEFT JOIN users u ON u.id = r.requested_by
             WHERE r.tenant_id = $1 AND r.status = 'delivered' AND r.delivered_at < NOW() - INTERVAL '7 days'
             ORDER BY r.delivered_at ASC`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows, threshold_days: 7 });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT status, COUNT(*) AS count FROM medical_records_requests WHERE tenant_id = $1 GROUP BY status`,
            [req.tenantId]
        );
        const today = await db.query(
            `SELECT COUNT(*) AS today_requests, COUNT(*) FILTER (WHERE status = 'returned') AS today_returned
             FROM medical_records_requests WHERE tenant_id = $1 AND requested_at::date = CURRENT_DATE`,
            [req.tenantId]
        );
        const avgTransit = await db.query(
            `SELECT AVG(EXTRACT(EPOCH FROM (returned_at - delivered_at))/86400)::NUMERIC(10,2) AS avg_transit_days
             FROM medical_records_requests WHERE tenant_id = $1 AND delivered_at IS NOT NULL AND returned_at IS NOT NULL`,
            [req.tenantId]
        );
        res.json({ ok: true, status_distribution: r.rows, today: today.rows[0], avg_transit_days: avgTransit.rows[0].avg_transit_days });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
