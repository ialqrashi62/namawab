'use strict';
// Wave 96 — Pathology: full lab workflow (specimen → blocks → slides → reports)
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_SPECIMEN_STATE = ['received','grossed','processing','embedded','sectioned','stained','reported','cancelled'];
const VALID_REPORT_STATE = ['draft','preliminary','final','amended','cancelled'];
const VALID_PRIORITY = ['routine','urgent','stat'];
const VALID_STAIN = ['H&E','IHC','special','PAS','GMS','Gram','AFB','mucin','trichrome','immunofluorescence'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'pathology',
        endpoints: [
            'GET /specimens',
            'GET /specimens/:id',
            'POST /specimens',
            'PUT /specimens/:id',
            'GET /specimens/:id/blocks',
            'POST /specimens/:id/blocks',
            'GET /specimens/:id/slides',
            'POST /specimens/:id/slides',
            'GET /reports',
            'GET /reports/:id',
            'POST /reports',
            'POST /reports/:id/sign',
            'GET /reports/patient/:patientId',
            'GET /critical-reports',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== SPECIMENS =====
router.get('/specimens', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { patient_id, state, priority, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name, p.mrn FROM path_specimens s LEFT JOIN patients p ON p.id = s.patient_id WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (state) { sql += ` AND s.state = $${params.length + 1}`; params.push(state); }
        if (priority) { sql += ` AND s.priority = $${params.length + 1}`; params.push(priority); }
        sql += ` ORDER BY s.received_at DESC NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/specimens/:id', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT s.*, p.full_name AS patient_name, p.mrn FROM path_specimens s LEFT JOIN patients p ON p.id = s.patient_id
             WHERE s.tenant_id = $1 AND s.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'specimen_not_found' });
        res.json({ ok: true, specimen: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/specimens', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, visit_id, accession_number, specimen_type, site, clinical_details, priority = 'routine', created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!specimen_type) return res.status(400).json({ ok: false, error: 'specimen_type_required' });
        if (!VALID_PRIORITY.includes(priority)) return res.status(400).json({ ok: false, error: 'invalid_priority' });

        const r = await db.query(
            `INSERT INTO path_specimens (tenant_id, patient_id, visit_id, accession_number, specimen_type, site, clinical_details, priority, state, received_at, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'received',NOW(),$9) RETURNING *`,
            [req.tenantId, patient_id, visit_id || null, accession_number || null, specimen_type, site || null, clinical_details || null, priority, created_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, specimen: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/specimens/:id', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const allowed = ['state','site','clinical_details','priority','blocks_count'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) {
                if (k === 'state' && !VALID_SPECIMEN_STATE.includes(req.body[k])) return res.status(400).json({ ok: false, error: 'invalid_state' });
                if (k === 'priority' && !VALID_PRIORITY.includes(req.body[k])) return res.status(400).json({ ok: false, error: 'invalid_priority' });
                sets.push(`${k} = $${i++}`); params.push(req.body[k]);
            }
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        sets.push(`updated_at = NOW()`);
        const r = await db.query(`UPDATE path_specimens SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`, params);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'specimen_not_found' });
        res.json({ ok: true, specimen: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BLOCKS =====
router.get('/specimens/:id/blocks', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM path_blocks WHERE tenant_id = $1 AND specimen_id = $2 ORDER BY block_no`, [req.tenantId, req.params.id]);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/specimens/:id/blocks', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { block_no, cassette_label, embedding_type = 'paraffin' } = req.body;
        if (!block_no) return res.status(400).json({ ok: false, error: 'block_no_required' });
        const r = await db.query(
            `INSERT INTO path_blocks (tenant_id, specimen_id, block_no, cassette_label, embedding_type)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [req.tenantId, req.params.id, block_no, cassette_label || null, embedding_type]
        );
        res.status(201).json({ ok: true, block: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SLIDES =====
router.get('/specimens/:id/slides', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM path_slides WHERE tenant_id = $1 AND specimen_id = $2 ORDER BY slide_no`, [req.tenantId, req.params.id]);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/specimens/:id/slides', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { block_id, slide_no, stain_type, cut_date = new Date() } = req.body;
        if (!slide_no) return res.status(400).json({ ok: false, error: 'slide_no_required' });
        if (!stain_type) return res.status(400).json({ ok: false, error: 'stain_type_required' });
        if (!VALID_STAIN.includes(stain_type)) return res.status(400).json({ ok: false, error: 'invalid_stain_type', valid: VALID_STAIN });
        const r = await db.query(
            `INSERT INTO path_slides (tenant_id, block_id, specimen_id, slide_no, stain_type, cut_date)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [req.tenantId, block_id || null, req.params.id, slide_no, stain_type, cut_date]
        );
        res.status(201).json({ ok: true, slide: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REPORTS =====
router.get('/reports', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { specimen_id, state, pathologist_id, critical_only, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT r.*, p.full_name AS patient_name, p.mrn, ps.specimen_type, u.full_name AS pathologist_name FROM path_reports r
                   LEFT JOIN path_specimens ps ON ps.id = r.specimen_id LEFT JOIN patients p ON p.id = ps.patient_id
                   LEFT JOIN users u ON u.id = r.pathologist_id WHERE r.tenant_id = $1`;
        if (specimen_id) { sql += ` AND r.specimen_id = $${params.length + 1}`; params.push(specimen_id); }
        if (state) { sql += ` AND r.state = $${params.length + 1}`; params.push(state); }
        if (pathologist_id) { sql += ` AND r.pathologist_id = $${params.length + 1}`; params.push(pathologist_id); }
        if (critical_only === 'true') { sql += ` AND r.critical_flag = true`; }
        sql += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/reports/:id', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT r.*, ps.specimen_type, p.full_name AS patient_name, p.mrn FROM path_reports r
             LEFT JOIN path_specimens ps ON ps.id = r.specimen_id LEFT JOIN patients p ON p.id = ps.patient_id
             WHERE r.tenant_id = $1 AND r.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'report_not_found' });
        res.json({ ok: true, report: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/reports', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const { specimen_id, pathologist_id, gross_text, micro_text, diagnosis, snomed_codes, icd10_codes, malignancy_flag = false, critical_flag = false } = req.body;
        if (!specimen_id) return res.status(400).json({ ok: false, error: 'specimen_id_required' });
        if (!diagnosis) return res.status(400).json({ ok: false, error: 'diagnosis_required' });

        const r = await db.query(
            `INSERT INTO path_reports (tenant_id, specimen_id, pathologist_id, gross_text, micro_text, diagnosis, snomed_codes, icd10_codes, malignancy_flag, critical_flag, state)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'draft') RETURNING *`,
            [req.tenantId, specimen_id, pathologist_id || req.user?.id || null, gross_text || null, micro_text || null, diagnosis,
             snomed_codes ? JSON.stringify(snomed_codes) : null, icd10_codes ? JSON.stringify(icd10_codes) : null,
             malignancy_flag, critical_flag]
        );
        res.status(201).json({ ok: true, report: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/reports/:id/sign', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const r = await db.query(
            `UPDATE path_reports SET state = 'final', signed_at = NOW(), signed_by = $3, updated_at = NOW()
             WHERE tenant_id = $1 AND id = $2 AND state IN ('draft','preliminary') AND signed_at IS NULL RETURNING *`,
            [req.tenantId, req.params.id, req.user?.id || null]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'cannot_sign' });
        res.json({ ok: true, report: r.rows[0], signed_at: r.rows[0].signed_at });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/reports/patient/:patientId', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT r.*, ps.specimen_type, ps.accession_number FROM path_reports r
             JOIN path_specimens ps ON ps.id = r.specimen_id
             WHERE r.tenant_id = $1 AND ps.patient_id = $2 ORDER BY r.created_at DESC LIMIT 30`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, latest: r.rows[0] || null, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/critical-reports', requireAuth, requireTenantScope, requireRole('pathologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT r.*, ps.specimen_type, p.full_name AS patient_name, u.full_name AS pathologist_name FROM path_reports r
             JOIN path_specimens ps ON ps.id = r.specimen_id LEFT JOIN patients p ON p.id = ps.patient_id
             LEFT JOIN users u ON u.id = r.pathologist_id
             WHERE r.tenant_id = $1 AND r.critical_flag = true ORDER BY r.created_at DESC LIMIT 100`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows, alert: 'Critical pathology results require immediate clinical communication.' });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const s = await db.query(
            `SELECT state, COUNT(*) AS count FROM path_specimens WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY state`,
            [req.tenantId]
        );
        const r = await db.query(
            `SELECT state, COUNT(*) AS count, COUNT(*) FILTER (WHERE malignancy_flag = true) AS malignant,
                    COUNT(*) FILTER (WHERE critical_flag = true) AS critical
             FROM path_reports WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY state`,
            [req.tenantId]
        );
        res.json({ ok: true, specimens: s.rows, reports: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
