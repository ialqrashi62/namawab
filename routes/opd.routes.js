const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeOpdRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/opd/doctor/queue', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const doctorName = req.query.doctor_name || req.session.user?.display_name || '';



        // Get appointments for the current tenant, date, and optionally filtered by doctor

        let q = `

            SELECT a.*, p.file_number, p.name_ar, p.name_en, p.phone, p.national_id

            FROM appointments a

            JOIN patients p ON a.patient_id = p.id

            WHERE a.tenant_id = $1 AND a.appt_date = CURRENT_DATE::TEXT AND a.status <> 'Cancelled'

        `;

        const params = [tenantId];

        if (doctorName) {

            q += ` AND (a.doctor_name = $2 OR a.department = (SELECT department_ar FROM employees WHERE name = $2 LIMIT 1))`;

            params.push(doctorName);

        }

        q += ` ORDER BY a.appt_time ASC`;



        const appts = (await pool.query(q, params)).rows;



        // For each appointment, fetch the latest vitals from nursing_vitals if they exist

        const result = [];

        for (const appt of appts) {

            const vitals = (await pool.query(

                'SELECT bp, temp, weight, height, pulse, o2_sat, respiratory_rate, blood_sugar FROM nursing_vitals WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC LIMIT 1',

                [appt.patient_id, tenantId]

            )).rows[0] || null;

            result.push({

                ...appt,

                vitals

            });

        }

        res.json(result);

    } catch (e) {

        console.error('[OPD QUEUE]', e.message);

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/opd/encounter/start', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { appointment_id } = req.body;

        if (!appointment_id) return res.status(422).json({ error: 'appointment_id is required' });



        // Update appointment status to In-Consultation

        const updateQ = tenantId

            ? "UPDATE appointments SET status='In-Consultation' WHERE id=$1 AND tenant_id=$2 RETURNING *"

            : "UPDATE appointments SET status='In-Consultation' WHERE id=$1 RETURNING *";

        const params = tenantId ? [appointment_id, tenantId] : [appointment_id];

        const updated = (await pool.query(updateQ, params)).rows[0];



        if (!updated) return res.status(404).json({ error: 'Appointment not found' });



        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'START_OPD_ENCOUNTER', 'OPD',

            `Started consultation for appointment ${appointment_id} patient ${updated.patient_id}`, req.ip);



        res.json(updated);

    } catch (e) {

        console.error('[OPD ENCOUNTER START]', e.message);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
