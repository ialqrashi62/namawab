const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePsychiatryRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.post('/api/psychiatry/evaluations', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { 

            patient_id, evaluation_date, mse_appearance, mse_behavior, mse_speech, mse_mood, mse_affect,

            mse_thought_process, mse_thought_content, mse_perception, mse_cognition, mse_insight, mse_judgment,

            diagnostic_summary

        } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        

        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }

        

        const result = await pool.query(

            `INSERT INTO psychiatric_evaluations 

             (patient_id, doctor_id, evaluation_date, mse_appearance, mse_behavior, mse_speech, mse_mood, mse_affect,

              mse_thought_process, mse_thought_content, mse_perception, mse_cognition, mse_insight, mse_judgment,

              diagnostic_summary, tenant_id, facility_id) 

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id`,

            [

                patient_id,

                req.session.user?.id || null,

                evaluation_date || new Date().toISOString().slice(0, 10),

                mse_appearance || '',

                mse_behavior || '',

                mse_speech || '',

                mse_mood || '',

                mse_affect || '',

                mse_thought_process || '',

                mse_thought_content || '',

                mse_perception || '',

                mse_cognition || '',

                mse_insight || '',

                mse_judgment || '',

                diagnostic_summary || '',

                tenantId || 1,

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_PSYCHIATRIC_EVALUATION', 'Psychiatry',

            `Recorded psychiatric evaluation for patient #${patient_id}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[Psychiatric Evaluation Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/psychiatry/evaluations/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT pe.*, su.display_name as doctor_name 

             FROM psychiatric_evaluations pe 

             LEFT JOIN system_users su ON pe.doctor_id = su.id 

             WHERE pe.patient_id=$1${tenantCheck} 

             ORDER BY pe.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[Psychiatric Evaluation Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
