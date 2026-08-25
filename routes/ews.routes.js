const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeEwsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, ewsEngine }) {
    const router = express.Router();
router.post('/api/ews/assess', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { patient_id, mews, pews, sepsis } = req.body || {};

        const { tenantId } = getRequestTenantContext(req);

        if (!patient_id) return res.status(400).json({ error: 'Patient ID is required' });

        if (tenantId) {

            const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);

            if (patientCheck.rows.length === 0) return res.status(404).json({ error: 'Patient not found' });

        }

        if (!mews && !pews && !sepsis) {

            return res.status(400).json({ error: 'Provide at least one of: mews, pews, sepsis observation sets' });

        }

        const out = {};

        if (mews) {

            out.mews = ewsEngine.computeMEWS(mews);

            if (!out.mews.ok) return res.status(422).json({ error: `MEWS rejected: ${out.mews.error}` });

        }

        if (pews) {

            out.pews = ewsEngine.computePEWS(pews);

            if (!out.pews.ok) return res.status(422).json({ error: `PEWS rejected: ${out.pews.error}` });

        }

        if (sepsis) {

            out.sepsis = ewsEngine.sepsisScreen(sepsis);

            if (!out.sepsis.ok) return res.status(422).json({ error: `Sepsis screen rejected: ${out.sepsis.error}` });

        }

        out.escalation = ewsEngine.escalationFor({

            mews: out.mews ? out.mews.score : null,

            pews: out.pews ? out.pews.score : null,

            component_alert: out.pews ? out.pews.component_alert : false,

            sepsis_alert: out.sepsis ? out.sepsis.alert : null,

        });

        logAudit(req.session.user?.id, req.session.user?.display_name, 'EWS_ASSESS', 'EWS',

            `EWS screen for patient #${patient_id}: ${out.escalation.level}` +

            (out.sepsis ? ` (sepsis screen: ${out.sepsis.alert})` : ''), req.ip);

        res.json({ success: true, ...out });

    } catch (e) {

        console.error('[EWS Assess Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
