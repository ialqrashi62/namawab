// filepath: namaweb/lab2_router.js
// Extended lab module: tests catalog, samples tracking, QC, critical callbacks.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/catalog', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'lab', 'admin'), async (req, res) => {
    try {
        const { q, category } = req.query;
        const conditions = ['1=1'];
        const params = [];
        if (q) { params.push(`%${q}%`); conditions.push(`(test_name ILIKE $${params.length} OR test_code ILIKE $${params.length})`); }
        if (category) { params.push(category); conditions.push(`category = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, test_code, test_name, test_name_ar, category, sample_type,
                   turnaround_time_hours, price, reference_unit
            FROM lab_tests_catalog WHERE ${conditions.join(' AND ')}
            ORDER BY test_name LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, tests: r.rows });
    } catch (err) { console.error('GET /api/lab2/catalog', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/samples', requireAuth, requireTenantScope, requireRole('lab', 'nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const { status, sample_type } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (sample_type) { params.push(sample_type); conditions.push(`sample_type = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, sample_type, collected_by, collected_at, status,
                   rejection_reason, ordering_provider, created_at
            FROM lab_samples WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, samples: r.rows });
    } catch (err) { console.error('GET /api/lab2/samples', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/samples/rejected', requireAuth, requireTenantScope, requireRole('lab', 'admin', 'quality'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, sample_type, rejection_reason, collected_by, collected_at
            FROM lab_samples WHERE tenant_id = $1 AND status = 'rejected' ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, samples: r.rows });
    } catch (err) { console.error('GET /api/lab2/samples/rejected', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/qc', requireAuth, requireTenantScope, requireRole('lab', 'admin', 'quality'), async (req, res) => {
    try {
        const { days } = req.query;
        const days_n = Math.min(+days || 30, 365);
        const r = await db.query(`
            SELECT id, test_id, control_level, target_value, measured_value, deviation,
                   status, performed_by, run_date, created_at
            FROM lab_qc WHERE tenant_id = $1 AND run_date >= CURRENT_DATE - ($2 || ' days')::interval
            ORDER BY run_date DESC LIMIT 200
        `, [req.tenantId, days_n]);
        const summary = await db.query(`
            SELECT COUNT(*) as total_qc,
                   COUNT(*) FILTER (WHERE status = 'in_control') as in_control,
                   COUNT(*) FILTER (WHERE status = 'out_of_control') as out_of_control,
                   COUNT(*) FILTER (WHERE status = 'warning') as warning
            FROM lab_qc WHERE tenant_id = $1 AND run_date >= CURRENT_DATE - $2::int
        `, [req.tenantId, days_n]);
        res.json({ ok: true, period_days: days_n, summary: summary.rows[0], qc_results: r.rows });
    } catch (err) { console.error('GET /api/lab2/qc', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/qc', requireAuth, requireTenantScope, requireRole('lab', 'admin'), async (req, res) => {
    try {
        const { test_id, control_level, target_value, measured_value, status, performed_by } = req.body;
        if (!test_id || measured_value == null) return res.status(400).json({ error: 'missing_required', required: ['test_id', 'measured_value'] });
        const deviation = measured_value - (target_value || 0);
        const r = await db.query(`
            INSERT INTO lab_qc (tenant_id, test_id, control_level, target_value, measured_value, deviation, status, performed_by, run_date)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE) RETURNING id
        `, [req.tenantId, test_id, control_level || 'normal', target_value || 0, measured_value, deviation, status || 'in_control', performed_by || req.userName || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id, deviation });
    } catch (err) { console.error('POST /api/lab2/qc', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/critical-callbacks', requireAuth, requireTenantScope, requireRole('lab', 'nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const { pending, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (pending === 'true') conditions.push('acknowledged_at IS NULL');
        else if (pending === 'false') conditions.push('acknowledged_at IS NOT NULL');
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, test_name, critical_value, provider_name, callback_method,
                   callback_at, acknowledged_by, acknowledged_at, created_at
            FROM lab_critical_callbacks WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, callbacks: r.rows });
    } catch (err) { console.error('GET /api/lab2/critical-callbacks', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/critical-callbacks/:id/acknowledge', requireAuth, requireTenantScope, requireRole('lab', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE lab_critical_callbacks SET acknowledged_by = $3, acknowledged_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND acknowledged_at IS NULL RETURNING id, acknowledged_at
        `, [req.params.id, req.tenantId, req.userName || req.userId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_ack' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/lab2/critical-callbacks/:id/acknowledge', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/micro', requireAuth, requireTenantScope, requireRole('lab', 'doctor', 'admin'), async (req, res) => {
    try {
        const { organism, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (organism) { params.push(`%${organism}%`); conditions.push(`organism ILIKE $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, specimen_source, organism, sensitivity, resistance,
                   final_report, status, created_at
            FROM lab_microbiology WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, cultures: r.rows });
    } catch (err) { console.error('GET /api/lab2/micro', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('lab', 'admin', 'quality'), async (req, res) => {
    try {
        const samples = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE status = 'received') as received,
                   COUNT(*) FILTER (WHERE status = 'processing') as processing,
                   COUNT(*) FILTER (WHERE status = 'completed') as completed,
                   COUNT(*) FILTER (WHERE status = 'rejected') as rejected
            FROM lab_samples WHERE tenant_id = $1
        `, [req.tenantId]);
        const qc = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status = 'in_control') as in_control,
                   COUNT(*) FILTER (WHERE status = 'out_of_control') as out_of_control,
                   COUNT(*) FILTER (WHERE run_date = CURRENT_DATE) as run_today
            FROM lab_qc WHERE tenant_id = $1
        `, [req.tenantId]);
        const crit = await db.query(`
            SELECT COUNT(*) FILTER (WHERE acknowledged_at IS NULL) as pending_ack
            FROM lab_critical_callbacks WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, samples: samples.rows[0], qc: qc.rows[0], critical_pending: crit.rows[0].pending_ack });
    } catch (err) { console.error('GET /api/lab2/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['catalog', 'samples', 'qc', 'critical-callbacks', 'micro', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
