const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeCmeRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/cme/activities', requireAuth, requireRole('cme'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        res.json((await pool.query('SELECT * FROM cme_activities WHERE tenant_id=$1 ORDER BY activity_date DESC', [tenantId])).rows);
    }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/cme/activities', requireAuth, requireRole('cme'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId, facilityId } = getRequestTenantContext(req);
        const { title, category, provider, credit_hours, activity_date, location, max_participants, description } = req.body;
        const result = await pool.query('INSERT INTO cme_activities (title, category, provider, credit_hours, activity_date, location, max_participants, description, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
            [title || '', category || 'Conference', provider || '', credit_hours || 0, activity_date || '', location || '', max_participants || 50, description || '', tenantId, facilityId]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/cme/registrations', requireAuth, requireRole('cme'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { activity_id } = req.query;
        if (activity_id) res.json((await pool.query('SELECT * FROM cme_registrations WHERE activity_id=$1 AND tenant_id=$2', [activity_id, tenantId])).rows);
        else res.json((await pool.query('SELECT * FROM cme_registrations WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/cme/registrations', requireAuth, requireRole('cme'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId, facilityId } = getRequestTenantContext(req);
        const { activity_id, employee_name } = req.body;
        const result = await pool.query('INSERT INTO cme_registrations (activity_id, employee_name, registration_date, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [activity_id, employee_name || req.session.user.name, new Date().toISOString().split('T')[0], tenantId, facilityId]);
        await pool.query('UPDATE cme_activities SET registered=registered+1 WHERE id=$1 AND tenant_id=$2', [activity_id, tenantId]);
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/cme/events', requireAuth, requireRole('cme'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        res.json((await pool.query('SELECT * FROM cme_events WHERE tenant_id=$1 ORDER BY event_date DESC', [tenantId])).rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/cme/events', requireAuth, requireRole('cme'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId, facilityId } = getRequestTenantContext(req);
        const { title, speaker, event_date, cme_hours, category, department, status } = req.body;
        const r = await pool.query('INSERT INTO cme_events (title,speaker,event_date,cme_hours,category,department,status,tenant_id,facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *', [title, speaker, event_date, cme_hours || 0, category, department, status || 'upcoming', tenantId, facilityId]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
