const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeBurnCoeRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, centerPatient360 }) {
    const router = express.Router();
router.get('/api/burn-coe/patient-360/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), requireTenantScope, async (req, res) => {

    const { tenantId, facilityId } = getRequestTenantContext(req);

    const tenantCheck = tenantId ? ' AND tenant_id = $2' : '';

    return centerPatient360(req, res, ['burn_assessments', 'clinical_photos_meta']);

});


    return router;
}
