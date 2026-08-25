const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeUrologyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.post('/api/urology/urodynamics', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { 

            patient_id, study_date, max_flow_rate, voided_volume, post_void_residual, detrusor_pressure, interpretation 

        } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        

        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }

        

        const result = await pool.query(

            `INSERT INTO urodynamic_studies 

             (patient_id, doctor_id, study_date, max_flow_rate, voided_volume, post_void_residual, detrusor_pressure, interpretation, tenant_id, facility_id) 

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,

            [

                patient_id,

                req.session.user?.id || null,

                study_date || new Date().toISOString().slice(0, 10),

                max_flow_rate === undefined ? 0.00 : parseFloat(max_flow_rate),

                voided_volume === undefined ? 0.00 : parseFloat(voided_volume),

                post_void_residual === undefined ? 0.00 : parseFloat(post_void_residual),

                detrusor_pressure === undefined ? 0.00 : parseFloat(detrusor_pressure),

                interpretation || '',

                tenantId || 1,

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_URODYNAMIC_STUDY', 'Urology',

            `Recorded urodynamic study for patient #${patient_id}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[Urodynamic Study Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/urology/urodynamics/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT us.*, su.display_name as doctor_name 

             FROM urodynamic_studies us 

             LEFT JOIN system_users su ON us.doctor_id = su.id 

             WHERE us.patient_id=$1${tenantCheck} 

             ORDER BY us.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[Urodynamic Study Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
