const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeEntRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.post('/api/ent/audiograms', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { 

            patient_id, test_date,

            right_ac_250, right_ac_500, right_ac_1000, right_ac_2000, right_ac_4000, right_ac_8000,

            left_ac_250, left_ac_500, left_ac_1000, left_ac_2000, left_ac_4000, left_ac_8000,

            right_bc_250, right_bc_500, right_bc_1000, right_bc_2000, right_bc_4000,

            left_bc_250, left_bc_500, left_bc_1000, left_bc_2000, left_bc_4000,

            right_srt, left_srt, right_sd_score, left_sd_score,

            otoscopy_right, otoscopy_left, tympanometry_right, tympanometry_left,

            interpretation, notes

        } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        

        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }

        

        const result = await pool.query(

            `INSERT INTO audiogram_records 

             (patient_id, doctor_id, test_date, 

              right_ac_250, right_ac_500, right_ac_1000, right_ac_2000, right_ac_4000, right_ac_8000,

              left_ac_250, left_ac_500, left_ac_1000, left_ac_2000, left_ac_4000, left_ac_8000,

              right_bc_250, right_bc_500, right_bc_1000, right_bc_2000, right_bc_4000,

              left_bc_250, left_bc_500, left_bc_1000, left_bc_2000, left_bc_4000,

              right_srt, left_srt, right_sd_score, left_sd_score,

              otoscopy_right, otoscopy_left, tympanometry_right, tympanometry_left,

              interpretation, notes, tenant_id, facility_id) 

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37) RETURNING id`,

            [

                patient_id,

                req.session.user?.id || null,

                test_date || new Date().toISOString().slice(0, 10),

                right_ac_250 !== undefined && right_ac_250 !== '' ? parseInt(right_ac_250) : null,

                right_ac_500 !== undefined && right_ac_500 !== '' ? parseInt(right_ac_500) : null,

                right_ac_1000 !== undefined && right_ac_1000 !== '' ? parseInt(right_ac_1000) : null,

                right_ac_2000 !== undefined && right_ac_2000 !== '' ? parseInt(right_ac_2000) : null,

                right_ac_4000 !== undefined && right_ac_4000 !== '' ? parseInt(right_ac_4000) : null,

                right_ac_8000 !== undefined && right_ac_8000 !== '' ? parseInt(right_ac_8000) : null,

                left_ac_250 !== undefined && left_ac_250 !== '' ? parseInt(left_ac_250) : null,

                left_ac_500 !== undefined && left_ac_500 !== '' ? parseInt(left_ac_500) : null,

                left_ac_1000 !== undefined && left_ac_1000 !== '' ? parseInt(left_ac_1000) : null,

                left_ac_2000 !== undefined && left_ac_2000 !== '' ? parseInt(left_ac_2000) : null,

                left_ac_4000 !== undefined && left_ac_4000 !== '' ? parseInt(left_ac_4000) : null,

                left_ac_8000 !== undefined && left_ac_8000 !== '' ? parseInt(left_ac_8000) : null,

                right_bc_250 !== undefined && right_bc_250 !== '' ? parseInt(right_bc_250) : null,

                right_bc_500 !== undefined && right_bc_500 !== '' ? parseInt(right_bc_500) : null,

                right_bc_1000 !== undefined && right_bc_1000 !== '' ? parseInt(right_bc_1000) : null,

                right_bc_2000 !== undefined && right_bc_2000 !== '' ? parseInt(right_bc_2000) : null,

                right_bc_4000 !== undefined && right_bc_4000 !== '' ? parseInt(right_bc_4000) : null,

                left_bc_250 !== undefined && left_bc_250 !== '' ? parseInt(left_bc_250) : null,

                left_bc_500 !== undefined && left_bc_500 !== '' ? parseInt(left_bc_500) : null,

                left_bc_1000 !== undefined && left_bc_1000 !== '' ? parseInt(left_bc_1000) : null,

                left_bc_2000 !== undefined && left_bc_2000 !== '' ? parseInt(left_bc_2000) : null,

                left_bc_4000 !== undefined && left_bc_4000 !== '' ? parseInt(left_bc_4000) : null,

                right_srt !== undefined && right_srt !== '' ? parseInt(right_srt) : null,

                left_srt !== undefined && left_srt !== '' ? parseInt(left_srt) : null,

                right_sd_score !== undefined && right_sd_score !== '' ? parseInt(right_sd_score) : null,

                left_sd_score !== undefined && left_sd_score !== '' ? parseInt(left_sd_score) : null,

                otoscopy_right || '',

                otoscopy_left || '',

                tympanometry_right || null,

                tympanometry_left || null,

                interpretation || '',

                notes || '',

                tenantId || 1,

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_AUDIOGRAM_RECORD', 'ENT',

            `Recorded audiogram for patient #${patient_id}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[ENT Audiogram Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/ent/audiograms/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT ar.*, su.display_name as doctor_name 

             FROM audiogram_records ar 

             LEFT JOIN system_users su ON ar.doctor_id = su.id 

             WHERE ar.patient_id=$1${tenantCheck} 

             ORDER BY ar.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[ENT Audiogram Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
