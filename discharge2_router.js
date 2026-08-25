// filepath: namaweb/discharge2_router.js
// Discharge summaries + Medical Records (filing, requests, coding).
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/summaries', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { signed, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (signed === 'true') conditions.push('signed_at IS NOT NULL');
        if (signed === 'false') conditions.push('signed_at IS NULL');
        if (days) { params.push(+days); conditions.push(`discharge_date >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, authored_by, admission_date, discharge_date,
                   diagnosis_primary, diagnosis_secondary, procedures, hospital_course,
                   discharge_medications, follow_up, patient_instructions, signed_at, locked_at, created_at
            FROM discharge_summaries WHERE ${conditions.join(' AND ')}
            ORDER BY discharge_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, summaries: r.rows });
    } catch (err) { console.error('GET /api/dc2/summaries', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/summaries', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, admission_date, discharge_date, diagnosis_primary, diagnosis_secondary, procedures, hospital_course, discharge_medications, follow_up, patient_instructions, diet_activity_restrictions, pending_results } = req.body;
        if (!patient_id || !admission_date || !discharge_date || !diagnosis_primary) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'admission_date', 'discharge_date', 'diagnosis_primary'] });
        const r = await db.query(`
            INSERT INTO discharge_summaries (tenant_id, patient_id, authored_by, admission_date, discharge_date, diagnosis_primary, diagnosis_secondary, procedures, hospital_course, discharge_medications, follow_up, patient_instructions, diet_activity_restrictions, pending_results)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id
        `, [req.tenantId, patient_id, req.userId || req.userName || '', admission_date, discharge_date, diagnosis_primary, diagnosis_secondary || '', procedures || '', hospital_course || '', JSON.stringify(discharge_medications || []), follow_up || '', patient_instructions || '', diet_activity_restrictions || '', pending_results || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/dc2/summaries', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/summaries/:id/sign', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(`UPDATE discharge_summaries SET signed_at = NOW() WHERE id = $1 AND tenant_id = $2 AND signed_at IS NULL RETURNING id, signed_at`, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_signed' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/dc2/summaries/:id/sign', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/pending-signature', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, authored_by, discharge_date, diagnosis_primary, created_at
            FROM discharge_summaries WHERE tenant_id = $1 AND signed_at IS NULL
            ORDER BY created_at ASC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, pending: r.rows });
    } catch (err) { console.error('GET /api/dc2/pending-signature', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/med-records', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, file_number, location, shelf_number, status,
                   last_requested_by, last_requested_at, notes, created_at
            FROM medical_records_files WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, files: r.rows });
    } catch (err) { console.error('GET /api/dc2/med-records', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/med-records/requests', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, file_number, requested_by, department, purpose,
                   status, requested_at, delivered_at, returned_at, created_at
            FROM medical_records_requests WHERE ${conditions.join(' AND ')}
            ORDER BY requested_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, requests: r.rows });
    } catch (err) { console.error('GET /api/dc2/med-records/requests', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/med-records/requests/:id/return', requireAuth, requireTenantScope, requireRole('admin', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE medical_records_requests SET status = 'returned', returned_at = NOW() WHERE id = $1 AND tenant_id = $2 RETURNING id, status
        `, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/dc2/med-records/requests/:id/return', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/coding', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'coder'), async (req, res) => {
    try {
        const { status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, visit_id, primary_diagnosis, primary_icd10,
                   secondary_diagnoses, drg_code, coder, coding_date, status, created_at
            FROM medical_records_coding WHERE ${conditions.join(' AND ')}
            ORDER BY coding_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, coding: r.rows });
    } catch (err) { console.error('GET /api/dc2/coding', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/coding', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, visit_id, primary_diagnosis, primary_icd10, secondary_diagnoses, drg_code, notes } = req.body;
        if (!patient_id || !primary_diagnosis || !primary_icd10) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO medical_records_coding (tenant_id, patient_id, visit_id, primary_diagnosis, primary_icd10, secondary_diagnoses, drg_code, coder, coding_date, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE,'completed') RETURNING id
        `, [req.tenantId, patient_id, visit_id || null, primary_diagnosis, primary_icd10, secondary_diagnoses || '', drg_code || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/dc2/coding', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const s = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE signed_at IS NOT NULL) as signed,
                   COUNT(*) FILTER (WHERE signed_at IS NULL) as unsigned,
                   COUNT(*) FILTER (WHERE discharge_date >= CURRENT_DATE) as discharged_today,
                   COUNT(*) FILTER (WHERE discharge_date >= CURRENT_DATE - INTERVAL '7 days') as discharged_7d
            FROM discharge_summaries WHERE tenant_id = $1
        `, [req.tenantId]);
        const mr = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status IN ('out','checked_out')) as checked_out,
                   COUNT(*) as total_files
            FROM medical_records_files WHERE tenant_id = $1
        `, [req.tenantId]);
        const c = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status = 'completed') as total_coded,
                   COUNT(*) FILTER (WHERE coding_date >= CURRENT_DATE) as coded_today
            FROM medical_records_coding WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, summaries: s.rows[0], med_records_files: mr.rows[0], coding: c.rows[0] });
    } catch (err) { console.error('GET /api/dc2/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['summaries', 'med-records', 'requests', 'coding', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
