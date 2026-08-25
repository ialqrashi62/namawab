// filepath: namaweb/obgyn_router.js
// OBGYN — Antenatal visits, deliveries, fetal assessments.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/encounters', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { status, visit_type, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (visit_type) { params.push(visit_type); conditions.push(`visit_type = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`encounter_date >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, doctor_id, encounter_date, visit_type, gravida, para, lmp, edd,
                   gestational_age_weeks, chief_complaint, diagnosis_code, treatment_plan, status
            FROM obgyn_encounters WHERE ${conditions.join(' AND ')}
            ORDER BY encounter_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, encounters: r.rows });
    } catch (err) { console.error('GET /api/obgyn/encounters', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/encounters', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, encounter_date, visit_type, gravida, para, lmp, edd, gestational_age_weeks, chief_complaint, physical_exam_findings, diagnosis_code, treatment_plan } = req.body;
        if (!patient_id || !encounter_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO obgyn_encounters (tenant_id, patient_id, doctor_id, encounter_date, visit_type, gravida, para, lmp, edd, gestational_age_weeks, chief_complaint, physical_exam_findings, diagnosis_code, treatment_plan, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'active') RETURNING id
        `, [req.tenantId, patient_id, req.userId, encounter_date, visit_type || 'antenatal', gravida || null, para || null, lmp || null, edd || null, gestational_age_weeks || null, chief_complaint || '', physical_exam_findings || '', diagnosis_code || '', treatment_plan || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/obgyn/encounters', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/antenatal/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, visit_number, gestational_age, weight, weight_gain, blood_pressure,
                   systolic, diastolic, fundal_height, urine_protein, edema, fetal_heart_rate,
                   presentation, next_visit_date, risk_level, notes, created_at
            FROM obgyn_antenatal_visits WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY visit_number DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        const summary = await db.query(`
            SELECT MAX(visit_number) as visits_count,
                   MAX(gestational_age) as current_ga,
                   MIN(blood_pressure) FILTER (WHERE systolic IS NOT NULL) as min_bp,
                   MAX(systolic) as max_systolic
            FROM obgyn_antenatal_visits WHERE tenant_id = $1 AND patient_id = $2
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, visits: r.rows, summary: summary.rows[0] });
    } catch (err) { console.error('GET /api/obgyn/antenatal', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/antenatal', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, visit_number, gestational_age, weight, weight_gain, systolic, diastolic, fundal_height, urine_protein, edema, fetal_heart_rate, presentation, next_visit_date, risk_level, notes } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO obgyn_antenatal_visits (tenant_id, patient_id, visit_number, gestational_age, weight, weight_gain, blood_pressure, systolic, diastolic, fundal_height, urine_protein, edema, fetal_heart_rate, presentation, next_visit_date, risk_level, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING id
        `, [req.tenantId, patient_id, visit_number || null, gestational_age || null, weight || null, weight_gain || null, (systolic && diastolic ? `${systolic}/${diastolic}` : ''), systolic || null, diastolic || null, fundal_height || null, urine_protein || false, edema || false, fetal_heart_rate || null, presentation || 'cephalic', next_visit_date || null, risk_level || 'low', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/obgyn/antenatal', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/deliveries', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { delivery_mode, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (delivery_mode) { params.push(delivery_mode); conditions.push(`delivery_mode = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`delivery_date >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, delivery_date, delivery_mode, delivery_duration_min,
                   apgar_1min, apgar_5min, birth_weight_g, maternal_blood_loss_ml, pph_status, created_at
            FROM obgyn_deliveries WHERE ${conditions.join(' AND ')}
            ORDER BY delivery_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, deliveries: r.rows });
    } catch (err) { console.error('GET /api/obgyn/deliveries', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/deliveries', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, delivery_date, delivery_mode, delivery_duration_min, apgar_1min, apgar_5min, birth_weight_g, maternal_blood_loss_ml, pph_status } = req.body;
        if (!patient_id || !delivery_date || !delivery_mode) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO obgyn_deliveries (tenant_id, patient_id, delivery_date, delivery_mode, delivery_duration_min, apgar_1min, apgar_5min, birth_weight_g, maternal_blood_loss_ml, pph_status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id
        `, [req.tenantId, patient_id, delivery_date, delivery_mode, delivery_duration_min || null, apgar_1min || null, apgar_5min || null, birth_weight_g || null, maternal_blood_loss_ml || null, pph_status || false]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/obgyn/deliveries', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/fetal/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, gestational_age_weeks, bpd_mm, hc_mm, ac_mm, fl_mm,
                   estimated_fetal_weight_g, growth_percentile, doppler_velocity_cm_s, created_at
            FROM maternal_fetal_metrics WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY gestational_age_weeks DESC LIMIT 30
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, metrics: r.rows });
    } catch (err) { console.error('GET /api/obgyn/fetal', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/fetal', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, gestational_age_weeks, bpd_mm, hc_mm, ac_mm, fl_mm, estimated_fetal_weight_g, growth_percentile, doppler_velocity_cm_s } = req.body;
        if (!patient_id || !gestational_age_weeks) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO maternal_fetal_metrics (tenant_id, patient_id, gestational_age_weeks, bpd_mm, hc_mm, ac_mm, fl_mm, estimated_fetal_weight_g, growth_percentile, doppler_velocity_cm_s)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id
        `, [req.tenantId, patient_id, gestational_age_weeks, bpd_mm || null, hc_mm || null, ac_mm || null, fl_mm || null, estimated_fetal_weight_g || null, growth_percentile || null, doppler_velocity_cm_s || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/obgyn/fetal', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const enc = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE encounter_date >= CURRENT_DATE) as today,
                   COUNT(*) FILTER (WHERE visit_type = 'antenatal') as antenatal,
                   COUNT(*) FILTER (WHERE visit_type = 'postnatal') as postnatal
            FROM obgyn_encounters WHERE tenant_id = $1
        `, [req.tenantId]);
        const del = await db.query(`
            SELECT COUNT(*) as total_deliveries,
                   COUNT(*) FILTER (WHERE delivery_date >= CURRENT_DATE - INTERVAL '30 days') as deliveries_30d,
                   COUNT(*) FILTER (WHERE delivery_mode = 'C-section') as csection,
                   COUNT(*) FILTER (WHERE delivery_mode = 'vaginal') as vaginal,
                   COUNT(*) FILTER (WHERE pph_status) as pph_cases,
                   AVG(birth_weight_g)::numeric(10,2) as avg_birth_weight
            FROM obgyn_deliveries WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, encounters: enc.rows[0], deliveries: del.rows[0] });
    } catch (err) { console.error('GET /api/obgyn/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['encounters', 'antenatal', 'deliveries', 'fetal', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
