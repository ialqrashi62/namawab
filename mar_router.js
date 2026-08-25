// filepath: namaweb/mar_router.js
// MAR — Medication Administration Record: schedule, due list, admin, late/missed tracking.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Patient medication schedule (active orders)
router.get('/orders/:patient_id', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'pharmacist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, prescription_ref, medication, dose, route, scheduled_at, status, cds_warnings
            FROM emar_orders WHERE tenant_id = $1 AND patient_id = $2 AND status IN ('pending','overdue','administered')
            ORDER BY scheduled_at ASC LIMIT 100
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, orders: r.rows });
    } catch (err) { console.error('GET /api/mar/orders', err); res.status(500).json({ error: 'internal_error' }); }
});

// Due-now window (next 30 min)
router.get('/due-now/:patient_id', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, medication, dose, route, scheduled_at, cds_warnings
            FROM emar_orders WHERE tenant_id = $1 AND patient_id = $2 AND status = 'pending'
            AND scheduled_at BETWEEN NOW() - INTERVAL '15 minutes' AND NOW() + INTERVAL '30 minutes'
            ORDER BY scheduled_at ASC
        `, [req.tenantId, req.params.patient_id]);
        const now = new Date();
        for (const o of r.rows) {
            const diff = (new Date(o.scheduled_at) - now) / 60000;
            o.due_in_minutes = Math.round(diff);
            o.is_overdue = diff < -1;
        }
        res.json({ ok: true, total: r.rows.length, orders: r.rows });
    } catch (err) { console.error('GET /api/mar/due-now', err); res.status(500).json({ error: 'internal_error' }); }
});

// Administer a medication (5-rights: patient, drug, dose, route, time)
router.post('/administer/:order_id', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { administered_at, witness_by, witness_by_name, notes } = req.body;
        const orderId = req.params.order_id;
        const o = await db.query(`SELECT * FROM emar_orders WHERE tenant_id = $1 AND id = $2`, [req.tenantId, orderId]);
        if (!o.rows.length) return res.status(404).json({ error: 'order_not_found' });
        const ord = o.rows[0];
        if (ord.status === 'administered') return res.status(409).json({ error: 'already_administered' });
        const administeredBy = req.userName || req.userId || '';
        await db.query(`
            INSERT INTO mar_administrations (tenant_id, patient_id, patient_name, admission_id, medication, dose, route, frequency, start_date, end_date, prescriber, status, notes)
            VALUES ($1,$2,$3,NULL,$4,$5,$6,NULL,NULL,NULL,$7,'administered',$8)
        `, [req.tenantId, ord.patient_id, '', ord.medication, ord.dose, ord.route, ord.prescription_ref || '', notes || '']);
        const upd = await db.query(`
            UPDATE emar_orders SET status = 'administered', administered_at = COALESCE($2, NOW()), administered_by = $3, administered_by_name = $3, witness_by = $4, witness_by_name = $5, notes = $6
            WHERE tenant_id = $1 AND id = $7 RETURNING status
        `, [req.tenantId, administered_at || new Date().toISOString(), administeredBy, witness_by || '', witness_by_name || '', notes || '', orderId]);
        res.json({ ok: true, status: upd.rows[0].status });
    } catch (err) { console.error('POST /api/mar/administer', err); res.status(500).json({ error: 'internal_error' }); }
});

// Override (hold/refuse with reason)
router.post('/override/:order_id', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { override_reason, status } = req.body;
        if (!override_reason) return res.status(400).json({ error: 'override_reason_required' });
        const newStatus = status || 'held';
        const r = await db.query(`UPDATE emar_orders SET status = $2, override_reason = $3, notes = COALESCE(notes, '') || $4 || ' override: ' || $5 WHERE tenant_id = $1 AND id = $6 RETURNING id, status`, [req.tenantId, newStatus, override_reason, '', '', req.params.order_id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, status: r.rows[0].status });
    } catch (err) { console.error('POST /api/mar/override', err); res.status(500).json({ error: 'internal_error' }); }
});

// Scheduled administration events for a date (full day's grid)
router.get('/day-schedule/:patient_id', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { date } = req.query;
        const d = date || new Date().toISOString().slice(0, 10);
        const r = await db.query(`
            SELECT id, medication, dose, route, scheduled_at, status, cds_warnings
            FROM emar_orders WHERE tenant_id = $1 AND patient_id = $2
            AND scheduled_at::date = $3::date
            ORDER BY scheduled_at ASC
        `, [req.tenantId, req.params.patient_id, d]);
        const admin = await db.query(`SELECT COUNT(*) as admin_count, COUNT(*) FILTER (WHERE medication IS NOT NULL) as total FROM mar_administrations WHERE tenant_id = $1 AND patient_id = $2 AND created_at::date = $3::date`, [req.tenantId, req.params.patient_id, d]);
        res.json({ ok: true, date: d, total_scheduled: r.rows.length, given: admin.rows[0].admin_count, schedule: r.rows });
    } catch (err) { console.error('GET /api/mar/day-schedule', err); res.status(500).json({ error: 'internal_error' }); }
});

// Pending prescriptions queue (for pharmacy verification)
router.get('/rx-queue', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, doctor, medication_name, dosage, frequency, duration, status, verified_by, verified_at, created_at
            FROM pharmacy_prescriptions_queue WHERE tenant_id = $1 AND status = 'pending' ORDER BY created_at ASC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, queue: r.rows });
    } catch (err) { console.error('GET /api/mar/rx-queue', err); res.status(500).json({ error: 'internal_error' }); }
});

// Mark Rx verified
router.post('/verify/:rx_id', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const r = await db.query(`UPDATE pharmacy_prescriptions_queue SET status = 'verified', verified_by = $2, verified_at = NOW() WHERE tenant_id = $1 AND id = $3 RETURNING id`, [req.tenantId, req.userName || '', req.params.rx_id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/mar/verify', err); res.status(500).json({ error: 'internal_error' }); }
});

// Missed/late stats (compliance dashboard)
router.get('/compliance/:patient_id', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status = 'administered') as given,
                   COUNT(*) FILTER (WHERE status = 'overdue') as overdue,
                   COUNT(*) FILTER (WHERE status IN ('held','cancelled')) as held,
                   COUNT(*) as total
            FROM emar_orders WHERE tenant_id = $1 AND patient_id = $2 AND created_at >= NOW() - INTERVAL '7 days'
        `, [req.tenantId, req.params.patient_id]);
        const s = r.rows[0];
        const compliance = s.total > 0 ? Math.round(100 * +s.given / s.total) : 0;
        res.json({ ok: true, compliance_pct: compliance, ...s });
    } catch (err) { console.error('GET /api/mar/compliance', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['orders', 'due-now', 'administer', 'override', 'day-schedule', 'rx-queue', 'verify', 'compliance'], timestamp: new Date().toISOString() });
});

module.exports = router;
