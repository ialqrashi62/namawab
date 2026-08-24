const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeSurgeriesRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, E12_WHO_ORDER, e12IsValidSurgeryTransition, e12NormalizeStatus }) {
    const router = express.Router();
router.get('/api/surgeries', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { status, date } = req.query;

        const { tenantId } = getRequestTenantContext(req);

        let q = 'SELECT * FROM surgeries';

        const params = [];

        const conds = [];

        if (tenantId) {

            params.push(tenantId);

            conds.push(`tenant_id = $${params.length}`);

        }

        if (status) { params.push(status); conds.push(`status = $${params.length}`); }

        if (date) { params.push(date); conds.push(`scheduled_date = $${params.length}`); }

        if (conds.length) q += ' WHERE ' + conds.join(' AND ');

        q += ' ORDER BY scheduled_date DESC, scheduled_time DESC';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/surgeries/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const q = tenantId

            ? 'SELECT * FROM surgeries WHERE id = $1 AND tenant_id = $2'

            : 'SELECT * FROM surgeries WHERE id = $1';

        const params = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const row = (await pool.query(q, params)).rows[0];

        if (!row) return res.status(404).json({ error: 'Surgery not found' });

        res.json(row);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/surgeries', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, patient_name, surgeon_id, surgeon_name, anesthetist_id, anesthetist_name,

            procedure_name, procedure_name_ar, surgery_type, operating_room, priority,

            scheduled_date, scheduled_time, estimated_duration, notes } = req.body;



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



        const result = await pool.query(

            `INSERT INTO surgeries (patient_id, patient_name, surgeon_id, surgeon_name, anesthetist_id, anesthetist_name,

             procedure_name, procedure_name_ar, surgery_type, operating_room, priority,

             scheduled_date, scheduled_time, estimated_duration, notes, tenant_id, facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING id`,

            [patient_id, patient_name || '', surgeon_id || 0, surgeon_name || '', anesthetist_id || 0, anesthetist_name || '',

                procedure_name || '', procedure_name_ar || '', surgery_type || 'Elective', operating_room || '',

                priority || 'Normal', scheduled_date || '', scheduled_time || '', estimated_duration || 60, notes || '',

                tenantId, facilityId]);



        const selectQ = tenantId

            ? 'SELECT * FROM surgeries WHERE id = $1 AND tenant_id = $2'

            : 'SELECT * FROM surgeries WHERE id = $1';

        const selectParams = tenantId ? [result.rows[0].id, tenantId] : [result.rows[0].id];



        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CREATE_SURGERY', 'Surgery', `Scheduled surgery for patient ${patient_name || patient_id}`, req.ip);

        res.json((await pool.query(selectQ, selectParams)).rows[0]);

    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/surgeries/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);



        // Verify surgery ownership first

        const checkQ = tenantId

            ? 'SELECT id FROM surgeries WHERE id = $1 AND tenant_id = $2'

            : 'SELECT id FROM surgeries WHERE id = $1';

        const checkParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const surgeryCheck = (await pool.query('SELECT * FROM surgeries WHERE id=$1' + (tenantId ? ' AND tenant_id=$2' : ''), checkParams)).rows[0];

        if (!surgeryCheck) return res.status(404).json({ error: 'Surgery not found' });



        const { status, operating_room, scheduled_date, scheduled_time, actual_start, actual_end, post_op_notes, preop_status } = req.body;

        // E12 HARDENING: status changes must obey the surgery state machine + WHO checklist gating.

        // This closes the legacy bypass where the UI flipped status directly to InProgress/Completed.

        if (status !== undefined) {

            const current = e12NormalizeStatus(surgeryCheck.status || 'Scheduled');

            const target = e12NormalizeStatus(status);

            if (target !== current) {

                if (!e12IsValidSurgeryTransition(current, target)) {

                    return res.status(409).json({ error: `Invalid surgery status transition from "${current}" to "${target}"` });

                }

                if (target === 'InProgress') {

                    const clQ = tenantId ? 'SELECT state FROM who_surgical_checklist WHERE surgery_id=$1 AND tenant_id=$2' : 'SELECT state FROM who_surgical_checklist WHERE surgery_id=$1';

                    const cl = (await pool.query(clQ, tenantId ? [req.params.id, tenantId] : [req.params.id])).rows[0];

                    const reachedTimeOut = cl && (E12_WHO_ORDER.indexOf(cl.state) >= E12_WHO_ORDER.indexOf('Time-Out'));

                    if (!reachedTimeOut) return res.status(409).json({ error: 'WHO Time-Out must be completed before incision (InProgress)' });

                }

                if (target === 'Completed') {

                    const clQ = tenantId ? 'SELECT state FROM who_surgical_checklist WHERE surgery_id=$1 AND tenant_id=$2' : 'SELECT state FROM who_surgical_checklist WHERE surgery_id=$1';

                    const cl = (await pool.query(clQ, tenantId ? [req.params.id, tenantId] : [req.params.id])).rows[0];

                    if (!cl || cl.state !== 'Completed') return res.status(409).json({ error: 'WHO Sign-Out must be completed before the surgery can be Completed' });

                }

            }

        }

        const fields = []; const params = []; let idx = 1;

        if (status !== undefined) { fields.push(`status=$${idx++}`); params.push(e12NormalizeStatus(status)); }

        if (operating_room !== undefined) { fields.push(`operating_room=$${idx++}`); params.push(operating_room); }

        if (scheduled_date !== undefined) { fields.push(`scheduled_date=$${idx++}`); params.push(scheduled_date); }

        if (scheduled_time !== undefined) { fields.push(`scheduled_time=$${idx++}`); params.push(scheduled_time); }

        if (actual_start !== undefined) { fields.push(`actual_start=$${idx++}`); params.push(actual_start); }

        if (actual_end !== undefined) { fields.push(`actual_end=$${idx++}`); params.push(actual_end); }

        if (post_op_notes !== undefined) { fields.push(`post_op_notes=$${idx++}`); params.push(post_op_notes); }

        if (preop_status !== undefined) { fields.push(`preop_status=$${idx++}`); params.push(preop_status); }

        if (fields.length) {

            params.push(req.params.id);

            const whereClause = tenantId ? `WHERE id=$${idx} AND tenant_id=$${idx+1}` : `WHERE id=$${idx}`;

            if (tenantId) params.push(tenantId);

            await pool.query(`UPDATE surgeries SET ${fields.join(',')} ${whereClause}`, params);

        }



        const selectQ = tenantId

            ? 'SELECT * FROM surgeries WHERE id = $1 AND tenant_id = $2'

            : 'SELECT * FROM surgeries WHERE id = $1';

        const selectParams = tenantId ? [req.params.id, tenantId] : [req.params.id];



        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'UPDATE_SURGERY', 'Surgery', `Updated surgery ${req.params.id}`, req.ip);

        res.json((await pool.query(selectQ, selectParams)).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.delete('/api/surgeries/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);



        // Verify surgery ownership first

        const checkQ = tenantId

            ? 'SELECT id FROM surgeries WHERE id = $1 AND tenant_id = $2'

            : 'SELECT id FROM surgeries WHERE id = $1';

        const checkParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const surgeryCheck = (await pool.query(checkQ, checkParams)).rows[0];

        if (!surgeryCheck) return res.status(404).json({ error: 'Surgery not found' });



        const deleteParams1 = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const tenantFilter = tenantId ? ' AND tenant_id=$2' : '';



        await pool.query(`DELETE FROM surgery_preop_tests WHERE surgery_id=$1${tenantFilter}`, deleteParams1);

        await pool.query(`DELETE FROM surgery_preop_assessments WHERE surgery_id=$1${tenantFilter}`, deleteParams1);

        await pool.query(`DELETE FROM surgery_anesthesia_records WHERE surgery_id=$1${tenantFilter}`, deleteParams1);

        await pool.query(`DELETE FROM consent_forms WHERE surgery_id=$1${tenantFilter}`, deleteParams1);

        await pool.query(`DELETE FROM surgeries WHERE id=$1${tenantFilter}`, deleteParams1);



        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'DELETE_SURGERY', 'Surgery', `Deleted/cancelled surgery ${req.params.id}`, req.ip);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/surgeries/:id/preop', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);



        // Verify surgery ownership first

        const checkQ = tenantId

            ? 'SELECT id FROM surgeries WHERE id = $1 AND tenant_id = $2'

            : 'SELECT id FROM surgeries WHERE id = $1';

        const checkParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const surgeryCheck = (await pool.query(checkQ, checkParams)).rows[0];

        if (!surgeryCheck) return res.status(404).json({ error: 'Surgery not found' });



        const queryText = tenantId

            ? 'SELECT * FROM surgery_preop_assessments WHERE surgery_id=$1 AND tenant_id=$2'

            : 'SELECT * FROM surgery_preop_assessments WHERE surgery_id=$1';

        const queryParams = tenantId ? [req.params.id, tenantId] : [req.params.id];



        res.json((await pool.query(queryText, queryParams)).rows[0] || null);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/surgeries/:id/preop', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);



        // Verify surgery ownership first

        const checkQ = tenantId

            ? 'SELECT id, patient_id FROM surgeries WHERE id = $1 AND tenant_id = $2'

            : 'SELECT id, patient_id FROM surgeries WHERE id = $1';

        const checkParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const surgery = (await pool.query(checkQ, checkParams)).rows[0];

        if (!surgery) return res.status(404).json({ error: 'Surgery not found' });



        const pid = surgery.patient_id || 0;

        const s = req.body;



        const existingQ = tenantId

            ? 'SELECT id FROM surgery_preop_assessments WHERE surgery_id=$1 AND tenant_id=$2'

            : 'SELECT id FROM surgery_preop_assessments WHERE surgery_id=$1';

        const existingParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const existing = (await pool.query(existingQ, existingParams)).rows[0];



        // Calculate overall status

        const checkItems = [s.npo_confirmed, s.allergies_reviewed, s.medications_reviewed, s.labs_reviewed,

        s.imaging_reviewed, s.blood_type_confirmed, s.consent_signed, s.anesthesia_clearance, s.nursing_assessment];

        const completedCount = checkItems.filter(x => x).length;

        const overall = completedCount === checkItems.length ? 'Complete' : completedCount > 0 ? 'In Progress' : 'Incomplete';



        if (existing) {

            const updateQ = tenantId

                ? `UPDATE surgery_preop_assessments SET npo_confirmed=$1, allergies_reviewed=$2, allergies_notes=$3,

                    medications_reviewed=$4, medications_notes=$5, labs_reviewed=$6, labs_notes=$7, imaging_reviewed=$8, imaging_notes=$9,

                    blood_type_confirmed=$10, blood_reserved=$11, consent_signed=$12, anesthesia_clearance=$13,

                    nursing_assessment=$14, nursing_notes=$15, cardiac_clearance=$16, cardiac_notes=$17,

                    pulmonary_clearance=$18, infection_screening=$19, dvt_prophylaxis=$20, overall_status=$21, assessed_by=$22

                    WHERE surgery_id=$23 AND tenant_id=$24`

                : `UPDATE surgery_preop_assessments SET npo_confirmed=$1, allergies_reviewed=$2, allergies_notes=$3,

                    medications_reviewed=$4, medications_notes=$5, labs_reviewed=$6, labs_notes=$7, imaging_reviewed=$8, imaging_notes=$9,

                    blood_type_confirmed=$10, blood_reserved=$11, consent_signed=$12, anesthesia_clearance=$13,

                    nursing_assessment=$14, nursing_notes=$15, cardiac_clearance=$16, cardiac_notes=$17,

                    pulmonary_clearance=$18, infection_screening=$19, dvt_prophylaxis=$20, overall_status=$21, assessed_by=$22

                    WHERE surgery_id=$23`;

            const updateParams = [s.npo_confirmed ? 1 : 0, s.allergies_reviewed ? 1 : 0, s.allergies_notes || '',

                s.medications_reviewed ? 1 : 0, s.medications_notes || '', s.labs_reviewed ? 1 : 0, s.labs_notes || '',

                s.imaging_reviewed ? 1 : 0, s.imaging_notes || '', s.blood_type_confirmed ? 1 : 0, s.blood_reserved ? 1 : 0,

                s.consent_signed ? 1 : 0, s.anesthesia_clearance ? 1 : 0, s.nursing_assessment ? 1 : 0, s.nursing_notes || '',

                s.cardiac_clearance ? 1 : 0, s.cardiac_notes || '', s.pulmonary_clearance ? 1 : 0,

                s.infection_screening ? 1 : 0, s.dvt_prophylaxis ? 1 : 0, overall, req.session.user?.display_name || req.session.user?.name || '', req.params.id];

            if (tenantId) updateParams.push(tenantId);

            await pool.query(updateQ, updateParams);

        } else {

            await pool.query(`INSERT INTO surgery_preop_assessments (surgery_id, patient_id, npo_confirmed, allergies_reviewed, allergies_notes,

                medications_reviewed, medications_notes, labs_reviewed, labs_notes, imaging_reviewed, imaging_notes,

                blood_type_confirmed, blood_reserved, consent_signed, anesthesia_clearance,

                nursing_assessment, nursing_notes, cardiac_clearance, cardiac_notes,

                pulmonary_clearance, infection_screening, dvt_prophylaxis, overall_status, assessed_by, tenant_id, facility_id)

                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)`,

                [req.params.id, pid, s.npo_confirmed ? 1 : 0, s.allergies_reviewed ? 1 : 0, s.allergies_notes || '',

                s.medications_reviewed ? 1 : 0, s.medications_notes || '', s.labs_reviewed ? 1 : 0, s.labs_notes || '',

                s.imaging_reviewed ? 1 : 0, s.imaging_notes || '', s.blood_type_confirmed ? 1 : 0, s.blood_reserved ? 1 : 0,

                s.consent_signed ? 1 : 0, s.anesthesia_clearance ? 1 : 0, s.nursing_assessment ? 1 : 0, s.nursing_notes || '',

                s.cardiac_clearance ? 1 : 0, s.cardiac_notes || '', s.pulmonary_clearance ? 1 : 0,

                s.infection_screening ? 1 : 0, s.dvt_prophylaxis ? 1 : 0, overall, req.session.user?.display_name || req.session.user?.name || '', tenantId, facilityId]);

        }



        // Update surgery preop_status

        const updateSurgeryQ = tenantId

            ? 'UPDATE surgeries SET preop_status=$1 WHERE id=$2 AND tenant_id=$3'

            : 'UPDATE surgeries SET preop_status=$1 WHERE id=$2';

        const updateSurgeryParams = tenantId ? [overall, req.params.id, tenantId] : [overall, req.params.id];

        await pool.query(updateSurgeryQ, updateSurgeryParams);



        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'UPDATE_PREOP_ASSESSMENT', 'Surgery', `Updated preop assessment for surgery ${req.params.id}`, req.ip);



        const returnQ = tenantId

            ? 'SELECT * FROM surgery_preop_assessments WHERE surgery_id=$1 AND tenant_id=$2'

            : 'SELECT * FROM surgery_preop_assessments WHERE surgery_id=$1';

        const returnParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        res.json((await pool.query(returnQ, returnParams)).rows[0]);

    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/surgeries/:id/preop-tests', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);



        // Verify surgery ownership first

        const checkQ = tenantId

            ? 'SELECT id FROM surgeries WHERE id = $1 AND tenant_id = $2'

            : 'SELECT id FROM surgeries WHERE id = $1';

        const checkParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const surgeryCheck = (await pool.query(checkQ, checkParams)).rows[0];

        if (!surgeryCheck) return res.status(404).json({ error: 'Surgery not found' });



        const q = tenantId

            ? 'SELECT * FROM surgery_preop_tests WHERE surgery_id=$1 AND tenant_id=$2 ORDER BY id'

            : 'SELECT * FROM surgery_preop_tests WHERE surgery_id=$1 ORDER BY id';

        const params = tenantId ? [req.params.id, tenantId] : [req.params.id];

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/surgeries/:id/preop-tests', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);



        // Verify surgery ownership first

        const checkQ = tenantId

            ? 'SELECT id, patient_id FROM surgeries WHERE id = $1 AND tenant_id = $2'

            : 'SELECT id, patient_id FROM surgeries WHERE id = $1';

        const checkParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const surgery = (await pool.query(checkQ, checkParams)).rows[0];

        if (!surgery) return res.status(404).json({ error: 'Surgery not found' });



        const { test_type, test_name, notes } = req.body;

        const result = await pool.query(

            'INSERT INTO surgery_preop_tests (surgery_id, patient_id, test_type, test_name, notes, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',

            [req.params.id, surgery.patient_id || 0, test_type || 'Lab', test_name || '', notes || '', tenantId, facilityId]);



        const returnQ = tenantId

            ? 'SELECT * FROM surgery_preop_tests WHERE id=$1 AND tenant_id=$2'

            : 'SELECT * FROM surgery_preop_tests WHERE id=$1';

        const returnParams = tenantId ? [result.rows[0].id, tenantId] : [result.rows[0].id];



        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'CREATE_PREOP_TEST', 'Surgery', `Created preop test for surgery ${req.params.id}`, req.ip);

        res.json((await pool.query(returnQ, returnParams)).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/surgeries/:id/anesthesia', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);



        // Verify surgery ownership first

        const checkQ = tenantId

            ? 'SELECT id FROM surgeries WHERE id = $1 AND tenant_id = $2'

            : 'SELECT id FROM surgeries WHERE id = $1';

        const checkParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const surgeryCheck = (await pool.query(checkQ, checkParams)).rows[0];

        if (!surgeryCheck) return res.status(404).json({ error: 'Surgery not found' });



        const q = tenantId

            ? 'SELECT * FROM surgery_anesthesia_records WHERE surgery_id=$1 AND tenant_id=$2'

            : 'SELECT * FROM surgery_anesthesia_records WHERE surgery_id=$1';

        const params = tenantId ? [req.params.id, tenantId] : [req.params.id];

        res.json((await pool.query(q, params)).rows[0] || null);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/surgeries/:id/anesthesia', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId, facilityId } = getRequestTenantContext(req);



        // Verify surgery ownership first

        const checkQ = tenantId

            ? 'SELECT id, patient_id FROM surgeries WHERE id = $1 AND tenant_id = $2'

            : 'SELECT id, patient_id FROM surgeries WHERE id = $1';

        const checkParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const surgery = (await pool.query(checkQ, checkParams)).rows[0];

        if (!surgery) return res.status(404).json({ error: 'Surgery not found' });



        const a = req.body;

        const existingQ = tenantId

            ? 'SELECT id FROM surgery_anesthesia_records WHERE surgery_id=$1 AND tenant_id=$2'

            : 'SELECT id FROM surgery_anesthesia_records WHERE surgery_id=$1';

        const existingParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        const existing = (await pool.query(existingQ, existingParams)).rows[0];



        if (existing) {

            const updateQ = tenantId

                ? `UPDATE surgery_anesthesia_records SET anesthetist_name=$1, asa_class=$2, anesthesia_type=$3,

                    airway_assessment=$4, mallampati_score=$5, premedication=$6, induction_agents=$7, maintenance_agents=$8,

                    muscle_relaxants=$9, monitors_used=$10, iv_access=$11, fluid_given=$12, blood_loss_ml=$13,

                    complications=$14, recovery_notes=$15, notes=$16 WHERE surgery_id=$17 AND tenant_id=$18`

                : `UPDATE surgery_anesthesia_records SET anesthetist_name=$1, asa_class=$2, anesthesia_type=$3,

                    airway_assessment=$4, mallampati_score=$5, premedication=$6, induction_agents=$7, maintenance_agents=$8,

                    muscle_relaxants=$9, monitors_used=$10, iv_access=$11, fluid_given=$12, blood_loss_ml=$13,

                    complications=$14, recovery_notes=$15, notes=$16 WHERE surgery_id=$17`;

            const updateParams = [a.anesthetist_name || '', a.asa_class || 'ASA I', a.anesthesia_type || 'General',

                a.airway_assessment || '', a.mallampati_score || '', a.premedication || '', a.induction_agents || '',

                a.maintenance_agents || '', a.muscle_relaxants || '', a.monitors_used || '', a.iv_access || '',

                a.fluid_given || '', a.blood_loss_ml || 0, a.complications || '', a.recovery_notes || '', a.notes || '', req.params.id];

            if (tenantId) updateParams.push(tenantId);

            await pool.query(updateQ, updateParams);

        } else {

            await pool.query(`INSERT INTO surgery_anesthesia_records (surgery_id, patient_id, anesthetist_name, asa_class, anesthesia_type,

                airway_assessment, mallampati_score, premedication, induction_agents, maintenance_agents,

                muscle_relaxants, monitors_used, iv_access, fluid_given, blood_loss_ml,

                complications, recovery_notes, notes, tenant_id, facility_id)

                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,

                [req.params.id, surgery.patient_id || 0, a.anesthetist_name || '', a.asa_class || 'ASA I', a.anesthesia_type || 'General',

                a.airway_assessment || '', a.mallampati_score || '', a.premedication || '', a.induction_agents || '',

                a.maintenance_agents || '', a.muscle_relaxants || '', a.monitors_used || '', a.iv_access || '',

                a.fluid_given || '', a.blood_loss_ml || 0, a.complications || '', a.recovery_notes || '', a.notes || '', tenantId, facilityId]);

        }



        logAudit(req.session.user?.id, req.session.user?.display_name || '', 'UPDATE_ANESTHESIA_RECORD', 'Surgery', `Updated anesthesia record for surgery ${req.params.id}`, req.ip);



        const returnQ = tenantId

            ? 'SELECT * FROM surgery_anesthesia_records WHERE surgery_id=$1 AND tenant_id=$2'

            : 'SELECT * FROM surgery_anesthesia_records WHERE surgery_id=$1';

        const returnParams = tenantId ? [req.params.id, tenantId] : [req.params.id];

        res.json((await pool.query(returnQ, returnParams)).rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
