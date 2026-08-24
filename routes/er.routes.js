const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeErRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e7RequireTenant, ER_DISPOSITIONS, esiEngine }) {
    const router = express.Router();
router.get('/api/er/board', requireAuth, requireRole('emergency', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e7RequireTenant(req);

        const rows = (await pool.query(

            `SELECT id, patient_id, patient_name, chief_complaint, chief_complaint_ar,

                    triage_level, triage_color, esi_level, esi_rationale, er_phase,

                    assigned_doctor, assigned_bed, arrival_time, triage_started_at,

                    provider_assigned_at, time_to_provider_min, disposition, disposition_type, status

             FROM emergency_visits

             WHERE status='Active' AND tenant_id = $1

             ORDER BY COALESCE(NULLIF(esi_level,0), triage_level, 3) ASC, arrival_time ASC`,

            [tenantId])).rows;



        const now = Date.now();

        const board = rows.map(v => {

            const arrivalMs = v.arrival_time ? new Date(v.arrival_time).getTime() : now;

            const minsSinceArrival = Math.max(0, Math.round((now - arrivalMs) / 60000));

            const lvl = v.esi_level || v.triage_level || 3;

            const phase = v.er_phase || (v.triage_started_at ? 'Waiting' : 'Arrival');

            // Time-to-provider breach thresholds (ESI-1: immediate; ESI-2: 10 min).

            let ttp_breach = false;

            if (!v.provider_assigned_at && (lvl === 1 || lvl === 2)) {

                const limit = lvl === 1 ? 0 : 10;

                if (minsSinceArrival > limit) ttp_breach = true;

            }

            return {

                id: v.id, patient_id: v.patient_id, patient_name: v.patient_name,

                chief_complaint: v.chief_complaint, chief_complaint_ar: v.chief_complaint_ar,

                esi_level: lvl, triage_color: v.triage_color, esi_rationale: v.esi_rationale,

                phase, location: v.assigned_bed || null, assigned_doctor: v.assigned_doctor || null,

                arrival_time: v.arrival_time, minutes_since_arrival: minsSinceArrival,

                triage_started_at: v.triage_started_at, provider_assigned_at: v.provider_assigned_at,

                time_to_provider_min: v.time_to_provider_min,

                time_to_provider_breach: ttp_breach,

                disposition: v.disposition, disposition_type: v.disposition_type, status: v.status

            };

        });

        res.json(board);

    } catch (e) {

        if (e.e7Status) return res.status(e.e7Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/er/triage', requireAuth, requireRole('emergency', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e7RequireTenant(req);

        const { visit_id } = req.body;

        if (!visit_id) return res.status(422).json({ error: 'visit_id is required' });



        // Ownership / IDOR: visit must belong to this tenant.

        const visit = (await pool.query(

            'SELECT id, patient_id, er_phase, status FROM emergency_visits WHERE id = $1 AND tenant_id = $2',

            [visit_id, tenantId])).rows[0];

        if (!visit) return res.status(404).json({ error: 'Emergency visit not found' });



        // State machine: cannot (re)triage a visit that has already been dispositioned/closed.

        if (visit.status && visit.status !== 'Active') {

            return res.status(409).json({ error: `Cannot triage a ${visit.status} visit` });

        }

        if (visit.er_phase === 'Disposition') {

            return res.status(409).json({ error: 'Cannot triage after disposition' });

        }

        // A patient already picked up by a provider must not be silently re-triaged to a different ESI.

        if (visit.er_phase === 'InTreatment') {

            return res.status(409).json({ error: 'Cannot re-triage a patient already in treatment' });

        }



        // SERVER-SIDE ESI — never trust req.body.esi_level.

        const esi = esiEngine.computeESI({

            vitals: req.body.vitals || {},

            loc: req.body.loc,

            chief_complaint: req.body.chief_complaint,

            chief_complaint_ar: req.body.chief_complaint_ar,

            pain_score: req.body.pain_score,

            resources: req.body.resources,

            resource_count: req.body.resource_count,

            high_risk: req.body.high_risk,

            age: req.body.age,

            requires_lifesaving: req.body.requires_lifesaving,

            cardiac_arrest: req.body.cardiac_arrest,

            requires_intubation: req.body.requires_intubation,

            active_seizure: req.body.active_seizure

        });



        // I2: corroboration audit. The engine TRUSTS client escalation flags (requires_lifesaving /

        // cardiac_arrest / active_seizure) and may land ESI-1/2 on them alone. We do NOT block (a

        // clinician may know things vitals don't show), but when such a flag is set AND every

        // measurable vital present (spo2,sbp,hr,rr) is within normal range AND LOC is alert, we mark

        // the result `unconfirmed_lifesaving_flag` and emit a distinct audit event for retro review.

        const _v = req.body.vitals || {};

        const _num = (x) => { if (x === null || x === undefined || x === '') return null; const n = Number(x); return Number.isFinite(n) ? n : null; };

        const _loc = String((req.body.loc != null ? req.body.loc : _v.loc) || '').trim().toLowerCase();

        const escalationFlag = req.body.requires_lifesaving === true || req.body.cardiac_arrest === true || req.body.active_seizure === true;

        const _spo2 = _num(_v.spo2), _sbp = _num(_v.sbp != null ? _v.sbp : _v.bp_systolic), _hr = _num(_v.hr), _rr = _num(_v.rr);

        const _present = [_spo2, _sbp, _hr, _rr].filter(x => x !== null);

        const vitalsNormal = _present.length === 4 &&

            _spo2 >= 95 && _sbp >= 100 && _hr >= 50 && _hr <= 100 && _rr >= 10 && _rr <= 20;

        const locAlert = _loc === 'a' || _loc === 'alert' || _loc === '';

        const unconfirmedLifesavingFlag = escalationFlag && vitalsNormal && locAlert;



        const rationaleObj = { decision_point: esi.decision_point, rationale: esi.rationale, danger_zone: esi.danger_zone, fail_safe: esi.fail_safe };

        if (unconfirmedLifesavingFlag) rationaleObj.unconfirmed_lifesaving_flag = true;

        const rationaleStr = JSON.stringify(rationaleObj);

        const nowIso = new Date().toISOString();



        await pool.query(

            `UPDATE emergency_visits

             SET esi_level=$1, triage_level=$1, triage_color=$2, esi_rationale=$3,

                 er_phase='Waiting',

                 triage_started_at=COALESCE(NULLIF(triage_started_at,''), $4),

                 triage_nurse=COALESCE(NULLIF($5,''), triage_nurse)

             WHERE id=$6 AND tenant_id=$7`,

            [esi.esi_level, esi.triage_color, rationaleStr, nowIso,

             req.body.triage_nurse || req.session.user?.display_name || '', visit_id, tenantId]);



        logAudit(req.session.user?.id, req.session.user?.display_name, 'ER_TRIAGE', 'Emergency',

            `ESI ${esi.esi_level} (DP ${esi.decision_point}) for visit #${visit_id}; danger_zone=${esi.danger_zone}`, req.ip);



        // I2: distinct audit event when an ESI-1/2 escalation rests only on a client flag while all

        // measurable vitals are normal and LOC is alert — flagged for retrospective clinical review.

        if (unconfirmedLifesavingFlag) {

            logAudit(req.session.user?.id, req.session.user?.display_name, 'ER_TRIAGE_UNCONFIRMED_ESCALATION', 'Emergency',

                `Visit #${visit_id}: ESI ${esi.esi_level} driven by client escalation flag with all measurable vitals normal (spo2=${_spo2},sbp=${_sbp},hr=${_hr},rr=${_rr}) and LOC alert — review`, req.ip);

        }



        res.json({ success: true, visit_id, esi_level: esi.esi_level, triage_color: esi.triage_color,

            decision_point: esi.decision_point, rationale: esi.rationale, danger_zone: esi.danger_zone,

            high_risk: esi.high_risk, resources_estimated: esi.resources_estimated, fail_safe: esi.fail_safe });

    } catch (e) {

        if (e.e7Status) return res.status(e.e7Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/er/assign-provider', requireAuth, requireRole('emergency', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = e7RequireTenant(req);

        const { visit_id, provider } = req.body;

        if (!visit_id) return res.status(422).json({ error: 'visit_id is required' });



        const visit = (await pool.query(

            'SELECT id, er_phase, status, esi_level, triage_started_at, arrival_time FROM emergency_visits WHERE id = $1 AND tenant_id = $2',

            [visit_id, tenantId])).rows[0];

        if (!visit) return res.status(404).json({ error: 'Emergency visit not found' });



        // State machine: provider assignment requires triage first.

        if (visit.status && visit.status !== 'Active') {

            return res.status(409).json({ error: `Cannot assign provider to a ${visit.status} visit` });

        }

        const triaged = (visit.esi_level && visit.esi_level > 0) || (visit.triage_started_at && visit.triage_started_at !== '');

        if (!triaged) {

            return res.status(409).json({ error: 'Cannot assign provider before triage' });

        }



        const providerName = (provider && String(provider).trim()) || req.session.user?.display_name || 'Provider';

        const nowMs = Date.now();

        const startMs = visit.triage_started_at ? new Date(visit.triage_started_at).getTime()

            : (visit.arrival_time ? new Date(visit.arrival_time).getTime() : nowMs);

        const ttp = Math.max(0, Math.round((nowMs - startMs) / 60000));

        const nowIso = new Date(nowMs).toISOString();



        await pool.query(

            `UPDATE emergency_visits

             SET assigned_doctor=$1, er_phase='InTreatment',

                 provider_assigned_at=COALESCE(NULLIF(provider_assigned_at,''), $2),

                 time_to_provider_min=COALESCE(NULLIF(time_to_provider_min,0), $3)

             WHERE id=$4 AND tenant_id=$5`,

            [providerName, nowIso, ttp, visit_id, tenantId]);



        logAudit(req.session.user?.id, req.session.user?.display_name, 'ER_ASSIGN_PROVIDER', 'Emergency',

            `Provider ${providerName} assigned to visit #${visit_id}; time-to-provider=${ttp}min`, req.ip);



        res.json({ success: true, visit_id, assigned_doctor: providerName, time_to_provider_min: ttp, phase: 'InTreatment' });

    } catch (e) {

        if (e.e7Status) return res.status(e.e7Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/er/disposition', requireAuth, requireRole('emergency', 'nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = e7RequireTenant(req);

        const { visit_id, disposition_type } = req.body;

        if (!visit_id) return res.status(422).json({ error: 'visit_id is required' });

        if (!ER_DISPOSITIONS.includes(disposition_type)) {

            return res.status(422).json({ error: 'Invalid disposition_type', allowed: ER_DISPOSITIONS });

        }



        const visit = (await pool.query(

            `SELECT id, patient_id, patient_name, assigned_bed, assigned_doctor, chief_complaint,

                    chief_complaint_ar, er_phase, status, esi_level, triage_started_at, provider_assigned_at

             FROM emergency_visits WHERE id = $1 AND tenant_id = $2`,

            [visit_id, tenantId])).rows[0];

        if (!visit) return res.status(404).json({ error: 'Emergency visit not found' });



        if (visit.status && visit.status !== 'Active') {

            return res.status(409).json({ error: `Visit already ${visit.status}` });

        }



        // State machine: cannot disposition before triage.

        const triaged = (visit.esi_level && visit.esi_level > 0) || (visit.triage_started_at && visit.triage_started_at !== '');

        if (!triaged) {

            return res.status(409).json({ error: 'Cannot set disposition before triage' });

        }

        // Admit/Discharge/Transfer require a provider to have seen the patient. LWBS is allowed

        // after triage without a provider (the patient left before being seen).

        const seenByProvider = visit.provider_assigned_at && visit.provider_assigned_at !== '';

        if (disposition_type !== 'LWBS' && !seenByProvider) {

            return res.status(409).json({ error: 'Cannot disposition before a provider is assigned' });

        }



        // Map disposition -> visit status.

        const STATUS_MAP = { Admitted: 'Admitted', Discharged: 'Discharged', Transferred: 'Transferred', LWBS: 'LWBS' };

        const newStatus = STATUS_MAP[disposition_type];

        const nowIso = new Date().toISOString();



        const sets = ["er_phase='Disposition'", `status=$1`, `disposition=$2`, `disposition_time=$3`];

        const vals = [newStatus, disposition_type, nowIso];

        let i = 4;

        if (req.body.diagnosis) { sets.push(`discharge_diagnosis=$${i++}`); vals.push(req.body.diagnosis); }

        if (req.body.instructions) { sets.push(`discharge_instructions=$${i++}`); vals.push(req.body.instructions); }

        if (req.body.medications) { sets.push(`discharge_medications=$${i++}`); vals.push(req.body.medications); }

        if (req.body.followup_date) { sets.push(`followup_date=$${i++}`); vals.push(req.body.followup_date); }

        if (disposition_type === 'Discharged') { sets.push(`discharge_time=$${i++}`); vals.push(nowIso); }

        vals.push(visit_id); const idIdx = i++;

        vals.push(tenantId); const tIdx = i;



        await pool.query(

            `UPDATE emergency_visits SET ${sets.join(',')} WHERE id=$${idIdx} AND tenant_id=$${tIdx}`, vals);



        // Free the ED bed on terminal dispositions.

        if (visit.assigned_bed) {

            await pool.query(

                "UPDATE emergency_beds SET status='Available', current_patient_id=0 WHERE bed_name=$1 AND tenant_id=$2",

                [visit.assigned_bed, tenantId]);

        }



        // ADT handoff (E5 inpatient): admit -> create an Emergency admission, tenant-scoped.

        let admission = null;

        if (disposition_type === 'Admitted') {

            const admDept = req.body.admission_department || 'Emergency';

            const admDoctor = req.body.admitting_doctor || visit.assigned_doctor || '';

            const diag = req.body.diagnosis || visit.chief_complaint_ar || visit.chief_complaint || '';

            try {

                admission = (await pool.query(

                    `INSERT INTO admissions (patient_id, patient_name, admission_type, admitting_doctor, attending_doctor, department, diagnosis, status, tenant_id, facility_id)

                     VALUES ($1,$2,'Emergency',$3,$3,$4,$5,'Active',$6,$7) RETURNING id`,

                    [visit.patient_id, visit.patient_name, admDoctor, admDept, diag, tenantId, facilityId])).rows[0];

            } catch (admErr) {

                // Admission table shape can vary; never fail the disposition on the handoff insert.

                console.error('ER->ADT handoff insert error:', admErr.message);

            }

        }



        logAudit(req.session.user?.id, req.session.user?.display_name, 'ER_DISPOSITION', 'Emergency',

            `Disposition ${disposition_type} (status ${newStatus}) for visit #${visit_id}${admission ? ` -> admission #${admission.id}` : ''}`, req.ip);



        res.json({ success: true, visit_id, disposition_type, status: newStatus, phase: 'Disposition',

            admission_id: admission ? admission.id : null });

    } catch (e) {

        if (e.e7Status) return res.status(e.e7Status).json({ error: e.message });

        res.status(500).json({ error: 'Server error' });

    }

});


    return router;
}
