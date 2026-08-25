const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeHl7Router({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/hl7/messages', requireAuth, requireRole('admin', 'lis_admin', 'ris_admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const rows = await pool.query('SELECT * FROM hl7_messages WHERE tenant_id=$1 ORDER BY message_datetime DESC LIMIT 200', [tid]);

        res.json(rows.rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/hl7/messages/send', requireAuth, requireRole('admin', 'lis', 'ris'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { message_type, message_body, patient_id, interface_name } = req.body;

        if (!message_type || !message_body) return res.status(400).json({ error: 'message_type and message_body required' });

        

        // IDOR check if patient is supplied

        if (patient_id) {

            const pCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [parseInt(patient_id), tid]);

            if (!pCheck.rows.length) return res.status(403).json({ error: 'Patient access denied' });

        }

        

        const ctrlId = `CTRL-${Date.now()}`;

        const r = await pool.query(

            `INSERT INTO hl7_messages (message_type, message_control_id, message_body, patient_id, direction, processing_status, interface_name, tenant_id)

             VALUES ($1, $2, $3, $4, 'Outbound', 'Queued', $5, $6) RETURNING *`,

            [message_type, ctrlId, message_body, patient_id ? parseInt(patient_id) : null, interface_name || 'LIS', tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'HL7_MSG_QUEUE', 'Integration', `Outbound HL7 ${message_type} queued. ControlID: ${ctrlId}`, tid);

        res.json({ success: true, message: r.rows[0] });

    } catch (e) { res.status(500).json({ error: e.message }); }

});


    return router;
}
