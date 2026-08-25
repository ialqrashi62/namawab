'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// ICU continuous monitoring ingest (5-15 minute snap)
router.post('/monitor-snap', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'intensivist'), async (req, res) => {
    try {
        const { admission_id, patient_id, hr, sbp, dbp, rr, spo2, temp, etco2, cvp, fio2, peep, urine_output, notes } = req.body;
        if (!admission_id || !patient_id) return res.status(400).json({ error: 'missing_required' });
        const map = sbp && dbp ? +(+(sbp) + 2 * +(dbp)) / 3 .toFixed(1) : null;
        const r = await db.query(`INSERT INTO icu_monitoring (tenant_id, admission_id, patient_id, monitor_time, hr, sbp, dbp, map, rr, spo2, temp, etco2, cvp, fio2, peep, urine_output, notes, recorded_by) VALUES ($1,$2,$3,NOW(),$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING id, map`, [req.tenantId, admission_id, patient_id, hr || null, sbp || null, dbp || null, map, rr || null, spo2 || null, temp || null, etco2 || null, cvp || null, fio2 || null, peep || null, urine_output || null, notes || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, computed_map: r.rows[0].map });
    } catch (err) { console.error('POST /api/moni/monitor-snap', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/monitor-stream/:admission_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'intensivist', 'admin'), async (req, res) => {
    try {
        const minutes = Math.min(+req.query.minutes || 60, 1440);
        const r = await db.query(`SELECT id, monitor_time, hr, sbp, dbp, map, rr, spo2, temp, etco2, cvp, fio2, peep, urine_output, notes, recorded_by FROM icu_monitoring WHERE tenant_id = $1 AND admission_id = $2 AND monitor_time >= NOW() - ($3 || ' minutes')::interval ORDER BY monitor_time DESC LIMIT 500`, [req.tenantId, req.params.admission_id, minutes]);
        res.json({ ok: true, window_minutes: minutes, total: r.rows.length, stream: r.rows });
    } catch (err) { console.error('GET /api/moni/monitor-stream', err); res.status(500).json({ error: 'internal_error' }); }
});

// Latest snapshot per admission
router.get('/monitor-latest/:admission_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'intensivist'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, monitor_time, hr, sbp, dbp, map, rr, spo2, temp, etco2, fio2, peep FROM icu_monitoring WHERE tenant_id = $1 AND admission_id = $2 ORDER BY monitor_time DESC LIMIT 1`, [req.tenantId, req.params.admission_id]);
        if (r.rows.length === 0) return res.json({ ok: true, found: false });
        res.json({ ok: true, found: true, latest: r.rows[0] });
    } catch (err) { console.error('GET /api/moni/monitor-latest', err); res.status(500).json({ error: 'internal_error' }); }
});

// Device calibrations
router.get('/devices', requireAuth, requireTenantScope, requireRole('biomedical_engineer', 'admin', 'nurse'), async (req, res) => {
    try {
        const { status, device_name } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (device_name) { params.push(device_name); conditions.push(`device_name = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`SELECT id, device_name, serial_number, calibration_date, next_calibration_date, calibrated_by, status, notes, created_at FROM device_calibrations WHERE ${conditions.join(' AND ')} ORDER BY next_calibration_date ASC LIMIT $${params.length}`, params);
        res.json({ ok: true, total: r.rows.length, devices: r.rows });
    } catch (err) { console.error('GET /api/moni/devices', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/devices/calibrate', requireAuth, requireTenantScope, requireRole('biomedical_engineer', 'admin'), async (req, res) => {
    try {
        const { device_name, serial_number, calibration_date, next_calibration_date, calibrated_by, notes, status } = req.body;
        if (!device_name || !serial_number || !calibration_date) return res.status(400).json({ error: 'missing_required', required: ['device_name','serial_number','calibration_date'] });
        const r = await db.query(`INSERT INTO device_calibrations (tenant_id, device_name, serial_number, calibration_date, next_calibration_date, calibrated_by, status, notes) VALUES ($1,$2,$3,$4,$5,$6,COALESCE($7,'calibrated'),$8) RETURNING id`, [req.tenantId, device_name, serial_number, calibration_date, next_calibration_date || null, calibrated_by || req.userName || '', status, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/moni/devices/calibrate', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/devices/due-soon', requireAuth, requireTenantScope, requireRole('biomedical_engineer', 'admin'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 30, 365);
        const r = await db.query(`SELECT id, device_name, serial_number, calibration_date, next_calibration_date, (next_calibration_date - CURRENT_DATE) as days_until_due FROM device_calibrations WHERE tenant_id = $1 AND next_calibration_date IS NOT NULL AND next_calibration_date <= CURRENT_DATE + $2::int AND next_calibration_date >= CURRENT_DATE ORDER BY next_calibration_date ASC LIMIT 100`, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, devices: r.rows });
    } catch (err) { console.error('GET /api/moni/devices/due-soon', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/devices/overdue', requireAuth, requireTenantScope, requireRole('biomedical_engineer', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, device_name, serial_number, calibration_date, next_calibration_date, (CURRENT_DATE - next_calibration_date) as days_overdue FROM device_calibrations WHERE tenant_id = $1 AND next_calibration_date IS NOT NULL AND next_calibration_date < CURRENT_DATE ORDER BY next_calibration_date LIMIT 100`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, devices: r.rows });
    } catch (err) { console.error('GET /api/moni/devices/overdue', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'intensivist', 'biomedical_engineer'), async (req, res) => {
    try {
        const m = await db.query(`SELECT COUNT(DISTINCT admission_id) as admissions_monitored, COUNT(*) as monitor_records_24h, AVG(hr)::numeric(4,0) as avg_hr FROM icu_monitoring WHERE tenant_id = $1 AND monitor_time >= NOW() - INTERVAL '24 hours'`, [req.tenantId]);
        const d = await db.query(`SELECT COUNT(*) as total_devices, COUNT(*) FILTER (WHERE status = 'calibrated') as calibrated, COUNT(*) FILTER (WHERE next_calibration_date < CURRENT_DATE) as overdue, COUNT(*) FILTER (WHERE next_calibration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') as due_30d FROM device_calibrations WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, monitoring: m.rows[0], devices: d.rows[0] });
    } catch (err) { console.error('GET /api/moni/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['monitor-snap', 'monitor-stream', 'monitor-latest', 'devices', 'devices/calibrate', 'devices/due-soon', 'devices/overdue', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
