// filepath: namaweb/or_scheduler_router.js
// OR scheduling + WHO safety checklist + surgical time logs + OR consumption.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// OR slots per room/date
router.get('/slots', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist', 'or_coordinator', 'admin'), async (req, res) => {
    try {
        const { room_id, slot_date } = req.query;
        let sql = `SELECT id, surgery_id, room_id, surgeon_id, slot_date, slot_start_time, slot_end_time, duration_minutes, status
                   FROM or_slots WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (room_id) { params.push(room_id); sql += ` AND room_id = $${params.length}`; }
        if (slot_date) { params.push(slot_date); sql += ` AND slot_date = $${params.length}`; }
        sql += ` ORDER BY slot_date DESC, slot_start_time DESC LIMIT 200`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, slots: r.rows });
    } catch (err) { console.error('GET /api/or/slots', err); res.status(500).json({ error: 'internal_error' }); }
});

// Schedule a slot (will conflict-check against existing slots in the same room)
router.post('/slots', requireAuth, requireTenantScope, requireRole('or_coordinator', 'admin', 'surgeon'), async (req, res) => {
    try {
        const { surgery_id, room_id, surgeon_id, slot_date, slot_start_time, slot_end_time, duration_minutes } = req.body;
        if (!room_id || !slot_date || !slot_start_time || !slot_end_time) return res.status(400).json({ error: 'missing_required' });
        // Conflict check
        const c = await db.query(`
            SELECT id FROM or_slots WHERE tenant_id = $1 AND room_id = $2 AND slot_date = $3
            AND NOT (slot_end_time <= $4 OR slot_start_time >= $5)
        `, [req.tenantId, room_id, slot_date, slot_start_time, slot_end_time]);
        if (c.rows.length) return res.status(409).json({ error: 'slot_conflict', conflict_with: c.rows[0].id });
        const r = await db.query(`
            INSERT INTO or_slots (tenant_id, surgery_id, room_id, surgeon_id, slot_date, slot_start_time, slot_end_time, duration_minutes, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'scheduled') RETURNING id
        `, [req.tenantId, surgery_id || null, room_id, surgeon_id || null, slot_date, slot_start_time, slot_end_time, duration_minutes || 60]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/or/slots', err); res.status(500).json({ error: 'internal_error' }); }
});

router.patch('/slots/:id/status', requireAuth, requireTenantScope, requireRole('or_coordinator', 'surgeon'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'].includes(status)) return res.status(400).json({ error: 'invalid_status' });
        const r = await db.query(`UPDATE or_slots SET status = $2 WHERE tenant_id = $1 AND id = $3 RETURNING id`, [req.tenantId, status, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('PATCH /api/or/slots/:id', err); res.status(500).json({ error: 'internal_error' }); }
});

// WHO surgical safety checklist (sign-in / time-out / sign-out)
router.get('/who/:surgery_id', requireAuth, requireTenantScope, requireRole('surgeon', 'nurse', 'anesthesiologist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT * FROM who_surgical_checklist WHERE tenant_id = $1 AND surgery_id = $2
            ORDER BY created_at DESC LIMIT 1
        `, [req.tenantId, req.params.surgery_id]);
        res.json({ ok: true, checklist: r.rows[0] || null });
    } catch (err) { console.error('GET /api/or/who', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/who/:surgery_id', requireAuth, requireTenantScope, requireRole('surgeon', 'or_nurse'), async (req, res) => {
    try {
        const { sign_in_confirmed, time_out_confirmed, sign_out_confirmed, notes } = req.body;
        const r = await db.query(`
            INSERT INTO who_surgical_checklist (tenant_id, surgery_id, sign_in_confirmed, time_out_confirmed, sign_out_confirmed, notes)
            VALUES ($1, $2, COALESCE($3, false), COALESCE($4, false), COALESCE($5, false), $6)
            ON CONFLICT (tenant_id, surgery_id) DO UPDATE SET sign_in_confirmed = EXCLUDED.sign_in_confirmed, time_out_confirmed = EXCLUDED.time_out_confirmed, sign_out_confirmed = EXCLUDED.sign_out_confirmed, notes = EXCLUDED.notes
            RETURNING id
        `, [req.tenantId, req.params.surgery_id, sign_in_confirmed || false, time_out_confirmed || false, sign_out_confirmed || false, notes || '']);
        res.json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/or/who', err); res.status(500).json({ error: 'internal_error' }); }
});

// Surgical time logs (knife-to-closure, anesthesia start/end)
router.post('/timelog', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist'), async (req, res) => {
    try {
        const { surgery_id, anesthesia_start_time, incision_time, closure_time, anesthesia_end_time } = req.body;
        if (!surgery_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO surgical_time_logs (tenant_id, surgery_id, anesthesia_start_time, incision_time, closure_time, anesthesia_end_time)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `, [req.tenantId, surgery_id, anesthesia_start_time || null, incision_time || null, closure_time || null, anesthesia_end_time || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/or/timelog', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/timelog/:surgery_id', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT anesthesia_start_time, incision_time, closure_time, anesthesia_end_time,
                   EXTRACT(EPOCH FROM (closure_time - incision_time))/60 as surgical_minutes,
                   EXTRACT(EPOCH FROM (anesthesia_end_time - anesthesia_start_time))/60 as anesthesia_minutes
            FROM surgical_time_logs WHERE tenant_id = $1 AND surgery_id = $2
            ORDER BY anesthesia_start_time DESC LIMIT 5
        `, [req.tenantId, req.params.surgery_id]);
        res.json({ ok: true, logs: r.rows });
    } catch (err) { console.error('GET /api/or/timelog', err); res.status(500).json({ error: 'internal_error' }); }
});

// OR consumption (consumables used per surgery)
router.post('/consume', requireAuth, requireTenantScope, requireRole('or_nurse', 'surgeon'), async (req, res) => {
    try {
        const { surgery_id, item_id, qty_used, batch_id } = req.body;
        if (!surgery_id || !item_id || !qty_used) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO or_consumption (tenant_id, surgery_id, item_id, qty_used, batch_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        `, [req.tenantId, surgery_id, item_id, qty_used, batch_id || null]);
        // Best-effort stock decrement
        try { await db.query(`UPDATE inventory_items SET stock_qty = GREATEST(0, COALESCE(stock_qty, 0) - $2) WHERE tenant_id = $1 AND id = $3`, [req.tenantId, qty_used, item_id]); } catch (_) {}
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/or/consume', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/consume/:surgery_id', requireAuth, requireTenantScope, requireRole('admin', 'surgeon', 'or_nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT surgery_id, item_id, SUM(qty_used) as qty_used, MAX(created_at) as last_used
            FROM or_consumption WHERE tenant_id = $1 AND surgery_id = $2
            GROUP BY surgery_id, item_id ORDER BY last_used DESC
        `, [req.tenantId, req.params.surgery_id]);
        res.json({ ok: true, total: r.rows.length, consumption: r.rows });
    } catch (err) { console.error('GET /api/or/consume', err); res.status(500).json({ error: 'internal_error' }); }
});

// OR utilization analytics
router.get('/utilization', requireAuth, requireTenantScope, requireRole('admin', 'or_coordinator'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT room_id, COUNT(*) as slot_count, SUM(duration_minutes) as total_minutes,
                   COUNT(*) FILTER (WHERE status = 'completed') as completed,
                   COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
                   COUNT(*) FILTER (WHERE status = 'no_show') as no_show
            FROM or_slots WHERE tenant_id = $1 AND slot_date >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY room_id ORDER BY total_minutes DESC NULLS LAST
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, rooms: r.rows });
    } catch (err) { console.error('GET /api/or/utilization', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['slots', 'who', 'timelog', 'consume', 'utilization'], timestamp: new Date().toISOString() });
});

module.exports = router;
