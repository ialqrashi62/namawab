const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeTransportRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/transport/requests', requireAuth, requireRole('transport'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        res.json((await pool.query('SELECT * FROM transport_requests WHERE tenant_id=$1 ORDER BY request_time DESC', [tenantId])).rows);
    }
    catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/transport/requests', requireAuth, requireRole('transport'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId, facilityId } = getRequestTenantContext(req);
        const { patient_id, patient_name, from_location, to_location, transport_type, priority, requested_by, special_needs } = req.body;
        const r = await pool.query('INSERT INTO transport_requests (patient_id,patient_name,from_location,to_location,transport_type,priority,requested_by,special_needs,tenant_id,facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
            [patient_id, patient_name, from_location, to_location, transport_type || 'Wheelchair', priority || 'Routine', requested_by, special_needs, tenantId, facilityId]);
        res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.put('/api/transport/requests/:id', requireAuth, requireRole('transport'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { status, assigned_porter, pickup_time, dropoff_time } = req.body;
        const sets = []; const vals = []; let i = 1;
        if (status) { sets.push(`status=$${i++}`); vals.push(status); }
        if (assigned_porter) { sets.push(`assigned_porter=$${i++}`); vals.push(assigned_porter); }
        if (pickup_time) { sets.push(`pickup_time=$${i++}`); vals.push(pickup_time); }
        if (dropoff_time) { sets.push(`dropoff_time=$${i++}`); vals.push(dropoff_time); }
        vals.push(req.params.id);
        vals.push(tenantId);
        await pool.query(`UPDATE transport_requests SET ${sets.join(',')} WHERE id=$${i} AND tenant_id=$${i+1}`, vals);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
