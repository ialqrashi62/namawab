// filepath: namaweb/discharge_planner_router.js
// Discharge planning, summary authoring + digital sign-off/lock + follow-up coordination.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Author / update discharge summary (draft mode)
router.post('/summary', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, admission_date, discharge_date, diagnosis_primary, diagnosis_secondary, procedures, hospital_course, discharge_medications, follow_up, patient_instructions, diet_activity_restrictions, pending_results, authored_by } = req.body;
        if (!patient_id || !diagnosis_primary) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO discharge_summaries (tenant_id, patient_id, admission_date, discharge_date, diagnosis_primary, diagnosis_secondary, procedures, hospital_course, discharge_medications, follow_up, patient_instructions, diet_activity_restrictions, pending_results, authored_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,COALESCE($14,$15)) RETURNING id
        `, [req.tenantId, patient_id, admission_date || null, discharge_date || null, diagnosis_primary, diagnosis_secondary || '', procedures || '', hospital_course || '', discharge_medications || '', follow_up || '', patient_instructions || '', diet_activity_restrictions || '', pending_results || '', authored_by, req.userName || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id, status: 'draft' });
    } catch (err) { console.error('POST /api/dcp/summary', err); res.status(500).json({ error: 'internal_error' }); }
});

// Sign-off (locks the summary)
router.post('/summary/:id/sign', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE discharge_summaries SET signed_at = NOW(), locked_at = NOW() WHERE tenant_id = $1 AND id = $2 RETURNING id, signed_at, locked_at
        `, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, signed: true, locked: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/dcp/summary/sign', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/summary/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, diagnosis_primary, diagnosis_secondary, procedures, hospital_course, discharge_medications, follow_up,
                   patient_instructions, diet_activity_restrictions, pending_results, authored_by, signed_at, locked_at, admission_date, discharge_date, created_at
            FROM discharge_summaries WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 1
        `, [req.tenantId, req.params.patient_id]);
        if (!r.rows.length) return res.json({ ok: true, summary: null });
        const s = r.rows[0];
        s.is_locked = s.locked_at != null;
        res.json({ ok: true, summary: s });
    } catch (err) { console.error('GET /api/dcp/summary', err); res.status(500).json({ error: 'internal_error' }); }
});

// Pending discharge candidates (no summary yet)
router.get('/pending', requireAuth, requireTenantScope, requireRole('discharge_coordinator', 'nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT a.id as admission_id, a.patient_id, a.patient_name, a.admission_date, a.expected_los, a.department,
                   a.diagnosis, ds.id as summary_id, ds.signed_at
            FROM admissions a
            LEFT JOIN discharge_summaries ds ON ds.tenant_id = a.tenant_id AND ds.patient_id = a.patient_id
            WHERE a.tenant_id = $1 AND a.status = 'active'
            ORDER BY a.admission_date ASC LIMIT 100
        `, [req.tenantId]);
        const pending = r.rows.filter(x => !x.signed_at);
        res.json({ ok: true, total: pending.length, total_active: r.rows.length, candidates: pending });
    } catch (err) { console.error('GET /api/dcp/pending', err); res.status(500).json({ error: 'internal_error' }); }
});

// Check completeness of discharge summary
router.get('/completeness/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'discharge_coordinator'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT diagnosis_primary, diagnosis_secondary, discharge_medications, follow_up, patient_instructions, pending_results, signed_at
            FROM discharge_summaries WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 1
        `, [req.tenantId, req.params.patient_id]);
        if (!r.rows.length) return res.json({ ok: true, exists: false, completion_pct: 0 });
        const s = r.rows[0];
        const fields = ['diagnosis_primary', 'diagnosis_secondary', 'discharge_medications', 'follow_up', 'patient_instructions', 'pending_results'];
        let done = 0;
        fields.forEach(f => { if (s[f] && String(s[f]).trim()) done++; });
        const pct = Math.round(100 * done / fields.length);
        res.json({ ok: true, exists: true, completion_pct: pct, signed: !!s.signed_at, fields_done: done });
    } catch (err) { console.error('GET /api/dcp/completeness', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['summary', 'sign', 'pending', 'completeness'], timestamp: new Date().toISOString() });
});

module.exports = router;
