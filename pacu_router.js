// filepath: namaweb/pacu_router.js
// PACU recovery + wound care log + implants registry + flap perfusion + cardio-pulmonary bypass.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// --- PACU (Post-Anesthesia Care Unit) ---
// Aldrete score on admission (0-10 scale)
function aldreteFromVitals(bp, hr, spo2, temp) {
    let s = 0;
    const bpN = +(bp || 0);
    if (bpN >= 100 && bpN <= 160) s += 2; else if (bpN >= 90 && bpN <= 170) s += 1;
    const hrN = +(hr || 0);
    if (hrN >= 60 && hrN <= 100) s += 2; else if (hrN >= 50 && hrN <= 110) s += 1;
    const spN = +(spo2 || 0);
    if (spN >= 92) s += 2;
    const tN = +(temp || 37);
    if (tN >= 36 && tN <= 38) s += 2; else if (tN >= 35.5 && tN <= 38.5) s += 1;
    // activity + consciousness simplified (awake=2, arousable=1)
    s += 2;
    return Math.min(10, s);
}

router.post('/recovery', requireAuth, requireTenantScope, requireRole('pacu_nurse', 'anesthesiologist', 'nurse'), async (req, res) => {
    try {
        const { surgery_id, patient_id, start_time, end_time, pain_score, bp, hr, spo2, temp, aldrete_score, discharge_status, recovery_nurse, notes } = req.body;
        if (!surgery_id || !patient_id || !start_time) return res.status(400).json({ error: 'missing_required' });
        const aldrete = aldrete_score != null ? Math.min(10, Math.max(0, +aldrete_score)) : aldreteFromVitals(bp, hr, spo2, temp);
        const r = await db.query(`
            INSERT INTO pacu_records (tenant_id, surgery_id, patient_id, start_time, end_time, pain_score, bp, hr, spo2, temp, aldrete_score, discharge_status, recovery_nurse, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id
        `, [req.tenantId, surgery_id, patient_id, start_time, end_time || null, pain_score || null, bp || null, hr || null, spo2 || null, temp || null, aldrete, discharge_status || 'in_pacu', recovery_nurse || req.userName || '', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id, aldrete_score: aldrete });
    } catch (err) { console.error('POST /api/pacu/recovery', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/recovery/:surgery_id', requireAuth, requireTenantScope, requireRole('pacu_nurse', 'anesthesiologist', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, start_time, end_time, pain_score, bp, hr, spo2, temp, aldrete_score, discharge_status, recovery_nurse, notes, created_at
            FROM pacu_records WHERE tenant_id = $1 AND surgery_id = $2 ORDER BY start_time DESC LIMIT 20
        `, [req.tenantId, req.params.surgery_id]);
        res.json({ ok: true, total: r.rows.length, pacu: r.rows });
    } catch (err) { console.error('GET /api/pacu/recovery', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/aldrete/:surgery_id', requireAuth, requireTenantScope, requireRole('pacu_nurse', 'anesthesiologist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT aldrete_score, pain_score, bp, hr, spo2, temp, start_time
            FROM pacu_records WHERE tenant_id = $1 AND surgery_id = $2 AND end_time IS NULL
            ORDER BY start_time DESC LIMIT 1
        `, [req.tenantId, req.params.surgery_id]);
        if (!r.rows.length) return res.json({ ok: true, in_pacu: false, aldrete_score: null });
        const rec = r.rows[0];
        const ready = rec.aldrete_score >= 9;
        res.json({ ok: true, in_pacu: true, current: rec, ready_for_discharge: ready });
    } catch (err) { console.error('GET /api/pacu/aldrete', err); res.status(500).json({ error: 'internal_error' }); }
});

// Wound care log (daily/regular assessment)
router.post('/wound', requireAuth, requireTenantScope, requireRole('nurse', 'wound_care_nurse', 'doctor'), async (req, res) => {
    try {
        const { encounter_id, check_date, wound_status, drainage_amount_ml, drainage_type, intervention_taken } = req.body;
        if (!encounter_id || !check_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO surgery_wound_logs (tenant_id, encounter_id, check_date, wound_status, drainage_amount_ml, drainage_type, intervention_taken)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
        `, [req.tenantId, encounter_id, check_date, wound_status || 'clean', drainage_amount_ml || null, drainage_type || '', intervention_taken || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pacu/wound', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/wound/:encounter_id', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, check_date, wound_status, drainage_amount_ml, drainage_type, intervention_taken, created_at
            FROM surgery_wound_logs WHERE tenant_id = $1 AND encounter_id = $2 ORDER BY check_date DESC LIMIT 60
        `, [req.tenantId, req.params.encounter_id]);
        res.json({ ok: true, total: r.rows.length, wounds: r.rows });
    } catch (err) { console.error('GET /api/pacu/wound', err); res.status(500).json({ error: 'internal_error' }); }
});

// Implants registry (UDI tracking)
router.post('/implant', requireAuth, requireTenantScope, requireRole('surgeon', 'or_nurse'), async (req, res) => {
    try {
        const { encounter_id, implants } = req.body;
        if (!encounter_id || !Array.isArray(implants) || !implants.length) return res.status(400).json({ error: 'missing_required' });
        const ids = [];
        for (const im of implants) {
            const r = await db.query(`
                INSERT INTO surgery_implants (tenant_id, encounter_id, implant_type, brand_model, serial_number, lot_number, position_details)
                VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
            `, [req.tenantId, encounter_id, im.implant_type || 'prosthesis', im.brand_model || '', im.serial_number || '', im.lot_number || '', im.position_details || '']);
            ids.push(r.rows[0].id);
        }
        res.status(201).json({ ok: true, ids, count: ids.length });
    } catch (err) { console.error('POST /api/pacu/implant', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/implant/:encounter_id', requireAuth, requireTenantScope, requireRole('surgeon', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, implant_type, brand_model, serial_number, lot_number, position_details, created_at
            FROM surgery_implants WHERE tenant_id = $1 AND encounter_id = $2 ORDER BY created_at DESC
        `, [req.tenantId, req.params.encounter_id]);
        res.json({ ok: true, total: r.rows.length, implants: r.rows });
    } catch (err) { console.error('GET /api/pacu/implant', err); res.status(500).json({ error: 'internal_error' }); }
});

// Flap perfusion monitoring (reconstructive/hand)
router.post('/flap', requireAuth, requireTenantScope, requireRole('surgeon', 'nurse'), async (req, res) => {
    try {
        const { patient_id, procedure_id, log_time, perfusion_status, capillary_refill_sec, color_status, temperature_c } = req.body;
        if (!patient_id || !log_time) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO flap_monitoring_metrics (tenant_id, patient_id, procedure_id, log_time, perfusion_status, capillary_refill_sec, color_status, temperature_c)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
        `, [req.tenantId, patient_id, procedure_id || null, log_time, perfusion_status || 'pink', capillary_refill_sec || null, color_status || '', temperature_c || null]);
        // Auto-flag concerning readings
        const flag = (temperature_c && +temperature_c < 30) || (capillary_refill_sec && +capillary_refill_sec > 3) ? 'compromise_suspected' : 'ok';
        res.status(201).json({ ok: true, id: r.rows[0].id, flag });
    } catch (err) { console.error('POST /api/pacu/flap', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/flap/:procedure_id', requireAuth, requireTenantScope, requireRole('surgeon', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, log_time, perfusion_status, capillary_refill_sec, color_status, temperature_c,
                   CASE WHEN temperature_c < 30 OR capillary_refill_sec > 3 THEN true ELSE false END as concern
            FROM flap_monitoring_metrics WHERE tenant_id = $1 AND procedure_id = $2 ORDER BY log_time DESC LIMIT 100
        `, [req.tenantId, req.params.procedure_id]);
        res.json({ ok: true, total: r.rows.length, flaps: r.rows });
    } catch (err) { console.error('GET /api/pacu/flap', err); res.status(500).json({ error: 'internal_error' }); }
});

// CPB (cardiopulmonary bypass) timing
router.post('/cpb', requireAuth, requireTenantScope, requireRole('perfusionist', 'cardiothoracic_surgeon'), async (req, res) => {
    try {
        const { procedure_id, cpb_start, cpb_end, cross_clamp_start, cross_clamp_end, pump_flow_rate } = req.body;
        if (!procedure_id || !cpb_start) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO cardio_thoracic_metrics (tenant_id, procedure_id, cpb_start, cpb_end, cross_clamp_start, cross_clamp_end, pump_flow_rate)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
        `, [req.tenantId, procedure_id, cpb_start, cpb_end || null, cross_clamp_start || null, cross_clamp_end || null, pump_flow_rate || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pacu/cpb', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/cpb/:procedure_id', requireAuth, requireTenantScope, requireRole('cardiothoracic_surgeon', 'perfusionist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT cpb_start, cpb_end, cross_clamp_start, cross_clamp_end, pump_flow_rate,
                   EXTRACT(EPOCH FROM (cpb_end - cpb_start))/60 as cpb_minutes,
                   EXTRACT(EPOCH FROM (cross_clamp_end - cross_clamp_start))/60 as cross_clamp_minutes
            FROM cardio_thoracic_metrics WHERE tenant_id = $1 AND procedure_id = $2 ORDER BY cpb_start DESC LIMIT 5
        `, [req.tenantId, req.params.procedure_id]);
        res.json({ ok: true, cpb_records: r.rows });
    } catch (err) { console.error('GET /api/pacu/cpb', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['recovery', 'aldrete', 'wound', 'implant', 'flap', 'cpb'], timestamp: new Date().toISOString() });
});

module.exports = router;
