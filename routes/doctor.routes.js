const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function DoctorRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/doctor/wait-queue', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const result = await pool.query(

            `SELECT w.id as queue_id, w.*, p.name_ar, p.name_en, p.file_number, p.dob, p.phone, p.gender, p.national_id,

                    p.insurance_company, p.insurance_policy_number AS insurance_number, p.blood_type,

                    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - w.check_in_time)) / 60 AS wait_minutes,

                    COALESCE(r.name_ar, r.name_en, r.room_number) as exam_room_name, r.room_number as exam_room_number

             FROM waiting_queue w

             JOIN patients p ON w.patient_id = p.id

             LEFT JOIN exam_rooms r ON r.id::text = w.exam_room_id::text AND r.tenant_id = w.tenant_id

             WHERE w.tenant_id = $1

               AND w.status NOT IN ('ReadyForDischarge', 'NoShow', 'Done')

             ORDER BY w.triage_level ASC, w.check_in_time ASC`,

            [tenantId]

        );

        res.json(result.rows);

    } catch (e) {

        console.error('[DS] Error fetching doctor wait-queue:', e);

        res.status(500).json({ error: 'Server error', detail: e.message });

    }

});

router.get('/api/doctor/next-patient', requireAuth, async (req, res) => {

    try {

        const doctorName = req.session.user?.display_name || '';



        // Get next waiting patient for this doctor

        const next = (await pool.query(

            "SELECT * FROM waiting_queue WHERE doctor ILIKE $1 AND status='Waiting' ORDER BY check_in_time ASC LIMIT 1",

            ['%' + doctorName + '%']

        )).rows[0];



        if (!next) return res.json({ hasNext: false });



        // Update status to In-Progress

        await pool.query("UPDATE waiting_queue SET status='In Progress' WHERE id=$1", [next.id]);



        // Get patient details

        let patient = null;

        if (next.patient_id) {

            patient = (await pool.query('SELECT * FROM patients WHERE id=$1', [next.patient_id])).rows[0];

        }



        // Get visit lifecycle

        let visit = null;

        try {

            visit = (await pool.query(

                "SELECT * FROM visit_lifecycle WHERE patient_id=$1 AND created_at::date=CURRENT_DATE ORDER BY id DESC LIMIT 1",

                [next.patient_id]

            )).rows[0];

            if (visit) {

                await pool.query("UPDATE visit_lifecycle SET status='in_consultation', consult_start=CURRENT_TIMESTAMP WHERE id=$1", [visit.id]);

            }

        } catch (e) { }



        // Get recent vitals

        let vitals = null;

        try {

            vitals = (await pool.query(

                "SELECT * FROM nursing_vitals WHERE patient_id=$1 ORDER BY id DESC LIMIT 1",

                [next.patient_id]

            )).rows[0];

        } catch (e) { }



        // Get waiting count

        const waitingCount = (await pool.query(

            "SELECT COUNT(*) as cnt FROM waiting_queue WHERE doctor ILIKE $1 AND status='Waiting'",

            ['%' + doctorName + '%']

        )).rows[0].cnt;



        res.json({

            hasNext: true,

            queue: next,

            patient,

            vitals,

            visit,

            waiting_count: parseInt(waitingCount)

        });

    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/doctor/my-queue', requireAuth, async (req, res) => {

    try {

        const doctorName = req.session.user?.display_name || '';

        const rows = (await pool.query(

            "SELECT * FROM waiting_queue WHERE doctor ILIKE $1 AND status IN ('Waiting','In Progress') ORDER BY CASE status WHEN 'In Progress' THEN 0 ELSE 1 END, check_in_time ASC",

            ['%' + doctorName + '%']

        )).rows;

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
