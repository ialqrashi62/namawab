// filepath: namaweb/discharge_router.js
'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const dischargeEngine = require('./discharge_summary_engine');

router.post('/generate', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const patientId = +req.body.patient_id;
        if (!patientId) return res.status(400).json({ error: 'missing_patient_id' });
        const result = await dischargeEngine.generateDischargeSummary(req.tenantId, patientId, { diagnosis_primary: req.body.diagnosis_primary || '' });
        if (result.error) return res.status(404).json({ error: result.error });
        res.json({ ok: true, ...result });
    } catch (err) {
        console.error('POST /api/discharge/generate', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.post('/', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, discharge_date, diagnosis_primary, diagnosis_secondary, procedures, hospital_course,
            discharge_medications, follow_up, patient_instructions, diet_activity_restrictions, pending_results } = req.body;
        if (!patient_id || !discharge_date) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'discharge_date'] });
        const result = await db.query(`
            INSERT INTO discharge_summaries
                (tenant_id, patient_id, authored_by, discharge_date, diagnosis_primary, diagnosis_secondary, procedures,
                 hospital_course, discharge_medications, follow_up, patient_instructions, diet_activity_restrictions, pending_results)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id
        `, [req.tenantId, patient_id, req.userId, discharge_date, diagnosis_primary || '',
            JSON.stringify(diagnosis_secondary || []), JSON.stringify(procedures || []),
            hospital_course || '', JSON.stringify(discharge_medications || []),
            follow_up || '', patient_instructions || '', diet_activity_restrictions || '', pending_results || '']);
        res.status(201).json({ ok: true, id: result.rows[0].id });
    } catch (err) {
        console.error('POST /api/discharge', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const patientId = req.query.patient_id;
        if (!patientId) return res.status(400).json({ error: 'missing_patient_id' });
        const result = await db.query(`
            SELECT id, discharge_date, diagnosis_primary, signed_at, locked_at, created_at, authored_by
            FROM discharge_summaries WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY discharge_date DESC LIMIT 20
        `, [req.tenantId, patientId]);
        res.json({ ok: true, total: result.rows.length, summaries: result.rows });
    } catch (err) {
        console.error('GET /api/discharge', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/:id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM discharge_summaries WHERE id = $1 AND tenant_id = $2
        `, [req.params.id, req.tenantId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, summary: result.rows[0] });
    } catch (err) {
        console.error('GET /api/discharge/:id', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.post('/:id/sign', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const result = await db.query(`
            UPDATE discharge_summaries SET signed_at = NOW(), locked_at = NOW(), updated_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND signed_at IS NULL RETURNING id, signed_at
        `, [req.params.id, req.tenantId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_signed' });
        res.json({ ok: true, ...result.rows[0] });
    } catch (err) {
        console.error('POST /api/discharge/sign', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', timestamp: new Date().toISOString() });
});

module.exports = router;