// filepath: namaweb/orders2_router.js
// eMAR (Electronic Medication Administration Record) + Orders + Result Acknowledgements.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/orders', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'pharmacist', 'admin'), async (req, res) => {
    try {
        const { status, type, patient_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (type) { params.push(type); conditions.push(`type = $${params.length}`); }
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, encounter_id, patient_id, type, status, ordered_by, order_set_id, created_at
            FROM orders WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, orders: r.rows });
    } catch (err) { console.error('GET /api/orders2', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/orders/:id/items', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'pharmacist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, order_id, catalog_ref, qty, instructions, created_at
            FROM order_items WHERE tenant_id = $1 AND order_id = $2 ORDER BY id
        `, [req.tenantId, req.params.id]);
        res.json({ ok: true, total: r.rows.length, items: r.rows });
    } catch (err) { console.error('GET /api/orders2/items', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/orders', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { encounter_id, patient_id, type, order_set_id, items } = req.body;
        if (!patient_id || !type) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'type'] });
        const r = await db.query(`
            INSERT INTO orders (tenant_id, encounter_id, patient_id, type, status, ordered_by, order_set_id)
            VALUES ($1,$2,$3,$4,'active',$5,$6) RETURNING id
        `, [req.tenantId, encounter_id || null, patient_id, type, req.userId, order_set_id || null]);
        const orderId = r.rows[0].id;
        if (Array.isArray(items)) {
            for (const it of items) {
                await db.query(`
                    INSERT INTO order_items (tenant_id, order_id, catalog_ref, qty, instructions) VALUES ($1, $2, $3, $4, $5)
                `, [req.tenantId, orderId, it.catalog_ref || '', it.qty || 1, it.instructions || '']);
            }
        }
        res.status(201).json({ ok: true, id: orderId });
    } catch (err) { console.error('POST /api/orders2', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/emar', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, status, scheduled_at } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (scheduled_at) { params.push(scheduled_at); conditions.push(`scheduled_at::date = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, prescription_ref, patient_id, medication, dose, route, scheduled_at,
                   administered_at, administered_by_name, witness_by_name, status, cds_warnings
            FROM emar_orders WHERE ${conditions.join(' AND ')}
            ORDER BY scheduled_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, emar: r.rows });
    } catch (err) { console.error('GET /api/orders2/emar', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/emar/due', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, medication, dose, route, scheduled_at, cds_warnings
            FROM emar_orders WHERE tenant_id = $1 AND status = 'pending' AND scheduled_at <= NOW()
            ORDER BY scheduled_at LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, due: r.rows });
    } catch (err) { console.error('GET /api/orders2/emar/due', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/emar/:id/administer', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { witness_by_name, notes } = req.body;
        const r = await db.query(`
            UPDATE emar_orders SET status = 'administered', administered_at = NOW(),
                                   administered_by = $3, administered_by_name = $4,
                                   witness_by_name = COALESCE($5, witness_by_name),
                                   notes = COALESCE($6, notes)
            WHERE id = $1 AND tenant_id = $2 AND status = 'pending' RETURNING id, status, administered_at
        `, [req.params.id, req.tenantId, req.userId, req.userName || req.userId, witness_by_name || null, notes || null]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_not_pending' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/orders2/emar/administer', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/emar/:id/refuse', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { reason, override_reason } = req.body;
        if (!reason) return res.status(400).json({ error: 'missing_required', required: ['reason'] });
        const r = await db.query(`
            UPDATE emar_orders SET status = 'refused', notes = COALESCE($3, notes), override_reason = $4
            WHERE id = $1 AND tenant_id = $2 RETURNING id, status
        `, [req.params.id, req.tenantId, reason, override_reason || null]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/orders2/emar/refuse', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/result-acks', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, result_type, result_id, patient_id, ack_level, acknowledged_by_name, note, acknowledged_at
            FROM result_acknowledgements WHERE tenant_id = $1 ORDER BY acknowledged_at DESC LIMIT 200
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, acks: r.rows });
    } catch (err) { console.error('GET /api/orders2/result-acks', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/result-acks', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { result_type, result_id, patient_id, ack_level, note } = req.body;
        if (!result_type || !result_id || !patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO result_acknowledgements (tenant_id, result_type, result_id, patient_id, ack_level, acknowledged_by, acknowledged_by_name, note)
            VALUES ($1,$2,$3,$4,COALESCE($5,'standard'),$6,$7,$8) RETURNING id
        `, [req.tenantId, result_type, result_id, patient_id, ack_level, req.userId, req.userName || '', note || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/orders2/result-acks', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'nurse'), async (req, res) => {
    try {
        const ord = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE status = 'active') as active,
                   COUNT(*) FILTER (WHERE status = 'completed') as completed,
                   COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
                   COUNT(*) FILTER (WHERE type = 'medication') as medication,
                   COUNT(*) FILTER (WHERE type = 'lab') as lab,
                   COUNT(*) FILTER (WHERE type = 'imaging') as imaging
            FROM orders WHERE tenant_id = $1
        `, [req.tenantId]);
        const emar = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status = 'pending') as pending,
                   COUNT(*) FILTER (WHERE status = 'administered') as administered,
                   COUNT(*) FILTER (WHERE status = 'refused') as refused,
                   COUNT(*) FILTER (WHERE scheduled_at <= NOW() AND status = 'pending') as overdue
            FROM emar_orders WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, orders: ord.rows[0], emar: emar.rows[0] });
    } catch (err) { console.error('GET /api/orders2/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['orders', 'items', 'emar', 'emar/due', 'administer', 'refuse', 'result-acks', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
