// filepath: namaweb/maintenance_router.js
// Equipment maintenance management.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/equipment', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'technician', 'admin'), async (req, res) => {
    try {
        const { status, category, q } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (category) { params.push(category); conditions.push(`category = $${params.length}`); }
        if (q) { params.push(`%${q}%`); conditions.push(`(equipment_name ILIKE $${params.length} OR equipment_code ILIKE $${params.length})`); }
        params.push(Math.min(+req.query.limit || 200, 1000));
        const r = await db.query(`
            SELECT id, equipment_code, equipment_name, equipment_name_ar, category, manufacturer, model,
                   serial_number, department, location, purchase_date, warranty_end,
                   last_pm, next_pm, last_calibration, next_calibration, status
            FROM maintenance_equipment
            WHERE ${conditions.join(' AND ')}
            ORDER BY department, equipment_name LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, equipment: r.rows });
    } catch (err) { console.error('GET /api/maintenance/equipment', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/due-soon', requireAuth, requireTenantScope, requireRole('technician', 'admin', 'doctor'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 7, 90);
        const r = await db.query(`
            SELECT id, equipment_code, equipment_name, department, location, next_pm,
                   (next_pm - CURRENT_DATE) as days_until_due, status
            FROM maintenance_equipment
            WHERE tenant_id = $1 AND next_pm IS NOT NULL
              AND next_pm <= CURRENT_DATE + $2::int
            ORDER BY next_pm ASC LIMIT 100
        `, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, equipment: r.rows });
    } catch (err) { console.error('GET /api/maintenance/due-soon', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/pm-schedules', requireAuth, requireTenantScope, requireRole('technician', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT s.id, s.equipment_id, e.equipment_name, s.pm_type, s.frequency,
                   s.last_done, s.next_due, s.performed_by, s.status
            FROM maintenance_pm_schedules s
            LEFT JOIN maintenance_equipment e ON e.id = s.equipment_id
            WHERE s.tenant_id = $1 ORDER BY s.next_due LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, schedules: r.rows });
    } catch (err) { console.error('GET /api/maintenance/pm-schedules', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/work-orders', requireAuth, requireTenantScope, requireRole('technician', 'admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const { status, priority } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (priority) { params.push(priority); conditions.push(`priority = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 50, 500));
        const r = await db.query(`
            SELECT id, wo_number, request_type, priority, department, location,
                   equipment_id, description, requested_by, assigned_to,
                   scheduled_date, completed_date, cost, status
            FROM maintenance_work_orders
            WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, work_orders: r.rows });
    } catch (err) { console.error('GET /api/maintenance/work-orders', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/work-orders', requireAuth, requireTenantScope, requireRole('technician', 'nurse', 'admin'), async (req, res) => {
    try {
        const { equipment_id, description, priority, assigned_to, scheduled_date } = req.body;
        if (!description) return res.status(400).json({ error: 'missing_required', required: ['description'] });
        const woNumber = 'WO-' + Date.now();
        const r = await db.query(`
            INSERT INTO maintenance_work_orders (tenant_id, wo_number, description, priority, equipment_id, assigned_to, scheduled_date, status, requested_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,'open',$8) RETURNING id
        `, [req.tenantId, woNumber, description, priority || 'normal', equipment_id || null, assigned_to || null, scheduled_date || null, req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, wo_number: woNumber });
    } catch (err) { console.error('POST /api/maintenance/work-orders', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/work-orders/:id/complete', requireAuth, requireTenantScope, requireRole('technician', 'admin'), async (req, res) => {
    try {
        const { resolution } = req.body;
        const r = await db.query(`
            UPDATE maintenance_work_orders SET status = 'completed', completed_date = NOW(), resolution = COALESCE($3, resolution)
            WHERE id = $1 AND tenant_id = $2 AND status != 'completed' RETURNING id, wo_number, status, completed_date
        `, [req.params.id, req.tenantId, resolution || null]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_completed' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/maintenance/work-orders/complete', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('technician', 'admin'), async (req, res) => {
    try {
        const eq = await db.query(`
            SELECT COUNT(*) as total_equipment,
                   COUNT(*) FILTER (WHERE status = 'active') as active,
                   COUNT(*) FILTER (WHERE status = 'maintenance') as in_maintenance,
                   COUNT(*) FILTER (WHERE status = 'broken') as broken,
                   COUNT(*) FILTER (WHERE warranty_end IS NOT NULL AND warranty_end < CURRENT_DATE) as warranty_expired,
                   COUNT(*) FILTER (WHERE next_pm IS NOT NULL AND next_pm <= CURRENT_DATE + INTERVAL '7 days') as pm_due_7d
            FROM maintenance_equipment WHERE tenant_id = $1
        `, [req.tenantId]);
        const wo = await db.query(`
            SELECT status, priority, COUNT(*) as cnt FROM maintenance_work_orders
            WHERE tenant_id = $1 GROUP BY status, priority ORDER BY status, priority
        `, [req.tenantId]);
        res.json({ ok: true, equipment: eq.rows[0], work_orders: wo.rows });
    } catch (err) { console.error('GET /api/maintenance/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['equipment', 'due-soon', 'pm-schedules', 'work-orders', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
