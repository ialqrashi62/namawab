const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeAppointmentsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, smsService, sendPatientEmail, optionalReadFallback }) {
    const router = express.Router();
router.get('/api/appointments', requireAuth, requireRole('appointments'), async (req, res) => {

    try {

        // --- TENANT SCOPE: filter appointments by current tenant_id ---

        const { tenantId } = getRequestTenantContext(req);

        let rows;

        if (tenantId) {

            rows = (await pool.query('SELECT * FROM appointments WHERE tenant_id = $1 ORDER BY id DESC', [tenantId])).rows;

        } else {

            rows = (await pool.query('SELECT * FROM appointments ORDER BY id DESC')).rows;

        }

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/appointments', requireAuth, requireRole('appointments'), async (req, res) => {

    try {

        const { patient_name, patient_id, doctor_name, department, appt_date, appt_time, notes, fee } = req.body;

        const apptFee = parseFloat(fee) || 0;

        // --- TENANT SCOPE: stamp tenant_id & facility_id from session (never from body) ---

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const result = await pool.query('INSERT INTO appointments (patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes, tenant_id, branch_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',

            [patient_id || null, patient_name, doctor_name, department, appt_date, appt_time, notes || '', tenantId || null, facilityId || null]);

        // Auto-create invoice for appointment fee

        if (apptFee > 0 && patient_id) {

            await pool.query('INSERT INTO invoices (patient_id, patient_name, total, description, service_type, paid, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,0,$6,$7)',

                [patient_id, patient_name, apptFee, `رسوم موعد: ${doctor_name} - ${appt_date}`, 'Appointment', tenantId || null, facilityId || null]);

        }

        const appt = (await pool.query('SELECT * FROM appointments WHERE id=$1', [result.rows[0].id])).rows[0];



        // AUTO: Add to waiting queue when appointment is today

        try {

            const apptDate = new Date(appt_date);

            const today = new Date();

            if (apptDate.toDateString() === today.toDateString()) {

                await pool.query(

                    "INSERT INTO waiting_queue (patient_id, patient_name, doctor, department, status, check_in_time, tenant_id) VALUES ($1, $2, $3, $4, 'Waiting', CURRENT_TIMESTAMP, $5) ON CONFLICT DO NOTHING",

                    [patient_id, patient_name, doctor_name, department || 'General', tenantId || null]

                );

            }

        } catch (qe) { console.error('Queue auto-insert:', qe.message); }

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_APPOINTMENT', 'Appointments',

            `Appointment for ${patient_name} with Dr. ${doctor_name} on ${appt_date}`, req.ip);



        // Send SMS confirmation to patient

        if (patient_id) {

            try {

                const pRow = (await pool.query('SELECT phone FROM patients WHERE id=$1', [patient_id])).rows[0];

                if (pRow && pRow.phone) {

                    const smsText = `عزيزي المريض، تم تأكيد موعدك يوم ${appt_date} الساعة ${appt_time} مع الدكتور ${doctor_name}. شكراً لاختياركم مجمع نما الطبي.\nDear Patient, your appointment on ${appt_date} at ${appt_time} with Dr. ${doctor_name} has been confirmed.`;

                    await smsService.sendSMS(pRow.phone, smsText, 'APPOINTMENT_CONFIRM');

                }

            } catch (smsErr) { console.error('[SMS ERROR] Appointment confirmation SMS failed:', smsErr.message); }

        }



        // Send Email confirmation to patient

        if (patient_id && tenantId) {

            const emailSubject = `تأكيد موعد - مجمع نما الطبي | Appointment Confirmation`;

            const emailHtml = `

                <div style="direction: rtl; text-align: right; font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">

                    <h2 style="color: #006970;">عزيزي المريض، تم تأكيد موعدك بنجاح.</h2>

                    <p><strong>الطبيب:</strong> ${doctor_name}</p>

                    <p><strong>التاريخ:</strong> ${appt_date}</p>

                    <p><strong>الوقت:</strong> ${appt_time}</p>

                    <p>شكراً لاختياركم مجمع نما الطبي.</p>

                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                    <div style="direction: ltr; text-align: left;">

                        <h2 style="color: #006970;">Dear Patient, your appointment has been confirmed.</h2>

                        <p><strong>Doctor:</strong> ${doctor_name}</p>

                        <p><strong>Date:</strong> ${appt_date}</p>

                        <p><strong>Time:</strong> ${appt_time}</p>

                        <p>Thank you for choosing Nama Medical.</p>

                    </div>

                </div>

            `;

            sendPatientEmail(patient_id, emailSubject, emailHtml, tenantId);

        }



        res.json(appt);

    } catch (e) { console.error('APPOINTMENTS POST ERROR:', e); res.status(500).json({ error: 'Server error' }); }

});

router.delete('/api/appointments/:id', requireAuth, requireRole('appointments'), async (req, res) => {

    try {

        // --- TENANT SCOPE: verify record belongs to current tenant before delete (IDOR prevention) ---

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const appt = (await pool.query(`SELECT * FROM appointments WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];

        if (!appt) return res.status(404).json({ error: 'Appointment not found' });

        await pool.query('DELETE FROM appointments WHERE id=$1', [req.params.id]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'DELETE_APPOINTMENT', 'Appointments',

            `Deleted appointment #${req.params.id} for ${appt.patient_name}`, req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/appointments/followup', requireAuth, requireRole('appointments'), async (req, res) => {

    try {

        const { patient_id, patient_name, doctor_name, appt_date, appt_time, notes } = req.body;

        // --- TENANT SCOPE: stamp tenant_id from session for follow-up appointments ---

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const result = await pool.query(

            'INSERT INTO appointments (patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes, status, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',

            [patient_id, patient_name, doctor_name || req.session.user?.display_name, '', appt_date, appt_time || '09:00', `متابعة: ${notes || ''}`, 'Confirmed', tenantId || null, facilityId || null]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_FOLLOWUP', 'Appointments',

            `Follow-up for ${patient_name} with Dr. ${doctor_name} on ${appt_date}`, req.ip);

        res.json((await pool.query('SELECT * FROM appointments WHERE id=$1', [result.rows[0].id])).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/appointments/check-conflict', requireAuth, requireRole('appointments'), async (req, res) => {

    try {

        const { doctor, date, time_slot, exclude_id } = req.query;

        if (!doctor || !date || !time_slot) return res.json({ hasConflict: false, conflicts: [] });

        let query = "SELECT * FROM appointments WHERE doctor_name=$1 AND appt_date=$2 AND appt_time=$3 AND status != 'Cancelled'";

        let params = [doctor, date, time_slot];

        if (exclude_id) { query += ' AND id != $4'; params.push(exclude_id); }

        const conflicts = (await pool.query(query, params)).rows;

        res.json({ hasConflict: conflicts.length > 0, conflicts });

    } catch (e) { if (optionalReadFallback(res, e, { hasConflict: false, conflicts: [] })) return; res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/appointments/:id/checkin', requireAuth, requireRole('appointments'), async (req, res) => {

    try {

        // --- TENANT SCOPE: verify appointment belongs to current tenant ---

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const appt = (await pool.query(`SELECT * FROM appointments WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];

        if (!appt) return res.status(404).json({ error: 'Appointment not found' });



        // Update appointment status

        await pool.query("UPDATE appointments SET status='Checked-In' WHERE id=$1", [req.params.id]);



        // Create visit lifecycle entry (visit_lifecycle schema provisioned out-of-band; no DDL in handler)

        const visit = await pool.query(

            'INSERT INTO visit_lifecycle (patient_id, patient_name, appointment_id, doctor, department, status, arrived_at) VALUES ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP) RETURNING *',

            [appt.patient_id, appt.patient_name, appt.id, appt.doctor_name || '', appt.department || 'General', 'arrived']

        );



        // Auto-add to waiting queue (with correct tenantId and default status 'CheckedIn')

        await pool.query(

            "INSERT INTO waiting_queue (tenant_id, patient_id, patient_name, doctor, department, status, check_in_time) VALUES ($1,$2,$3,$4,$5,'CheckedIn',CURRENT_TIMESTAMP)",

            [tenantId || 1, appt.patient_id, appt.patient_name, appt.doctor_name || '', appt.department || 'General']

        );



        logAudit(req.session.user?.id, req.session.user?.display_name, 'CHECK_IN', 'Appointments',

            'Patient ' + appt.patient_name + ' checked in for Dr. ' + (appt.doctor_name || ''), req.ip);



        res.json({ success: true, visit_id: visit.rows[0].id });

    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/appointments/:id/noshow', requireAuth, requireRole('appointments'), async (req, res) => {

    try {

        // --- TENANT SCOPE: verify appointment belongs to current tenant ---

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const appt = (await pool.query(`SELECT * FROM appointments WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];

        if (!appt) return res.status(404).json({ error: 'Appointment not found' });

        await pool.query("UPDATE appointments SET status='No-Show' WHERE id=$1", [req.params.id]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'NO_SHOW', 'Appointments',

            'Patient ' + (appt?.patient_name || '') + ' marked as No-Show', req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/appointments/check-duplicate', requireAuth, requireRole('appointments'), async (req, res) => {

    try {

        const { patient_id, date, doctor } = req.body;

        const existing = (await pool.query(

            "SELECT * FROM appointments WHERE patient_id=$1 AND appt_date=$2 AND doctor_name=$3 AND status NOT IN ('Cancelled','No-Show')",

            [patient_id, date, doctor]

        )).rows;

        res.json({ duplicate: existing.length > 0, existing });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
