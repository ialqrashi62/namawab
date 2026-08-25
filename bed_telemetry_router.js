// filepath: namaweb/bed_telemetry_router.js
// Bed telemetry + status history + occupancy analytics.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/beds', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin', 'receptionist'), async (req, res) => {
    try {
        const { ward_id, status, zone } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (ward_id) { params.push(ward_id); conditions.push(`ward_id = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (zone) { params.push(zone); conditions.push(`zone = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, bed_number, bed_type, room_number, status, current_patient_id, current_admission_id, ward_id, notes
            FROM beds WHERE ${conditions.join(' AND ')}
            ORDER BY bed_number LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, beds: r.rows });
    } catch (err) { console.error('GET /api/bt/beds', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/beds/history', requireAuth, requireTenantScope, requireRole('admin', 'nurse', 'quality'), async (req, res) => {
    try {
        const { bed_id, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (bed_id) { params.push(bed_id); conditions.push(`bed_id = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`changed_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, bed_id, admission_id, patient_id, from_status, to_status, reason, changed_by, changed_at
            FROM bed_status_history WHERE ${conditions.join(' AND ')}
            ORDER BY changed_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, history: r.rows });
    } catch (err) { console.error('GET /api/bt/beds/history', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/emergency-beds', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, bed_name, bed_name_ar, zone, zone_ar, status, current_patient_id, notes
            FROM emergency_beds WHERE tenant_id = $1 ORDER BY bed_name
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, beds: r.rows });
    } catch (err) { console.error('GET /api/bt/emergency-beds', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/emergency-beds/:id/assign', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            UPDATE emergency_beds SET current_patient_id = $3, status = 'occupied' WHERE id = $1 AND tenant_id = $2 RETURNING id, status
        `, [req.params.id, req.tenantId, patient_id]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/bt/emergency-beds/assign', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/emergency-beds/:id/release', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE emergency_beds SET current_patient_id = NULL, status = 'available' WHERE id = $1 AND tenant_id = $2 RETURNING id, status
        `, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/bt/emergency-beds/release', err); res.status(500).json({ error: 'internal_error' }); }
});

// Bed occupancy analytics by ward
router.get('/occupancy', requireAuth, requireTenantScope, requireRole('admin', 'nurse', 'quality'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT ward_id,
                   COUNT(*) as total_beds,
                   COUNT(*) FILTER (WHERE status = 'occupied') as occupied,
                   COUNT(*) FILTER (WHERE status = 'available') as available,
                   COUNT(*) FILTER (WHERE status = 'cleaning') as cleaning,
                   COUNT(*) FILTER (WHERE status = 'maintenance') as maintenance,
                   ROUND(COUNT(*) FILTER (WHERE status = 'occupied')::numeric / NULLIF(COUNT(*), 0) * 100, 1) as occupancy_pct
            FROM beds WHERE tenant_id = $1 GROUP BY ward_id ORDER BY ward_id
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, wards: r.rows });
    } catch (err) { console.error('GET /api/bt/occupancy', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const e = await db.query(`SELECT COUNT(*) as ed_beds, COUNT(*) FILTER (WHERE status = 'occupied') as occupied FROM emergency_beds WHERE tenant_id = $1`, [req.tenantId]);
        const b = await db.query(`SELECT COUNT(*) as total_beds, COUNT(*) FILTER (WHERE status = 'occupied') as occupied FROM beds WHERE tenant_id = $1`, [req.tenantId]);
        const t = await db.query(`SELECT COUNT(*) FILTER (WHERE DATE_TRUNC('day', changed_at) = CURRENT_DATE) as transitions_today, COUNT(*) FILTER (WHERE changed_at >= NOW() - INTERVAL '24 hours') as transitions_24h FROM bed_status_history WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, emergency: e.rows[0], wards: b.rows[0], transitions: t.rows[0] });
    } catch (err) { console.error('GET /api/bt/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['beds', 'history', 'emergency-beds', 'occupancy', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
