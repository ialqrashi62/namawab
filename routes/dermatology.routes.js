const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeDermatologyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.post('/api/dermatology/lesions', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { 

            patient_id, exam_date, body_site, lesion_type, color, size_mm, distribution, biopsy_taken, notes 

        } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        

        if (!patient_id) {

            return res.status(400).json({ error: 'Patient ID is required' });

        }

        

        const result = await pool.query(

            `INSERT INTO dermatology_lesions 

             (patient_id, doctor_id, exam_date, body_site, lesion_type, color, size_mm, distribution, biopsy_taken, notes, tenant_id, facility_id) 

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,

            [

                patient_id,

                req.session.user?.id || null,

                exam_date || new Date().toISOString().slice(0, 10),

                body_site || '',

                lesion_type || '',

                color || '',

                size_mm === undefined ? 0.0 : parseFloat(size_mm),

                distribution || '',

                !!biopsy_taken,

                notes || '',

                tenantId || 1,

                facilityId || null

            ]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_DERMATOLOGY_LESION', 'Dermatology',

            `Recorded dermatology lesion for patient #${patient_id}`, req.ip);

            

        res.json({ id: result.rows[0].id, success: true });

    } catch (e) {

        console.error('[Dermatology Lesion Create Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/dermatology/lesions/patient/:patient_id', requireAuth, requireRole('patients', 'prescriptions'), async (req, res) => {

    try {

        const { patient_id } = req.params;

        const { tenantId } = getRequestTenantContext(req);

        const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';

        const tenantParams = tenantId ? [patient_id, tenantId] : [patient_id];

        

        const result = await pool.query(

            `SELECT dl.*, su.display_name as doctor_name 

             FROM dermatology_lesions dl 

             LEFT JOIN system_users su ON dl.doctor_id = su.id 

             WHERE dl.patient_id=$1${tenantCheck} 

             ORDER BY dl.id DESC`,

            tenantParams

        );

        

        res.json(result.rows);

    } catch (e) {

        console.error('[Dermatology Lesion Get Error]', e);

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
