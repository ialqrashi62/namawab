const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeNotificationsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/notifications', requireAuth, async (req, res) => {

    try {

        const role = req.session.user?.role || '';

        const userId = req.session.user?.id;

        const notifs = (await pool.query("SELECT * FROM notifications WHERE (user_id=$1 OR target_role=$2 OR target_role='') ORDER BY created_at DESC LIMIT 50", [userId, role])).rows;

        res.json({ notifications: notifs, unread: notifs.filter(n => !n.is_read).length });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/notifications/:id/read', requireAuth, async (req, res) => {

    try {

        await pool.query('UPDATE notifications SET is_read=1 WHERE id=$1', [req.params.id]);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
