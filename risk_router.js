// filepath: namaweb/risk_router.js
// Risk register management (likelihood x impact scoring).
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/risk?status=active&level=high
router.get('/', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'safety'), async (req, res) => {
    try {
        const { status, risk_level, category, min_score, max_score } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (risk_level) { params.push(risk_level); conditions.push(`risk_level = $${params.length}`); }
        if (category) { params.push(category); conditions.push(`category = $${params.length}`); }
        if (min_score) { params.push(+min_score); conditions.push(`risk_score >= $${params.length}`); }
        if (max_score) { params.push(+max_score); conditions.push(`risk_score <= $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, incident_id, risk_title, category, likelihood, impact, risk_score, risk_level,
                   control_measure, residual_likelihood, residual_impact, residual_score,
                   owner_name, review_date, status, created_by, created_at
            FROM quality_risk_register
            WHERE ${conditions.join(' AND ')}
            ORDER BY risk_score DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, risks: r.rows });
    } catch (err) { console.error('GET /api/risk', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/risk — create new risk
router.post('/', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'safety'), async (req, res) => {
    try {
        const { risk_title, category, likelihood, impact, risk_score, risk_level, control_measure, owner_name, review_date } = req.body;
        if (!risk_title || likelihood == null || impact == null) return res.status(400).json({ error: 'missing_required', required: ['risk_title', 'likelihood', 'impact'] });
        const computedScore = risk_score != null ? risk_score : (likelihood * impact);
        const computedLevel = risk_level || (computedScore >= 15 ? 'extreme' : computedScore >= 10 ? 'high' : computedScore >= 5 ? 'medium' : 'low');
        const r = await db.query(`
            INSERT INTO quality_risk_register (tenant_id, risk_title, category, likelihood, impact, risk_score, risk_level, control_measure, owner_name, review_date, status, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'active',$11) RETURNING id
        `, [req.tenantId, risk_title, category || '', likelihood, impact, computedScore, computedLevel, control_measure || '', owner_name || '', review_date || null, req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id, risk_score: computedScore, risk_level: computedLevel });
    } catch (err) { console.error('POST /api/risk', err); res.status(500).json({ error: 'internal_error' }); }
});

// PUT /api/risk/:id — update risk + control measure
router.put('/:id', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'safety'), async (req, res) => {
    try {
        const { control_measure, residual_likelihood, residual_impact, residual_score, owner_name, review_date, status } = req.body;
        const updates = [];
        const params = [];
        let pi = 1;
        if (control_measure !== undefined) { updates.push(`control_measure = $${pi++}`); params.push(control_measure); }
        if (residual_likelihood != null) { updates.push(`residual_likelihood = $${pi++}`); params.push(residual_likelihood); }
        if (residual_impact != null) { updates.push(`residual_impact = $${pi++}`); params.push(residual_impact); }
        if (residual_score != null) { updates.push(`residual_score = $${pi++}`); params.push(residual_score); }
        if (owner_name !== undefined) { updates.push(`owner_name = $${pi++}`); params.push(owner_name); }
        if (review_date !== undefined) { updates.push(`review_date = $${pi++}`); params.push(review_date); }
        if (status) { updates.push(`status = $${pi++}`); params.push(status); }
        if (updates.length === 0) return res.status(400).json({ error: 'nothing_to_update' });
        params.push(req.params.id, req.tenantId);
        const r = await db.query(`UPDATE quality_risk_register SET ${updates.join(', ')} WHERE id = $${pi++} AND tenant_id = $${pi++} RETURNING id, risk_score, residual_score, status`, params);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('PUT /api/risk/:id', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/risk/matrix — heat-map matrix (likelihood × impact)
router.get('/matrix', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'safety'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT likelihood, impact, COUNT(*) as count,
                   COUNT(*) FILTER (WHERE status = 'active') as active_count
            FROM quality_risk_register
            WHERE tenant_id = $1
            GROUP BY likelihood, impact ORDER BY likelihood DESC, impact DESC
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, cells: r.rows });
    } catch (err) { console.error('GET /api/risk/matrix', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/risk/due-review — risks approaching review date
router.get('/due-review', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'safety'), async (req, res) => {
    try {
        const days = Math.min(+req.query.days || 30, 365);
        const r = await db.query(`
            SELECT id, risk_title, category, risk_level, owner_name, review_date,
                   (review_date - CURRENT_DATE) as days_until_review, status
            FROM quality_risk_register
            WHERE tenant_id = $1 AND status = 'active' AND review_date IS NOT NULL
              AND review_date <= CURRENT_DATE + $2::int
            ORDER BY review_date ASC LIMIT 100
        `, [req.tenantId, days]);
        res.json({ ok: true, period_days: days, total: r.rows.length, risks: r.rows });
    } catch (err) { console.error('GET /api/risk/due-review', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/risk/stats
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'safety'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT COUNT(*) as total_risks,
                   COUNT(*) FILTER (WHERE status = 'active') as active,
                   COUNT(*) FILTER (WHERE status = 'closed') as closed,
                   COUNT(*) FILTER (WHERE risk_level = 'extreme') as extreme,
                   COUNT(*) FILTER (WHERE risk_level = 'high') as high,
                   COUNT(*) FILTER (WHERE risk_level = 'medium') as medium,
                   COUNT(*) FILTER (WHERE risk_level = 'low') as low,
                   COUNT(*) FILTER (WHERE residual_score IS NOT NULL AND residual_score < risk_score) as reduced
            FROM quality_risk_register WHERE tenant_id = $1
        `, [req.tenantId]);
        const byCat = await db.query(`
            SELECT COALESCE(category, 'uncategorized') as category, COUNT(*) as cnt
            FROM quality_risk_register WHERE tenant_id = $1
            GROUP BY category ORDER BY cnt DESC LIMIT 10
        `, [req.tenantId]);
        res.json({ ok: true, summary: r.rows[0], by_category: byCat.rows });
    } catch (err) { console.error('GET /api/risk/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['list', 'create', 'update', 'matrix', 'due-review', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
