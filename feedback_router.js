// filepath: namaweb/feedback_router.js
// Patient feedback (complaints, suggestions, kudos).
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// GET /api/feedback?type=complaint&resolved=false
router.get('/', requireAuth, requireTenantScope, requireRole('admin', 'quality', 'nurse', 'doctor'), async (req, res) => {
    try {
        const { type, resolved, department, min_rating, max_rating } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (type) { params.push(type); conditions.push(`feedback_type = $${params.length}`); }
        if (resolved === 'true') conditions.push('is_resolved = true');
        else if (resolved === 'false') conditions.push('is_resolved = false');
        if (department) { params.push(department); conditions.push(`department = $${params.length}`); }
        if (min_rating) { params.push(+min_rating); conditions.push(`rating >= $${params.length}`); }
        if (max_rating) { params.push(+max_rating); conditions.push(`rating <= $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, department, feedback_type, rating,
                   comment, comment_ar, is_resolved, resolved_by, resolved_at, resolution_notes, created_at
            FROM patient_feedback
            WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, feedback: r.rows });
    } catch (err) { console.error('GET /api/feedback', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/feedback/open — unresolved complaints
router.get('/open', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, department, feedback_type, rating, comment, created_at
            FROM patient_feedback
            WHERE tenant_id = $1 AND is_resolved = false
            ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, items: r.rows });
    } catch (err) { console.error('GET /api/feedback/open', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/feedback
router.post('/', requireAuth, requireTenantScope, requireRole('patient', 'doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { patient_id, encounter_id, department, feedback_type, rating, comment, comment_ar } = req.body;
        if (!feedback_type || !rating) return res.status(400).json({ error: 'missing_required', required: ['feedback_type', 'rating'] });
        if (rating < 1 || rating > 5) return res.status(400).json({ error: 'rating_out_of_range', allowed: [1,2,3,4,5] });
        const r = await db.query(`
            INSERT INTO patient_feedback (tenant_id, patient_id, encounter_id, department, feedback_type, rating, comment, comment_ar)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id
        `, [req.tenantId, patient_id || null, encounter_id || null, department || '', feedback_type, rating, comment || '', comment_ar || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/feedback', err); res.status(500).json({ error: 'internal_error' }); }
});

// POST /api/feedback/:id/resolve
router.post('/:id/resolve', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const { resolution_notes } = req.body;
        const r = await db.query(`
            UPDATE patient_feedback SET is_resolved = true, resolved_by = $3, resolved_at = NOW(), resolution_notes = COALESCE($4, resolution_notes)
            WHERE id = $1 AND tenant_id = $2 AND is_resolved = false RETURNING id, is_resolved, resolved_at
        `, [req.params.id, req.tenantId, req.userId, resolution_notes || null]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_resolved' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/feedback/:id/resolve', err); res.status(500).json({ error: 'internal_error' }); }
});

// GET /api/feedback/stats
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'quality'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT
                COUNT(*) as total_feedback,
                COUNT(*) FILTER (WHERE is_resolved) as resolved,
                COUNT(*) FILTER (WHERE NOT is_resolved) as open,
                AVG(rating)::numeric(4,2) as avg_rating,
                COUNT(*) FILTER (WHERE rating <= 2) as negative,
                COUNT(*) FILTER (WHERE rating >= 4) as positive
            FROM patient_feedback WHERE tenant_id = $1
        `, [req.tenantId]);
        const byType = await db.query(`
            SELECT feedback_type, COUNT(*) as cnt, AVG(rating)::numeric(4,2) as avg_rating
            FROM patient_feedback WHERE tenant_id = $1
            GROUP BY feedback_type ORDER BY cnt DESC LIMIT 10
        `, [req.tenantId]);
        const byDept = await db.query(`
            SELECT COALESCE(department, 'unknown') as department, COUNT(*) as cnt, AVG(rating)::numeric(4,2) as avg_rating
            FROM patient_feedback WHERE tenant_id = $1
            GROUP BY department ORDER BY cnt DESC LIMIT 10
        `, [req.tenantId]);
        res.json({ ok: true, summary: r.rows[0], by_type: byType.rows, by_department: byDept.rows });
    } catch (err) { console.error('GET /api/feedback/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['list', 'open', 'create', 'resolve', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
