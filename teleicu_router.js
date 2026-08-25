// filepath: namaweb/teleicu_router.js
// TeleICU / Critical-care ventilation + prevention bundles + ICP.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Ventilation logs (ICU + NICU)
router.get('/ventilator', requireAuth, requireTenantScope, requireRole('intensivist', 'doctor', 'respiratory_therapist', 'admin'), async (req, res) => {
    try {
        const { admission_id, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (admission_id) { params.push(admission_id); conditions.push(`admission_id = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`started_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, admission_id, patient_id, vent_mode, fio2, tidal_volume, respiratory_rate,
                   peep, pip, ie_ratio, ps, started_at, ended_at, created_at
            FROM icu_ventilator WHERE ${conditions.join(' AND ')}
            ORDER BY started_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, ventilator_logs: r.rows });
    } catch (err) { console.error('GET /api/teleicu/ventilator', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/ventilator', requireAuth, requireTenantScope, requireRole('intensivist', 'respiratory_therapist', 'doctor'), async (req, res) => {
    try {
        const { admission_id, patient_id, vent_mode, fio2, tidal_volume, respiratory_rate, peep, pip, ie_ratio, ps, started_at, ended_at } = req.body;
        if (!admission_id || !vent_mode) return res.status(400).json({ error: 'missing_required', required: ['admission_id', 'vent_mode'] });
        const r = await db.query(`
            INSERT INTO icu_ventilator (tenant_id, admission_id, patient_id, vent_mode, fio2, tidal_volume, respiratory_rate, peep, pip, ie_ratio, ps, started_at, ended_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,COALESCE($12,NOW()),$13) RETURNING id
        `, [req.tenantId, admission_id, patient_id || null, vent_mode, fio2 || null, tidal_volume || null, respiratory_rate || null, peep || null, pip || null, ie_ratio || null, ps || null, started_at, ended_at || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/teleicu/ventilator', err); res.status(500).json({ error: 'internal_error' }); }
});

// Critical-care ventilation logs (RSBI, weaning)
router.get('/cc-ventilation', requireAuth, requireTenantScope, requireRole('intensivist', 'respiratory_therapist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`log_time >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, log_time, vent_mode, rsbi_value, weaning_status, fio2_percent, peep_cmh2o, created_at
            FROM crit_care_ventilation_logs WHERE ${conditions.join(' AND ')}
            ORDER BY log_time DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, cc_logs: r.rows });
    } catch (err) { console.error('GET /api/teleicu/cc-ventilation', err); res.status(500).json({ error: 'internal_error' }); }
});

// Prevention bundles (VAP, CLABSI, CAUTI)
router.get('/prevention-bundles', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin', 'quality'), async (req, res) => {
    try {
        const { bundle_type, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (bundle_type) { params.push(bundle_type); conditions.push(`bundle_type = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`audit_date >= CURRENT_DATE - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, admission_id, bundle_type, audit_date, checked_items, compliance_rate,
                   non_compliance_reason, recorded_by, created_at
            FROM icu_prevention_bundles WHERE ${conditions.join(' AND ')}
            ORDER BY audit_date DESC LIMIT $${params.length}
        `, params);
        const summary = await db.query(`
            SELECT bundle_type, ROUND(AVG(compliance_rate)::numeric, 2) as avg_compliance,
                   COUNT(*) as audit_count
            FROM icu_prevention_bundles WHERE tenant_id = $1 GROUP BY bundle_type ORDER BY bundle_type
        `, [req.tenantId]);
        res.json({ ok: true, summary: summary.rows, bundles: r.rows });
    } catch (err) { console.error('GET /api/teleicu/prevention-bundles', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/prevention-bundles', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'quality'), async (req, res) => {
    try {
        const { admission_id, bundle_type, audit_date, checked_items, compliance_rate, non_compliance_reason } = req.body;
        if (!admission_id || !bundle_type || compliance_rate == null) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO icu_prevention_bundles (tenant_id, admission_id, bundle_type, audit_date, checked_items, compliance_rate, non_compliance_reason, recorded_by)
            VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5, $6, $7, $8) RETURNING id
        `, [req.tenantId, admission_id, bundle_type, audit_date, JSON.stringify(checked_items || {}), compliance_rate, non_compliance_reason || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/teleicu/prevention-bundles', err); res.status(500).json({ error: 'internal_error' }); }
});

// CPB (cardiopulmonary bypass) — cardiac surgery
router.get('/cpb', requireAuth, requireTenantScope, requireRole('perfusionist', 'cardiologist', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, doctor_id, bypass_date, pump_time, cross_clamp_time, flow_rate, min_temp, notes, created_at
            FROM cpb_logs WHERE tenant_id = $1 ORDER BY bypass_date DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, cpb_logs: r.rows });
    } catch (err) { console.error('GET /api/teleicu/cpb', err); res.status(500).json({ error: 'internal_error' }); }
});

// EP ablation (electrophysiology)
router.get('/ep-ablation', requireAuth, requireTenantScope, requireRole('cardiologist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, procedure_id, site_name, energy_joules, duration_sec, modality, success_indicator, created_at
            FROM ep_ablation_logs WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, ablations: r.rows });
    } catch (err) { console.error('GET /api/teleicu/ep-ablation', err); res.status(500).json({ error: 'internal_error' }); }
});

// ICU dashboard
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'intensivist'), async (req, res) => {
    try {
        const vent = await db.query(`
            SELECT COUNT(*) FILTER (WHERE ended_at IS NULL) as currently_ventilated,
                   COUNT(*) FILTER (WHERE started_at >= CURRENT_DATE - INTERVAL '24 hours' AND ended_at IS NOT NULL) as extubated_24h,
                   AVG(fio2)::numeric(5,2) as avg_fio2
            FROM icu_ventilator WHERE tenant_id = $1
        `, [req.tenantId]);
        const bun = await db.query(`
            SELECT bundle_type, ROUND(AVG(compliance_rate)::numeric, 1) as avg_compliance,
                   COUNT(*) FILTER (WHERE compliance_rate = 100) as full_compliance
            FROM icu_prevention_bundles WHERE tenant_id = $1 AND audit_date >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY bundle_type ORDER BY bundle_type
        `, [req.tenantId]);
        res.json({ ok: true, ventilator: vent.rows[0], bundles_30d: bun.rows });
    } catch (err) { console.error('GET /api/teleicu/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['ventilator', 'cc-ventilation', 'prevention-bundles', 'cpb', 'ep-ablation', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
