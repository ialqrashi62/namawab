const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makePulmonologyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, specialtyScores }) {
    const router = express.Router();
router.post('/api/pulmonology/pft', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id, test_date, fev1, fvc, fev1_fvc_ratio, pef, interpretation, notes } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        

        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }



        // FEV1/FVC ratio is a DERIVED server-side value: when both volumes are present the

        // ratio is computed (a client-sent ratio is ignored — a spoofed 0.9 over an

        // obstructive 0.55 would mask COPD/asthma severity); physiologically inconsistent

        // volumes (FEV1 > FVC, non-positive, > 12 L) 422 fail-closed.

        const fev1Num = (fev1 !== undefined && fev1 !== null && fev1 !== '') ? Number(fev1) : null;

        const fvcNum = (fvc !== undefined && fvc !== null && fvc !== '') ? Number(fvc) : null;

        if (fev1Num !== null && !Number.isFinite(fev1Num)) return res.status(422).json({ error: 'fev1 must be numeric' });

        if (fvcNum !== null && !Number.isFinite(fvcNum)) return res.status(422).json({ error: 'fvc must be numeric' });

        let ratioVal = null;

        if (fev1Num !== null && fvcNum !== null) {

            const ratioRes = specialtyScores.computeFEV1FVC(fev1Num, fvcNum);

            if (!ratioRes.ok) return res.status(422).json({ error: `FEV1/FVC rejected: ${ratioRes.error}` });

            ratioVal = ratioRes.ratio;

        }



        const result = await pool.query(

            `INSERT INTO pulmonary_function_tests

             (patient_id, doctor_id, test_date, fev1, fvc, fev1_fvc_ratio, pef, interpretation, notes, tenant_id, facility_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,

            [

                patient_id,

                req.session.user?.id || null,

                test_date || new Date().toISOString().slice(0, 10),

                fev1Num,

                fvcNum,

                ratioVal,

                pef || null,

                interpretation || '', 

                notes || '', 

                tenantId || 1, 

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_PFT_RECORD', 'Pulmonology',

            `Recorded Pulmonary Function Test (PFT) for patient #${patient_id}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[Pulmonology PFT Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/pulmonology/pft/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT pft.*, su.display_name as doctor_name 

             FROM pulmonary_function_tests pft 

             LEFT JOIN system_users su ON pft.doctor_id = su.id 

             WHERE pft.patient_id=$1${tenantCheck} 

             ORDER BY pft.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[Pulmonology PFT Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
