const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeMessagesRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, optionalReadFallback, requirePermission }) {
    const router = express.Router();
router.get('/api/messages', requireAuth, async (req, res) => {

    try {

        const userId = req.session.user.id;

        res.json((await pool.query(

            `SELECT im.*,

                    im.sender_id AS from_user_id,

                    im.receiver_id AS to_user_id,

                    im.body AS content,

                    CASE WHEN im.is_read = 1 THEN im.created_at ELSE NULL END AS read_at,

                    sender.display_name AS from_name,

                    receiver.display_name AS to_name,

                    sender.display_name AS sender_name

               FROM internal_messages im

               LEFT JOIN system_users sender ON im.sender_id=sender.id

               LEFT JOIN system_users receiver ON im.receiver_id=receiver.id

              WHERE im.receiver_id=$1 OR im.sender_id=$1

              ORDER BY im.id DESC`, [userId])).rows);

    } catch (e) { if (optionalReadFallback(res, e)) return; res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/messages', requireAuth, async (req, res) => {

    try {

        const receiver_id = req.body.receiver_id || req.body.to_user_id;

        const body = req.body.body || req.body.content || '';

        const { subject, priority } = req.body;

        const result = await pool.query('INSERT INTO internal_messages (sender_id, receiver_id, subject, body, priority) VALUES ($1,$2,$3,$4,$5) RETURNING id',

            [req.session.user.id, receiver_id, subject || '', body || '', priority || 'Normal']);

        res.json((await pool.query('SELECT * FROM internal_messages WHERE id=$1', [result.rows[0].id])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/messages', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const userId = req.session.user.id;

        const { tenantId } = getRequestTenantContext(req);

        res.json((await pool.query(`SELECT m.*, su.display_name as sender_name FROM internal_messages m LEFT JOIN system_users su ON m.sender_id=su.id WHERE m.receiver_id=$1 AND m.tenant_id=$2 ORDER BY m.created_at DESC`, [userId, tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/messages/sent', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const userId = req.session.user.id;

        const { tenantId } = getRequestTenantContext(req);

        res.json((await pool.query(`SELECT m.*, su.display_name as receiver_name FROM internal_messages m LEFT JOIN system_users su ON m.receiver_id=su.id WHERE m.sender_id=$1 AND m.tenant_id=$2 ORDER BY m.created_at DESC`, [userId, tenantId])).rows);

    } catch (e) {

        if (e.code === '42703') {

            const userId = req.session.user.id;

            const rows = (await pool.query(

                `SELECT m.*, su.display_name as receiver_name

                 FROM internal_messages m LEFT JOIN system_users su ON m.receiver_id=su.id

                 WHERE m.sender_id=$1 ORDER BY m.created_at DESC`,

                [userId]

            )).rows;

            return res.json(rows);

        }

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/messages', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { receiver_id, subject, body, priority } = req.body;

        const senderId = req.session.user.id;

        const { tenantId } = getRequestTenantContext(req);

        const result = await pool.query('INSERT INTO internal_messages (sender_id, receiver_id, subject, body, priority, tenant_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',

            [senderId, receiver_id, subject || '', body || '', priority || 'Normal', tenantId]);

        logAudit(senderId, req.session.user.name, 'SEND_MESSAGE', 'Messaging', `Message to user ${receiver_id}: ${subject}`, req.ip);

        res.json({ success: true, id: result.rows[0].id });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/messages/:id/read', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const userId = req.session.user.id;

        const { tenantId } = getRequestTenantContext(req);

        const r = await pool.query('UPDATE internal_messages SET is_read=1 WHERE id=$1 AND receiver_id=$2 AND tenant_id=$3', [req.params.id, userId, tenantId]);

        if (!r.rowCount) return res.status(404).json({ error: 'Message not found' });

        res.json({ success: true });

    } catch (e) {

        if (e.code === '42703') {

            const userId = req.session.user.id;

            const r = await pool.query('UPDATE internal_messages SET is_read=1 WHERE id=$1 AND receiver_id=$2', [req.params.id, userId]);

            if (!r.rowCount) return res.status(404).json({ error: 'Message not found' });

            return res.json({ success: true });

        }

        res.status(500).json({ error: 'Server error' });

    }

});

router.delete('/api/messages/:id', requireAuth, requireTenantScope, requirePermission('messages:delete'), async (req, res) => {

    try {

        const userId = req.session.user.id;

        const { tenantId } = getRequestTenantContext(req);

        const r = await pool.query('DELETE FROM internal_messages WHERE id=$1 AND (sender_id=$2 OR receiver_id=$2) AND tenant_id=$3', [req.params.id, userId, tenantId]);

        if (!r.rowCount) return res.status(404).json({ error: 'Message not found' });

        res.json({ success: true });

    } catch (e) {

        if (e.code === '42703') {

            const userId = req.session.user.id;

            const r = await pool.query('DELETE FROM internal_messages WHERE id=$1 AND (sender_id=$2 OR receiver_id=$2)', [req.params.id, userId]);

            if (!r.rowCount) return res.status(404).json({ error: 'Message not found' });

            return res.json({ success: true });

        }

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
