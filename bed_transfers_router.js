'use strict';
// Wave 91 — Bed Transfers: intra-hospital ward/bed moves
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'bed-transfers',
        endpoints: [
            'GET /transfers',
            'GET /transfers/:id',
            'POST /transfers',
            'GET /transfers/patient/:patientId',
            'GET /transfers/ward/:ward',
            'GET /recent',
            'GET /by-reason',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/transfers', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, admission_id, from_ward, to_ward, limit = 100, offset = 0 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT t.*, p.full_name AS patient_name, p.mrn, u.full_name AS transferred_by_name FROM bed_transfers t
                   LEFT JOIN patients p ON p.id = t.patient_id LEFT JOIN users u ON u.id = t.transferred_by WHERE t.tenant_id = $1`;
        if (patient_id) { sql += ` AND t.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (admission_id) { sql += ` AND t.admission_id = $${params.length + 1}`; params.push(admission_id); }
        if (from_ward) { sql += ` AND t.from_ward = $${params.length + 1}`; params.push(from_ward); }
        if (to_ward) { sql += ` AND t.to_ward = $${params.length + 1}`; params.push(to_ward); }
        sql += ` ORDER BY t.transfer_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/transfers/:id', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT t.*, p.full_name AS patient_name, p.mrn, u.full_name AS transferred_by_name FROM bed_transfers t
             LEFT JOIN patients p ON p.id = t.patient_id LEFT JOIN users u ON u.id = t.transferred_by
             WHERE t.tenant_id = $1 AND t.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'transfer_not_found' });
        res.json({ ok: true, transfer: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/transfers', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by, transfer_date = new Date() } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!to_ward) return res.status(400).json({ ok: false, error: 'to_ward_required' });
        if (!transfer_reason) return res.status(400).json({ ok: false, error: 'transfer_reason_required' });
        if (from_ward === to_ward && from_bed === to_bed) return res.status(400).json({ ok: false, error: 'no_location_change' });

        const r = await db.query(
            `INSERT INTO bed_transfers (admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by, transfer_date, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [admission_id || null, patient_id, from_ward || null, from_bed || null, to_ward, to_bed || null,
             transfer_reason, transferred_by || req.user?.id || null, transfer_date, req.tenantId]
        );
        res.status(201).json({ ok: true, transfer: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/transfers/patient/:patientId', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT t.*, u.full_name AS transferred_by_name FROM bed_transfers t LEFT JOIN users u ON u.id = t.transferred_by
             WHERE t.tenant_id = $1 AND t.patient_id = $2 ORDER BY t.transfer_date DESC`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, latest: r.rows[0] || null, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/transfers/ward/:ward', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT t.*, p.full_name AS patient_name FROM bed_transfers t LEFT JOIN patients p ON p.id = t.patient_id
             WHERE t.tenant_id = $1 AND (t.from_ward = $2 OR t.to_ward = $2) ORDER BY t.transfer_date DESC LIMIT 100`,
            [req.tenantId, req.params.ward]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/recent', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { hours = 24 } = req.query;
        const r = await db.query(
            `SELECT t.*, p.full_name AS patient_name, u.full_name AS transferred_by_name FROM bed_transfers t
             LEFT JOIN patients p ON p.id = t.patient_id LEFT JOIN users u ON u.id = t.transferred_by
             WHERE t.tenant_id = $1 AND t.transfer_date >= NOW() - ($2 || ' hours')::INTERVAL ORDER BY t.transfer_date DESC LIMIT 200`,
            [req.tenantId, hours]
        );
        res.json({ ok: true, hours: parseInt(hours), count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/by-reason', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT transfer_reason, COUNT(*) AS count FROM bed_transfers WHERE tenant_id = $1 AND transfer_date >= NOW() - INTERVAL '90 days'
             GROUP BY transfer_reason ORDER BY count DESC LIMIT 25`,
            [req.tenantId]
        );
        res.json({ ok: true, reasons: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT COUNT(*) AS total_transfers, COUNT(DISTINCT patient_id) AS unique_patients,
                    COUNT(DISTINCT transferred_by) AS staff_involved,
                    COUNT(DISTINCT from_ward) AS from_wards, COUNT(DISTINCT to_ward) AS to_wards
             FROM bed_transfers WHERE tenant_id = $1 AND transfer_date >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const flow = await db.query(
            `SELECT from_ward, to_ward, COUNT(*) AS count FROM bed_transfers WHERE tenant_id = $1 AND from_ward IS NOT NULL AND to_ward IS NOT NULL
               AND transfer_date >= NOW() - INTERVAL '90 days'
             GROUP BY from_ward, to_ward ORDER BY count DESC LIMIT 10`,
            [req.tenantId]
        );
        res.json({ ok: true, summary_90d: r.rows[0], top_flows: flow.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
