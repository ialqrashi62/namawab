const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeEmergencyRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, specialtyScores, e7RequireTenant }) {
    const router = express.Router();
router.get('/api/emergency/visits', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const q = tenantId

            ? 'SELECT * FROM emergency_visits WHERE tenant_id = $1 ORDER BY arrival_time DESC'

            : 'SELECT * FROM emergency_visits ORDER BY arrival_time DESC';

        const params = tenantId ? [tenantId] : [];

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/emergency/visits/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const q = tenantId

            ? 'SELECT * FROM emergency_visits WHERE id = $1 AND tenant_id = $2'

            : 'SELECT * FROM emergency_visits WHERE id = $1';

        const params = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const row = (await pool.query(q, params)).rows[0];

        if (!row) return res.status(404).json({ error: 'Emergency visit not found' });

        res.json(row);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/emergency/visits', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, patient_name, arrival_mode, chief_complaint, chief_complaint_ar, triage_level, triage_color, triage_nurse, triage_vitals, assigned_doctor, assigned_bed, acuity_notes } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);



        // Validate patient context to prevent IDOR / illegal references

        if (patient_id && tenantId) {

            const patientCheck = (await pool.query('SELECT id FROM patients WHERE id = $1 AND tenant_id = $2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) {

                return res.status(403).json({ error: 'Invalid patient context or access denied' });

            }

        }



        // Validate bed context to prevent IDOR / illegal references

        if (assigned_bed && tenantId) {

            const bedCheck = (await pool.query('SELECT id FROM emergency_beds WHERE bed_name = $1 AND tenant_id = $2', [assigned_bed, tenantId])).rows[0];

            if (!bedCheck) {

                return res.status(403).json({ error: 'Invalid bed context or access denied' });

            }

        }



        const r = await pool.query(

            `INSERT INTO emergency_visits (patient_id,patient_name,arrival_mode,chief_complaint,chief_complaint_ar,triage_level,triage_color,triage_nurse,triage_vitals,assigned_doctor,assigned_bed,acuity_notes,tenant_id,facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,

            [patient_id, patient_name, arrival_mode || 'Walk-in', chief_complaint, chief_complaint_ar, triage_level || 3, triage_color || 'Yellow', triage_nurse, triage_vitals, assigned_doctor, assigned_bed, acuity_notes, tenantId, facilityId]);



        if (assigned_bed) {

            const updateBedQ = tenantId

                ? "UPDATE emergency_beds SET status='Occupied', current_patient_id=$1 WHERE bed_name=$2 AND tenant_id=$3"

                : "UPDATE emergency_beds SET status='Occupied', current_patient_id=$1 WHERE bed_name=$2";

            const updateBedParams = tenantId ? [patient_id, assigned_bed, tenantId] : [patient_id, assigned_bed];

            await pool.query(updateBedQ, updateBedParams);

        }



        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_EMERGENCY_VISIT', 'Emergency', `Created emergency visit for patient #${patient_id}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/emergency/visits/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        // Fail-closed tenant scope (E7 hardening): null tenant => 403, never an unscoped fallback.

        const { tenantId } = e7RequireTenant(req);



        const { status, disposition, assigned_doctor, assigned_bed,

            discharge_diagnosis, discharge_instructions, discharge_medications, followup_date } = req.body;



        // State guard: terminal disposition transitions MUST go through POST /api/er/disposition

        // (server-authoritative state machine + triage/provider gating + ADT handoff + bed release).

        // The legacy route is for non-terminal field updates only.

        const TERMINAL_STATUSES = ['Discharged', 'Admitted', 'Transferred', 'LWBS'];

        if (status && TERMINAL_STATUSES.includes(status)) {

            return res.status(409).json({ error: 'Terminal disposition must use POST /api/er/disposition', use: '/api/er/disposition' });

        }



        // Verify visit ownership first (always tenant-scoped).

        const visit = (await pool.query(

            'SELECT id, assigned_bed, patient_id FROM emergency_visits WHERE id = $1 AND tenant_id = $2',

            [req.params.id, tenantId])).rows[0];

        if (!visit) return res.status(404).json({ error: 'Emergency visit not found' });



        // If assigned_bed is changed, verify it belongs to tenant

        if (assigned_bed) {

            const bedCheck = (await pool.query('SELECT id FROM emergency_beds WHERE bed_name = $1 AND tenant_id = $2', [assigned_bed, tenantId])).rows[0];

            if (!bedCheck) {

                return res.status(403).json({ error: 'Invalid bed context or access denied' });

            }

        }



        // NOTE: acuity/sort fields are intentionally NOT accepted here — they are written only via

        // POST /api/er/triage (server-side ESI engine). Any client-sent acuity values are ignored

        // to prevent bypassing the ESI computation.

        const sets = []; const vals = []; let i = 1;

        if (status) { sets.push(`status=$${i++}`); vals.push(status); }

        if (disposition) { sets.push(`disposition=$${i++}`); vals.push(disposition); sets.push(`disposition_time=$${i++}`); vals.push(new Date().toISOString()); }

        if (assigned_doctor) { sets.push(`assigned_doctor=$${i++}`); vals.push(assigned_doctor); }

        if (assigned_bed) { sets.push(`assigned_bed=$${i++}`); vals.push(assigned_bed); }

        if (discharge_diagnosis) { sets.push(`discharge_diagnosis=$${i++}`); vals.push(discharge_diagnosis); }

        if (discharge_instructions) { sets.push(`discharge_instructions=$${i++}`); vals.push(discharge_instructions); }

        if (discharge_medications) { sets.push(`discharge_medications=$${i++}`); vals.push(discharge_medications); }

        if (followup_date) { sets.push(`followup_date=$${i++}`); vals.push(followup_date); }



        if (!sets.length) return res.status(422).json({ error: 'No updatable fields provided' });



        vals.push(req.params.id);

        const idIdx = i++;

        vals.push(tenantId);

        const tIdx = i;



        await pool.query(

            `UPDATE emergency_visits SET ${sets.join(',')} WHERE id=$${idIdx} AND tenant_id=$${tIdx}`, vals);



        logAudit(req.session.user?.id, req.session.user?.display_name, 'UPDATE_EMERGENCY_VISIT', 'Emergency', `Updated emergency visit #${req.params.id} (Status: ${status || 'N/A'})`, req.ip);

        res.json({ success: true });

    } catch (e) {

        if (e.e7Status) return res.status(e.e7Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/emergency/beds', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const q = tenantId

            ? 'SELECT * FROM emergency_beds WHERE tenant_id = $1 ORDER BY id'

            : 'SELECT * FROM emergency_beds ORDER BY id';

        const params = tenantId ? [tenantId] : [];

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/emergency/stats', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);



        const activeQ = tenantId

            ? "SELECT COUNT(*) as cnt FROM emergency_visits WHERE status='Active' AND tenant_id=$1"

            : "SELECT COUNT(*) as cnt FROM emergency_visits WHERE status='Active'";



        const todayQ = tenantId

            ? "SELECT COUNT(*) as cnt FROM emergency_visits WHERE DATE(arrival_time)=CURRENT_DATE AND tenant_id=$1"

            : "SELECT COUNT(*) as cnt FROM emergency_visits WHERE DATE(arrival_time)=CURRENT_DATE";



        const criticalQ = tenantId

            ? "SELECT COUNT(*) as cnt FROM emergency_visits WHERE status='Active' AND triage_level<=2 AND tenant_id=$1"

            : "SELECT COUNT(*) as cnt FROM emergency_visits WHERE status='Active' AND triage_level<=2";



        const bedsQ = tenantId

            ? "SELECT COUNT(*) as total, COUNT(*) FILTER(WHERE status='Available') as available FROM emergency_beds WHERE tenant_id=$1"

            : "SELECT COUNT(*) as total, COUNT(*) FILTER(WHERE status='Available') as available FROM emergency_beds";



        const byTriageQ = tenantId

            ? "SELECT triage_color, COUNT(*) as cnt FROM emergency_visits WHERE status='Active' AND tenant_id=$1 GROUP BY triage_color"

            : "SELECT triage_color, COUNT(*) as cnt FROM emergency_visits WHERE status='Active' GROUP BY triage_color";



        const params = tenantId ? [tenantId] : [];



        const active = (await pool.query(activeQ, params)).rows[0].cnt;

        const today = (await pool.query(todayQ, params)).rows[0].cnt;

        const critical = (await pool.query(criticalQ, params)).rows[0].cnt;

        const beds = (await pool.query(bedsQ, params)).rows[0];

        const byTriage = (await pool.query(byTriageQ, params)).rows;



        res.json({ active, today, critical, totalBeds: beds.total, availableBeds: beds.available, byTriage });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/emergency/trauma/:visitId', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);



        // Verify visit ownership first

        const visitCheckQ = tenantId

            ? 'SELECT id, patient_id FROM emergency_visits WHERE id = $1 AND tenant_id = $2'

            : 'SELECT id, patient_id FROM emergency_visits WHERE id = $1';

        const visitCheckParams = tenantId ? [req.params.visitId, tenantId] : [req.params.visitId];

        const visit = (await pool.query(visitCheckQ, visitCheckParams)).rows[0];

        if (!visit) return res.status(404).json({ error: 'Emergency visit not found or access denied' });



        const { patient_id, airway, breathing, circulation, disability, exposure, gcs_eye, gcs_verbal, gcs_motor, mechanism_of_injury, trauma_team_activated, assessed_by } = req.body;



        // Verify patient ownership

        if (patient_id && tenantId) {

            const patientCheck = (await pool.query('SELECT id FROM patients WHERE id = $1 AND tenant_id = $2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) return res.status(403).json({ error: 'Invalid patient context or access denied' });

        }



        // GCS is a server-side authority value. A missing component must NEVER default to

        // normal (the old `|| 4/5/6` turned an unassessed patient into a reassuring GCS 15).

        // Partial GCS (e.g. best-motor only in rapid trauma) is stored honestly with a NULL

        // total; invalid provided components 422 fail-closed.

        const gcsRes = specialtyScores.validateGCSComponents({ eye: gcs_eye, verbal: gcs_verbal, motor: gcs_motor });

        if (!gcsRes.ok) {

            return res.status(422).json({ error: `GCS rejected: ${gcsRes.error}` });

        }

        const teVal = gcsRes.components.eye, tvVal = gcsRes.components.verbal, tmVal = gcsRes.components.motor;

        const gcs_total = gcsRes.total;

        const r = await pool.query(

            `INSERT INTO emergency_trauma_assessments (visit_id,patient_id,airway,breathing,circulation,disability,exposure,gcs_eye,gcs_verbal,gcs_motor,gcs_total,mechanism_of_injury,trauma_team_activated,assessed_by,tenant_id,facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,

            [req.params.visitId, patient_id, airway, breathing, circulation, disability, exposure, teVal, tvVal, tmVal, gcs_total, mechanism_of_injury, trauma_team_activated ? 1 : 0, assessed_by, tenantId, facilityId]);



        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_TRAUMA_ASSESSMENT', 'Emergency', `Created trauma assessment for visit #${req.params.visitId}`, req.ip);

        res.json(r.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
