const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeRheumatologyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, specialtyScores }) {
    const router = express.Router();
router.post('/api/rheumatology/joints', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id, assessment_date, tender_joint_count, swollen_joint_count, vas_pain, das28_score, esr, crp, gh, notes } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);



        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }



        const tjcP = specialtyScores.parseOptionalInt(tender_joint_count, 0, 28, 'tender_joint_count');

        if (!tjcP.ok) return res.status(422).json({ error: tjcP.error });

        const sjcP = specialtyScores.parseOptionalInt(swollen_joint_count, 0, 28, 'swollen_joint_count');

        if (!sjcP.ok) return res.status(422).json({ error: sjcP.error });

        const vasP = specialtyScores.parseOptionalInt(vas_pain, 0, 100, 'vas_pain');

        if (!vasP.ok) return res.status(422).json({ error: vasP.error });

        const tjcVal = tjcP.value, sjcVal = sjcP.value, vasVal = vasP.value;



        // DAS28 is a server-side authority value (anti-spoof). When a NON-EMPTY acute-phase

        // reactant is supplied we COMPUTE it and ignore any client-sent das28_score; a

        // client-sent score is only accepted stand-alone after strict range validation.

        // (Empty-string esr/crp — typical untouched form fields — count as absent.)

        const hasEsr = esr !== undefined && esr !== null && esr !== '';

        const hasCrp = crp !== undefined && crp !== null && crp !== '';

        let das28Val = null;

        if (hasEsr || hasCrp) {

            const das28Input = { tjc28: tjcVal, sjc28: sjcVal, gh: (gh !== undefined && gh !== null && gh !== '') ? gh : vasVal };

            const computed = hasEsr

                ? specialtyScores.computeDAS28ESR({ ...das28Input, esr })

                : specialtyScores.computeDAS28CRP({ ...das28Input, crp });

            if (!computed.ok) {

                return res.status(422).json({ error: `DAS28 rejected: ${computed.error}` });

            }

            das28Val = computed.score;

        } else if (das28_score !== undefined && das28_score !== null && das28_score !== '') {

            const clientScore = parseFloat(das28_score);

            if (!Number.isFinite(clientScore) || clientScore < 0 || clientScore > 10) {

                return res.status(422).json({ error: 'das28_score out of range (0-10)' });

            }

            das28Val = clientScore;

        }



        const result = await pool.query(

            `INSERT INTO joint_assessments

             (patient_id, doctor_id, assessment_date, tender_joint_count, swollen_joint_count, vas_pain, das28_score, notes, tenant_id, facility_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,

            [

                patient_id,

                req.session.user?.id || null,

                assessment_date || new Date().toISOString().slice(0, 10),

                tjcVal,

                sjcVal,

                vasVal,

                das28Val,

                notes || '',

                tenantId || 1,

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_JOINT_ASSESSMENT', 'Rheumatology',

            `Recorded joint assessment for patient #${patient_id}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[Rheumatology Joint Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/rheumatology/joints/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT ja.*, su.display_name as doctor_name 

             FROM joint_assessments ja 

             LEFT JOIN system_users su ON ja.doctor_id = su.id 

             WHERE ja.patient_id=$1${tenantCheck} 

             ORDER BY ja.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[Rheumatology Joint Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
