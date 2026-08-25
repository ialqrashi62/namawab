// filepath: namaweb/anesthesia_router.js
// Anesthesia assessments + Pre-op + Pain management.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/assessments', requireAuth, requireTenantScope, requireRole('anesthesiologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, tenant_id, patient_id, encounter_id, age, weight_kg, height_cm, mallampati,
                   airway_class, asa_class, allergies, last_eat, last_drink, meds, prior_anesthesia,
                   recommendation, status, assessed_by, created_at
            FROM anesthesia_assessments WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/anesthesia', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/assessments', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, age, weight_kg, height_cm, mallampati, airway_class, asa_class, allergies, last_eat, last_drink, meds, prior_anesthesia, recommendation } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required', required: ['patient_id'] });
        const r = await db.query(`
            INSERT INTO anesthesia_assessments (tenant_id, patient_id, encounter_id, age, weight_kg, height_cm, mallampati, airway_class, asa_class, allergies, last_eat, last_drink, meds, prior_anesthesia, recommendation, status, assessed_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'completed',$16) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, age || null, weight_kg || null, height_cm || null, mallampati || null, airway_class || null, asa_class || null, allergies || '', last_eat || null, last_drink || null, meds || '', prior_anesthesia || '', recommendation || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/anesthesia', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/preops', requireAuth, requireTenantScope, requireRole('anesthesiologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, procedure_name, asa_class, fasting_hours, allergies,
                   consent_obtained, premedication, anesthetic_plan, status, created_at
            FROM anesthesia_preops WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, preops: r.rows });
    } catch (err) { console.error('GET /api/anesthesia/preops', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/preops', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { patient_id, procedure_name, asa_class, fasting_hours, allergies, consent_obtained, premedication, anesthetic_plan } = req.body;
        if (!patient_id || !procedure_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO anesthesia_preops (tenant_id, patient_id, procedure_name, asa_class, fasting_hours, allergies, consent_obtained, premedication, anesthetic_plan, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'planned') RETURNING id
        `, [req.tenantId, patient_id, procedure_name, asa_class || 'II', fasting_hours || 8, allergies || '', consent_obtained || false, premedication || '', anesthetic_plan || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/anesthesia/preops', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/records/:surgery_id', requireAuth, requireTenantScope, requireRole('anesthesiologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, tenant_id, surgery_id, induction_agent, dose_mg, airway,
                    induction_time, maintenance_agent, technique, moniters, iv_lines,
                    estimated_blood_loss, complications, extubation_time, signoff
            FROM surgery_anesthesia_records WHERE tenant_id = $1 AND surgery_id = $2
        `, [req.tenantId, req.params.surgery_id]);
        res.json({ ok: true, total: r.rows.length, records: r.rows });
    } catch (err) { console.error('GET /api/anesthesia/records', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/records', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { surgery_id, induction_agent, dose_mg, airway, induction_time, maintenance_agent, technique, moniters, iv_lines, estimated_blood_loss, complications, extubation_time } = req.body;
        if (!surgery_id || !induction_agent) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO surgery_anesthesia_records (tenant_id, surgery_id, induction_agent, dose_mg, airway, induction_time, maintenance_agent, technique, moniters, iv_lines, estimated_blood_loss, complications, extubation_time, signoff)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id
        `, [req.tenantId, surgery_id, induction_agent, dose_mg || null, airway || '', induction_time || null, maintenance_agent || '', technique || '', moniters || '', iv_lines || '', estimated_blood_loss || 0, complications || '', extubation_time || null, req.userName || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/anesthesia/records', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/pain-assessments', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, patient_id, score, location, type, intervention, response, follow_up_score, assessed_by, created_at
            FROM pain_assessments WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/anesthesia/pain', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/pain-assessments', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id, score, location, type, intervention } = req.body;
        if (!patient_id || score == null) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO pain_assessments (tenant_id, patient_id, score, location, type, intervention, assessed_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
        `, [req.tenantId, patient_id, score, location || '', type || '', intervention || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/anesthesia/pain', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'anesthesiologist'), async (req, res) => {
    try {
        const a = await db.query(`SELECT COUNT(*) as total_assessments FROM anesthesia_assessments WHERE tenant_id = $1`, [req.tenantId]);
        const p = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status = 'planned') as planned,
                   COUNT(*) FILTER (WHERE status = 'completed') as completed
            FROM anesthesia_preops WHERE tenant_id = $1
        `, [req.tenantId]);
        const pain = await db.query(`
            SELECT COUNT(*) as total_pain_assessments,
                   AVG(score)::numeric(4,2) as avg_score,
                   COUNT(*) FILTER (WHERE score >= 7) as severe_pain
            FROM pain_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
        `, [req.tenantId]);
        res.json({ ok: true, assessments: a.rows[0], preops: p.rows[0], pain_7d: pain.rows[0] });
    } catch (err) { console.error('GET /api/anesthesia/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['assessments', 'preops', 'records', 'pain-assessments', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
