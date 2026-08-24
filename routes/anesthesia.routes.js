const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeAnesthesiaRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.post('/api/anesthesia/pain', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { 

            patient_id, assessment_time, pain_score_vas, pca_pump_used, pca_demands, pca_deliveries, notes 

        } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        

        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }

        

        const result = await pool.query(

            `INSERT INTO pain_assessments 

             (patient_id, doctor_id, assessment_time, pain_score_vas, pca_pump_used, pca_demands, pca_deliveries, notes, tenant_id, facility_id) 

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,

            [

                patient_id,

                req.session.user?.id || null,

                assessment_time || new Date().toISOString(),

                pain_score_vas === undefined ? 0 : parseInt(pain_score_vas),

                !!pca_pump_used,

                pca_demands === undefined ? 0 : parseInt(pca_demands),

                pca_deliveries === undefined ? 0 : parseInt(pca_deliveries),

                notes || '',

                tenantId || 1,

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_PAIN_ASSESSMENT', 'Anesthesia',

            `Recorded pain assessment for patient #${patient_id}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[Pain Assessment Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/anesthesia/pain/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT p.*, su.display_name as doctor_name 

             FROM pain_assessments p 

             LEFT JOIN system_users su ON p.doctor_id = su.id 

             WHERE p.patient_id=$1${tenantCheck} 

             ORDER BY p.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[Pain Assessment Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
