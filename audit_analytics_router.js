// filepath: namaweb/audit_analytics_router.js
// Audit + chain verification + resource analytics + finance integrity + waste tracking.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/audit-analytics/trail — recent audit entries
router.get('/trail', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'compliance'), async (req, res) => {
    try {
        const { action, user_id, module, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (action) { params.push(action); conditions.push(`action = $${params.length}`); }
        if (user_id) { params.push(user_id); conditions.push(`user_id = $${params.length}`); }
        if (module) { params.push(module); conditions.push(`module = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`created_at >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, user_id, user_name, action, module, record_id, ip_address, prev_hash, row_hash, chain_idx, created_at
            FROM audit_trail WHERE ${conditions.join(' AND ')}
            ORDER BY chain_idx DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, trail: r.rows });
    } catch (err) { console.error('GET /api/audit-analytics/trail', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/audit-analytics/chain/verify — verify hash chain integrity
router.get('/chain/verify', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'compliance'), async (req, res) => {
    try {
        const days_n = Math.min(+req.query.days || 30, 365);
        // Sample first 100 rows and verify chain
        const r = await db.query(`
            SELECT id, prev_hash, row_hash, chain_idx, action, module, user_id, created_at
            FROM audit_trail WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
            ORDER BY chain_idx ASC LIMIT 1000
        `, [req.tenantId, days_n]);
        // Verify chain linkage
        let valid = 0, broken = 0;
        const breaks = [];
        let prevHash = null;
        for (const row of r.rows) {
            if (row.prev_hash === prevHash) {
                valid++;
            } else {
                broken++;
                if (breaks.length < 5) breaks.push({ at_chain_idx: row.chain_idx, expected_prev: prevHash, actual_prev: row.prev_hash, action: row.action });
            }
            prevHash = row.row_hash;
        }
        const total = await db.query(`
            SELECT COUNT(*) as total,
                   MIN(created_at) as earliest,
                   MAX(created_at) as latest,
                   MAX(chain_idx) as max_chain_idx
            FROM audit_trail WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
        `, [req.tenantId, days_n]);
        res.json({ ok: true, period_days: days_n, total_rows: total.rows[0].total, chain_index_meta: total.rows[0], sample_verified: valid, breaks_detected: broken, breaks: breaks });
    } catch (err) { console.error('GET /api/audit-analytics/chain/verify', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/audit-analytics/by-user
router.get('/by-user', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'compliance'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 7, 90);
        const r = await db.query(`
            SELECT user_id, user_name, COUNT(*) as actions_count,
                   COUNT(DISTINCT action) as unique_actions,
                   COUNT(DISTINCT module) as modules_touched,
                   MIN(created_at) as first_action,
                   MAX(created_at) as last_action
            FROM audit_trail WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
            GROUP BY user_id, user_name ORDER BY actions_count DESC LIMIT 50
        `, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, users: r.rows });
    } catch (err) { console.error('GET /api/audit-analytics/by-user', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/audit-analytics/by-action
router.get('/by-action', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'compliance'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 7, 90);
        const r = await db.query(`
            SELECT action, module, COUNT(*) as count
            FROM audit_trail WHERE tenant_id = $1 AND created_at >= NOW() - ($2 || ' days')::interval
            GROUP BY action, module ORDER BY count DESC LIMIT 50
        `, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, actions: r.rows });
    } catch (err) { console.error('GET /api/audit-analytics/by-action', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/audit-analytics/resource-logs
router.get('/resource-logs', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 30, 365);
        const r = await db.query(`
            SELECT id, log_date, bed_occupancy_percent, staff_patient_ratio, or_utilization_percent,
                   resource_bottleneck, created_at
            FROM admin_resource_logs WHERE tenant_id = $1 AND log_date >= CURRENT_DATE - $2::int
            ORDER BY log_date DESC LIMIT 100
        `, [req.tenantId, days]);
        // Aggregates
        const summary = await db.query(`
            SELECT ROUND(AVG(bed_occupancy_percent)::numeric, 2) as avg_bed_occupancy,
                   ROUND(AVG(or_utilization_percent)::numeric, 2) as avg_or_utilization,
                   ROUND(AVG(staff_patient_ratio)::numeric, 2) as avg_staff_ratio,
                   MAX(bed_occupancy_percent) as peak_bed_occupancy,
                   MIN(bed_occupancy_percent) as low_bed_occupancy,
                   COUNT(*) FILTER (WHERE bed_occupancy_percent > 90) as high_load_days,
                   COUNT(*) FILTER (WHERE resource_bottleneck IS NOT NULL AND resource_bottleneck != '') as bottleneck_days
            FROM admin_resource_logs WHERE tenant_id = $1 AND log_date >= CURRENT_DATE - $2::int
        `, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, summary: summary.rows[0], logs: r.rows });
    } catch (err) { console.error('GET /api/audit-analytics/resource-logs', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/audit-analytics/resource-logs
router.post('/resource-logs', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const { log_date, bed_occupancy_percent, staff_patient_ratio, or_utilization_percent, resource_bottleneck } = req.body;
        if (!log_date) return res.status(400).json({ error: 'missing_required', required: ['log_date'] });
        const r = await db.query(`
            INSERT INTO admin_resource_logs (tenant_id, log_date, bed_occupancy_percent, staff_patient_ratio, or_utilization_percent, resource_bottleneck)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `, [req.tenantId, log_date, bed_occupancy_percent || null, staff_patient_ratio || null, or_utilization_percent || null, resource_bottleneck || null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/audit-analytics/resource-logs', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/audit-analytics/finance-integrity
router.get('/finance-integrity', requireAuth, requireTenantScope, requireRole('admin', 'finance', 'quality'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 30, 365);
        const r = await db.query(`
            SELECT id, log_date, revenue_leakage_amount, cost_per_case_avg,
                   billing_anomaly_detected, anomaly_description, created_at
            FROM financial_integrity_logs WHERE tenant_id = $1 AND log_date >= CURRENT_DATE - $2::int
            ORDER BY log_date DESC LIMIT 100
        `, [req.tenantId, days]);
        const summary = await db.query(`
            SELECT ROUND(SUM(revenue_leakage_amount)::numeric, 2) as total_leakage,
                   ROUND(AVG(cost_per_case_avg)::numeric, 2) as avg_cost_per_case,
                   COUNT(*) FILTER (WHERE billing_anomaly_detected) as anomaly_days,
                   COUNT(*) as total_entries
            FROM financial_integrity_logs WHERE tenant_id = $1 AND log_date >= CURRENT_DATE - $2::int
        `, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, summary: summary.rows[0], logs: r.rows });
    } catch (err) { console.error('GET /api/audit-analytics/finance-integrity', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/audit-analytics/waste
router.get('/waste', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'nurse'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 30, 365);
        const r = await db.query(`
            SELECT id, waste_type, weight_kg, disposal_company, truck_number, logged_by, logged_at, notes, created_at
            FROM medical_waste_logs WHERE tenant_id = $1 AND logged_at >= NOW() - ($2 || ' days')::interval
            ORDER BY logged_at DESC LIMIT 100
        `, [req.tenantId, days]);
        const summary = await db.query(`
            SELECT waste_type, COUNT(*) as entries, SUM(weight_kg) as total_kg, AVG(weight_kg)::numeric(10,2) as avg_kg
            FROM medical_waste_logs WHERE tenant_id = $1 AND logged_at >= NOW() - ($2 || ' days')::interval
            GROUP BY waste_type ORDER BY total_kg DESC
        `, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, by_type: summary.rows, logs: r.rows });
    } catch (err) { console.error('GET /api/audit-analytics/waste', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/audit-analytics/waste
router.post('/waste', requireAuth, requireTenantScope, requireRole('admin', 'nurse', 'quality'), async (req, res) => {
    try {
        const { waste_type, weight_kg, disposal_company, truck_number, notes } = req.body;
        if (!waste_type || !weight_kg) return res.status(400).json({ error: 'missing_required', required: ['waste_type', 'weight_kg'] });
        const r = await db.query(`
            INSERT INTO medical_waste_logs (tenant_id, waste_type, weight_kg, disposal_company, truck_number, logged_by, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `, [req.tenantId, waste_type, weight_kg, disposal_company || '', truck_number || '', req.userName || req.userId, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/audit-analytics/waste', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/audit-analytics/dashboard — combined dashboard
router.get('/dashboard', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const a = await db.query(`
            SELECT COUNT(*) as audit_events_24h,
                   COUNT(DISTINCT user_id) as active_users_24h,
                   COUNT(*) FILTER (WHERE action IN ('DELETE','CANCEL','DENY','DISABLE')) as sensitive_events_24h
            FROM audit_trail WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '24 hours'
        `, [req.tenantId]);
        const r = await db.query(`
            SELECT COUNT(*) FILTER (WHERE bed_occupancy_percent > 85) as high_burden_days_30d,
                   ROUND(AVG(bed_occupancy_percent)::numeric, 1) as current_avg_bed_occupancy
            FROM admin_resource_logs WHERE tenant_id = $1 AND log_date >= CURRENT_DATE - INTERVAL '30 days'
        `, [req.tenantId]);
        const f = await db.query(`
            SELECT COALESCE(SUM(revenue_leakage_amount), 0) as leakage_30d,
                   COUNT(*) FILTER (WHERE billing_anomaly_detected) as anomalies_30d
            FROM financial_integrity_logs WHERE tenant_id = $1 AND log_date >= CURRENT_DATE - INTERVAL '30 days'
        `, [req.tenantId]);
        const w = await db.query(`
            SELECT COALESCE(SUM(weight_kg), 0) as total_waste_kg_30d
            FROM medical_waste_logs WHERE tenant_id = $1 AND logged_at >= NOW() - INTERVAL '30 days'
        `, [req.tenantId]);
        res.json({ ok: true, audit_24h: a.rows[0], resource_30d: r.rows[0], finance_30d: f.rows[0], waste_30d: w.rows[0] });
    } catch (err) { console.error('GET /api/audit-analytics/dashboard', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['trail', 'chain/verify', 'by-user', 'by-action', 'resource-logs', 'finance-integrity', 'waste', 'dashboard'], timestamp: new Date().toISOString() });
});

module.exports = router;
