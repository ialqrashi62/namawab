const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeCentersPatient360Router({ 
centerPatient360, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS
 }) {
    const router = express.Router();
router.get('/api/heart-vascular-center/patient-360/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), requireTenantScope, async (req, res) => {
    // handler must resolve tenant context + apply tenant filtering to queries
    const { tenantId, facilityId } = getRequestTenantContext(req);
    const tenantCheck = tenantId ? ' AND tenant_id = $2' : '';
    const tables = ['cardiology_procedures', 'ecg_records', 'cardiology_assessments'];
    return centerPatient360(req, res, tables);
});
router.get('/api/ortho-spine-center/patient-360/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), requireTenantScope, async (req, res) => {
    const { tenantId, facilityId } = getRequestTenantContext(req);
    const tenantCheck = tenantId ? ' AND tenant_id = $2' : '';
    return centerPatient360(req, res, ['orthopedic_implants', 'joint_rom_assessments']);
});
router.get('/api/eye-institute/patient-360/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), requireTenantScope, async (req, res) => {
    const { tenantId, facilityId } = getRequestTenantContext(req);
    const tenantCheck = tenantId ? ' AND tenant_id = $2' : '';
    return centerPatient360(req, res, ['eye_exams']);
});
router.get('/api/ent-headneck-center/patient-360/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), requireTenantScope, async (req, res) => {
    const { tenantId, facilityId } = getRequestTenantContext(req);
    const tenantCheck = tenantId ? ' AND tenant_id = $2' : '';
    return centerPatient360(req, res, ['audiogram_records']);
});
router.get('/api/women-fetal-coe/patient-360/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), requireTenantScope, async (req, res) => {
    const { tenantId, facilityId } = getRequestTenantContext(req);
    const tenantCheck = tenantId ? ' AND tenant_id = $2' : '';
    return centerPatient360(req, res, ['obgyn_pregnancies', 'obgyn_deliveries', 'obgyn_ultrasounds']);
});
router.get('/api/bariatric-metabolic-coe/patient-360/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), requireTenantScope, async (req, res) => {
    const { tenantId, facilityId } = getRequestTenantContext(req);
    const tenantCheck = tenantId ? ' AND tenant_id = $2' : '';
    return centerPatient360(req, res, ['diabetes_glucose_logs', 'insulin_regimens']);
});

    return router;
}
