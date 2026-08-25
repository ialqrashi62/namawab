// filepath: namaweb/telemetry_router.js
// Vital signs + ICU monitor streaming ingestion + device calibration tracking.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Vital signs (single snapshot)
router.post('/vitals', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id, heart_rate, systolic_bp, diastolic_bp, temperature, respiratory_rate, oxygen_saturation, weight_kg, height_cm, pain_score, notes, recorded_by } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO vital_signs (tenant_id, patient_id, recorded_by, heart_rate, systolic_bp, diastolic_bp, temperature, respiratory_rate, oxygen_saturation, weight_kg, height_cm, pain_score, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`, [req.tenantId, patient_id, recorded_by || req.userName || '', heart_rate || null, systolic_bp || null, diastolic_bp || null, temperature || null, respiratory_rate || null, oxygen_saturation || null, weight_kg || null, height_cm || null, pain_score || null, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/tele/vitals', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/vitals/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`SELECT heart_rate, systolic_bp, diastolic_bp, temperature, respiratory_rate, oxygen_saturation, recorded_by, recorded_at FROM vital_signs WHERE tenant_id = $1 AND patient_id = $2 ORDER BY recorded_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, vitals: r.rows });
    } catch (err) { console.error('GET /api/tele/vitals', err); res.status(500).json({ error: 'internal_error' }); }
});

// ICU monitor stream (high-frequency ingestion)
router.post('/monitor', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'device'), async (req, res) => {
    try {
        const { admission_id, patient_id, monitor_time, hr, sbp, dbp, map, rr, spo2, temp, etco2, cvp, fio2, peep, urine_output, notes, recorded_by } = req.body;
        if (!patient_id || !monitor_time) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO icu_monitoring (tenant_id, admission_id, patient_id, monitor_time, hr, sbp, dbp, map, rr, spo2, temp, etco2, cvp, fio2, peep, urine_output, notes, recorded_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING id`, [req.tenantId, admission_id || null, patient_id, monitor_time, hr || null, sbp || null, dbp || null, map || null, rr || null, spo2 || null, temp || null, etco2 || null, cvp || null, fio2 || null, peep || null, urine_output || null, notes || '', recorded_by || req.userName || 'device']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/tele/monitor', err); res.status(500).json({ error: 'internal_error' }); }
});

// Last ICU reading (single-row latest)
router.get('/monitor/:patient_id/latest', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'intensivist'), async (req, res) => {
    try {
        const r = await db.query(`SELECT monitor_time, hr, sbp, dbp, map, rr, spo2, temp, etco2, cvp, fio2, peep, urine_output FROM icu_monitoring WHERE tenant_id = $1 AND patient_id = $2 ORDER BY monitor_time DESC LIMIT 1`, [req.tenantId, req.params.patient_id]);
        if (!r.rows.length) return res.json({ ok: true, latest: null });
        // Compute MAP if missing
        const v = r.rows[0];
        if (!v.map && v.sbp && v.dbp) v.map = Math.round(v.dbp + (v.sbp - v.dbp) / 3);
        res.json({ ok: true, latest: v });
    } catch (err) { console.error('GET /api/tele/monitor/latest', err); res.status(500).json({ error: 'internal_error' }); }
});

// Monitor stream window (last N minutes)
router.get('/monitor/:patient_id/stream', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'intensivist'), async (req, res) => {
    try {
        const minutes = +(req.query.minutes || 30);
        const r = await db.query(`SELECT monitor_time, hr, sbp, spo2, rr, map FROM icu_monitoring WHERE tenant_id = $1 AND patient_id = $2 AND monitor_time >= NOW() - ($3 || ' minutes')::interval ORDER BY monitor_time ASC`, [req.tenantId, req.params.patient_id, minutes]);
        res.json({ ok: true, total: r.rows.length, samples: r.rows });
    } catch (err) { console.error('GET /api/tele/monitor/stream', err); res.status(500).json({ error: 'internal_error' }); }
});

// Device calibration log
router.post('/devices/calibrate', requireAuth, requireTenantScope, requireRole('biomed', 'admin'), async (req, res) => {
    try {
        const { device_name, serial_number, calibration_date, next_calibration_date, calibrated_by, status, notes } = req.body;
        if (!device_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO device_calibrations (tenant_id, device_name, serial_number, calibration_date, next_calibration_date, calibrated_by, status, notes) VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'passed'), $8) RETURNING id, status`, [req.tenantId, device_name, serial_number || '', calibration_date || new Date().toISOString().slice(0, 10), next_calibration_date || null, calibrated_by || req.userName || '', status, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/tele/devices/calibrate', err); res.status(500).json({ error: 'internal_error' }); }
});

// Devices due-for-calibration (next 30 days)
router.get('/devices/due-calibration', requireAuth, requireTenantScope, requireRole('biomed', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, device_name, serial_number, calibration_date, next_calibration_date, EXTRACT(DAY FROM (next_calibration_date - CURRENT_DATE)) as days_until FROM device_calibrations WHERE tenant_id = $1 AND next_calibration_date IS NOT NULL AND next_calibration_date <= CURRENT_DATE + INTERVAL '30 days' ORDER BY next_calibration_date ASC LIMIT 100`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, devices: r.rows });
    } catch (err) { console.error('GET /api/tele/devices/due-calibration', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['vitals', 'monitor', 'devices'], timestamp: new Date().toISOString() });
});

module.exports = router;
