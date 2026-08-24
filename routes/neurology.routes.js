const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeNeurologyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, specialtyScores }) {
    const router = express.Router();
router.post('/api/neurology/assessments', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id, assessment_date, gcs_eye, gcs_verbal, gcs_motor, nihss_score, reflexes_status, notes } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        

        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }

        

        // GCS is a server-side authority value: each provided component is strictly

        // range-validated by the engine (422 on garbage instead of a DB CHECK 500);

        // a partial GCS keeps a NULL total — never a reassuring default.

        const gcsRes = specialtyScores.validateGCSComponents({ eye: gcs_eye, verbal: gcs_verbal, motor: gcs_motor });

        if (!gcsRes.ok) {

            return res.status(422).json({ error: `GCS rejected: ${gcsRes.error}` });

        }

        const gcs_eye_val = gcsRes.components.eye;

        const gcs_verbal_val = gcsRes.components.verbal;

        const gcs_motor_val = gcsRes.components.motor;

        const gcs_total_score = gcsRes.total;



        // NIHSS total is range-validated server-side (0-42); garbage is rejected, not stored.

        let nihss_val = null;

        if (nihss_score !== undefined && nihss_score !== null && nihss_score !== '') {

            const nihssRes = specialtyScores.validateNIHSSTotal(nihss_score);

            if (!nihssRes.ok) {

                return res.status(422).json({ error: `NIHSS rejected: ${nihssRes.error}` });

            }

            nihss_val = nihssRes.total;

        }



        const result = await pool.query(

            `INSERT INTO neurology_assessments 

             (patient_id, doctor_id, assessment_date, gcs_eye, gcs_verbal, gcs_motor, gcs_total_score, nihss_score, reflexes_status, notes, tenant_id, facility_id) 

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,

            [

                patient_id, 

                req.session.user?.id || null, 

                assessment_date || new Date().toISOString().slice(0, 10), 

                gcs_eye_val,

                gcs_verbal_val,

                gcs_motor_val,

                gcs_total_score,

                nihss_val,

                reflexes_status || '',

                notes || '', 

                tenantId || 1, 

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_NEUROLOGY_ASSESSMENT', 'Neurology',

            `Recorded neurology assessment for patient #${patient_id}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[Neurology Assessment Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/neurology/assessments/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT na.*, su.display_name as doctor_name 

             FROM neurology_assessments na 

             LEFT JOIN system_users su ON na.doctor_id = su.id 

             WHERE na.patient_id=$1${tenantCheck} 

             ORDER BY na.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[Neurology Assessment Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
