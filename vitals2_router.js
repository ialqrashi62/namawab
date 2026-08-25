// filepath: namaweb/vitals2_router.js
// Vital signs trending + I/O + fluid balance.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/trending/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 7, 90);
        const r = await db.query(`
            SELECT id, temperature, pulse, systolic_bp, diastolic_bp, respiratory_rate,
                   spo2, pain_score, blood_glucose, notes, recorded_by, recorded_at
            FROM vital_signs WHERE tenant_id = $1 AND patient_id = $2
              AND recorded_at >= NOW() - ($3 || ' days')::interval
            ORDER BY recorded_at DESC LIMIT 200
        `, [req.tenantId, req.params.patient_id, days]);
        // Compute averages and trends
        const avg = await db.query(`
            SELECT
                AVG(temperature)::numeric(5,2) as avg_temp,
                AVG(pulse)::numeric(6,2) as avg_pulse,
                AVG(systolic_bp)::numeric(6,2) as avg_systolic,
                AVG(diastolic_bp)::numeric(6,2) as avg_diastolic,
                AVG(spo2)::numeric(5,2) as avg_spo2,
                AVG(pain_score)::numeric(4,2) as avg_pain
            FROM vital_signs WHERE tenant_id = $1 AND patient_id = $2
              AND recorded_at >= NOW() - ($3 || ' days')::interval
        `, [req.tenantId, req.params.patient_id, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, vitals: r.rows, averages: avg.rows[0] });
    } catch (err) { console.error('GET /api/vitals2/trending', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, temperature, pulse, systolic_bp, diastolic_bp, respiratory_rate, spo2, pain_score, blood_glucose, notes } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required', required: ['patient_id'] });
        const r = await db.query(`
            INSERT INTO vital_signs (tenant_id, patient_id, temperature, pulse, systolic_bp, diastolic_bp, respiratory_rate, spo2, pain_score, blood_glucose, notes, recorded_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id
        `, [req.tenantId, patient_id, temperature, pulse, systolic_bp, diastolic_bp, respiratory_rate, spo2, pain_score, blood_glucose, notes || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/vitals2', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/abnormal/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, temperature, pulse, systolic_bp, diastolic_bp, respiratory_rate, spo2, pain_score, recorded_at
            FROM vital_signs WHERE tenant_id = $1 AND patient_id = $2
              AND (
                (temperature IS NOT NULL AND (temperature > 38.5 OR temperature < 35))
                OR (pulse IS NOT NULL AND (pulse > 130 OR pulse < 50))
                OR (systolic_bp IS NOT NULL AND (systolic_bp > 180 OR systolic_bp < 90))
                OR (spo2 IS NOT NULL AND spo2 < 92)
                OR (pain_score IS NOT NULL AND pain_score >= 7)
              )
            ORDER BY recorded_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, abnormal: r.rows });
    } catch (err) { console.error('GET /api/vitals2/abnormal', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/io/patient/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 1, 7);
        const r = await db.query(`
            SELECT id, recorded_at, shift, intake_oral_ml, intake_iv_ml, intake_total_ml,
                   output_urine_ml, output_ngt_ml, output_drain_ml, output_total_ml,
                   (intake_total_ml - output_total_ml) as balance, notes, recorded_by
            FROM icu_fluid_balance WHERE tenant_id = $1 AND patient_id = $2
              AND recorded_at >= NOW() - ($3 || ' days')::interval
            ORDER BY recorded_at DESC LIMIT 100
        `, [req.tenantId, req.params.patient_id, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, records: r.rows });
    } catch (err) { console.error('GET /api/vitals2/io', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/io', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id, shift, intake_oral_ml, intake_iv_ml, output_urine_ml, output_ngt_ml, output_drain_ml, notes } = req.body;
        if (!patient_id || !shift) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'shift'] });
        const intake_oral = +intake_oral_ml || 0;
        const intake_iv = +intake_iv_ml || 0;
        const output_urine = +output_urine_ml || 0;
        const output_ngt = +output_ngt_ml || 0;
        const output_drain = +output_drain_ml || 0;
        const intake_total = intake_oral + intake_iv;
        const output_total = output_urine + output_ngt + output_drain;
        const r = await db.query(`
            INSERT INTO icu_fluid_balance (tenant_id, patient_id, shift, intake_oral_ml, intake_iv_ml, intake_total_ml, output_urine_ml, output_ngt_ml, output_drain_ml, output_total_ml, notes, recorded_by, recorded_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW()) RETURNING id, intake_total_ml, output_total_ml
        `, [req.tenantId, patient_id, shift, intake_oral, intake_iv, intake_total, output_urine, output_ngt, output_drain, output_total, notes || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, intake_total: r.rows[0].intake_total_ml, output_total: r.rows[0].output_total_ml });
    } catch (err) { console.error('POST /api/vitals2/io', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/iol', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 7, 90);
        const r = await db.query(`
            SELECT id, patient_id, eye_side, iol_type, power, model, manufacturer, implanted_at, surgeon_name, created_at
            FROM iol_registry WHERE tenant_id = $1 AND implanted_at >= NOW() - ($2 || ' days')::interval
            ORDER BY implanted_at DESC LIMIT 100
        `, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, implants: r.rows });
    } catch (err) { console.error('GET /api/vitals2/iol', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/iol', requireAuth, requireTenantScope, requireRole('doctor', 'surgeon'), async (req, res) => {
    try {
        const { patient_id, eye_side, iol_type, power, model, manufacturer, implanted_at } = req.body;
        if (!patient_id || !eye_side) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'eye_side'] });
        const r = await db.query(`
            INSERT INTO iol_registry (tenant_id, patient_id, eye_side, iol_type, power, model, manufacturer, implanted_at, surgeon_name)
            VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8,NOW()),$9) RETURNING id
        `, [req.tenantId, patient_id, eye_side, iol_type || 'monofocal', power || null, model || '', manufacturer || '', implanted_at || null, req.userName || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/vitals2/iol', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'nurse'), async (req, res) => {
    try {
        const v = await db.query(`
            SELECT COUNT(*) as total_readings,
                   COUNT(*) FILTER (WHERE recorded_at >= CURRENT_DATE) as today,
                   COUNT(*) FILTER (WHERE recorded_at >= NOW() - INTERVAL '24 hours') as last_24h,
                   AVG(systolic_bp)::numeric(6,2) as avg_systolic,
                   AVG(spo2)::numeric(5,2) as avg_spo2
            FROM vital_signs WHERE tenant_id = $1
        `, [req.tenantId]);
        const io = await db.query(`
            SELECT COUNT(*) as io_records,
                   SUM(intake_total_ml) as total_intake_ml,
                   SUM(output_total_ml) as total_output_ml,
                   SUM(intake_total_ml - output_total_ml) as total_balance_ml
            FROM icu_fluid_balance WHERE tenant_id = $1 AND recorded_at >= NOW() - INTERVAL '24 hours'
        `, [req.tenantId]);
        res.json({ ok: true, vitals: v.rows[0], fluid_balance_24h: io.rows[0] });
    } catch (err) { console.error('GET /api/vitals2/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['trending', 'create', 'abnormal', 'io', 'iol', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
