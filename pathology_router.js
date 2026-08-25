// filepath: namaweb/pathology_router.js
// Pathology lab: specimen lifecycle (gross → block → slide → report) with sign-off.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Specimen accessioned
router.post('/specimens', requireAuth, requireTenantScope, requireRole('pathologist', 'lab_tech'), async (req, res) => {
    try {
        const { patient_id, visit_id, accession_number, specimen_type, site, clinical_details, priority } = req.body;
        if (!patient_id || !specimen_type) return res.status(400).json({ error: 'missing_required' });
        const accNo = accession_number || 'ACC-' + Date.now();
        const r = await db.query(`
            INSERT INTO path_specimens (tenant_id, patient_id, visit_id, accession_number, specimen_type, site, clinical_details, priority, state, received_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'routine'), 'received', NOW()) RETURNING id, accession_number
        `, [req.tenantId, patient_id, visit_id || null, accNo, specimen_type, site || '', clinical_details || '', priority]);
        res.status(201).json({ ok: true, id: r.rows[0].id, accession_number: r.rows[0].accession_number });
    } catch (err) { console.error('POST /api/pth/specimens', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/specimens', requireAuth, requireTenantScope, requireRole('pathologist', 'doctor'), async (req, res) => {
    try {
        const { state, priority, patient_id } = req.query;
        let sql = `SELECT id, patient_id, accession_number, specimen_type, site, priority, state, received_at, blocks_count FROM path_specimens WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (state) { params.push(state); sql += ` AND state = $${params.length}`; }
        if (priority) { params.push(priority); sql += ` AND priority = $${params.length}`; }
        if (patient_id) { params.push(patient_id); sql += ` AND patient_id = $${params.length}`; }
        sql += ` ORDER BY received_at DESC LIMIT 200`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, specimens: r.rows });
    } catch (err) { console.error('GET /api/pth/specimens', err); res.status(500).json({ error: 'internal_error' }); }
});

// Block creation (paraffin)
router.post('/blocks', requireAuth, requireTenantScope, requireRole('pathologist', 'lab_tech'), async (req, res) => {
    try {
        const { specimen_id, block_no, cassette_label, embedding_type } = req.body;
        if (!specimen_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO path_blocks (tenant_id, specimen_id, block_no, cassette_label, embedding_type) VALUES ($1, $2, $3, $4, COALESCE($5, 'paraffin')) RETURNING id`, [req.tenantId, specimen_id, block_no || 1, cassette_label || '', embedding_type]);
        await db.query(`UPDATE path_specimens SET blocks_count = COALESCE(blocks_count, 0) + 1 WHERE tenant_id = $1 AND id = $2`, [req.tenantId, specimen_id]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pth/blocks', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/blocks/:specimen_id', requireAuth, requireTenantScope, requireRole('pathologist', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, block_no, cassette_label, embedding_type, created_at FROM path_blocks WHERE tenant_id = $1 AND specimen_id = $2 ORDER BY block_no`, [req.tenantId, req.params.specimen_id]);
        res.json({ ok: true, total: r.rows.length, blocks: r.rows });
    } catch (err) { console.error('GET /api/pth/blocks', err); res.status(500).json({ error: 'internal_error' }); }
});

// Slide cutting
router.post('/slides', requireAuth, requireTenantScope, requireRole('lab_tech', 'pathologist'), async (req, res) => {
    try {
        const { block_id, specimen_id, slide_no, stain_type, cut_date } = req.body;
        if (!block_id) return res.status(400).json({ error: 'block_required' });
        const r = await db.query(`INSERT INTO path_slides (tenant_id, block_id, specimen_id, slide_no, stain_type, cut_date) VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE)) RETURNING id`, [req.tenantId, block_id, specimen_id || null, slide_no || 1, stain_type || 'H&E', cut_date]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pth/slides', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/slides/:specimen_id', requireAuth, requireTenantScope, requireRole('pathologist', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, slide_no, stain_type, cut_date, created_at FROM path_slides WHERE tenant_id = $1 AND specimen_id = $2 ORDER BY slide_no`, [req.tenantId, req.params.specimen_id]);
        res.json({ ok: true, total: r.rows.length, slides: r.rows });
    } catch (err) { console.error('GET /api/pth/slides', err); res.status(500).json({ error: 'internal_error' }); }
});

// Report authoring + sign-off
router.post('/reports', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { specimen_id, gross_text, micro_text, diagnosis, snomed_codes, icd10_codes, malignancy_flag, critical_flag } = req.body;
        if (!specimen_id || !diagnosis) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO pathology_reports (tenant_id, specimen_id, pathologist_id, gross_text, micro_text, diagnosis, snomed_codes, icd10_codes, malignancy_flag, critical_flag, state)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, false), COALESCE($10, false), 'final')
            RETURNING id
        `, [req.tenantId, specimen_id, req.userName || '', gross_text || '', micro_text || '', diagnosis, snomed_codes || '', icd10_codes || '', malignancy_flag, critical_flag]);
        await db.query(`UPDATE path_specimens SET state = 'reported' WHERE tenant_id = $1 AND id = $2`, [req.tenantId, specimen_id]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pth/reports', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/reports/:id/sign', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const r = await db.query(`UPDATE pathology_reports SET state = 'signed', signed_at = NOW(), signed_by = $2 WHERE tenant_id = $1 AND id = $3 RETURNING id, state, signed_at, signed_by`, [req.tenantId, req.userName || '', req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/pth/reports/sign', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/reports/:id/addendum', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { addendum_text } = req.body;
        if (!addendum_text) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`UPDATE pathology_reports SET addenda = COALESCE(addenda,'') || E'\\n' || $2, addendum_count = COALESCE(addendum_count,0) + 1 WHERE tenant_id = $1 AND id = $3 RETURNING id, addendum_count`, [req.tenantId, addendum_text, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, addendum_count: r.rows[0].addendum_count });
    } catch (err) { console.error('POST /api/pth/reports/addendum', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/reports/:patient_id', requireAuth, requireTenantScope, requireRole('pathologist', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT r.id, r.specimen_id, r.diagnosis, r.snomed_codes, r.icd10_codes, r.malignancy_flag, r.critical_flag, r.state, r.signed_at, s.specimen_type, s.accession_number FROM pathology_reports r LEFT JOIN path_specimens s ON s.tenant_id = r.tenant_id AND s.id = r.specimen_id WHERE r.tenant_id = $1 AND s.patient_id = $2 ORDER BY r.created_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, reports: r.rows });
    } catch (err) { console.error('GET /api/pth/reports', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/critical', requireAuth, requireTenantScope, requireRole('pathologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, specimen_id, diagnosis, malignancy_flag, critical_flag, state, signed_at FROM pathology_reports WHERE tenant_id = $1 AND (critical_flag = true OR malignancy_flag = true) ORDER BY created_at DESC LIMIT 50`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, alerts: r.rows });
    } catch (err) { console.error('GET /api/pth/critical', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('pathologist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT COUNT(*) FILTER (WHERE priority = 'stat') as stat_count,
                   COUNT(*) FILTER (WHERE state = 'received') as pending_grossing,
                   COUNT(*) FILTER (WHERE state = 'reported') as reported,
                   COUNT(*) FILTER (WHERE signed_at IS NOT NULL) as signed,
                   COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_total
            FROM path_specimens WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, stats: r.rows[0] });
    } catch (err) { console.error('GET /api/pth/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['specimens', 'blocks', 'slides', 'reports', 'sign', 'addendum', 'critical', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
