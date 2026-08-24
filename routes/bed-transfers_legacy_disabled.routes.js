const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeBedTransfers_Legacy_DisabledRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.post('/api/bed-transfers_legacy_disabled', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);



        // Verify admission ownership first

        if (admission_id && tenantId) {

            const checkQ = 'SELECT id FROM admissions WHERE id = $1 AND tenant_id = $2';

            const adm = (await pool.query(checkQ, [admission_id, tenantId])).rows[0];

            if (!adm) return res.status(403).json({ error: 'Invalid admission context or access denied' });

        }



        // Verify patient ownership

        if (patient_id && tenantId) {

            const patientCheck = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) return res.status(403).json({ error: 'Invalid patient context or access denied' });

        }



        // Verify beds ownership

        if (from_bed && tenantId) {

            const fromBedCheck = (await pool.query('SELECT id FROM beds WHERE id=$1 AND tenant_id=$2', [from_bed, tenantId])).rows[0];

            if (!fromBedCheck) return res.status(403).json({ error: 'Invalid source bed context or access denied' });

        }

        if (to_bed && tenantId) {

            const toBedCheck = (await pool.query('SELECT id FROM beds WHERE id=$1 AND tenant_id=$2', [to_bed, tenantId])).rows[0];

            if (!toBedCheck) return res.status(403).json({ error: 'Invalid destination bed context or access denied' });

        }



        await pool.query(

            `INSERT INTO bed_transfers (admission_id,patient_id,from_ward,from_bed,to_ward,to_bed,transfer_reason,transferred_by,tenant_id,branch_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,

            [admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by, tenantId, facilityId]);



        if (from_bed) {

            const updateOldBedQ = tenantId

                ? "UPDATE beds SET status='Available', current_patient_id=0, current_admission_id=0 WHERE id=$1 AND tenant_id=$2"

                : "UPDATE beds SET status='Available', current_patient_id=0, current_admission_id=0 WHERE id=$1";

            const updateOldBedParams = tenantId ? [from_bed, tenantId] : [from_bed];

            await pool.query(updateOldBedQ, updateOldBedParams);

        }

        if (to_bed) {

            const updateNewBedQ = tenantId

                ? "UPDATE beds SET status='Occupied', current_patient_id=$1, current_admission_id=$2 WHERE id=$3 AND tenant_id=$4"

                : "UPDATE beds SET status='Occupied', current_patient_id=$1, current_admission_id=$2 WHERE id=$3";

            const updateNewBedParams = tenantId ? [patient_id, admission_id, to_bed, tenantId] : [patient_id, admission_id, to_bed];

            await pool.query(updateNewBedQ, updateNewBedParams);

        }



        const updateAdmissionQ = tenantId

            ? 'UPDATE admissions SET ward_id=$1, bed_id=$2 WHERE id=$3 AND tenant_id=$4'

            : 'UPDATE admissions SET ward_id=$1, bed_id=$2 WHERE id=$3';

        const updateAdmissionParams = tenantId ? [to_ward, to_bed, admission_id, tenantId] : [to_ward, to_bed, admission_id];

        await pool.query(updateAdmissionQ, updateAdmissionParams);



        logAudit(req.session.user?.id, req.session.user?.display_name, 'BED_TRANSFER', 'Inpatient', `Transferred patient #${patient_id} to bed #${to_bed}`, req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
