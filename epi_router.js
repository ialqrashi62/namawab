// filepath: namaweb/epi_router.js
// Epidemiology / Infection Control — outbreaks, surveillance, HAI isolation.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Outbreaks
router.get('/outbreaks', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin', 'quality'), async (req, res) => {
    try {
        const { status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, outbreak_name, organism, start_date, end_date, affected_ward, total_cases,
                   investigation_notes, control_measures, status, reported_by, created_at
            FROM infection_outbreaks WHERE ${conditions.join(' AND ')}
            ORDER BY start_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, outbreaks: r.rows });
    } catch (err) { console.error('GET /api/epi/outbreaks', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/outbreaks', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { outbreak_name, organism, start_date, affected_ward, total_cases, investigation_notes, control_measures } = req.body;
        if (!outbreak_name || !start_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO infection_outbreaks (tenant_id, outbreak_name, organism, start_date, affected_ward, total_cases, investigation_notes, control_measures, status, reported_by)
            VALUES ($1,$2,$3,$4,$5,COALESCE($6,0),$7,$8,'active',$9) RETURNING id
        `, [req.tenantId, outbreak_name, organism || '', start_date, affected_ward || '', total_cases, investigation_notes || '', control_measures || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/epi/outbreaks', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/outbreaks/:id/close', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { end_date, final_notes } = req.body;
        const r = await db.query(`
            UPDATE infection_outbreaks SET status = 'closed', end_date = COALESCE($3, CURRENT_DATE),
                                          investigation_notes = COALESCE(investigation_notes || E'\n[CLOSED] ', '') || $4
            WHERE id = $1 AND tenant_id = $2 AND status != 'closed' RETURNING id, status, end_date
        `, [req.params.id, req.tenantId, end_date, final_notes || 'Outbreak closed']);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_closed' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/epi/outbreaks/close', err); res.status(500).json({ error: 'internal_error' }); }
});

// Surveillance (HAI tracking)
router.get('/surveillance', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { hai_category, organism, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (hai_category) { params.push(hai_category); conditions.push(`hai_category = $${params.length}`); }
        if (organism) { params.push(organism); conditions.push(`organism = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`detection_date >= CURRENT_DATE - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, infection_type, infection_site, organism, sensitivity,
                   detection_date, hai_category, device_related, device_type, ward, bed, isolation_type, outcome, reported_by, created_at
            FROM infection_surveillance WHERE ${conditions.join(' AND ')}
            ORDER BY detection_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, cases: r.rows });
    } catch (err) { console.error('GET /api/epi/surveillance', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/surveillance', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { patient_id, patient_name, infection_type, infection_site, organism, sensitivity, hai_category, device_related, device_type, ward, bed, isolation_type, outcome, notes } = req.body;
        if (!patient_id || !infection_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO infection_surveillance (tenant_id, patient_id, patient_name, infection_type, infection_site, organism, sensitivity, hai_category, device_related, device_type, ward, bed, isolation_type, outcome, reported_by, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', infection_type, infection_site || '', organism || '', sensitivity || '', hai_category || 'HAI-General', device_related || false, device_type || '', ward || '', bed || '', isolation_type || 'standard', outcome || 'monitoring', req.userName || req.userId, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/epi/surveillance', err); res.status(500).json({ error: 'internal_error' }); }
});

// HAI Isolation records
router.get('/isolation', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { status, precaution_type, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (precaution_type) { params.push(precaution_type); conditions.push(`precaution_type = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`effective_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, surveillance_id, precaution_type, hai_category,
                   organism, ward, bed, effective_at, resolved_at, status, notes, created_at
            FROM hai_isolation WHERE ${conditions.join(' AND ')}
            ORDER BY effective_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, isolations: r.rows });
    } catch (err) { console.error('GET /api/epi/isolation', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/isolation/:id/resolve', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE hai_isolation SET status = 'resolved', resolved_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND status != 'resolved' RETURNING id, status, resolved_at
        `, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_resolved' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/epi/isolation/resolve', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'doctor'), async (req, res) => {
    try {
        const ob = await db.query(`SELECT COUNT(*) as total_outbreaks, COUNT(*) FILTER (WHERE status = 'active') as active_outbreaks, COUNT(*) FILTER (WHERE status = 'closed') as closed_outbreaks FROM infection_outbreaks WHERE tenant_id = $1`, [req.tenantId]);
        const sv = await db.query(`
            SELECT
                COUNT(*) as hai_cases_30d,
                COUNT(*) FILTER (WHERE hai_category = 'CLABSI') as clabsi,
                COUNT(*) FILTER (WHERE hai_category = 'CAUTI') as cauti,
                COUNT(*) FILTER (WHERE hai_category = 'SSI') as ssi,
                COUNT(*) FILTER (WHERE hai_category = 'VAP') as vap,
                COUNT(*) FILTER (WHERE device_related) as device_related,
                COUNT(*) FILTER (WHERE outcome = 'mortality') as mortality
            FROM infection_surveillance WHERE tenant_id = $1 AND detection_date >= CURRENT_DATE - INTERVAL '30 days'
        `, [req.tenantId]);
        const is = await db.query(`SELECT COUNT(*) FILTER (WHERE status = 'active') as active_isolations, COUNT(*) FILTER (WHERE precaution_type = 'droplet') as droplet, COUNT(*) FILTER (WHERE precaution_type = 'airborne') as airborne, COUNT(*) FILTER (WHERE precaution_type = 'contact') as contact FROM hai_isolation WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, outbreaks: ob.rows[0], surveillance_30d: sv.rows[0], isolation_active: is.rows[0] });
    } catch (err) { console.error('GET /api/epi/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['outbreaks', 'surveillance', 'isolation', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
