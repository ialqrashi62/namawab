'use strict';
// Wave 93 — Patient Problem List: ICD-10/SNOMED-coded diagnoses with active/resolved
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_SEVERITY = ['mild','moderate','severe','critical','life_threatening'];
const VALID_STATUS = ['active','inactive','resolved','remission','ruled_out'];
const VALID_TYPES = ['diagnosis','symptom','finding','risk_factor','condition'];

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'problem-list',
        endpoints: [
            'GET /problems',
            'GET /problems/:id',
            'POST /problems',
            'PUT /problems/:id',
            'POST /problems/:id/resolve',
            'GET /problems/patient/:patientId',
            'GET /problems/patient/:patientId/principal',
            'GET /active',
            'GET /by-icd10/:code',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/problems', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, icd10_code, status, is_active, severity, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT p.*, pt.full_name AS patient_name, pt.mrn, u.full_name AS added_by_name FROM patient_problem_list p
                   LEFT JOIN patients pt ON pt.id = p.patient_id LEFT JOIN users u ON u.id = p.added_by_id WHERE p.tenant_id = $1`;
        if (patient_id) { sql += ` AND p.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (icd10_code) { sql += ` AND p.icd10_code = $${params.length + 1}`; params.push(icd10_code); }
        if (status) { sql += ` AND p.status = $${params.length + 1}`; params.push(status); }
        if (is_active !== undefined) { sql += ` AND p.is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        if (severity) { sql += ` AND p.severity = $${params.length + 1}`; params.push(severity); }
        sql += ` ORDER BY p.is_active DESC, p.onset_date DESC NULLS LAST, p.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/problems/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT p.*, pt.full_name AS patient_name, pt.mrn FROM patient_problem_list p
             LEFT JOIN patients pt ON pt.id = p.patient_id WHERE p.tenant_id = $1 AND p.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'problem_not_found' });
        res.json({ ok: true, problem: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/problems', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, icd10_code, icd10_description, snomed_code, problem_name, problem_type, onset_date, severity = 'moderate', status = 'active', is_active = true, principal_diagnosis = false, notes, added_by, added_by_id } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!problem_name) return res.status(400).json({ ok: false, error: 'problem_name_required' });
        if (!VALID_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity' });
        if (!VALID_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (problem_type && !VALID_TYPES.includes(problem_type)) return res.status(400).json({ ok: false, error: 'invalid_problem_type' });
        if (principal_diagnosis && status !== 'active') return res.status(400).json({ ok: false, error: 'principal_diagnosis_must_be_active' });

        const r = await db.query(
            `INSERT INTO patient_problem_list (patient_id, icd10_code, icd10_description, snomed_code, problem_name, problem_type, onset_date, severity, status, is_active, principal_diagnosis, notes, added_by, added_by_id, last_updated_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
            [patient_id, icd10_code || null, icd10_description || null, snomed_code || null, problem_name, problem_type || null,
             onset_date || null, severity, status, is_active, principal_diagnosis, notes || null,
             added_by || req.user?.full_name || null, added_by_id || req.user?.id || null,
             added_by_id || req.user?.id || null, req.tenantId]
        );
        res.status(201).json({ ok: true, problem: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/problems/:id', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const allowed = ['icd10_code','icd10_description','snomed_code','problem_name','problem_type','severity','status','is_active','notes','principal_diagnosis','last_updated_by'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) {
                if (k === 'severity' && !VALID_SEVERITY.includes(req.body[k])) return res.status(400).json({ ok: false, error: 'invalid_severity' });
                if (k === 'status' && !VALID_STATUS.includes(req.body[k])) return res.status(400).json({ ok: false, error: 'invalid_status' });
                if (k === 'problem_type' && req.body[k] && !VALID_TYPES.includes(req.body[k])) return res.status(400).json({ ok: false, error: 'invalid_problem_type' });
                sets.push(`${k} = $${i++}`); params.push(req.body[k]);
            }
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        sets.push(`updated_at = NOW()`);
        const r = await db.query(
            `UPDATE patient_problem_list SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            params
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'problem_not_found' });
        res.json({ ok: true, problem: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/problems/:id/resolve', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { resolved_date = new Date() } = req.body;
        const r = await db.query(
            `UPDATE patient_problem_list SET status = 'resolved', is_active = false, resolved_date = $3, principal_diagnosis = false
             WHERE tenant_id = $1 AND id = $2 AND is_active = true RETURNING *`,
            [req.tenantId, req.params.id, resolved_date]
        );
        if (!r.rows.length) return res.status(409).json({ ok: false, error: 'not_found_or_already_inactive' });
        res.json({ ok: true, problem: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/problems/patient/:patientId', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM patient_problem_list WHERE tenant_id = $1 AND patient_id = $2
             ORDER BY is_active DESC, principal_diagnosis DESC, severity DESC, onset_date DESC NULLS LAST`,
            [req.tenantId, req.params.patientId]
        );
        const active = r.rows.filter(x => x.is_active);
        const resolved = r.rows.filter(x => !x.is_active);
        res.json({ ok: true, count: r.rows.length, active_count: active.length, resolved_count: resolved.length, active, resolved });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/problems/patient/:patientId/principal', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM patient_problem_list WHERE tenant_id = $1 AND patient_id = $2 AND principal_diagnosis = true AND is_active = true LIMIT 1`,
            [req.tenantId, req.params.patientId]
        );
        if (!r.rows.length) return res.json({ ok: true, principal: null, message: 'No principal diagnosis set. Use principal_diagnosis=true when creating to designate.' });
        res.json({ ok: true, principal: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/active', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT p.*, pt.full_name AS patient_name, pt.mrn, u.full_name AS added_by_name FROM patient_problem_list p
             LEFT JOIN patients pt ON pt.id = p.patient_id LEFT JOIN users u ON u.id = p.added_by_id
             WHERE p.tenant_id = $1 AND p.is_active = true ORDER BY p.created_at DESC LIMIT 200`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/by-icd10/:code', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT p.*, pt.full_name AS patient_name FROM patient_problem_list p LEFT JOIN patients pt ON pt.id = p.patient_id
             WHERE p.tenant_id = $1 AND p.icd10_code = $2 ORDER BY p.created_at DESC LIMIT 100`,
            [req.tenantId, req.params.code]
        );
        res.json({ ok: true, icd10_code: req.params.code, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE is_active = true) AS active,
                    COUNT(*) FILTER (WHERE is_active = false) AS resolved,
                    COUNT(*) FILTER (WHERE severity = 'critical' OR severity = 'life_threatening') AS critical
             FROM patient_problem_list WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const byType = await db.query(
            `SELECT problem_type, COUNT(*) AS count FROM patient_problem_list WHERE tenant_id = $1 AND problem_type IS NOT NULL
             GROUP BY problem_type ORDER BY count DESC`,
            [req.tenantId]
        );
        const topIcd10 = await db.query(
            `SELECT icd10_code, icd10_description, COUNT(*) AS count FROM patient_problem_list
             WHERE tenant_id = $1 AND icd10_code IS NOT NULL AND created_at >= NOW() - INTERVAL '90 days'
             GROUP BY icd10_code, icd10_description ORDER BY count DESC LIMIT 25`,
            [req.tenantId]
        );
        res.json({ ok: true, summary_90d: r.rows[0], by_type: byType.rows, top_icd10: topIcd10.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
