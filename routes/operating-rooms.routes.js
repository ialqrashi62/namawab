const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeOperatingRoomsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/operating-rooms', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const q = tenantId

            ? 'SELECT * FROM operating_rooms WHERE tenant_id = $1 ORDER BY id'

            : 'SELECT * FROM operating_rooms ORDER BY id';

        const params = tenantId ? [tenantId] : [];

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/operating-rooms', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const { room_name, room_name_ar, location, equipment } = req.body;



        const result = await pool.query(

            'INSERT INTO operating_rooms (room_name, room_name_ar, location, equipment, tenant_id, branch_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',

            [room_name || '', room_name_ar || '', location || '', equipment || '', tenantId, facilityId]);



        const returnQ = tenantId

            ? 'SELECT * FROM operating_rooms WHERE id=$1 AND tenant_id=$2'

            : 'SELECT * FROM operating_rooms WHERE id=$1';

        const returnParams = tenantId ? [result.rows[0].id, tenantId] : [result.rows[0].id];



        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CREATE_OPERATING_ROOM', 'Surgery', `Created operating room ${room_name}`, req.ip);

        res.json((await pool.query(returnQ, returnParams)).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
