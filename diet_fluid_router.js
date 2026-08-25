'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Diet orders
router.get('/diet-orders/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'dietitian', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, admission_id, diet_type, texture, fluid_restriction_ml, supplements, indications, ordered_by, ordered_at FROM diet_orders WHERE tenant_id = $1 AND patient_id = $2 ORDER BY ordered_at DESC LIMIT 100`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, orders: r.rows });
    } catch (err) { console.error('GET /api/df/diet-orders', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/diet-orders', requireAuth, requireTenantScope, requireRole('doctor', 'dietitian'), async (req, res) => {
    try {
        const { patient_id, admission_id, diet_type, texture, fluid_restriction_ml, supplements, indications } = req.body;
        if (!patient_id || !diet_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO diet_orders (tenant_id, patient_id, admission_id, diet_type, texture, fluid_restriction_ml, supplements, indications, ordered_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`, [req.tenantId, patient_id, admission_id || null, diet_type, texture || 'regular', fluid_restriction_ml || null, supplements || '', indications || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/df/diet-orders', err); res.status(500).json({ error: 'internal_error' }); }
});

// Fluid balance with auto-pos-neg classification
router.get('/fluid-balance/:admission_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, log_time, intake_oral_ml, intake_iv_ml, output_urine_ml, output_drain_ml, output_ngt_ml, intake_total_ml, output_total_ml, (intake_total_ml - output_total_ml) as balance_ml, recorded_by FROM icu_fluid_balance WHERE tenant_id = $1 AND admission_id = $2 ORDER BY log_time DESC LIMIT 200`, [req.tenantId, req.params.admission_id]);
        // Classify each row
        const enriched = r.rows.map(row => {
            let balance_status = 'neutral';
            if (row.balance_ml > 500) balance_status = 'positive';
            else if (row.balance_ml < -500) balance_status = 'negative';
            return Object.assign({}, row, { balance_status });
        });
        // Daily cumulative
        const daily = await db.query(`SELECT DATE(log_time) as day, SUM(intake_total_ml) as total_intake_ml, SUM(output_total_ml) as total_output_ml, SUM(intake_total_ml - output_total_ml) as daily_balance_ml FROM icu_fluid_balance WHERE tenant_id = $1 AND admission_id = $2 GROUP BY DATE(log_time) ORDER BY day`, [req.tenantId, req.params.admission_id]);
        res.json({ ok: true, total: enriched.length, records: enriched, daily_cumulative: daily.rows });
    } catch (err) { console.error('GET /api/df/fluid-balance', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/fluid-balance', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { admission_id, patient_id, log_time, intake_oral_ml, intake_iv_ml, output_urine_ml, output_drain_ml, output_ngt_ml } = req.body;
        if (!admission_id || !patient_id) return res.status(400).json({ error: 'missing_required' });
        const iOral = +intake_oral_ml || 0, iIv = +intake_iv_ml || 0;
        const oUri = +output_urine_ml || 0, oDrain = +output_drain_ml || 0, oNgt = +output_ngt_ml || 0;
        const iTotal = iOral + iIv;
        const oTotal = oUri + oDrain + oNgt;
        const r = await db.query(`INSERT INTO icu_fluid_balance (tenant_id, admission_id, patient_id, log_time, intake_oral_ml, intake_iv_ml, output_urine_ml, output_drain_ml, output_ngt_ml, intake_total_ml, output_total_ml, recorded_by) VALUES ($1,$2,$3,COALESCE($4,NOW()),$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`, [req.tenantId, admission_id, patient_id, log_time, iOral, iIv, oUri, oDrain, oNgt, iTotal, oTotal, req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, intake_total: iTotal, output_total: oTotal, balance: iTotal - oTotal });
    } catch (err) { console.error('POST /api/df/fluid-balance', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/weight-log/:admission_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, log_date, weight_kg, height_cm, bmi, notes, recorded_by FROM admission_daily_rounds WHERE tenant_id = $1 AND admission_id = $2 ORDER BY log_date DESC LIMIT 30`, [req.tenantId, req.params.admission_id]);
        res.json({ ok: true, total: r.rows.length, weights: r.rows });
    } catch (err) { console.error('GET /api/df/weight-log', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'nurse', 'doctor'), async (req, res) => {
    try {
        const d = await db.query(`SELECT COUNT(*) FILTER (WHERE diet_type = 'NPO') as npo_orders, COUNT(*) as total_diet_orders FROM diet_orders WHERE tenant_id = $1`, [req.tenantId]);
        const f = await db.query(`SELECT COUNT(*) as fluid_log_entries, SUM(intake_total_ml) as total_intake_ml_30d, SUM(intake_total_ml - output_total_ml) as total_balance_30d FROM icu_fluid_balance WHERE tenant_id = $1 AND log_time >= NOW() - INTERVAL '30 days'`, [req.tenantId]);
        res.json({ ok: true, diet: d.rows[0], fluid: f.rows[0] });
    } catch (err) { console.error('GET /api/df/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['diet-orders', 'fluid-balance', 'weight-log', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
