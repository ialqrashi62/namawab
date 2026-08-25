const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeIncidentsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, canReviewOvr }) {
    const router = express.Router();
router.get('/api/incidents/ovr', requireAuth, requireTenantScope, async (req, res) => {

  try {

    const { tenantId } = getRequestTenantContext(req);

    const user = req.session.user;

    const isPrivileged = canReviewOvr(user);

    let rows;

    if (isPrivileged) {

      rows = (await pool.query(

        'SELECT * FROM incident_reports WHERE (tenant_id=$1 OR tenant_id IS NULL) ORDER BY created_at DESC LIMIT 100',

        [tenantId]

      )).rows;

    } else {

      // Non-privileged: only see their own non-anonymous reports

      rows = (await pool.query(

        'SELECT * FROM incident_reports WHERE tenant_id=$1 AND (is_anonymous=false AND reporter_id=$2) ORDER BY created_at DESC LIMIT 50',

        [tenantId, user.id]

      )).rows;

    }

    res.json(rows);

  } catch (e) { console.error('[OVR GET]', e.message); res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/incidents/ovr', requireAuth, requireTenantScope, async (req, res) => {

  try {

    const { tenantId, facilityId } = getRequestTenantContext(req);

    const user = req.session.user;

    const { incident_type, sac_classification, incident_datetime, location, description, immediate_actions, is_anonymous } = req.body;

    if (!incident_type || !description) return res.status(422).json({ error: 'incident_type and description are required' });

    const sacValue = sac_classification || req.body.severity || 'SAC4';

    const immediateActionsValue = immediate_actions || req.body.immediate_action || '';

    const reporterId = is_anonymous ? null : user.id;

    const reporterName = is_anonymous ? null : (user.display_name || user.username);

    const result = await pool.query(

      `INSERT INTO incident_reports (tenant_id, facility_id, incident_type, sac_classification, incident_datetime, location, description, immediate_actions, is_anonymous, reporter_id, reporter_name)

       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,

      [tenantId, facilityId || null, incident_type, sacValue,

       incident_datetime ? new Date(incident_datetime) : new Date(),

       location || '', description, immediateActionsValue, is_anonymous ? true : false,

       reporterId, reporterName]

    );

    logAudit(user.id, user.display_name || user.username, 'CREATE_OVR_INCIDENT', 'Safety',

      `SAC: ${sacValue} | Type: ${incident_type} | Anonymous: ${is_anonymous}`, req.ip);

    res.status(201).json(result.rows[0]);

  } catch (e) { console.error('[OVR POST]', e.message); res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/incidents/ovr/:id', requireAuth, requireTenantScope, async (req, res) => {

  try {

    const { tenantId } = getRequestTenantContext(req);

    const user = req.session.user;

    if (!canReviewOvr(user)) return res.status(403).json({ error: 'Forbidden' });

    const { status, rca_status, rca_notes } = req.body;

    const result = await pool.query(

      `UPDATE incident_reports SET status=$1, rca_status=$2, rca_notes=$3, updated_at=NOW()

       WHERE id=$4 AND (tenant_id=$5 OR tenant_id IS NULL) RETURNING *`,

      [status || 'Open', rca_status || null, rca_notes || null, req.params.id, tenantId]

    );

    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });

    logAudit(user.id, user.display_name || user.username, 'UPDATE_OVR_INCIDENT', 'Safety',

      `ID: ${req.params.id} → status: ${status} | RCA: ${rca_status}`, req.ip);

    res.json(result.rows[0]);

  } catch (e) { console.error('[OVR PUT]', e.message); res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
