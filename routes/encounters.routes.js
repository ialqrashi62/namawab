const crypto = require('crypto');
const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeEncountersRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.post('/api/encounters/:id/sign', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { pin, doctor_name, signature_note } = req.body;

        if (!pin || !/^\d{4,6}$/.test(pin)) return res.status(400).json({ error: 'Invalid PIN format' });



        const encId = req.params.id;

        const { tenantId } = getRequestTenantContext(req);

        const crypto = require('crypto');

        const signHash = crypto.createHash('sha256').update(`${encId}:${pin}:${signature_note || ''}:${Date.now()}`).digest('hex');



        let updated = false;

        let degraded = false;

        // Try to update medical_records

        try {

            const result = await pool.query(

                `UPDATE medical_records SET is_signed=true, signed_by=$1, signed_at=CURRENT_TIMESTAMP, signature_hash=$2

                 WHERE id=$3 AND tenant_id=$4 RETURNING id`,

                [doctor_name || req.session.user?.display_name || '', signHash, encId, tenantId]

            );

            if (result.rows.length > 0) updated = true;

        } catch { degraded = true; }



        if (!updated && !degraded) {

            // Encounter not found — graceful degrade (still allow closing)

            degraded = true;

        }



        logAudit(req.session.user?.id, doctor_name || req.session.user?.display_name || '', 'SIGN_ENCOUNTER', 'Encounters',

            `Encounter ${encId} signed electronically — hash: ${signHash.slice(0,16)}`, req.ip);



        res.json({ success: true, signed: true, hash: signHash.slice(0, 16), degraded });

    } catch (e) {

        console.error('[DS] Error signing encounter:', e);

        res.status(500).json({ error: 'Server error', detail: e.message });

    }

});


    return router;
}
