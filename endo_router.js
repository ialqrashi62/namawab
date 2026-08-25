'use strict';
// Wave 86 — Endoscopy Reports: GI procedure documentation
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_TYPES = ['egd','colonoscopy','sigmoidoscopy','ercp','eus','enteroscopy','capsule_endoscopy','bronchoscopy','cystoscopy'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'endoscopy',
        endpoints: [
            'GET /reports',
            'GET /reports/:id',
            'POST /reports',
            'PUT /reports/:id',
            'GET /reports/patient/:patientId',
            'GET /by-type',
            'GET /with-complications',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/reports', requireAuth, requireTenantScope, requireRole('gastroenterologist'), async (req, res) => {
    try {
        const { patient_id, endoscopy_type, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT r.*, p.full_name AS patient_name, p.mrn, u.full_name AS doctor_name FROM endoscopy_reports r
                   LEFT JOIN patients p ON p.id = r.patient_id LEFT JOIN users u ON u.id = r.doctor_id WHERE r.tenant_id = $1`;
        if (patient_id) { sql += ` AND r.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (endoscopy_type) { sql += ` AND r.endoscopy_type = $${params.length + 1}`; params.push(endoscopy_type); }
        sql += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/reports/:id', requireAuth, requireTenantScope, requireRole('gastroenterologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT r.*, p.full_name AS patient_name, p.mrn, u.full_name AS doctor_name FROM endoscopy_reports r
             LEFT JOIN patients p ON p.id = r.patient_id LEFT JOIN users u ON u.id = r.doctor_id
             WHERE r.tenant_id = $1 AND r.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'report_not_found' });
        res.json({ ok: true, report: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/reports', requireAuth, requireTenantScope, requireRole('gastroenterologist'), async (req, res) => {
    try {
        const { patient_id, endoscopy_type, indications, findings, complications, recommendations, doctor_id } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!endoscopy_type) return res.status(400).json({ ok: false, error: 'endoscopy_type_required' });
        if (!VALID_TYPES.includes(endoscopy_type)) return res.status(400).json({ ok: false, error: 'invalid_endoscopy_type', valid: VALID_TYPES });
        if (!findings) return res.status(400).json({ ok: false, error: 'findings_required' });

        const r = await db.query(
            `INSERT INTO endoscopy_reports (patient_id, doctor_id, endoscopy_type, indications, findings, complications, recommendations, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [patient_id, doctor_id || req.user?.id || null, endoscopy_type,
             indications || null, findings,
             complications ? JSON.stringify(complications) : null,
             recommendations || null, req.tenantId]
        );
        res.status(201).json({ ok: true, report: r.rows[0], has_complications: Boolean(complications) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/reports/:id', requireAuth, requireTenantScope, requireRole('gastroenterologist'), async (req, res) => {
    try {
        const allowed = ['endoscopy_type','indications','findings','recommendations'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) {
                if (k === 'endoscopy_type' && !VALID_TYPES.includes(req.body[k])) {
                    return res.status(400).json({ ok: false, error: 'invalid_endoscopy_type' });
                }
                sets.push(`${k} = $${i++}`); params.push(req.body[k]);
            }
        }
        if ('complications' in req.body) {
            sets.push(`complications = $${i++}`);
            params.push(req.body.complications ? JSON.stringify(req.body.complications) : null);
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        const r = await db.query(
            `UPDATE endoscopy_reports SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            params
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'report_not_found' });
        res.json({ ok: true, report: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/reports/patient/:patientId', requireAuth, requireTenantScope, requireRole('gastroenterologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT r.*, u.full_name AS doctor_name FROM endoscopy_reports r LEFT JOIN users u ON u.id = r.doctor_id
             WHERE r.tenant_id = $1 AND r.patient_id = $2 ORDER BY r.created_at DESC LIMIT 30`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, latest: r.rows[0] || null, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/by-type', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT endoscopy_type, COUNT(*) AS count, COUNT(DISTINCT patient_id) AS unique_patients,
                    COUNT(*) FILTER (WHERE complications IS NOT NULL) AS with_complications
             FROM endoscopy_reports WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'
             GROUP BY endoscopy_type ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, types: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/with-complications', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT r.*, p.full_name AS patient_name, u.full_name AS doctor_name FROM endoscopy_reports r
             LEFT JOIN patients p ON p.id = r.patient_id LEFT JOIN users u ON u.id = r.doctor_id
             WHERE r.tenant_id = $1 AND r.complications IS NOT NULL ORDER BY r.created_at DESC LIMIT 100`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT COUNT(*) AS total_procedures, COUNT(DISTINCT patient_id) AS unique_patients,
                    COUNT(DISTINCT doctor_id) AS endoscopists,
                    COUNT(*) FILTER (WHERE complications IS NOT NULL) AS with_complications
             FROM endoscopy_reports WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        res.json({ ok: true, summary_90d: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
