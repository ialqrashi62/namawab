// filepath: namaweb/analytics_router.js
// Cross-cutting analytics + executive dashboard pulls + finance report snapshots.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Executive dashboard (single-shot board view)
router.get('/exec', requireAuth, requireTenantScope, requireRole('admin', 'cmo', 'ceo', 'cfo'), async (req, res) => {
    try {
        const today = await db.query(`SELECT COUNT(*) as new_patients_today FROM admissions WHERE tenant_id = $1 AND admission_date::date = CURRENT_DATE`, [req.tenantId]);
        const inpatient = await db.query(`SELECT COUNT(*) as inpatient_count FROM admissions WHERE tenant_id = $1 AND status = 'active'`, [req.tenantId]);
        const edVisits = await db.query(`SELECT COUNT(*) as ed_visits_today FROM emergency_visits WHERE tenant_id = $1 AND created_at::date = CURRENT_DATE`, [req.tenantId]);
        const surgeries = await db.query(`SELECT COUNT(*) as surgeries_today FROM imaging_studies WHERE tenant_id = $1 AND scheduled_at::date = CURRENT_DATE AND modality LIKE 'SURG%'`, [req.tenantId]).catch(() => ({ rows: [{ surgeries_today: 0 }] }));
        const revenue = await db.query(`SELECT ROUND(SUM(COALESCE(total,0))::numeric, 2) as revenue_30d FROM invoices WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days'`, [req.tenantId]);
        const beds = await db.query(`SELECT COUNT(*) FILTER (WHERE status = 'occupied') as occupied_beds, COUNT(*) FILTER (WHERE status = 'available') as available_beds, COUNT(*) as total_beds FROM beds WHERE tenant_id = $1`, [req.tenantId]);
        const staff = await db.query(`SELECT COUNT(*) as active_staff FROM hr_employees WHERE tenant_id = $1 AND is_active = true`, [req.tenantId]);
        const incidents = await db.query(`SELECT COUNT(*) as open_incidents FROM incident_reports WHERE tenant_id = $1 AND status = 'open'`, [req.tenantId]);
        const labBacklog = await db.query(`SELECT COUNT(*) as unreported_results FROM lab_results WHERE tenant_id = $1 AND status = 'pending'`, [req.tenantId]);
        res.json({ ok: true, dashboard: {
            new_patients_today: +(today.rows[0].new_patients_today || 0),
            inpatient_count: +(inpatient.rows[0].inpatient_count || 0),
            ed_visits_today: +(edVisits.rows[0].ed_visits_today || 0),
            surgeries_today: +(surgeries.rows[0].surgeries_today || 0),
            revenue_30d: +(revenue.rows[0].revenue_30d || 0),
            beds: beds.rows[0],
            active_staff: +(staff.rows[0].active_staff || 0),
            open_incidents: +(incidents.rows[0].open_incidents || 0),
            lab_backlog: +(labBacklog.rows[0].unreported_results || 0),
            occupancy_pct: beds.rows[0].total_beds ? Math.round(100 * (+beds.rows[0].occupied_beds / +beds.rows[0].total_beds)) : 0
        } });
    } catch (err) { console.error('GET /api/ax/exec', err); res.status(500).json({ error: 'internal_error' }); }
});

// Throughput (last 30d)
router.get('/throughput', requireAuth, requireTenantScope, requireRole('admin', 'cmo', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT CURRENT_DATE::text as day,
                   (SELECT COUNT(*) FROM admissions WHERE tenant_id = $1 AND admission_date >= NOW() - INTERVAL '30 days') as admissions_30d,
                   (SELECT COUNT(*) FROM emergency_visits WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days') as ed_visits_30d,
                   (SELECT COUNT(*) FROM imaging_studies WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days') as imaging_30d,
                   (SELECT COUNT(*) FROM lab_results WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days') as labs_30d,
                   (SELECT COUNT(*) FROM or_slots WHERE tenant_id = $1 AND slot_date >= NOW() - INTERVAL '30 days') as surgery_30d,
                   (SELECT COUNT(*) FROM invoices WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days') as bills_30d
        `, [req.tenantId]);
        res.json({ ok: true, throughput_30d: r.rows[0] });
    } catch (err) { console.error('GET /api/ax/throughput', err); res.status(500).json({ error: 'internal_error' }); }
});

// Financial snapshots
router.get('/finance-snapshots', requireAuth, requireTenantScope, requireRole('admin', 'cfo'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, report_type, report_period_start, report_period_end, generated_by, generated_at, total_revenue, total_expenses, net_income, status FROM finance_report_snapshots WHERE tenant_id = $1 ORDER BY generated_at DESC LIMIT 30`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, snapshots: r.rows });
    } catch (err) { console.error('GET /api/ax/finance-snapshots', err); res.status(500).json({ error: 'internal_error' }); }
});

// CSP reports (security incidents)
router.get('/csp-reports', requireAuth, requireTenantScope, requireRole('security_officer', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, document_uri, directive, blocked_uri, source_ip, created_at FROM csp_reports WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, csp: r.rows });
    } catch (err) { console.error('GET /api/ax/csp-reports', err); res.status(500).json({ error: 'internal_error' }); }
});

// Census by department over time
router.get('/census-trend', requireAuth, requireTenantScope, requireRole('admin', 'cmo', 'nurse_director'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT department, COUNT(*) as total_admissions_30d,
                   COUNT(*) FILTER (WHERE status = 'active') as currently_active,
                   COUNT(*) FILTER (WHERE discharge_date IS NOT NULL AND discharge_date >= NOW() - INTERVAL '30 days') as discharged_30d
            FROM admissions WHERE tenant_id = $1 AND admission_date >= NOW() - INTERVAL '30 days'
            GROUP BY department ORDER BY total_admissions_30d DESC
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, departments: r.rows });
    } catch (err) { console.error('GET /api/ax/census-trend', err); res.status(500).json({ error: 'internal_error' }); }
});

// Knowledge vector stats
router.get('/knowledge-stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT COUNT(*) as vector_count, COUNT(DISTINCT department_id) as department_count FROM clinical_knowledge_vectors WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('GET /api/ax/knowledge-stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['exec', 'throughput', 'finance-snapshots', 'csp-reports', 'census-trend', 'knowledge-stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
