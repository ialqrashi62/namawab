'use strict';
// Wave 97 — Lab Ops: QC tracking + critical callbacks + microbiology
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_WESTGARD = ['1_2s','1_3s','2_2s','R_4s','4_1s','10x','8x','12x','in_control','unknown'];
const VALID_LEVEL = ['L1','L2','L3','normal','abnormal_low','abnormal_high'];
const VALID_MICRO_STATUS = ['preliminary','final','corrected','cancelled'];
const VALID_SAMPLE_STATE = ['pending','collected','received','processing','completed','rejected'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'lab-ops',
        endpoints: [
            'GET /qc',
            'GET /qc/:id',
            'POST /qc',
            'GET /qc/breaches',
            'GET /qc/by-analyzer',
            'GET /callbacks',
            'POST /callbacks',
            'POST /callbacks/:id/acknowledge',
            'GET /micro',
            'GET /micro/:id',
            'POST /micro',
            'GET /micro/patient/:patientId',
            'GET /micro/critical',
            'GET /samples',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== QC =====
router.get('/qc', requireAuth, requireTenantScope, requireRole('lab_supervisor'), async (req, res) => {
    try {
        const { analyzer, analyte, level, breach, westgard_flag, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT q.*, u.full_name AS entered_by_name FROM lab_qc q LEFT JOIN users u ON u.id = q.entered_by WHERE q.tenant_id = $1`;
        if (analyzer) { sql += ` AND q.analyzer = $${params.length + 1}`; params.push(analyzer); }
        if (analyte) { sql += ` AND q.analyte = $${params.length + 1}`; params.push(analyte); }
        if (level) { sql += ` AND q.level = $${params.length + 1}`; params.push(level); }
        if (breach !== undefined) { sql += ` AND q.breach = $${params.length + 1}`; params.push(breach === 'true'); }
        if (westgard_flag) { sql += ` AND q.westgard_flag = $${params.length + 1}`; params.push(westgard_flag); }
        sql += ` ORDER BY q.at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/qc/:id', requireAuth, requireTenantScope, requireRole('lab_supervisor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM lab_qc WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'qc_not_found' });
        res.json({ ok: true, qc: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/qc', requireAuth, requireTenantScope, requireRole('lab_supervisor'), async (req, res) => {
    try {
        const { analyzer, analyte, level, value, target, sd, westgard_flag = 'in_control', reagent_lot, entered_by, at = new Date() } = req.body;
        if (!analyzer) return res.status(400).json({ ok: false, error: 'analyzer_required' });
        if (!analyte) return res.status(400).json({ ok: false, error: 'analyte_required' });
        if (value === undefined) return res.status(400).json({ ok: false, error: 'value_required' });
        if (!VALID_WESTGARD.includes(westgard_flag)) return res.status(400).json({ ok: false, error: 'invalid_westgard_flag' });

        let breach = false;
        let z = null;
        if (target !== undefined && sd !== undefined && sd !== 0) z = Math.round(((parseFloat(value) - parseFloat(target)) / parseFloat(sd)) * 100) / 100;
        if (z !== null && Math.abs(z) > 3) breach = true;
        if (['1_3s','R_4s','10x'].includes(westgard_flag)) breach = true;

        const r = await db.query(
            `INSERT INTO lab_qc (tenant_id, analyzer, analyte, level, value, target, sd, z, westgard_flag, breach, reagent_lot, entered_by, at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [req.tenantId, analyzer, analyte, level || 'L1', value, target || null, sd || null, z, westgard_flag, breach, reagent_lot || null, entered_by || req.user?.id || null, at]
        );
        res.status(201).json({ ok: true, qc: r.rows[0], z, breach });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/qc/breaches', requireAuth, requireTenantScope, requireRole('lab_supervisor'), async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const r = await db.query(
            `SELECT q.*, u.full_name AS entered_by_name FROM lab_qc q LEFT JOIN users u ON u.id = q.entered_by
             WHERE q.tenant_id = $1 AND q.breach = true AND q.at >= NOW() - ($2 || ' days')::INTERVAL ORDER BY q.at DESC LIMIT 200`,
            [req.tenantId, days]
        );
        res.json({ ok: true, days: parseInt(days), count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/qc/by-analyzer', requireAuth, requireTenantScope, requireRole('lab_supervisor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT analyzer, COUNT(*) AS total, COUNT(*) FILTER (WHERE breach = true) AS breaches,
                    AVG(z)::NUMERIC(10,2) AS avg_z, COUNT(DISTINCT analyte) AS analytes
             FROM lab_qc WHERE tenant_id = $1 AND at >= NOW() - INTERVAL '90 days' GROUP BY analyzer ORDER BY total DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, analyzers: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CRITICAL CALLBACKS =====
router.get('/callbacks', requireAuth, requireTenantScope, requireRole('lab_supervisor'), async (req, res) => {
    try {
        const { acknowledged, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT c.*, u.full_name AS notified_by_name FROM lab_critical_callbacks c LEFT JOIN users u ON u.id = c.notified_by WHERE c.tenant_id = $1`;
        if (acknowledged !== undefined) { sql += ` AND c.ack = $${params.length + 1}`; params.push(acknowledged === 'true'); }
        sql += ` ORDER BY c.notified_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/callbacks', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { result_id, notified_to, notified_by, notes } = req.body;
        if (!result_id) return res.status(400).json({ ok: false, error: 'result_id_required' });
        if (!notified_to) return res.status(400).json({ ok: false, error: 'notified_to_required' });

        const r = await db.query(
            `INSERT INTO lab_critical_callbacks (tenant_id, result_id, notified_to, notified_by, notified_by_name, notes)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [req.tenantId, result_id, notified_to, notified_by || req.user?.id || null, req.user?.full_name || null, notes || null]
        );
        res.status(201).json({ ok: true, callback: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/callbacks/:id/acknowledge', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { ack_text } = req.body;
        const r = await db.query(
            `UPDATE lab_critical_callbacks SET ack = true, notes = COALESCE($3, notes) || ' [ACK by ' || $4 || ' at ' || NOW() || ']'
             WHERE tenant_id = $1 AND id = $2 AND ack = false RETURNING *`,
            [req.tenantId, req.params.id, ack_text || '', req.user?.full_name || req.user?.id || 'unknown']
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'already_acknowledged_or_not_found' });
        res.json({ ok: true, callback: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MICROBIOLOGY =====
router.get('/micro', requireAuth, requireTenantScope, requireRole('microbiologist'), async (req, res) => {
    try {
        const { patient_id, report_status, organism, critical_value, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT m.*, p.full_name AS patient_name, p.mrn FROM lab_microbiology m LEFT JOIN patients p ON p.id = m.patient_id WHERE m.tenant_id = $1`;
        if (patient_id) { sql += ` AND m.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (report_status) { sql += ` AND m.report_status = $${params.length + 1}`; params.push(report_status); }
        if (organism) { sql += ` AND m.organism_identified ILIKE $${params.length + 1}`; params.push(`%${organism}%`); }
        if (critical_value !== undefined) { sql += ` AND m.critical_value = $${params.length + 1}`; params.push(critical_value === 'true'); }
        sql += ` ORDER BY m.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/micro/:id', requireAuth, requireTenantScope, requireRole('microbiologist'), async (req, res) => {
    try {
        const r = await db.query(`SELECT m.*, p.full_name AS patient_name FROM lab_microbiology m LEFT JOIN patients p ON p.id = m.patient_id WHERE m.tenant_id = $1 AND m.id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'micro_report_not_found' });
        res.json({ ok: true, report: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/micro', requireAuth, requireTenantScope, requireRole('microbiologist'), async (req, res) => {
    try {
        const { order_id, patient_id, admission_id, specimen_type, collection_date, collection_time, collection_site, gram_stain, preliminary_result, organism_identified, colony_count, loinc_code, reported_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!specimen_type) return res.status(400).json({ ok: false, error: 'specimen_type_required' });

        const r = await db.query(
            `INSERT INTO lab_microbiology (order_id, patient_id, admission_id, specimen_type, collection_date, collection_time, collection_site, gram_stain, preliminary_result, organism_identified, colony_count, loinc_code, reported_by, report_status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'preliminary',$14) RETURNING *`,
            [order_id || null, patient_id, admission_id || null, specimen_type, collection_date || null, collection_time || null,
             collection_site || null, gram_stain || null, preliminary_result || null,
             organism_identified || null, colony_count || null, loinc_code || null,
             reported_by || req.user?.id || null, req.tenantId]
        );
        res.status(201).json({ ok: true, report: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/micro/patient/:patientId', requireAuth, requireTenantScope, requireRole('microbiologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM lab_microbiology WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 30`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/micro/critical', requireAuth, requireTenantScope, requireRole('microbiologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT m.*, p.full_name AS patient_name FROM lab_microbiology m LEFT JOIN patients p ON p.id = m.patient_id
             WHERE m.tenant_id = $1 AND m.critical_value = true ORDER BY m.created_at DESC LIMIT 100`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows, alert: 'Critical microbiology findings (e.g., positive blood cultures, MRSA bacteremia).' });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SAMPLES (basic read) =====
router.get('/samples', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { state, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name FROM lab_samples s LEFT JOIN patients p ON p.id = s.patient_id WHERE s.tenant_id = $1`;
        if (state) { sql += ` AND s.state = $${params.length + 1}`; params.push(state); }
        sql += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const qc = await db.query(
            `SELECT COUNT(*) AS total_qc, COUNT(*) FILTER (WHERE breach = true) AS breaches, COUNT(DISTINCT analyzer) AS analyzers
             FROM lab_qc WHERE tenant_id = $1 AND at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const cb = await db.query(
            `SELECT COUNT(*) AS total_callbacks, COUNT(*) FILTER (WHERE ack = true) AS acknowledged
             FROM lab_critical_callbacks WHERE tenant_id = $1 AND notified_at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const mi = await db.query(
            `SELECT report_status, COUNT(*) AS count FROM lab_microbiology WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY report_status`,
            [req.tenantId]
        );
        res.json({ ok: true, qc_90d: qc.rows[0], callbacks_90d: cb.rows[0], micro_status: mi.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
