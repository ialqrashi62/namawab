const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeOphthalmologyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.post('/api/ophthalmology/exams', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { 

            patient_id, exam_date, 

            od_va_uncorrected, os_va_uncorrected, od_va_corrected, os_va_corrected,

            od_iop, os_iop, iop_method,

            od_sphere, os_sphere, od_cylinder, os_cylinder, od_axis, os_axis,

            od_add, os_add,

            slit_lamp_exam, fundoscopy_exam, notes 

        } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        

        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }

        

        const result = await pool.query(

            `INSERT INTO eye_exams 

             (patient_id, doctor_id, exam_date, od_va_uncorrected, os_va_uncorrected, od_va_corrected, os_va_corrected, od_iop, os_iop, iop_method, od_sphere, os_sphere, od_cylinder, os_cylinder, od_axis, os_axis, od_add, os_add, slit_lamp_exam, fundoscopy_exam, notes, tenant_id, facility_id) 

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING id`,

            [

                patient_id, 

                req.session.user?.id || null, 

                exam_date || new Date().toISOString().slice(0, 10), 

                od_va_uncorrected || '',

                os_va_uncorrected || '',

                od_va_corrected || '',

                os_va_corrected || '',

                od_iop !== undefined && od_iop !== '' ? parseFloat(od_iop) : null,

                os_iop !== undefined && os_iop !== '' ? parseFloat(os_iop) : null,

                iop_method || 'Goldmann',

                od_sphere !== undefined && od_sphere !== '' ? parseFloat(od_sphere) : null,

                os_sphere !== undefined && os_sphere !== '' ? parseFloat(os_sphere) : null,

                od_cylinder !== undefined && od_cylinder !== '' ? parseFloat(od_cylinder) : null,

                os_cylinder !== undefined && os_cylinder !== '' ? parseFloat(os_cylinder) : null,

                od_axis !== undefined && od_axis !== '' ? parseInt(od_axis) : null,

                os_axis !== undefined && os_axis !== '' ? parseInt(os_axis) : null,

                od_add !== undefined && od_add !== '' ? parseFloat(od_add) : null,

                os_add !== undefined && os_add !== '' ? parseFloat(os_add) : null,

                slit_lamp_exam || '',

                fundoscopy_exam || '',

                notes || '', 

                tenantId || 1, 

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_EYE_EXAM', 'Ophthalmology',

            `Recorded eye exam for patient #${patient_id}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[Ophthalmology Exam Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/ophthalmology/exams/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT ee.*, su.display_name as doctor_name 

             FROM eye_exams ee 

             LEFT JOIN system_users su ON ee.doctor_id = su.id 

             WHERE ee.patient_id=$1${tenantCheck} 

             ORDER BY ee.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[Ophthalmology Exam Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
