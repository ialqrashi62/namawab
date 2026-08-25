// filepath: namaweb/radiology2_router.js
// Radiology module — orders, studies, structured reports.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/orders', requireAuth, requireTenantScope, requireRole('doctor', 'radiologist', 'admin'), async (req, res) => {
    try {
        const { status, modality, is_radiology, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (modality) { params.push(modality); conditions.push(`modality = $${params.length}`); }
        if (is_radiology === 'true') conditions.push('is_radiology = true');
        else if (is_radiology === 'false') conditions.push('is_radiology = false');
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, doctor_id, order_type, description, status, sample_serial,
                   result_date, results, is_radiology, modality, body_part, price,
                   approval_status, approved_by, created_at
            FROM radiology_orders WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, orders: r.rows });
    } catch (err) { console.error('GET /api/radiology/orders', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/orders/pending', requireAuth, requireTenantScope, requireRole('radiologist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, doctor_id, order_type, description, modality, body_part,
                   status, approval_status, created_at
            FROM radiology_orders WHERE tenant_id = $1 AND status IN ('pending', 'in_progress')
            ORDER BY created_at ASC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, orders: r.rows });
    } catch (err) { console.error('GET /api/radiology/orders/pending', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/studies', requireAuth, requireTenantScope, requireRole('doctor', 'radiologist', 'admin'), async (req, res) => {
    try {
        const { status, modality, patient_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (modality) { params.push(modality); conditions.push(`modality = $${params.length}`); }
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, ordered_by, modality, body_part, study_name, study_uid,
                   accession_no, status, scheduled_at, performed_at, reported_at,
                   file_path, file_size_bytes, created_at
            FROM imaging_studies WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, studies: r.rows });
    } catch (err) { console.error('GET /api/radiology/studies', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/studies', requireAuth, requireTenantScope, requireRole('radiologist', 'admin'), async (req, res) => {
    try {
        const { patient_id, ordered_by, modality, body_part, study_name, study_uid, accession_no, scheduled_at } = req.body;
        if (!patient_id || !modality) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'modality'] });
        const r = await db.query(`
            INSERT INTO imaging_studies (tenant_id, patient_id, ordered_by, modality, body_part, study_name, study_uid, accession_no, status, scheduled_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'scheduled',$9) RETURNING id
        `, [req.tenantId, patient_id, ordered_by || req.userId, modality, body_part || '', study_name || '', study_uid || null, accession_no || null, scheduled_at || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/radiology/studies', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/reports', requireAuth, requireTenantScope, requireRole('doctor', 'radiologist', 'admin'), async (req, res) => {
    try {
        const { study_id, critical } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (study_id) { params.push(study_id); conditions.push(`study_id = $${params.length}`); }
        if (critical === 'true') conditions.push('critical_findings = true');
        else if (critical === 'false') conditions.push('critical_findings = false');
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, study_id, radiologist_id, findings, impression, recommendations,
                   critical_findings, signed_at, locked_at, created_at
            FROM imaging_reports WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, reports: r.rows });
    } catch (err) { console.error('GET /api/radiology/reports', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/reports', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const { study_id, findings, impression, recommendations, critical_findings } = req.body;
        if (!study_id || !findings || !impression) return res.status(400).json({ error: 'missing_required', required: ['study_id', 'findings', 'impression'] });
        const r = await db.query(`
            INSERT INTO imaging_reports (tenant_id, study_id, radiologist_id, findings, impression, recommendations, critical_findings)
            VALUES ($1,$2,$3,$4,$5,$6,COALESCE($7,false)) RETURNING id
        `, [req.tenantId, study_id, req.userId, findings, impression, recommendations || '', critical_findings || false]);
        // Update study status
        await db.query(`UPDATE imaging_studies SET status = 'reported', reported_at = NOW(), updated_at = NOW() WHERE id = $1 AND tenant_id = $2`, [study_id, req.tenantId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/radiology/reports', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/reports/:id/sign', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE imaging_reports SET signed_at = NOW() WHERE id = $1 AND tenant_id = $2 AND signed_at IS NULL RETURNING id, signed_at
        `, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_signed' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/radiology/reports/:id/sign', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/critical-findings', requireAuth, requireTenantScope, requireRole('doctor', 'radiologist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT r.id, r.study_id, s.patient_id, s.modality, s.body_part, r.findings, r.impression,
                   r.recommendations, r.critical_findings, r.signed_at, r.created_at
            FROM imaging_reports r
            LEFT JOIN imaging_studies s ON s.id = r.study_id
            WHERE r.tenant_id = $1 AND r.critical_findings = true
            ORDER BY r.created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, critical: r.rows });
    } catch (err) { console.error('GET /api/radiology/critical-findings', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'radiologist'), async (req, res) => {
    try {
        const orders = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE status = 'pending') as pending,
                   COUNT(*) FILTER (WHERE status = 'completed') as completed,
                   COUNT(*) FILTER (WHERE modality IN ('CT','MRI')) as advanced,
                   COUNT(*) FILTER (WHERE modality = 'XRAY') as xray,
                   COUNT(*) FILTER (WHERE modality IN ('US','DOPPLER')) as ultrasound
            FROM radiology_orders WHERE tenant_id = $1
        `, [req.tenantId]);
        const studies = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled,
                   COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
                   COUNT(*) FILTER (WHERE status = 'reported') as reported,
                   COUNT(*) FILTER (WHERE status = 'finalized') as finalized
            FROM imaging_studies WHERE tenant_id = $1
        `, [req.tenantId]);
        const reports = await db.query(`
            SELECT COUNT(*) FILTER (WHERE critical_findings = true) as critical_total,
                   COUNT(*) FILTER (WHERE signed_at IS NOT NULL) as signed,
                   COUNT(*) FILTER (WHERE signed_at >= CURRENT_DATE) as signed_today
            FROM imaging_reports WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, orders: orders.rows[0], studies: studies.rows[0], reports: reports.rows[0] });
    } catch (err) { console.error('GET /api/radiology/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['orders', 'studies', 'reports', 'critical-findings', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
