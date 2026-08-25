// filepath: namaweb/labwork_router.js
// Laboratory workflow — sample collection → barcode → results → verification → critical callback + QC.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// --- Sample collection with barcode ---
router.post('/samples', requireAuth, requireTenantScope, requireRole('phlebotomist', 'nurse', 'lab_tech'), async (req, res) => {
    try {
        const { lab_order_id, patient_id, barcode, collected_by } = req.body;
        if (!patient_id || !barcode) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO lab_samples (tenant_id, lab_order_id, patient_id, barcode, state, collected_by, collected_at)
            VALUES ($1, $2, $3, $4, 'collected', COALESCE($5, $6), NOW()) RETURNING id
        `, [req.tenantId, lab_order_id || null, patient_id, barcode, collected_by, req.userName || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/lw/samples', err); res.status(500).json({ error: 'internal_error' }); }
});

// Receive sample in lab
router.post('/samples/:id/receive', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const r = await db.query(`UPDATE lab_samples SET state = 'received', received_by = $2, received_at = NOW() WHERE tenant_id = $1 AND id = $3 RETURNING id`, [req.tenantId, req.userName || '', req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/lw/samples/receive', err); res.status(500).json({ error: 'internal_error' }); }
});

// Reject sample with reason (hemolyzed, insufficient, mislabeled)
router.post('/samples/:id/reject', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { reason, notes } = req.body;
        if (!reason) return res.status(400).json({ error: 'reason_required' });
        const r = await db.query(`UPDATE lab_samples SET state = 'rejected', rejected_by = $2, rejected_reason = $3, rejected_at = NOW(), notes = $4 WHERE tenant_id = $1 AND id = $5 RETURNING id`, [req.tenantId, req.userName || '', reason, notes || '', req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/lw/samples/reject', err); res.status(500).json({ error: 'internal_error' }); }
});

// Sample tracking status
router.get('/samples/:id', requireAuth, requireTenantScope, requireRole('lab_tech', 'nurse', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, patient_id, lab_order_id, barcode, state, collected_by, collected_at, received_by, received_at, rejected_reason, rejected_by, rejected_at FROM lab_samples WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, sample: r.rows[0] });
    } catch (err) { console.error('GET /api/lw/samples', err); res.status(500).json({ error: 'internal_error' }); }
});

// --- Test catalog lookup ---
router.get('/catalog', requireAuth, requireTenantScope, requireRole('doctor', 'lab_tech', 'receptionist'), async (req, res) => {
    try {
        const { category } = req.query;
        let sql = `SELECT id, test_name, category, normal_range, price FROM lab_tests_catalog WHERE 1=1`;
        const params = [];
        if (category) { params.push(category); sql += ` AND category = $${params.length}`; }
        sql += ` ORDER BY category, test_name LIMIT 500`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, catalog: r.rows });
    } catch (err) { console.error('GET /api/lw/catalog', err); res.status(500).json({ error: 'internal_error' }); }
});

// --- Results entry (auto-flag critical) ---
router.post('/results', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { lab_sample_id, test_name, value, unit, ref_low, ref_high, loinc, notes } = req.body;
        if (!lab_sample_id || !test_name) return res.status(400).json({ error: 'missing_required' });
        const v = +(value || 0);
        const lo = +(ref_low || 0);
        const hi = +(ref_high || 0);
        const abnormal = hi ? (v < lo || v > hi) : false;
        const critically_low = lo ? v < lo * 0.5 : false;
        const critically_high = hi ? v > hi * 1.5 : false;
        const is_critical = critically_low || critically_high;
        const abnormal_flag = is_critical ? 'C' : (abnormal ? (v < lo ? 'L' : 'H') : '');
        const r = await db.query(`
            INSERT INTO lab_results (tenant_id, lab_sample_id, loinc, test_name, value, unit, ref_low, ref_high, abnormal_flag, is_critical, status, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending',$11) RETURNING id
        `, [req.tenantId, lab_sample_id, loinc || '', test_name, value || '', unit || '', ref_low || null, ref_high || null, abnormal_flag, is_critical, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id, abnormal_flag, is_critical });
    } catch (err) { console.error('POST /api/lw/results', err); res.status(500).json({ error: 'internal_error' }); }
});

// Verify a result (lab tech/doctor sign-off)
router.post('/results/:id/verify', requireAuth, requireTenantScope, requireRole('lab_tech', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`UPDATE lab_results SET status = 'verified', verified_by = $2, verified_at = NOW() WHERE tenant_id = $1 AND id = $3 RETURNING id, is_critical`, [req.tenantId, req.userName || '', req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, is_critical: r.rows[0].is_critical });
    } catch (err) { console.error('POST /api/lw/results/verify', err); res.status(500).json({ error: 'internal_error' }); }
});

// Patient results
router.get('/results/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, lab_sample_id, test_name, value, unit, ref_low, ref_high, abnormal_flag, is_critical, status, verified_at, created_at
            FROM lab_results WHERE tenant_id = $1 AND exists (SELECT 1 FROM lab_samples ls WHERE ls.id = lab_sample_id AND ls.patient_id = $2)
            ORDER BY created_at DESC LIMIT 200
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, results: r.rows });
    } catch (err) { console.error('GET /api/lw/results', err); res.status(500).json({ error: 'internal_error' }); }
});

// --- Critical-result callback log ---
router.post('/critical-callback/:result_id', requireAuth, requireTenantScope, requireRole('lab_tech', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { notified_to, notes } = req.body;
        if (!notified_to) return res.status(400).json({ error: 'notified_to_required' });
        const r = await db.query(`
            INSERT INTO lab_critical_callbacks (tenant_id, result_id, notified_to, notified_by, notified_by_name, notified_at, notes)
            VALUES ($1, $2, $3, $4, $4, NOW(), $5) RETURNING id
        `, [req.tenantId, req.params.result_id, notified_to, req.userName || '', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/lw/critical-callback', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/critical-callbacks', requireAuth, requireTenantScope, requireRole('lab_director', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, result_id, notified_to, notified_by_name, notified_at, ack, notes
            FROM lab_critical_callbacks WHERE tenant_id = $1 ORDER BY notified_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, callbacks: r.rows });
    } catch (err) { console.error('GET /api/lw/critical-callbacks', err); res.status(500).json({ error: 'internal_error' }); }
});

// QC summary by analyzer
router.get('/qc', requireAuth, requireTenantScope, requireRole('lab_director', 'lab_tech', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT analyzer, COUNT(*) as qc_count, COUNT(*) FILTER (WHERE westgard_flag IN ('1_2s','1_3s','2_2s','R_4s','4_1s','10_x')) as flagged_count FROM lab_qc WHERE tenant_id = $1 AND at >= NOW() - INTERVAL '7 days' GROUP BY analyzer ORDER BY flagged_count DESC`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, qc: r.rows });
    } catch (err) { console.error('GET /api/lw/qc', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['samples', 'receive', 'reject', 'catalog', 'results', 'verify', 'critical-callback', 'critical-callbacks', 'qc'], timestamp: new Date().toISOString() });
});

module.exports = router;