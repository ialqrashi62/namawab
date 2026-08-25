'use strict';
// Wave 119 — PHI record access audit log + Tenant plan assignments
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_ACCESS_TYPE = ['view','export','print','copy','modify','delete','share','download','upload','create','sign','unsign','lock','unlock','reassign','merge','print_label','print_id_card','access_denied','login_attempt','logout','other'];
const VALID_ASSIGNMENT_SOURCE = ['self_signup','sales','partner','admin','migration','trial_conversion','complimentary','beta','promotion','manual','automatic','other'];
const VALID_RISK = ['low','moderate','high','critical'];

function phiAccessSeverity(accessType, reason) {
    if (accessType === 'delete' || accessType === 'unsign') return 'critical';
    if (accessType === 'export' || accessType === 'download' || accessType === 'share') return 'high';
    if (accessType === 'modify' || accessType === 'merge' || accessType === 'reassign') return 'high';
    if (accessType === 'print' || accessType === 'copy') return 'moderate';
    if (accessType === 'access_denied') return 'notable';
    return 'standard';
}

function breakGlassCheck(accessType, reason) {
    const validReasons = ['emergency','break_glass','life_threatening','public_health','legal_mandate','audit','quality_improvement','research_approved','patient_request','continuity_of_care','payment','other'];
    if (accessType === 'access_denied') return 'blocked';
    if (reason && reason.toLowerCase().includes('break_glass')) return 'break_glass';
    if (reason && validReasons.some(r => reason.toLowerCase().includes(r.toLowerCase()))) return 'justified';
    return 'standard';
}

function planAssignmentStatus(effective_from, effective_to) {
    const now = new Date();
    if (effective_from && new Date(effective_from) > now) return 'pending';
    if (effective_to && new Date(effective_to) < now) return 'expired';
    if (effective_to && new Date(effective_to) > now) return 'active';
    return 'active';
}

function planAssignmentDuration(from, to) {
    if (!from) return null;
    const end = to ? new Date(to) : new Date();
    return Math.round((end - new Date(from)) / (1000 * 60 * 60 * 24));
}

function accessVolumeRisk(accessCount, timeWindow) {
    if (accessCount === undefined || timeWindow === undefined) return null;
    const rate = parseInt(accessCount) / parseFloat(timeWindow);
    if (rate > 100) return 'extreme_volume';
    if (rate > 50) return 'high_volume';
    if (rate > 20) return 'elevated';
    if (rate > 5) return 'normal';
    return 'low_volume';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'phi-access-plan',
        endpoints: [
            'GET /phi/record-access',
            'POST /phi/record-access',
            'GET /phi/stats',
            'GET /phi/accessor/:accessor_id',
            'GET /phi/patient/:patient_id',
            'GET /saas/plan-assignments',
            'POST /saas/plan-assignments',
            'GET /saas/plan-assignments/active',
            'GET /plan-status',
            'GET /plan-duration',
            'GET /access-volume',
            'GET /break-glass',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== PHI RECORD ACCESS LOG =====
router.get('/phi/record-access', requireAuth, requireTenantScope, requireRole('compliance_officer'), async (req, res) => {
    try {
        const { patient_id, accessor_id, access_type, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT a.*, p.full_name AS patient_name, u.username AS accessor_username, u.full_name AS accessor_full_name
                   FROM record_access_log a LEFT JOIN patients p ON p.id = a.patient_id LEFT JOIN users u ON u.id = a.accessor_id
                   WHERE a.tenant_id = $1`;
        if (patient_id) { sql += ` AND a.patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (accessor_id) { sql += ` AND a.accessor_id = $${params.length + 1}`; params.push(parseInt(accessor_id)); }
        if (access_type) { sql += ` AND a.access_type = $${params.length + 1}`; params.push(access_type); }
        if (since) { sql += ` AND a.at >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY a.at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/phi/record-access', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { facility_id, patient_id, accessor_id, access_type, reason } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!accessor_id) return res.status(400).json({ ok: false, error: 'accessor_id_required' });
        if (!access_type || !VALID_ACCESS_TYPE.includes(access_type)) return res.status(400).json({ ok: false, error: 'invalid_access_type' });

        const r = await db.query(
            `INSERT INTO record_access_log (tenant_id, facility_id, patient_id, accessor_id, access_type, reason, at)
             VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *`,
            [req.tenantId, facility_id || null, parseInt(patient_id), parseInt(accessor_id),
             access_type, reason || null]
        );
        res.status(201).json({
            ok: true, log: r.rows[0],
            computed: {
                severity: phiAccessSeverity(access_type, reason),
                break_glass_status: breakGlassCheck(access_type, reason)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/phi/accessor/:accessor_id', requireAuth, requireTenantScope, requireRole('compliance_officer'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT access_type, COUNT(*) AS count, MAX(at) AS last_access FROM record_access_log
             WHERE tenant_id = $1 AND accessor_id = $2 GROUP BY access_type ORDER BY count DESC`,
            [req.tenantId, parseInt(req.params.accessor_id)]
        );
        const total = r.rows.reduce((acc, x) => acc + parseInt(x.count), 0);
        const recent = await db.query(
            `SELECT * FROM record_access_log WHERE tenant_id = $1 AND accessor_id = $2 AND at >= NOW() - INTERVAL '24 hours'
             ORDER BY at DESC LIMIT 50`,
            [req.tenantId, parseInt(req.params.accessor_id)]
        );
        res.json({
            ok: true, accessor_id: parseInt(req.params.accessor_id),
            total_accesses: total, breakdown: r.rows, recent_24h: recent.rows,
            computed: { volume_risk: accessVolumeRisk(total, '24') }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/phi/patient/:patient_id', requireAuth, requireTenantScope, requireRole('compliance_officer'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT a.*, u.username AS accessor_username, u.full_name AS accessor_full_name
             FROM record_access_log a LEFT JOIN users u ON u.id = a.accessor_id
             WHERE a.tenant_id = $1 AND a.patient_id = $2 ORDER BY a.at DESC LIMIT 100`,
            [req.tenantId, parseInt(req.params.patient_id)]
        );
        const accessorCount = await db.query(
            `SELECT accessor_id, u.username, u.full_name, COUNT(*) AS access_count, MAX(at) AS last_access
             FROM record_access_log a LEFT JOIN users u ON u.id = a.accessor_id
             WHERE a.tenant_id = $1 AND a.patient_id = $2 GROUP BY accessor_id, u.username, u.full_name
             ORDER BY access_count DESC LIMIT 20`,
            [req.tenantId, parseInt(req.params.patient_id)]
        );
        res.json({
            ok: true, patient_id: parseInt(req.params.patient_id),
            recent_accesses: r.rows, unique_accessor_count: accessorCount.rows.length,
            top_accessors: accessorCount.rows
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/phi/stats', requireAuth, requireTenantScope, requireRole('compliance_officer'), async (req, res) => {
    try {
        const byType = await db.query(
            `SELECT access_type, COUNT(*) AS count FROM record_access_log WHERE tenant_id = $1 AND at >= NOW() - INTERVAL '90 days' GROUP BY access_type ORDER BY count DESC`,
            [req.tenantId]
        );
        const topAccessors = await db.query(
            `SELECT accessor_id, u.username, u.full_name, COUNT(*) AS count FROM record_access_log a LEFT JOIN users u ON u.id = a.accessor_id
             WHERE a.tenant_id = $1 AND a.at >= NOW() - INTERVAL '90 days' GROUP BY accessor_id, u.username, u.full_name ORDER BY count DESC LIMIT 20`,
            [req.tenantId]
        );
        const denied = await db.query(
            `SELECT COUNT(*) AS count FROM record_access_log WHERE tenant_id = $1 AND access_type = 'access_denied' AND at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        res.json({ ok: true, by_type_90d: byType.rows, top_accessors_90d: topAccessors.rows, denied_count_90d: denied.rows[0].count });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SAAS PLAN ASSIGNMENTS =====
router.get('/saas/plan-assignments', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { tenant_id, plan_key, assignment_source, since, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM tenant_plan_assignments WHERE 1=1`;
        if (tenant_id) { sql += ` AND tenant_id = $${params.length + 1}`; params.push(parseInt(tenant_id)); }
        if (plan_key) { sql += ` AND plan_key = $${params.length + 1}`; params.push(plan_key); }
        if (assignment_source) { sql += ` AND assignment_source = $${params.length + 1}`; params.push(assignment_source); }
        if (since) { sql += ` AND assigned_at >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY assigned_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/saas/plan-assignments/active', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { tenant_id } = req.query;
        const params = [];
        let sql = `SELECT * FROM tenant_plan_assignments WHERE (effective_from IS NULL OR effective_from <= NOW()) AND (effective_to IS NULL OR effective_to > NOW())`;
        if (tenant_id) { sql += ` AND tenant_id = $${params.length + 1}`; params.push(parseInt(tenant_id)); }
        sql += ` ORDER BY assigned_at DESC LIMIT 200`;
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/saas/plan-assignments', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { tenant_id, plan_key, assignment_source, assigned_by, effective_from, effective_to } = req.body;
        if (!tenant_id) return res.status(400).json({ ok: false, error: 'tenant_id_required' });
        if (!plan_key) return res.status(400).json({ ok: false, error: 'plan_key_required' });
        if (assignment_source && !VALID_ASSIGNMENT_SOURCE.includes(assignment_source)) return res.status(400).json({ ok: false, error: 'invalid_assignment_source' });
        if (effective_from && effective_to && new Date(effective_to) <= new Date(effective_from)) return res.status(400).json({ ok: false, error: 'effective_to_must_be_after_from' });

        const r = await db.query(
            `INSERT INTO tenant_plan_assignments (tenant_id, plan_key, assignment_source, assigned_by, effective_from, effective_to)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [parseInt(tenant_id), plan_key, assignment_source || 'manual', assigned_by || req.user?.id || null,
             effective_from || null, effective_to || null]
        );
        res.status(201).json({
            ok: true, assignment: r.rows[0],
            computed: { status: planAssignmentStatus(effective_from, effective_to) }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/plan-status', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { effective_from, effective_to } = req.query;
        res.json({ ok: true, effective_from, effective_to, status: planAssignmentStatus(effective_from, effective_to) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/plan-duration', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { effective_from, effective_to } = req.query;
        if (!effective_from) return res.status(400).json({ ok: false, error: 'effective_from_required' });
        res.json({ ok: true, duration_days: planAssignmentDuration(effective_from, effective_to) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/access-volume', requireAuth, requireTenantScope, requireRole('compliance_officer'), async (req, res) => {
    try {
        const { access_count, time_window_hours } = req.query;
        if (access_count === undefined || time_window_hours === undefined) return res.status(400).json({ ok: false, error: 'count_and_hours_required' });
        res.json({ ok: true, access_count: parseInt(access_count), time_window_hours: parseFloat(time_window_hours), risk: accessVolumeRisk(access_count, time_window_hours) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/break-glass', requireAuth, requireTenantScope, requireRole('compliance_officer'), async (req, res) => {
    try {
        const { access_type, reason } = req.query;
        if (!access_type) return res.status(400).json({ ok: false, error: 'access_type_required' });
        res.json({ ok: true, access_type, reason, status: breakGlassCheck(access_type, reason) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const phi = await db.query(`SELECT access_type, COUNT(*) AS count FROM record_access_log WHERE at >= NOW() - INTERVAL '90 days' GROUP BY access_type ORDER BY count DESC`, []);
        const phiTop = await db.query(`SELECT accessor_id, COUNT(*) AS count FROM record_access_log WHERE at >= NOW() - INTERVAL '30 days' GROUP BY accessor_id ORDER BY count DESC LIMIT 20`, []);
        const assignments = await db.query(`SELECT plan_key, assignment_source, COUNT(*) AS count FROM tenant_plan_assignments GROUP BY plan_key, assignment_source`, []);
        res.json({ ok: true, phi_by_type_90d: phi.rows, phi_top_accessors_30d: phiTop.rows, plan_assignments: assignments.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
