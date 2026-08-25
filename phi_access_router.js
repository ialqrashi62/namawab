'use strict';
// Wave 92 — PHI Access Log: PDPL/HIPAA-grade patient-record access tracking
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_ACCESS_TYPES = ['view','edit','create','delete','export','print','download','share'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'phi-access',
        endpoints: [
            'GET /access-log',
            'GET /access-log/patient/:patientId',
            'GET /access-log/user/:userId',
            'GET /access-log/exports',
            'GET /access-log/today',
            'POST /access-log',
            'GET /stats',
            'GET /patient-summary/:patientId'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/access-log', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, accessor_id, access_type, from_date, to_date, limit = 100, offset = 0 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT l.*, p.full_name AS patient_name, p.mrn, u.full_name AS accessor_name FROM record_access_log l
                   LEFT JOIN patients p ON p.id = l.patient_id LEFT JOIN users u ON u.id = l.accessor_id WHERE l.tenant_id = $1`;
        if (patient_id) { sql += ` AND l.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (accessor_id) { sql += ` AND l.accessor_id = $${params.length + 1}`; params.push(accessor_id); }
        if (access_type) { sql += ` AND l.access_type = $${params.length + 1}`; params.push(access_type); }
        if (from_date) { sql += ` AND l.at >= $${params.length + 1}`; params.push(from_date); }
        if (to_date) { sql += ` AND l.at <= $${params.length + 1}`; params.push(to_date); }
        sql += ` ORDER BY l.at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/access-log/patient/:patientId', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT l.*, u.full_name AS accessor_name FROM record_access_log l LEFT JOIN users u ON u.id = l.accessor_id
             WHERE l.tenant_id = $1 AND l.patient_id = $2 ORDER BY l.at DESC LIMIT 100`,
            [req.tenantId, req.params.patientId]
        );
        const uniqueAccessors = [...new Set(r.rows.map(x => x.accessor_id))].length;
        res.json({ ok: true, count: r.rows.length, unique_accessors: uniqueAccessors, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/access-log/user/:userId', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT l.*, p.full_name AS patient_name, p.mrn FROM record_access_log l LEFT JOIN patients p ON p.id = l.patient_id
             WHERE l.tenant_id = $1 AND l.accessor_id = $2 ORDER BY l.at DESC LIMIT 200`,
            [req.tenantId, req.params.userId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/access-log/exports', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT l.*, p.full_name AS patient_name, u.full_name AS accessor_name FROM record_access_log l
             LEFT JOIN patients p ON p.id = l.patient_id LEFT JOIN users u ON u.id = l.accessor_id
             WHERE l.tenant_id = $1 AND l.access_type IN ('export','download','print','share') ORDER BY l.at DESC LIMIT 200`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows, alert: 'Sensitive operations requiring HIPAA/PDPL breach monitoring.' });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/access-log/today', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT l.*, p.full_name AS patient_name, u.full_name AS accessor_name FROM record_access_log l
             LEFT JOIN patients p ON p.id = l.patient_id LEFT JOIN users u ON u.id = l.accessor_id
             WHERE l.tenant_id = $1 AND l.at::date = CURRENT_DATE ORDER BY l.at DESC LIMIT 500`,
            [req.tenantId]
        );
        const byType = {};
        r.rows.forEach(x => { byType[x.access_type] = (byType[x.access_type] || 0) + 1; });
        res.json({ ok: true, count: r.rows.length, by_type: byType, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/access-log', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, access_type, reason, at = new Date() } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!access_type) return res.status(400).json({ ok: false, error: 'access_type_required' });
        if (!VALID_ACCESS_TYPES.includes(access_type)) return res.status(400).json({ ok: false, error: 'invalid_access_type', valid: VALID_ACCESS_TYPES });

        const r = await db.query(
            `INSERT INTO record_access_log (tenant_id, patient_id, accessor_id, access_type, reason, at)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [req.tenantId, patient_id, req.user?.id || null, access_type, reason || null, at]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT access_type, COUNT(*) AS count, COUNT(DISTINCT patient_id) AS unique_patients,
                    COUNT(DISTINCT accessor_id) AS unique_accessors
             FROM record_access_log WHERE tenant_id = $1 AND at >= NOW() - INTERVAL '90 days'
             GROUP BY access_type ORDER BY count DESC`,
            [req.tenantId]
        );
        const today = await db.query(
            `SELECT COUNT(*) AS today_total FROM record_access_log WHERE tenant_id = $1 AND at::date = CURRENT_DATE`,
            [req.tenantId]
        );
        res.json({ ok: true, by_type: r.rows, today: today.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/patient-summary/:patientId', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const accesses = await db.query(
            `SELECT access_type, COUNT(*) AS count, MAX(at) AS last_access FROM record_access_log
             WHERE tenant_id = $1 AND patient_id = $2 GROUP BY access_type ORDER BY count DESC`,
            [req.tenantId, req.params.patientId]
        );
        const uniqueUsers = await db.query(
            `SELECT COUNT(DISTINCT accessor_id) AS unique_users FROM record_access_log WHERE tenant_id = $1 AND patient_id = $2`,
            [req.tenantId, req.params.patientId]
        );
        const total = await db.query(
            `SELECT COUNT(*) AS total_accesses, MAX(at) AS last_access FROM record_access_log WHERE tenant_id = $1 AND patient_id = $2`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, summary: { total_accesses: parseInt(total.rows[0].total_accesses), last_access: total.rows[0].last_access, unique_users: parseInt(uniqueUsers.rows[0].unique_users), by_type: accesses.rows } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
