'use strict';
// Wave 89 — Imaging Studies: DICOM-style structured imaging registry
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_STATUS = ['ordered','scheduled','in_progress','completed','reported','cancelled','failed'];
const VALID_MODALITY = ['CT','MRI','XR','US','MG','NM','PT','XA','MR','CR','DR'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'imaging-studies',
        endpoints: [
            'GET /studies',
            'GET /studies/:id',
            'POST /studies',
            'PUT /studies/:id',
            'POST /studies/:id/schedule',
            'POST /studies/:id/complete',
            'POST /studies/:id/report',
            'GET /studies/patient/:patientId',
            'GET /pending-schedule',
            'GET /awaiting-report',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/studies', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const { patient_id, modality, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name, p.mrn, u.full_name AS ordered_by_name FROM imaging_studies s
                   LEFT JOIN patients p ON p.id = s.patient_id LEFT JOIN users u ON u.id = s.ordered_by WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (modality) { sql += ` AND s.modality = $${params.length + 1}`; params.push(modality); }
        if (status) { sql += ` AND s.status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/studies/:id', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name, p.mrn FROM imaging_studies s LEFT JOIN patients p ON p.id = s.patient_id
             WHERE s.tenant_id = $1 AND s.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'study_not_found' });
        res.json({ ok: true, study: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/studies', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, modality, body_part, study_name, study_uid, accession_no, ordered_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!modality) return res.status(400).json({ ok: false, error: 'modality_required' });
        if (!VALID_MODALITY.includes(modality)) return res.status(400).json({ ok: false, error: 'invalid_modality', valid: VALID_MODALITY });
        if (!body_part) return res.status(400).json({ ok: false, error: 'body_part_required' });

        const r = await db.query(
            `INSERT INTO imaging_studies (tenant_id, patient_id, ordered_by, modality, body_part, study_name, study_uid, accession_no, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'ordered') RETURNING *`,
            [req.tenantId, patient_id, ordered_by || req.user?.id || null, modality, body_part, study_name || null, study_uid || null, accession_no || null]
        );
        res.status(201).json({ ok: true, study: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/studies/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const allowed = ['modality','body_part','study_name','study_uid','accession_no','scheduled_at'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) {
                if (k === 'modality' && !VALID_MODALITY.includes(req.body[k])) return res.status(400).json({ ok: false, error: 'invalid_modality' });
                sets.push(`${k} = $${i++}`); params.push(req.body[k]);
            }
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        sets.push(`updated_at = NOW()`);
        const r = await db.query(
            `UPDATE imaging_studies SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 AND status IN ('ordered','scheduled') RETURNING *`,
            params
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_edit_after_started' });
        res.json({ ok: true, study: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/studies/:id/schedule', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const { scheduled_at } = req.body;
        if (!scheduled_at) return res.status(400).json({ ok: false, error: 'scheduled_at_required' });
        const r = await db.query(
            `UPDATE imaging_studies SET status = 'scheduled', scheduled_at = $3, updated_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status = 'ordered' RETURNING *`,
            [req.tenantId, req.params.id, scheduled_at]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_schedule' });
        res.json({ ok: true, study: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/studies/:id/complete', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const { file_path, file_size_bytes, thumbnail_path } = req.body;
        const r = await db.query(
            `UPDATE imaging_studies SET status = 'completed', performed_at = NOW(),
                                          file_path = COALESCE($3, file_path), file_size_bytes = COALESCE($4, file_size_bytes),
                                          thumbnail_path = COALESCE($5, thumbnail_path), updated_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status IN ('scheduled','in_progress') RETURNING *`,
            [req.tenantId, req.params.id, file_path || null, file_size_bytes || null, thumbnail_path || null]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_complete' });
        res.json({ ok: true, study: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/studies/:id/report', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE imaging_studies SET status = 'reported', reported_at = NOW(), updated_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND status = 'completed' RETURNING *`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_report_uncompleted' });
        res.json({ ok: true, study: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/studies/patient/:patientId', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM imaging_studies WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 30`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pending-schedule', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name FROM imaging_studies s LEFT JOIN patients p ON p.id = s.patient_id
             WHERE s.tenant_id = $1 AND s.status = 'ordered' ORDER BY s.created_at ASC LIMIT 100`,
            [req.tenantId]
        );
        const waitHours = r.rows.map(x => ({
            ...x,
            waiting_hours: Math.round((Date.now() - new Date(x.created_at).getTime()) / 3600000 * 10) / 10
        }));
        res.json({ ok: true, count: waitHours.length, rows: waitHours });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/awaiting-report', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name, p.mrn FROM imaging_studies s LEFT JOIN patients p ON p.id = s.patient_id
             WHERE s.tenant_id = $1 AND s.status = 'completed' ORDER BY s.performed_at ASC LIMIT 100`,
            [req.tenantId]
        );
        const withWait = r.rows.map(x => ({
            ...x,
            awaiting_hours: x.performed_at ? Math.round((Date.now() - new Date(x.performed_at).getTime()) / 3600000 * 10) / 10 : null
        }));
        res.json({ ok: true, count: withWait.length, rows: withWait });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT status, COUNT(*) AS count, AVG(EXTRACT(EPOCH FROM (reported_at - performed_at))/60)::NUMERIC(10,2) AS avg_report_minutes
             FROM imaging_studies WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY status`,
            [req.tenantId]
        );
        const byModality = await db.query(
            `SELECT modality, COUNT(*) AS count FROM imaging_studies WHERE tenant_id = $1 AND modality IS NOT NULL AND created_at >= NOW() - INTERVAL '90 days'
             GROUP BY modality ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, status_breakdown: r.rows, by_modality: byModality.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
