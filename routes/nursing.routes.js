const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeNursingRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, nursingScores, specialtyScores }) {
    const router = express.Router();
router.get('/api/nursing/vitals', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        let q = 'SELECT * FROM nursing_vitals';

        let params = [];

        if (tenantId) {

            q += ' WHERE tenant_id=$1';

            params.push(tenantId);

        }

        q += ' ORDER BY id DESC LIMIT 100';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/nursing/vitals/:patientId', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        if (tenantId) {

            const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [req.params.patientId, tenantId]);

            if (patientCheck.rows.length === 0) return res.status(404).json({ error: 'Patient not found' });

        }

        let q = 'SELECT * FROM nursing_vitals WHERE patient_id=$1';

        let params = [req.params.patientId];

        if (tenantId) {

            q += ' AND tenant_id=$2';

            params.push(tenantId);

        }

        q += ' ORDER BY id DESC LIMIT 1';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/nursing/vitals', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, patient_name, bp, temp, weight, height, pulse, o2_sat, respiratory_rate, blood_sugar, chronic_diseases, current_medications, allergies, notes } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (tenantId) {

            const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);

            if (patientCheck.rows.length === 0) return res.status(404).json({ error: 'Patient not found' });

        }

        await pool.query('INSERT INTO nursing_vitals (patient_id, patient_name, bp, temp, weight, height, pulse, o2_sat, respiratory_rate, blood_sugar, chronic_diseases, current_medications, allergies, notes, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)',

            [patient_id, patient_name || '', bp || '', temp || 0, weight || 0, height || 0, pulse || 0, o2_sat || 0, respiratory_rate || 0, blood_sugar || 0, chronic_diseases || '', current_medications || '', allergies || '', notes || '', tenantId || null, facilityId || null]);



        let updateQ = 'UPDATE patients SET status=$1 WHERE id=$2';

        let updateParams = ['Waiting', patient_id];

        if (tenantId) {

            updateQ += ' AND tenant_id=$3';

            updateParams.push(tenantId);

        }

        await pool.query(updateQ, updateParams);

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/nursing/pain-assessment', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const {

            patient_id, patient_name, admission_id,

            pain_scale,        // 'NRS' | 'VAS' | 'FLACC' | 'FACES'

            pain_score,        // 0-10

            pain_location,     // موقع الألم

            pain_character,    // طبيعة الألم (حاد، ناري، ضاغط...)

            pain_radiation,    // انتشار الألم

            pain_onset,        // متى بدأ

            pain_duration,     // المدة

            aggravating_factors,

            relieving_factors,

            current_analgesia, // مسكنات حالية

            pain_goal,         // هدف السيطرة على الألم

            reassessment_time, // وقت إعادة التقييم

            notes

        } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!patient_id) return res.status(400).json({ error: 'patient_id required' });

        if (pain_score === undefined || pain_score === null || pain_score < 0 || pain_score > 10) {

            return res.status(400).json({ error: 'pain_score must be 0-10' });

        }

        const pOwn = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

        if (!pOwn) return res.status(404).json({ error: 'Patient not found' });

        const result = await pool.query(

            `INSERT INTO nursing_pain_assessments

             (patient_id, patient_name, admission_id, pain_scale, pain_score, pain_location,

              pain_character, pain_radiation, pain_onset, pain_duration, aggravating_factors,

              relieving_factors, current_analgesia, pain_goal, reassessment_time, notes,

              assessed_by, assessed_at, tenant_id, facility_id)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,NOW(),$18,$19)

             RETURNING id`,

            [patient_id, patient_name || '', admission_id || null,

             pain_scale || 'NRS', parseInt(pain_score), pain_location || '',

             pain_character || '', pain_radiation || '', pain_onset || '',

             pain_duration || '', aggravating_factors || '',

             relieving_factors || '', current_analgesia || '',

             pain_goal || 3, reassessment_time || null, notes || '',

             req.session.user.name, tenantId, facilityId || null]

        );

        // Critical pain alert if score >= 7

        if (parseInt(pain_score) >= 7) {

            await pool.query(

                `INSERT INTO notifications (user_id, title, title_ar, body, body_ar, type, tenant_id, created_at)

                 SELECT id, 'Critical Pain Alert', 'تنبيه ألم حاد',

                        'Patient pain score ${pain_score}/10 — immediate attention required',

                        'درجة ألم المريض ${pain_score}/10 — مطلوب تدخل فوري',

                        'clinical_alert', $1, NOW()

                 FROM system_users WHERE role IN ('doctor','nursing') AND tenant_id=$1 LIMIT 5`,

                [tenantId]

            ).catch(() => {}); // non-fatal

        }

        logAudit(req.session.user.id, req.session.user.name, 'NURSING_PAIN_ASSESSMENT', 'Nursing',

            `Pain score ${pain_score}/10 (${pain_scale}) for patient #${patient_id}`, req.ip);

        res.json({ id: result.rows[0].id, pain_score, critical: parseInt(pain_score) >= 7, success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/nursing/pain-history/:patientId', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const pOwn = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [req.params.patientId, tenantId])).rows[0];

        if (!pOwn) return res.status(404).json({ error: 'Patient not found' });

        const records = (await pool.query(

            `SELECT * FROM nursing_pain_assessments WHERE patient_id=$1 AND tenant_id=$2

             ORDER BY assessed_at DESC LIMIT 50`,

            [req.params.patientId, tenantId]

        )).rows;

        res.json(records);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/nursing/scores', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { patient_id, score_type, observations, notes } = req.body || {};

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' });

        const type = String(score_type || '').trim().toLowerCase();

        if (!['morse', 'braden', 'news', 'pain'].includes(type)) {

            return res.status(422).json({ error: 'Invalid score_type (morse|braden|news|pain)' });

        }

        // Right patient, tenant-scoped.

        const pat = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

        if (!pat) return res.status(404).json({ error: 'Patient not found' });



        const obs = observations || {};

        let computed;

        if (type === 'morse') computed = nursingScores.computeMorseFallRisk(obs);

        else if (type === 'braden') computed = nursingScores.computeBraden(obs);

        else if (type === 'news') computed = nursingScores.computeNEWS(obs);

        else computed = nursingScores.computePainBand(obs.pain != null ? obs.pain : obs.score);



        // Incomplete Braden => fail-closed 422 (never store a partial pressure-ulcer score).

        if (type === 'braden' && (computed.score == null || computed.band === 'Incomplete')) {

            return res.status(422).json({ error: computed.error || 'Incomplete Braden subscales', band: 'Incomplete', incomplete: true });

        }



        const uid = req.session.user?.id;

        const uname = req.session.user?.name || req.session.user?.display_name || '';

        const result = await pool.query(

            `INSERT INTO nursing_scores

               (tenant_id, facility_id, patient_id, score_type, score, band, inputs_json, recorded_by, recorded_by_name, notes)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,

            [tenantId, facilityId || null, patient_id, type, computed.score, computed.band || '',

             JSON.stringify(obs).slice(0, 4000), uid || null, uname, notes || '']);

        logAudit(uid, uname, 'NURSING_SCORE', 'Nursing',

            `${type} score ${computed.score} (${computed.band}) for patient #${patient_id} | tenant #${tenantId}`, req.ip);

        res.json({ score: computed.score, band: computed.band, components: computed.components || null, record: result.rows[0] });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/nursing/care-plans', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        let q = 'SELECT * FROM nursing_care_plans';

        let params = [];

        if (tenantId) {

            q += ' WHERE tenant_id=$1';

            params.push(tenantId);

        }

        q += ' ORDER BY created_at DESC';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/nursing/care-plans', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, patient_name, diagnosis, priority, goals, interventions, expected_outcomes } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (tenantId) {

            const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);

            if (patientCheck.rows.length === 0) return res.status(404).json({ error: 'Patient not found' });

        }

        const result = await pool.query('INSERT INTO nursing_care_plans (patient_id, patient_name, diagnosis, priority, goals, interventions, expected_outcomes, nurse, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',

            [patient_id, patient_name || '', diagnosis || '', priority || 'Medium', goals || '', interventions || '', expected_outcomes || '', req.session.user.name, tenantId || null, facilityId || null]);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/nursing/assessments', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        let q;

        let params = [];

        if (tenantId) {

            q = 'SELECT * FROM nursing_assessments WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 50';

            params.push(tenantId);

        } else {

            q = 'SELECT * FROM nursing_assessments ORDER BY created_at DESC LIMIT 50';

        }

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/nursing/assessments', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { patient_id, patient_name, assessment_type, pain_score, gcs_score, shift, notes } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        if (tenantId) {

            const patientCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId]);

            if (patientCheck.rows.length === 0) return res.status(404).json({ error: 'Patient not found' });

        }

        // item 2: never store a CLIENT-sent fall_risk/Braden score as authoritative. The pain band is

        // re-derived SERVER-SIDE from the raw 0–10 pain observation; authoritative Morse/Braden/NEWS

        // scores must be computed via POST /api/nursing/scores (server-side engine) — so they are

        // persisted here as 0 (not trusted) and the client score/band fields are ignored.

        const pain = nursingScores.computePainBand(pain_score);

        // GCS total: absent stays NULL (never a reassuring default 15); garbage/out-of-range 422s.

        const gcsP = specialtyScores.parseOptionalInt(gcs_score, 3, 15, 'gcs_score');

        if (!gcsP.ok) return res.status(422).json({ error: gcsP.error });

        const result = await pool.query('INSERT INTO nursing_assessments (patient_id, patient_name, assessment_type, fall_risk_score, braden_score, pain_score, gcs_score, nurse, shift, notes, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *',

            [patient_id, patient_name || '', assessment_type || 'General', 0, 0, pain.score, gcsP.value, req.session.user.name, shift || 'Morning', notes || '', tenantId || null, facilityId || null]);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/nursing/assessment', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { patient_id, pain_scale, notes } = req.body;

        const { tenantId } = getRequestTenantContext(req);

        if (!tenantId) return res.status(403).json({ error: 'Tenant scope required' });

        // item 2: do NOT trust client-sent fall_risk_score/braden_score as authoritative scores.

        // The pain band is computed SERVER-SIDE from the raw numeric pain_scale; authoritative

        // Morse/Braden/NEWS scoring goes through POST /api/nursing/scores (server-derived).

        const pain = nursingScores.computePainBand(pain_scale);

        // item 3: SELECT/UPDATE carry explicit AND tenant_id=$N so a cross-tenant write is impossible.

        const vitals = (await pool.query(

            'SELECT id FROM nursing_vitals WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC LIMIT 1',

            [patient_id, tenantId])).rows[0];

        if (vitals) {

            await pool.query('UPDATE nursing_vitals SET notes=$1 WHERE id=$2 AND tenant_id=$3', [

                JSON.stringify({ pain_scale: pain.score, pain_band: pain.band, notes, assessed_at: new Date().toISOString() }),

                vitals.id, tenantId

            ]);

        }

        res.json({ success: true, pain_score: pain.score, pain_band: pain.band });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/nursing/triage', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, patient_name, triage_level, pain_score, chief_complaint, notes, visit_id } = req.body;

        const { tenantId } = getRequestTenantContext(req);



        // Verify patient ownership

        if (patient_id && tenantId) {

            const patientCheck = (await pool.query('SELECT id FROM patients WHERE id = $1 AND tenant_id = $2', [patient_id, tenantId])).rows[0];

            if (!patientCheck) return res.status(403).json({ error: 'Invalid patient context or access denied' });

        }



        // Verify visit ownership

        if (visit_id && tenantId) {

            const visitCheck = (await pool.query('SELECT id FROM emergency_visits WHERE id = $1 AND tenant_id = $2', [visit_id, tenantId])).rows[0];

            if (!visitCheck) return res.status(403).json({ error: 'Invalid visit context or access denied' });

        }



        // Update visit lifecycle if visit_id provided

        if (visit_id) {

            await pool.query(

                'UPDATE visit_lifecycle SET status=$1, triage_at=CURRENT_TIMESTAMP, triage_level=$2, pain_score=$3 WHERE id=$4',

                ['triage', triage_level, pain_score, visit_id]

            );

        }



        // Also store in nursing vitals if that table exists

        try {

            const updateVitalsQ = tenantId

                ? "UPDATE nursing_vitals SET triage_level=$1, pain_score=$2 WHERE patient_id=$3 AND tenant_id=$4 AND created_at::date = CURRENT_DATE"

                : "UPDATE nursing_vitals SET triage_level=$1, pain_score=$2 WHERE patient_id=$3 AND created_at::date = CURRENT_DATE";

            const updateVitalsParams = tenantId

                ? [triage_level, pain_score, patient_id, tenantId]

                : [triage_level, pain_score, patient_id];

            await pool.query(updateVitalsQ, updateVitalsParams);

        } catch (e) { /* table may not have these columns yet */ }



        logAudit(req.session.user?.id, req.session.user?.display_name, 'SUBMIT_TRIAGE', 'Nursing', `Submitted triage for patient #${patient_id} (Triage Level: ${triage_level})`, req.ip);

        res.json({ success: true, triage_level, pain_score });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/nursing/risk-assessment', requireAuth, requireRole('nursing', 'doctor'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId: tid } = getRequestTenantContext(req);

        const { patient_id, admission_id, assessment_type, total_score, risk_level, details } = req.body;

        if (!patient_id || !assessment_type || total_score === undefined || !risk_level) {

            return res.status(400).json({ error: 'patient_id, assessment_type, total_score, and risk_level are required' });

        }



        // IDOR check

        const patCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [parseInt(patient_id), tid]);

        if (!patCheck.rows.length) {

            return res.status(403).json({ error: 'Patient access denied' });

        }



        const r = await pool.query(`

            INSERT INTO nursing_risk_assessments (patient_id, admission_id, assessment_type, total_score, risk_level, details, assessed_by, tenant_id)

            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *

        `, [parseInt(patient_id), admission_id ? parseInt(admission_id) : null, assessment_type, parseInt(total_score), risk_level, JSON.stringify(details || {}), req.session.user.display_name || req.session.user.name, tid]);



        logAudit(req.session.user.id, req.session.user.display_name || req.session.user.name, 'CREATE_NURSING_RISK_ASSESSMENT', 'Nursing', 

            `Recorded ${assessment_type} for patient #${patient_id} (Score: ${total_score}, Risk: ${risk_level})`, tid);



        res.json(r.rows[0]);

    } catch (e) {

        res.status(500).json({ error: e.message });

    }

});

router.get('/api/nursing/risk-assessments/:patientId', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId: tid } = getRequestTenantContext(req);

        const pid = parseInt(req.params.patientId);



        // IDOR check

        const patCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tid]);

        if (!patCheck.rows.length) {

            return res.status(403).json({ error: 'Patient access denied' });

        }



        const r = await pool.query('SELECT * FROM nursing_risk_assessments WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC', [pid, tid]);

        res.json(r.rows);

    } catch (e) {

        res.status(500).json({ error: e.message });

    }

});

router.get('/api/nursing/risk-assessments', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId: tid } = getRequestTenantContext(req);

        const r = await pool.query(`

            SELECT r.*, p.name_ar, p.name_en, p.file_number 

            FROM nursing_risk_assessments r

            JOIN patients p ON r.patient_id = p.id

            WHERE r.tenant_id = $1

            ORDER BY r.id DESC

        `, [tid]);

        res.json(r.rows);

    } catch (e) {

        res.status(500).json({ error: e.message });

    }

});

router.get('/api/nursing/io/:patientId', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const tenantId = req.user?.tenant_id;

        const pid = parseInt(req.params.patientId, 10);

        const date = req.query.date || new Date().toISOString().slice(0, 10);

        const whereClause = tenantId

            ? 'WHERE ni.patient_id=$1 AND ni.tenant_id=$2 AND ni.created_at::date=$3'

            : 'WHERE ni.patient_id=$1 AND ni.created_at::date=$2';

        const params = tenantId ? [pid, tenantId, date] : [pid, date];

        const r = await pool.query(

            `SELECT * FROM nursing_io ni ${whereClause} ORDER BY ni.created_at ASC`,

            params

        );

        const entries = r.rows;

        const intake  = entries.filter(e => e.entry_type === 'intake').reduce((s, e) => s + (e.volume_ml || 0), 0);

        const output  = entries.filter(e => e.entry_type === 'output').reduce((s, e) => s + (e.volume_ml || 0), 0);

        res.json({ entries, intake, output, balance: intake - output });

    } catch (e) { console.error('[NS I&O GET]', e); res.status(500).json({ error: e.message }); }

});

router.post('/api/nursing/io', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const tenantId = req.user?.tenant_id;

        const { patient_id, entry_type, source, volume_ml, entry_time, shift, notes } = req.body;

        if (!patient_id || !entry_type || !source || !volume_ml) {

            return res.status(400).json({ error: 'patient_id, entry_type, source, volume_ml required' });

        }

        if (!['intake', 'output'].includes(entry_type)) {

            return res.status(400).json({ error: 'entry_type must be intake or output' });

        }

        const r = await pool.query(

            `INSERT INTO nursing_io (tenant_id, patient_id, entry_type, source, volume_ml, entry_time, shift, nurse_name, notes)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,

            [tenantId, patient_id, entry_type, source, parseInt(volume_ml, 10),

             entry_time || new Date().toTimeString().slice(0,5),

             shift || 'General',

             req.user?.name || req.user?.username || 'Nurse',

             notes || '']

        );

        res.json(r.rows[0]);

    } catch (e) { console.error('[NS I&O POST]', e); res.status(500).json({ error: e.message }); }

});

router.get('/api/nursing/handover/:patientId', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const tenantId = req.user?.tenant_id;

        const pid = parseInt(req.params.patientId, 10);

        const whereClause = tenantId ? 'WHERE patient_id=$1 AND tenant_id=$2' : 'WHERE patient_id=$1';

        const params = tenantId ? [pid, tenantId] : [pid];

        const r = await pool.query(

            `SELECT * FROM nursing_handover ${whereClause} ORDER BY created_at DESC LIMIT 10`,

            params

        );

        res.json(r.rows);

    } catch (e) { console.error('[NS Handover GET]', e); res.status(500).json({ error: e.message }); }

});

router.post('/api/nursing/handover', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const tenantId = req.user?.tenant_id;

        const { patient_id, sbar_s, sbar_b, sbar_a, sbar_r, shift, news2_score } = req.body;

        if (!patient_id) return res.status(400).json({ error: 'patient_id required' });

        const r = await pool.query(

            `INSERT INTO nursing_handover (tenant_id, patient_id, nurse_name, shift, sbar_s, sbar_b, sbar_a, sbar_r, news2_score)

             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,

            [tenantId, patient_id,

             req.user?.name || req.user?.username || 'Nurse',

             shift || 'General',

             sbar_s || '', sbar_b || '', sbar_a || '', sbar_r || '',

             parseInt(news2_score, 10) || 0]

        );

        res.json(r.rows[0]);

    } catch (e) { console.error('[NS Handover POST]', e); res.status(500).json({ error: e.message }); }

});


    return router;
}
