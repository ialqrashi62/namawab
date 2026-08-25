// filepath: namaweb/peds2_router.js
// Pediatrics — growth/immunizations/APGAR/milestones + subspecialty logs.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/growth/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 365, 365 * 5);
        const r = await db.query(`
            SELECT id, log_date, weight_kg, length_cm, head_circ_cm, bmi,
                   weight_for_age_z, length_for_age_z, bmi_for_age_z, created_at
            FROM peds_growth_logs WHERE tenant_id = $1 AND patient_id = $2
              AND log_date >= NOW() - ($3 || ' days')::interval
            ORDER BY log_date DESC LIMIT 200
        `, [req.tenantId, req.params.patient_id, days]);
        // Compute growth velocity (delta between first and last)
        let growthVelocity = null;
        if (r.rows.length >= 2) {
            const first = r.rows[r.rows.length - 1];
            const last = r.rows[0];
            const months = (new Date(last.log_date) - new Date(first.log_date)) / (1000 * 60 * 60 * 24 * 30);
            growthVelocity = {
                weight_change_kg: (+last.weight_kg - +first.weight_kg).toFixed(2),
                length_change_cm: (+last.length_cm - +first.length_cm).toFixed(2),
                months_span: months.toFixed(1),
                weight_velocity_kg_month: months > 0 ? ((+last.weight_kg - +first.weight_kg) / months).toFixed(2) : null
            };
        }
        res.json({ ok: true, period_days: days, total: r.rows.length, logs: r.rows, growth_velocity: growthVelocity });
    } catch (err) { console.error('GET /api/peds2/growth', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/growth', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, log_date, weight_kg, length_cm, head_circ_cm, bmi, weight_for_age_z, length_for_age_z, bmi_for_age_z } = req.body;
        if (!patient_id || !log_date) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'log_date'] });
        const r = await db.query(`
            INSERT INTO peds_growth_logs (tenant_id, patient_id, log_date, weight_kg, length_cm, head_circ_cm, bmi, weight_for_age_z, length_for_age_z, bmi_for_age_z)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id
        `, [req.tenantId, patient_id, log_date, weight_kg, length_cm, head_circ_cm, bmi, weight_for_age_z, length_for_age_z, bmi_for_age_z]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/peds2/growth', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/immunizations/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, vaccine_name, dose_number, given_date, batch_number, site, route, next_due, reaction, given_by, notes, created_at
            FROM pediatric_immunizations WHERE tenant_id = $1 AND patient_id = $2 ORDER BY given_date DESC LIMIT 100
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, immunizations: r.rows });
    } catch (err) { console.error('GET /api/peds2/immunizations', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/immunizations/due-soon', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 30, 365);
        const r = await db.query(`
            SELECT id, patient_id, vaccine_name, dose_number, next_due,
                   (next_due - CURRENT_DATE) as days_until_due
            FROM pediatric_immunizations WHERE tenant_id = $1 AND next_due IS NOT NULL
              AND next_due <= CURRENT_DATE + ($2 || ' days')::interval
              AND next_due >= CURRENT_DATE
            ORDER BY next_due ASC LIMIT 200
        `, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, due_immunizations: r.rows });
    } catch (err) { console.error('GET /api/peds2/immunizations/due-soon', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/immunizations', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id, vaccine_name, dose_number, given_date, batch_number, site, route, next_due, reaction, notes } = req.body;
        if (!patient_id || !vaccine_name || !given_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO pediatric_immunizations (tenant_id, patient_id, vaccine_name, dose_number, given_date, batch_number, site, route, next_due, reaction, given_by, notes)
            VALUES ($1,$2,$3,COALESCE($4,1),$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id
        `, [req.tenantId, patient_id, vaccine_name, dose_number, given_date, batch_number || '', site || '', route || 'IM', next_due || null, reaction || '', req.userName || req.userId, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/peds2/immunizations', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/apgar', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, doctor_id, record_date, apgar_1min, apgar_5min, weight_kg, height_cm, head_circ_cm, created_at
            FROM pediatrics_apgar WHERE tenant_id = $1 ORDER BY record_date DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, apgars: r.rows });
    } catch (err) { console.error('GET /api/peds2/apgar', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/apgar', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, record_date, apgar_1min, apgar_5min, weight_kg, height_cm, head_circ_cm } = req.body;
        if (!patient_id || !record_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO pediatrics_apgar (tenant_id, patient_id, doctor_id, record_date, apgar_1min, apgar_5min, weight_kg, height_cm, head_circ_cm)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, req.userId, record_date, apgar_1min || null, apgar_5min || null, weight_kg || null, height_cm || null, head_circ_cm || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/peds2/apgar', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/milestones/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, milestone_category, milestone_name, status, achievement_date, notes, created_at
            FROM peds_milestone_tracking WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY milestone_category, milestone_name LIMIT 200
        `, [req.tenantId, req.params.patient_id]);
        const summary = await db.query(`
            SELECT status, COUNT(*) as cnt FROM peds_milestone_tracking
            WHERE tenant_id = $1 AND patient_id = $2 GROUP BY status
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, milestones: r.rows, by_status: summary.rows });
    } catch (err) { console.error('GET /api/peds2/milestones', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/milestones', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, milestone_category, milestone_name, status, achievement_date, notes } = req.body;
        if (!patient_id || !milestone_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO peds_milestone_tracking (tenant_id, patient_id, milestone_category, milestone_name, status, achievement_date, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id
        `, [req.tenantId, patient_id, milestone_category || '', milestone_name, status || 'achieved', achievement_date || null, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/peds2/milestones', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const growth = await db.query(`
            SELECT COUNT(*) FILTER (WHERE log_date >= CURRENT_DATE - INTERVAL '30 days') as growth_records_30d,
                   COUNT(DISTINCT patient_id) as patients_tracked
            FROM peds_growth_logs WHERE tenant_id = $1
        `, [req.tenantId]);
        const imm = await db.query(`
            SELECT COUNT(*) FILTER (WHERE next_due IS NOT NULL AND next_due < CURRENT_DATE) as overdue_vaccines,
                   COUNT(*) FILTER (WHERE given_date >= CURRENT_DATE - INTERVAL '7 days') as vaccines_7d
            FROM pediatric_immunizations WHERE tenant_id = $1
        `, [req.tenantId]);
        const apgar = await db.query(`
            SELECT COUNT(*) as total_apgars,
                   AVG(apgar_5min)::numeric(4,2) as avg_5min_score,
                   COUNT(*) FILTER (WHERE apgar_5min < 7) as low_apgar_count
            FROM pediatrics_apgar WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, growth: growth.rows[0], immunizations: imm.rows[0], apgar: apgar.rows[0] });
    } catch (err) { console.error('GET /api/peds2/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['growth', 'immunizations', 'apgar', 'milestones', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
