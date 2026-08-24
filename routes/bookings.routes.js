const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeBookingsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/bookings', requireAuth, async (req, res) => {

    try { res.json((await pool.query('SELECT * FROM online_bookings ORDER BY id DESC')).rows); }

    catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/bookings/:id', requireAuth, async (req, res) => {

    try {

        const { status } = req.body;

        await pool.query('UPDATE online_bookings SET status=$1 WHERE id=$2', [status, req.params.id]);

        res.json((await pool.query('SELECT * FROM online_bookings WHERE id=$1', [req.params.id])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
