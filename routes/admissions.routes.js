const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeAdmissionsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e8RequireTenant }) {
    const router = express.Router();
router.get('/api/admissions', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { status } = req.query;

        // L2 fix: fail-closed. The prior null-tenant else-branch used `WHERE tenant_id=$1`

        // with params=[] ("$1 not bound" runtime error) — and any unscoped fallback would be a

        // cross-tenant leak anyway. Require a tenant; every query carries AND tenant_id.

        const { tenantId } = e8RequireTenant(req);

        let qText, params;

        if (status) {

            qText = 'SELECT * FROM admissions WHERE status=$1 AND tenant_id=$2 ORDER BY admission_date DESC';

            params = [status, tenantId];

        } else {

            qText = 'SELECT * FROM admissions WHERE tenant_id=$1 ORDER BY admission_date DESC';

            params = [tenantId];

        }

        const q = await pool.query(qText, params);

        res.json(q.rows);

    } catch (e) {

        if (e.e8Status) return res.status(e.e8Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/admissions/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        // I2 fix: fail-closed (no unscoped fallback) so a null tenant context can never read

        // another tenant's admission (cross-tenant IDOR).

        const { tenantId } = e8RequireTenant(req);

        const row = (await pool.query(

            'SELECT * FROM admissions WHERE id = $1 AND tenant_id = $2',

            [req.params.id, tenantId])).rows[0];

        if (!row) return res.status(404).json({ error: 'Admission not found' });

        res.json(row);

    } catch (e) {

        if (e.e8Status) return res.status(e.e8Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/admissions', requireAuth, requireTenantScope, async (req, res) => {

    // E8 SHADOW-PATH CLOSURE: the legacy admit path occupied a bed WITHOUT a FOR UPDATE lock

    // (double-occupy race) and did not enforce the bed/admission state machine. Admissions must

    // now go through POST /api/adt/admit (race-safe, state-validated). This route is retired for

    // writes; it fails closed and directs callers to the safe route. (The ER->ADT handoff uses a

    // direct INSERT, not this route, so it is unaffected.)

    const { tenantId } = getRequestTenantContext(req);

    if (!tenantId && process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'Tenant scope required' });

    return res.status(409).json({ error: 'Use POST /api/adt/admit', use: '/api/adt/admit' });

});

router.post('/api/admissions/_legacy_disabled', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, patient_name, admission_type, admitting_doctor, attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code, admission_orders, diet_order, activity_level, dvt_prophylaxis, expected_los, insurance_auth } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);



        // Validate patient context to prevent IDOR / illegal references

        if (patient_id) {

            const patientCheckQ = tenantId

                ? 'SELECT id FROM patients WHERE id = $1 AND tenant_id = $2'

                : 'SELECT id FROM patients WHERE id = $1';

            const patientCheckParams = tenantId ? [patient_id, tenantId] : [patient_id];

            const patientCheck = (await pool.query(patientCheckQ, patientCheckParams)).rows[0];

            if (!patientCheck) {

                return res.status(403).json({ error: 'Invalid patient context or access denied' });

            }

        }



        // Validate ward / bed context to prevent IDOR / illegal references

        if (bed_id) {

            const bedCheckQ = tenantId

                ? 'SELECT id FROM beds WHERE id = $1 AND tenant_id = $2'

                : 'SELECT id FROM beds WHERE id = $1';

            const bedCheckParams = tenantId ? [bed_id, tenantId] : [bed_id];

            const bedCheck = (await pool.query(bedCheckQ, bedCheckParams)).rows[0];

            if (!bedCheck) {

                return res.status(403).json({ error: 'Invalid bed context or access denied' });

            }

        }



        if (ward_id) {

            const wardCheckQ = tenantId

                ? 'SELECT id FROM wards WHERE id = $1 AND tenant_id = $2'

                : 'SELECT id FROM wards WHERE id = $1';

            const wardCheckParams = tenantId ? [ward_id, tenantId] : [ward_id];

            const wardCheck = (await pool.query(wardCheckQ, wardCheckParams)).rows[0];

            if (!wardCheck) {

                return res.status(403).json({ error: 'Invalid ward context or access denied' });

            }

        }



        const r = await pool.query(

            `INSERT INTO admissions (patient_id,patient_name,admission_type,admitting_doctor,attending_doctor,department,ward_id,bed_id,diagnosis,icd10_code,admission_orders,diet_order,activity_level,dvt_prophylaxis,expected_los,insurance_auth,tenant_id,facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,

            [patient_id, patient_name, admission_type || 'Regular', admitting_doctor, attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code, admission_orders, diet_order || 'Regular', activity_level || 'Bed Rest', dvt_prophylaxis, expected_los || 3, insurance_auth, tenantId, facilityId]);



        if (bed_id) {

            const updateBedQ = tenantId

                ? "UPDATE beds SET status='Occupied', current_patient_id=$1, current_admission_id=$2 WHERE id=$3 AND tenant_id=$4"

                : "UPDATE beds SET status='Occupied', current_patient_id=$1, current_admission_id=$2 WHERE id=$3";

            const updateBedParams = tenantId ? [patient_id, r.rows[0].id, bed_id, tenantId] : [patient_id, r.rows[0].id, bed_id];

            await pool.query(updateBedQ, updateBedParams);

        }



        const updatePatientQ = tenantId

            ? "UPDATE patients SET status='Admitted' WHERE id=$1 AND tenant_id=$2"

            : "UPDATE patients SET status='Admitted' WHERE id=$1";

        const updatePatientParams = tenantId ? [patient_id, tenantId] : [patient_id];

        await pool.query(updatePatientQ, updatePatientParams);



        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_ADMISSION', 'Inpatient', `Created admission for patient #${patient_id}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/admissions/:id/discharge', requireAuth, requireTenantScope, async (req, res) => {

    // E8 SHADOW-PATH CLOSURE: legacy discharge freed the bed to 'Available' (not 'Cleaning') and

    // did NOT reject an already-discharged admission. Discharge must now go through

    // POST /api/adt/discharge (state-validated, frees bed -> Cleaning). Fails closed.

    const { tenantId } = getRequestTenantContext(req);

    if (!tenantId && process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'Tenant scope required' });

    return res.status(409).json({ error: 'Use POST /api/adt/discharge', use: '/api/adt/discharge' });

});

router.put('/api/admissions/:id/discharge_legacy_disabled', requireAuth, requireTenantScope, async (req, res) => {

    const client = await pool.connect();

    try {

        const { tenantId } = getRequestTenantContext(req);



        await client.query('BEGIN');



        // Verify admission ownership first

        const checkQ = tenantId

            ? 'SELECT id, bed_id, patient_id FROM admissions WHERE id = $1 AND tenant_id = $2 FOR UPDATE'

            : 'SELECT id, bed_id, patient_id FROM admissions WHERE id = $1 FOR UPDATE';

        const checkParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const checkRes = await client.query(checkQ, checkParams);

        const adm = checkRes.rows[0];

        if (!adm) {

            await client.query('ROLLBACK');

            client.release();

            return res.status(404).json({ error: 'Admission not found' });

        }



        const { discharge_type, discharge_summary, discharge_instructions, discharge_medications, followup_date, followup_doctor } = req.body;



        const updateQ = tenantId

            ? 'UPDATE admissions SET status=$1, discharge_date=$2, discharge_type=$3, discharge_summary=$4, discharge_instructions=$5, discharge_medications=$6, followup_date=$7, followup_doctor=$8 WHERE id=$9 AND tenant_id=$10'

            : 'UPDATE admissions SET status=$1, discharge_date=$2, discharge_type=$3, discharge_summary=$4, discharge_instructions=$5, discharge_medications=$6, followup_date=$7, followup_doctor=$8 WHERE id=$9';

        const updateParams = [

            'Discharged',

            new Date().toISOString(),

            discharge_type || 'Regular',

            discharge_summary,

            discharge_instructions,

            discharge_medications,

            followup_date,

            followup_doctor,

            req.params.id

        ];

        if (tenantId) updateParams.push(tenantId);

        await client.query(updateQ, updateParams);



        if (adm.bed_id) {

            const updateBedQ = tenantId

                ? "UPDATE beds SET status='Available', current_patient_id=0, current_admission_id=0 WHERE id=$1 AND tenant_id=$2"

                : "UPDATE beds SET status='Available', current_patient_id=0, current_admission_id=0 WHERE id=$1";

            const updateBedParams = tenantId ? [adm.bed_id, tenantId] : [adm.bed_id];

            await client.query(updateBedQ, updateBedParams);

        }

        if (adm.patient_id) {

            const updatePatientQ = tenantId

                ? "UPDATE patients SET status='Discharged' WHERE id=$1 AND tenant_id=$2"

                : "UPDATE patients SET status='Discharged' WHERE id=$1";

            const updatePatientParams = tenantId ? [adm.patient_id, tenantId] : [adm.patient_id];

            await client.query(updatePatientQ, updatePatientParams);

        }



        await client.query('COMMIT');

        client.release();



        logAudit(req.session.user?.id, req.session.user?.display_name, 'DISCHARGE_PATIENT', 'Inpatient', `Discharged patient from admission #${req.params.id}`, req.ip);

        res.json({ success: true });

    } catch (e) {

        try {

            await client.query('ROLLBACK');

        } catch (rollbackError) {}

        client.release();

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/admissions/:id/rounds', requireAuth, requireTenantScope, async (req, res) => {

    try {

        // I2 fix: fail-closed — no unscoped fallback (cross-tenant IDOR otherwise).

        const { tenantId, facilityId } = e8RequireTenant(req);



        // Verify admission ownership first

        const adm = (await pool.query('SELECT id FROM admissions WHERE id = $1 AND tenant_id = $2', [req.params.id, tenantId])).rows[0];

        if (!adm) return res.status(404).json({ error: 'Admission not found' });



        const { patient_id, doctor_name, subjective, objective, assessment, plan, vitals_summary, orders, diet_changes } = req.body;



        // Verify patient ownership

        if (patient_id) {

            const patientCheck = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) {

                return res.status(403).json({ error: 'Invalid patient context or access denied' });

            }

        }



        const r = await pool.query(

            `INSERT INTO admission_daily_rounds (admission_id,patient_id,round_date,round_time,doctor_name,subjective,objective,assessment,plan,vitals_summary,orders,diet_changes,tenant_id,facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,

            [req.params.id, patient_id, new Date().toISOString().split('T')[0], new Date().toTimeString().split(' ')[0], doctor_name, subjective, objective, assessment, plan, vitals_summary, orders, diet_changes, tenantId, facilityId]);



        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_DAILY_ROUND', 'Inpatient', `Added daily round for admission #${req.params.id}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) {

        if (e.e8Status) return res.status(e.e8Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/admissions/:id/rounds', requireAuth, requireTenantScope, async (req, res) => {

    try {

        // I2 fix: fail-closed — no unscoped fallback (cross-tenant IDOR otherwise).

        const { tenantId } = e8RequireTenant(req);



        // Verify admission ownership first

        const adm = (await pool.query('SELECT id FROM admissions WHERE id = $1 AND tenant_id = $2', [req.params.id, tenantId])).rows[0];

        if (!adm) return res.status(404).json({ error: 'Admission not found' });



        res.json((await pool.query(

            'SELECT * FROM admission_daily_rounds WHERE admission_id=$1 AND tenant_id=$2 ORDER BY id DESC',

            [req.params.id, tenantId])).rows);

    } catch (e) {

        if (e.e8Status) return res.status(e.e8Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
