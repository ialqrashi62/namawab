// filepath: namaweb/referral_router.js
// Patient referrals between providers/departments + care continuity.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// New referral
router.post('/', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, from_doctor, to_department, to_doctor, reason, urgency, notes } = req.body;
        if (!patient_id || !to_department || !reason) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO patient_referrals (tenant_id, patient_id, patient_name, from_doctor, to_department, to_doctor, reason, urgency, status, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8,'routine'),'pending',$9) RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', req.userName || from_doctor || '', to_department, to_doctor || '', reason, urgency, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/ref', err); res.status(500).json({ error: 'internal_error' }); }
});

// Patient's referral history
router.get('/patient/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, from_doctor, to_department, to_doctor, reason, urgency, status, notes, created_at
            FROM patient_referrals WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, referrals: r.rows });
    } catch (err) { console.error('GET /api/ref/patient', err); res.status(500).json({ error: 'internal_error' }); }
});

// Inbox for a receiving dept
router.get('/inbox', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { department, status } = req.query;
        let sql = `SELECT id, patient_id, patient_name, from_doctor, to_department, to_doctor, reason, urgency, status, created_at FROM patient_referrals WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (department) { params.push(department); sql += ` AND to_department = $${params.length}`; }
        if (status) { params.push(status); sql += ` AND status = $${params.length}`; } else sql += ` AND status = 'pending'`;
        sql += ` ORDER BY CASE urgency WHEN 'stat' THEN 1 WHEN 'urgent' THEN 2 WHEN 'routine' THEN 3 END, created_at ASC LIMIT 100`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, inbox: r.rows });
    } catch (err) { console.error('GET /api/ref/inbox', err); res.status(500).json({ error: 'internal_error' }); }
});

// Accept / decline referral
router.post('/:id/decision', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { decision, accepted_by } = req.body;
        if (!['accepted', 'declined'].includes(decision)) return res.status(400).json({ error: 'invalid_decision' });
        const status = decision === 'accepted' ? 'accepted' : 'declined';
        const r = await db.query(`UPDATE patient_referrals SET status = $2, to_doctor = COALESCE(NULLIF($3, ''), to_doctor), notes = COALESCE(notes,'') || ' | ' || $2 || ' by ' || $3 WHERE tenant_id = $1 AND id = $4 RETURNING id, status`, [req.tenantId, status, accepted_by || req.userName || '', req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, status: r.rows[0].status });
    } catch (err) { console.error('POST /api/ref/decision', err); res.status(500).json({ error: 'internal_error' }); }
});

// Mark consultation completed
router.post('/:id/complete', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { outcomes, recommendations } = req.body;
        const r = await db.query(`UPDATE patient_referrals SET status = 'completed', notes = COALESCE(notes,'') || ' | completed: ' || $2 || ' | recs: ' || $3 WHERE tenant_id = $1 AND id = $4 RETURNING id, status`, [req.tenantId, outcomes || '', recommendations || '', req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/ref/complete', err); res.status(500).json({ error: 'internal_error' }); }
});

// Stats (referral volume, acceptance rate)
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT to_department, COUNT(*) as received,
                   COUNT(*) FILTER (WHERE status = 'accepted') as accepted,
                   COUNT(*) FILTER (WHERE status = 'declined') as declined,
                   COUNT(*) FILTER (WHERE status = 'completed') as completed
            FROM patient_referrals WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
            GROUP BY to_department ORDER BY received DESC
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, departments: r.rows });
    } catch (err) { console.error('GET /api/ref/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['create', 'patient', 'inbox', 'decision', 'complete', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
