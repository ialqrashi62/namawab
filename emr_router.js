// filepath: namaweb/emr_router.js
// EMR / medical records: charts, file custody + access logging, ICD-10 coding, access audit.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// --- Clinical record creation (template-driven) ---
router.post('/record', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, encounter_id, template_id, recorded_values } = req.body;
        if (!patient_id || !template_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO clinical_records (tenant_id, patient_id, encounter_id, template_id, recorded_values, doctor_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`, [req.tenantId, patient_id, encounter_id || null, template_id, JSON.stringify(recorded_values || {}), req.userName || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/emr/record', err); res.status(500).json({ error: 'internal_error' }); }
});

// Lock + sign (doctor immutability)
router.post('/record/:id/lock', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { signature } = req.body;
        if (!signature) return res.status(400).json({ error: 'signature_required' });
        const r = await db.query(`UPDATE clinical_records SET is_locked = true, signature = $2, locked_at = NOW() WHERE tenant_id = $1 AND id = $3 RETURNING id, locked_at`, [req.tenantId, signature, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, locked: true, locked_at: r.rows[0].locked_at });
    } catch (err) { console.error('POST /api/emr/record/lock', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/records/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, encounter_id, template_id, recorded_values, doctor_id, is_locked, signature, created_at FROM clinical_records WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        // Audit access
        await db.query(`INSERT INTO record_access_log (tenant_id, patient_id, access_type, accessor_id) VALUES ($1, $2, 'records_read', $3)`, [req.tenantId, req.params.patient_id, req.userName || '']);
        res.json({ ok: true, total: r.rows.length, records: r.rows });
    } catch (err) { console.error('GET /api/emr/records', err); res.status(500).json({ error: 'internal_error' }); }
});

// --- File custody: request + deliver + return ---
router.post('/file/request', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin', 'receptionist'), async (req, res) => {
    try {
        const { file_number, requested_by, department, purpose } = req.body;
        if (!file_number) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO medical_records_requests (tenant_id, file_number, requested_by, department, purpose, status, requested_at) VALUES ($1, $2, $3, $4, $5, 'requested', NOW()) RETURNING id`, [req.tenantId, file_number, requested_by || req.userName || '', department || '', purpose || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/emr/file/request', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/file/deliver/:id', requireAuth, requireTenantScope, requireRole('records_clerk', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`UPDATE medical_records_requests SET status = 'delivered', delivered_at = NOW() WHERE tenant_id = $1 AND id = $2 RETURNING id, file_number`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        // Update master file
        await db.query(`UPDATE medical_records SET status = 'in_use', last_requested_at = NOW() WHERE tenant_id = $1 AND file_number = $2`, [req.tenantId, r.rows[0].file_number]);
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/emr/file/deliver', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/file/return/:id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'records_clerk'), async (req, res) => {
    try {
        const r = await db.query(`UPDATE medical_records_requests SET status = 'returned', returned_at = NOW() WHERE tenant_id = $1 AND id = $2 RETURNING id, file_number`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        await db.query(`UPDATE medical_records SET status = 'available' WHERE tenant_id = $1 AND file_number = $2`, [req.tenantId, r.rows[0].file_number]);
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/emr/file/return', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/file/requests', requireAuth, requireTenantScope, requireRole('records_clerk', 'admin'), async (req, res) => {
    try {
        const { status } = req.query;
        let sql = `SELECT id, file_number, requested_by, department, purpose, status, requested_at, delivered_at, returned_at FROM medical_records_requests WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (status) { params.push(status); sql += ` AND status = $${params.length}`; } else sql += ` AND status != 'returned'`;
        sql += ` ORDER BY requested_at DESC LIMIT 100`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, requests: r.rows });
    } catch (err) { console.error('GET /api/emr/file/requests', err); res.status(500).json({ error: 'internal_error' }); }
});

// --- ICD-10 coding (CDI workflow) ---
router.post('/coding', requireAuth, requireTenantScope, requireRole('coder', 'doctor'), async (req, res) => {
    try {
        const { patient_id, visit_id, primary_diagnosis, primary_icd10, secondary_diagnoses, drg_code, coder } = req.body;
        if (!patient_id || !primary_icd10) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO medical_records_coding (tenant_id, patient_id, visit_id, primary_diagnosis, primary_icd10, secondary_diagnoses, drg_code, coder, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'coded') RETURNING id`, [req.tenantId, patient_id, visit_id || null, primary_diagnosis || '', primary_icd10, secondary_diagnoses || '', drg_code || '', coder || req.userName || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/emr/coding', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/coding/:id/review', requireAuth, requireTenantScope, requireRole('doctor', 'senior_coder'), async (req, res) => {
    try {
        const r = await db.query(`UPDATE medical_records_coding SET status = 'reviewed', coding_date = CURRENT_DATE WHERE tenant_id = $1 AND id = $2 RETURNING id, status`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/emr/coding/review', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/coding/:patient_id', requireAuth, requireTenantScope, requireRole('coder', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, visit_id, primary_diagnosis, primary_icd10, drg_code, coder, status, coding_date FROM medical_records_coding WHERE tenant_id = $1 AND patient_id = $2 ORDER BY coding_date DESC NULLS LAST LIMIT 20`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, coding: r.rows });
    } catch (err) { console.error('GET /api/emr/coding', err); res.status(500).json({ error: 'internal_error' }); }
});

// Access log per patient
router.get('/access-log/:patient_id', requireAuth, requireTenantScope, requireRole('compliance_officer', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT access_type, accessor_id, reason, at FROM record_access_log WHERE tenant_id = $1 AND patient_id = $2 ORDER BY at DESC LIMIT 200`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, log: r.rows });
    } catch (err) { console.error('GET /api/emr/access-log', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['record', 'lock', 'file-request', 'file-deliver', 'file-return', 'coding', 'access-log'], timestamp: new Date().toISOString() });
});

module.exports = router;
