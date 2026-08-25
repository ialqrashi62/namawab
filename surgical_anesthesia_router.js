'use strict';
// Wave 109 — Surgical suite + Anesthesia + Perioperative safety (18 tables)
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_SURGERY_STATUS = ['scheduled','preop_in_progress','ready','in_progress','completed','cancelled','postponed','on_hold'];
const VALID_PRIORITY = ['elective','urgent','emergent','stat'];
const VALID_PHASE = ['sign_in','time_out','sign_out'];
const VALID_TIMEOUT_STATUS = ['in_progress','completed','paused','failed','aborted'];
const VALID_ASA_CLASS = ['1','2','3','4','5','6','E'];
const VALID_MALLAMPATI = ['1','2','3','4'];
const VALID_AIRWAY = ['normal','difficult_mask','difficult_intubation','fiberoptic_required','awake_intubation','cricothyrotomy','none_planned'];
const VALID_ANESTHESIA = ['general','regional','spinal','epidural','local','sedation','MAC','combined','tiva','none'];
const VALID_WOUND_STATUS = ['clean','granulating','infected','dehisced','necrotic','healing','dry','draining','packed','other'];
const VALID_DRAINAGE = ['serous','serosanguinous','sanguinous','purulent','bile','none'];
const VALID_APPROACH = ['open','laparoscopic','robotic','endoscopic','percutaneous','thoracoscopic','hybrid','other'];
const VALID_RISK = ['low','moderate','high','critical'];
const VALID_WHO_STATE = ['pending','completed','paused','failed'];

function asaMortality(asa) {
    const cls = String(asa).replace('E', '');
    const map = { '1': 0.06, '2': 0.13, '3': 0.4, '4': 4.6, '5': 24, '6': 51 };
    return map[cls] ?? null;
}

function mallampatiDifficulty(m) {
    const map = { '1': 'easy', '2': 'moderate', '3': 'difficult', '4': 'very_difficult' };
    return map[String(m)] || 'unknown';
}

function timeoutCompletion(completed) {
    if (!completed) return 0;
    const items = completed.split(',').map(s => s.trim()).filter(Boolean);
    return items.length;
}

function timeoutGate(missingItems, completionPct) {
    if (!missingItems || missingItems.trim() === '') {
        return completionPct >= 100 ? 'safe_to_proceed' : 'in_progress';
    }
    return 'blocked';
}

function woundHealing(status) {
    const map = { clean: 'good', granulating: 'good', healing: 'good', dry: 'good',
                  serous: 'normal', serosanguinous: 'normal',
                  infected: 'concerning', purulent: 'concerning',
                  dehisced: 'concerning', necrotic: 'severe', draining: 'monitor' };
    return map[status] || 'unknown';
}

function surgeryDuration(start, end) {
    if (!start || !end) return null;
    const ms = new Date(end) - new Date(start);
    return Math.round(ms / 60000);
}

function countSheetVariance(initial, final) {
    if (initial === undefined || final === undefined) return null;
    return parseInt(final) - parseInt(initial);
}

function airwayRisk(mallampati, asa) {
    const m = parseInt(mallampati);
    const a = parseInt(String(asa).replace('E', ''));
    let score = m;
    if (a >= 3) score += 1;
    if (a === 4 || a === 5) score += 1;
    if (score <= 2) return 'low';
    if (score <= 3) return 'moderate';
    if (score <= 4) return 'high';
    return 'very_high';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'surgical-anesthesia',
        endpoints: [
            'GET /surgeries',
            'POST /surgeries',
            'GET /surgeries/:id',
            'GET /encounters',
            'POST /encounters',
            'GET /anesthesia/asa',
            'POST /anesthesia/asa',
            'GET /anesthesia/records',
            'POST /anesthesia/records',
            'GET /anesthesia/preop',
            'POST /anesthesia/preop',
            'GET /preop-assessments',
            'POST /preop-assessments',
            'GET /count-sheets',
            'POST /count-sheets',
            'GET /implants',
            'POST /implants',
            'GET /timeouts',
            'POST /timeouts',
            'GET /who-checklist',
            'POST /who-checklist',
            'GET /wound-logs',
            'POST /wound-logs',
            'GET /intra-op-logs',
            'POST /intra-op-logs',
            'GET /robotic-logs',
            'POST /robotic-logs',
            'GET /time-logs',
            'POST /time-logs',
            'GET /asa-mortality',
            'GET /mallampati',
            'GET /airway-risk',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== SURGERIES =====
router.get('/surgeries', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { patient_id, status, priority, surgery_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_lookup FROM surgeries s LEFT JOIN patients p ON p.id = s.patient_id WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (status) { sql += ` AND s.status = $${params.length + 1}`; params.push(status); }
        if (priority) { sql += ` AND s.priority = $${params.length + 1}`; params.push(priority); }
        if (surgery_type) { sql += ` AND s.surgery_type = $${params.length + 1}`; params.push(surgery_type); }
        sql += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/surgeries/:id', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const r = await db.query(`SELECT s.*, p.full_name AS patient_lookup FROM surgeries s LEFT JOIN patients p ON p.id = s.patient_id WHERE s.tenant_id = $1 AND s.id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'surgery_not_found' });
        const surgery = r.rows[0];
        const counts = await db.query(`SELECT * FROM surgery_count_sheets WHERE surgery_id = $1 AND tenant_id = $2`, [req.params.id, req.tenantId]);
        const anes = await db.query(`SELECT * FROM surgery_anesthesia_records WHERE surgery_id = $1 AND tenant_id = $2`, [req.params.id, req.tenantId]);
        res.json({ ok: true, surgery, count_sheets: counts.rows, anesthesia_records: anes.rows, computed: { actual_duration_min: surgeryDuration(surgery.actual_start, surgery.actual_end) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/surgeries', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, anesthetist_id, procedure_name, procedure_name_ar, surgery_type, operating_room, priority, scheduled_date, scheduled_time, estimated_duration, status, preop_status, notes, post_op_notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!procedure_name) return res.status(400).json({ ok: false, error: 'procedure_name_required' });
        if (priority && !VALID_PRIORITY.includes(priority)) return res.status(400).json({ ok: false, error: 'invalid_priority' });
        if (status && !VALID_SURGERY_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (estimated_duration !== undefined && estimated_duration < 0) return res.status(400).json({ ok: false, error: 'invalid_duration' });

        const r = await db.query(
            `INSERT INTO surgeries (tenant_id, patient_id, surgeon_id, anesthetist_id, procedure_name, procedure_name_ar, surgery_type, operating_room, priority, scheduled_date, scheduled_time, estimated_duration, status, preop_status, notes, post_op_notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
            [req.tenantId, patient_id, surgeon_id || req.user?.id || null, anesthetist_id || null,
             procedure_name, procedure_name_ar || null, surgery_type || null, operating_room || null,
             priority || 'elective', scheduled_date || null, scheduled_time || null, estimated_duration ?? null,
             status || 'scheduled', preop_status || null, notes || null, post_op_notes || null]
        );
        res.status(201).json({ ok: true, surgery: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SURGERY ENCOUNTERS =====
router.get('/encounters', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { patient_id, status, surgical_approach, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT e.*, p.full_name AS patient_name FROM surgery_encounters e LEFT JOIN patients p ON p.id::text = e.patient_id WHERE e.tenant_id = $1`;
        if (patient_id) { sql += ` AND e.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (status) { sql += ` AND e.status = $${params.length + 1}`; params.push(status); }
        if (surgical_approach) { sql += ` AND e.surgical_approach = $${params.length + 1}`; params.push(surgical_approach); }
        sql += ` ORDER BY e.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/encounters', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, encounter_date, surgical_indication, pre_op_diagnosis, surgical_approach, anesthesia_type, operation_time_min, blood_loss_ml, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (surgical_approach && !VALID_APPROACH.includes(surgical_approach)) return res.status(400).json({ ok: false, error: 'invalid_approach' });
        if (anesthesia_type && !VALID_ANESTHESIA.includes(anesthesia_type)) return res.status(400).json({ ok: false, error: 'invalid_anesthesia' });
        if (operation_time_min !== undefined && operation_time_min < 0) return res.status(400).json({ ok: false, error: 'invalid_duration' });
        if (blood_loss_ml !== undefined && blood_loss_ml < 0) return res.status(400).json({ ok: false, error: 'invalid_blood_loss' });

        const r = await db.query(
            `INSERT INTO surgery_encounters (tenant_id, patient_id, surgeon_id, encounter_date, surgical_indication, pre_op_diagnosis, surgical_approach, anesthesia_type, operation_time_min, blood_loss_ml, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [String(req.tenantId), String(patient_id), surgeon_id ? String(surgeon_id) : (req.user?.id ? String(req.user.id) : null),
             encounter_date || new Date().toISOString(), surgical_indication || null, pre_op_diagnosis || null,
             surgical_approach || null, anesthesia_type || null, operation_time_min ?? null, blood_loss_ml ?? null,
             status || 'scheduled']
        );
        res.status(201).json({ ok: true, encounter: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ANESTHESIA ASA =====
router.get('/anesthesia/asa', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { patient_id, asa_class, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgery_asa_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (asa_class !== undefined) { sql += ` AND asa_class = $${params.length + 1}`; params.push(parseInt(asa_class)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/anesthesia/asa', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, assessed_by, asa_class, emergency, label, mortality_pct, recommendation } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!VALID_ASA_CLASS.includes(String(asa_class))) return res.status(400).json({ ok: false, error: 'invalid_asa_class' });
        const mortality = mortality_pct !== undefined ? parseFloat(mortality_pct) : asaMortality(asa_class);
        const finalLabel = label || `ASA ${asa_class}${emergency ? 'E' : ''}`;

        const r = await db.query(
            `INSERT INTO surgery_asa_assessments (tenant_id, patient_id, encounter_id, assessed_by, asa_class, emergency, label, mortality_pct, recommendation)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, assessed_by || req.user?.id || null,
             parseInt(asa_class), !!emergency, finalLabel, mortality, recommendation || null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0], computed: { auto_mortality_pct: mortality } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ANESTHESIA RECORDS (drugs + airway + monitors) =====
router.get('/anesthesia/records', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { surgery_id, anesthesia_type, asa_class, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgery_anesthesia_records WHERE tenant_id = $1`;
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(surgery_id); }
        if (anesthesia_type) { sql += ` AND anesthesia_type = $${params.length + 1}`; params.push(anesthesia_type); }
        if (asa_class) { sql += ` AND asa_class = $${params.length + 1}`; params.push(asa_class); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/anesthesia/records', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { surgery_id, patient_id, anesthetist_name, asa_class, anesthesia_type, airway_assessment, mallampati_score, premedication, induction_agents, maintenance_agents, muscle_relaxants, monitors_used, iv_access, fluid_given, blood_loss_ml, complications, recovery_notes, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!surgery_id) return res.status(400).json({ ok: false, error: 'surgery_id_required' });
        if (mallampati_score && !VALID_MALLAMPATI.includes(String(mallampati_score))) return res.status(400).json({ ok: false, error: 'invalid_mallampati' });
        if (anesthesia_type && !VALID_ANESTHESIA.includes(anesthesia_type)) return res.status(400).json({ ok: false, error: 'invalid_anesthesia_type' });
        if (blood_loss_ml !== undefined && blood_loss_ml < 0) return res.status(400).json({ ok: false, error: 'invalid_blood_loss' });

        const r = await db.query(
            `INSERT INTO surgery_anesthesia_records (tenant_id, surgery_id, patient_id, anesthetist_name, asa_class, anesthesia_type, airway_assessment, mallampati_score, premedication, induction_agents, maintenance_agents, muscle_relaxants, monitors_used, iv_access, fluid_given, blood_loss_ml, complications, recovery_notes, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *`,
            [req.tenantId, surgery_id, patient_id, anesthetist_name || null, asa_class || null, anesthesia_type || null,
             airway_assessment || null, mallampati_score || null, premedication || null, induction_agents || null,
             maintenance_agents || null, muscle_relaxants || null, monitors_used || null, iv_access || null,
             fluid_given || null, blood_loss_ml ?? null, complications || null, recovery_notes || null, notes || null]
        );
        res.status(201).json({
            ok: true, record: r.rows[0],
            computed: {
                mallampati_difficulty: mallampatiDifficulty(mallampati_score),
                asa_mortality_pct: asaMortality(asa_class),
                airway_risk: airwayRisk(mallampati_score, asa_class)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ANESTHESIA PREOP (airway + fasting + allergies) =====
router.get('/anesthesia/preop', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { patient_id, asa_class, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM anesthesia_preops WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (asa_class) { sql += ` AND asa_class = $${params.length + 1}`; params.push(parseInt(asa_class)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/anesthesia/preop', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, asa_class, airway, mallampati, last_meal_hours, allergies, prophylaxis, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (mallampati !== undefined && !VALID_MALLAMPATI.includes(parseInt(mallampati))) return res.status(400).json({ ok: false, error: 'invalid_mallampati' });
        if (airway && !VALID_AIRWAY.includes(airway)) return res.status(400).json({ ok: false, error: 'invalid_airway' });
        if (last_meal_hours !== undefined && last_meal_hours < 0) return res.status(400).json({ ok: false, error: 'invalid_npo_hours' });
        const npoCompliant = last_meal_hours === undefined || last_meal_hours >= 6;

        const r = await db.query(
            `INSERT INTO anesthesia_preops (tenant_id, patient_id, encounter_id, asa_class, airway, mallampati, last_meal_hours, allergies, prophylaxis, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             asa_class ?? null, airway || null, mallampati ?? null, last_meal_hours ?? null,
             allergies || null, prophylaxis || null, created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, preop: r.rows[0], computed: { npo_compliant: npoCompliant, mallampati_difficulty: mallampatiDifficulty(mallampati) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PREOP ASSESSMENTS (clearance checks) =====
router.get('/preop-assessments', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { surgery_id, patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgery_preop_assessments WHERE tenant_id = $1`;
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(surgery_id); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/preop-assessments', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { surgery_id, patient_id, npo_confirmed, allergies_reviewed, allergies_notes, medications_reviewed, medications_notes, labs_reviewed, labs_notes, imaging_reviewed, imaging_notes, blood_type_confirmed, blood_reserved, consent_signed, anesthesia_clearance, nursing_assessment, nursing_notes, cardiac_clearance, cardiac_notes, pulmonary_clearance, infection_screening, dvt_prophylaxis } = req.body;
        if (!surgery_id) return res.status(400).json({ ok: false, error: 'surgery_id_required' });
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });

        const r = await db.query(
            `INSERT INTO surgery_preop_assessments (tenant_id, surgery_id, patient_id, npo_confirmed, allergies_reviewed, allergies_notes, medications_reviewed, medications_notes, labs_reviewed, labs_notes, imaging_reviewed, imaging_notes, blood_type_confirmed, blood_reserved, consent_signed, anesthesia_clearance, nursing_assessment, nursing_notes, cardiac_clearance, cardiac_notes, pulmonary_clearance, infection_screening, dvt_prophylaxis)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23) RETURNING *`,
            [req.tenantId, surgery_id, patient_id, npo_confirmed ? 1 : 0, allergies_reviewed ? 1 : 0, allergies_notes || null,
             medications_reviewed ? 1 : 0, medications_notes || null, labs_reviewed ? 1 : 0, labs_notes || null,
             imaging_reviewed ? 1 : 0, imaging_notes || null, blood_type_confirmed ? 1 : 0, blood_reserved ? 1 : 0,
             consent_signed ? 1 : 0, anesthesia_clearance ? 1 : 0, nursing_assessment ? 1 : 0, nursing_notes || null,
             cardiac_clearance ? 1 : 0, cardiac_notes || null, pulmonary_clearance ? 1 : 0,
             infection_screening ? 1 : 0, dvt_prophylaxis ? 1 : 0]
        );

        const checks = { npo: npo_confirmed, allergies: allergies_reviewed, medications: medications_reviewed, labs: labs_reviewed, imaging: imaging_reviewed, blood: blood_type_confirmed, consent: consent_signed, anesthesia: anesthesia_clearance, nursing: nursing_assessment, cardiac: cardiac_clearance, pulmonary: pulmonary_clearance, infection: infection_screening, dvt: dvt_prophylaxis };
        const passed = Object.values(checks).filter(Boolean).length;
        const total = Object.keys(checks).length;

        res.status(201).json({ ok: true, assessment: r.rows[0], computed: { checks_passed: passed, total_checks: total, ready_for_or: passed === total } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COUNT SHEETS (sponges/needles/instruments) =====
router.get('/count-sheets', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { surgery_id, counts_match, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgery_count_sheets WHERE tenant_id = $1`;
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(surgery_id); }
        if (counts_match !== undefined) { sql += ` AND counts_match = $${params.length + 1}`; params.push(counts_match === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/count-sheets', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { surgery_id, sponge_count_initial, sponge_count_final, needle_count_initial, needle_count_final, instrument_count_initial, instrument_count_final, witness1_name, witness2_name, notes } = req.body;
        if (!surgery_id) return res.status(400).json({ ok: false, error: 'surgery_id_required' });

        const sponges_ok = sponge_count_initial !== undefined && sponge_count_final !== undefined && parseInt(sponge_count_initial) === parseInt(sponge_count_final);
        const needles_ok = needle_count_initial !== undefined && needle_count_final !== undefined && parseInt(needle_count_initial) === parseInt(needle_count_final);
        const instruments_ok = instrument_count_initial !== undefined && instrument_count_final !== undefined && parseInt(instrument_count_initial) === parseInt(instrument_count_final);
        const counts_match = sponges_ok && needles_ok && instruments_ok;
        if (!witness1_name) return res.status(400).json({ ok: false, error: 'witness1_required' });

        const r = await db.query(
            `INSERT INTO surgery_count_sheets (tenant_id, surgery_id, sponge_count_initial, sponge_count_final, needle_count_initial, needle_count_final, instrument_count_initial, instrument_count_final, counts_match, witness1_name, witness2_name, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [req.tenantId, surgery_id, sponge_count_initial ?? null, sponge_count_final ?? null,
             needle_count_initial ?? null, needle_count_final ?? null, instrument_count_initial ?? null, instrument_count_final ?? null,
             counts_match, witness1_name, witness2_name || null, notes || null]
        );
        res.status(201).json({
            ok: true, sheet: r.rows[0],
            computed: {
                sponge_variance: countSheetVariance(sponge_count_initial, sponge_count_final),
                needle_variance: countSheetVariance(needle_count_initial, needle_count_final),
                instrument_variance: countSheetVariance(instrument_count_initial, instrument_count_final),
                counts_match
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SURGERY IMPLANTS =====
router.get('/implants', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { encounter_id, implant_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgery_implants WHERE tenant_id = $1`;
        if (encounter_id) { sql += ` AND encounter_id = $${params.length + 1}`; params.push(String(encounter_id)); }
        if (implant_type) { sql += ` AND implant_type = $${params.length + 1}`; params.push(implant_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/implants', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { encounter_id, implant_type, brand_model, serial_number, lot_number, position_details } = req.body;
        if (!encounter_id) return res.status(400).json({ ok: false, error: 'encounter_id_required' });
        if (!implant_type) return res.status(400).json({ ok: false, error: 'implant_type_required' });
        if (!brand_model) return res.status(400).json({ ok: false, error: 'brand_model_required' });
        if (!serial_number) return res.status(400).json({ ok: false, error: 'serial_number_required' });

        const r = await db.query(
            `INSERT INTO surgery_implants (tenant_id, encounter_id, implant_type, brand_model, serial_number, lot_number, position_details)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(encounter_id), implant_type, brand_model, serial_number, lot_number || null, position_details || null]
        );
        res.status(201).json({ ok: true, implant: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SURGERY TIMEOUTS (3-phase safety) =====
router.get('/timeouts', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { encounter_id, phase, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgery_timeouts WHERE tenant_id = $1`;
        if (encounter_id) { sql += ` AND encounter_id = $${params.length + 1}`; params.push(encounter_id); }
        if (phase) { sql += ` AND phase = $${params.length + 1}`; params.push(phase); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/timeouts', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, encounter_id, assessed_by, phase, completed_items, missing_items, completion_pct, status, can_proceed } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!phase || !VALID_PHASE.includes(phase)) return res.status(400).json({ ok: false, error: 'invalid_phase', valid: VALID_PHASE });
        if (status && !VALID_TIMEOUT_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (completion_pct !== undefined && (completion_pct < 0 || completion_pct > 100)) return res.status(400).json({ ok: false, error: 'completion_pct_out_of_range_0_100' });

        const r = await db.query(
            `INSERT INTO surgery_timeouts (tenant_id, patient_id, encounter_id, assessed_by, phase, completed_items, missing_items, completion_pct, status, can_proceed)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, assessed_by || req.user?.id || null,
             phase, completed_items || null, missing_items || null, completion_pct ?? 0, status || 'in_progress', !!can_proceed]
        );
        res.status(201).json({
            ok: true, timeout: r.rows[0],
            computed: {
                items_completed: timeoutCompletion(completed_items),
                gate: timeoutGate(missing_items, completion_pct)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== WHO SURGICAL CHECKLIST (3-phase simplified) =====
router.get('/who-checklist', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { surgery_id, state, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM who_surgical_checklist WHERE tenant_id = $1`;
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(surgery_id); }
        if (state) { sql += ` AND state = $${params.length + 1}`; params.push(state); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/who-checklist', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { surgery_id, patient_id, sign_in_completed, sign_in_completed_by, sign_in_at, time_out_completed, time_out_completed_by, time_out_at, sign_out_completed, sign_out_completed_by, sign_out_at, state } = req.body;
        if (!surgery_id) return res.status(400).json({ ok: false, error: 'surgery_id_required' });
        if (state && !VALID_WHO_STATE.includes(state)) return res.status(400).json({ ok: false, error: 'invalid_state' });

        const r = await db.query(
            `INSERT INTO who_surgical_checklist (tenant_id, surgery_id, patient_id, sign_in_completed, sign_in_completed_by, sign_in_at, time_out_completed, time_out_completed_by, time_out_at, sign_out_completed, sign_out_completed_by, sign_out_at, state)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [req.tenantId, surgery_id, patient_id || null,
             sign_in_completed ? 1 : 0, sign_in_completed_by || null, sign_in_at || null,
             time_out_completed ? 1 : 0, time_out_completed_by || null, time_out_at || null,
             sign_out_completed ? 1 : 0, sign_out_completed_by || null, sign_out_at || null,
             state || 'pending']
        );
        const allDone = sign_in_completed && time_out_completed && sign_out_completed;
        res.status(201).json({ ok: true, checklist: r.rows[0], computed: { all_phases_complete: allDone } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== WOUND LOGS (post-op surveillance) =====
router.get('/wound-logs', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { encounter_id, wound_status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgery_wound_logs WHERE tenant_id = $1`;
        if (encounter_id) { sql += ` AND encounter_id = $${params.length + 1}`; params.push(String(encounter_id)); }
        if (wound_status) { sql += ` AND wound_status = $${params.length + 1}`; params.push(wound_status); }
        sql += ` ORDER BY check_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/wound-logs', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { encounter_id, check_date, wound_status, drainage_amount_ml, drainage_type, intervention_taken } = req.body;
        if (!encounter_id) return res.status(400).json({ ok: false, error: 'encounter_id_required' });
        if (wound_status && !VALID_WOUND_STATUS.includes(wound_status)) return res.status(400).json({ ok: false, error: 'invalid_wound_status' });
        if (drainage_type && !VALID_DRAINAGE.includes(drainage_type)) return res.status(400).json({ ok: false, error: 'invalid_drainage' });
        if (drainage_amount_ml !== undefined && drainage_amount_ml < 0) return res.status(400).json({ ok: false, error: 'invalid_drainage_amount' });

        const r = await db.query(
            `INSERT INTO surgery_wound_logs (tenant_id, encounter_id, check_date, wound_status, drainage_amount_ml, drainage_type, intervention_taken)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(encounter_id), check_date || new Date().toISOString(),
             wound_status || null, drainage_amount_ml ?? null, drainage_type || null, intervention_taken || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0], computed: { healing_status: woundHealing(wound_status) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== INTRA-OP LOGS (blood loss + tourniquet) =====
router.get('/intra-op-logs', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { procedure_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgical_intra_op_logs WHERE tenant_id = $1`;
        if (procedure_id) { sql += ` AND procedure_id = $${params.length + 1}`; params.push(String(procedure_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/intra-op-logs', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { procedure_id, estimated_blood_loss, actual_blood_loss, anesthesia_start, anesthesia_end, tourniquet_time_min } = req.body;
        if (!procedure_id) return res.status(400).json({ ok: false, error: 'procedure_id_required' });
        if (anesthesia_start && anesthesia_end && new Date(anesthesia_end) < new Date(anesthesia_start)) return res.status(400).json({ ok: false, error: 'anes_end_before_start' });

        const anesMinutes = surgeryDuration(anesthesia_start, anesthesia_end);
        const bloodVariance = (estimated_blood_loss !== undefined && actual_blood_loss !== undefined)
            ? parseFloat(actual_blood_loss) - parseFloat(estimated_blood_loss) : null;

        const r = await db.query(
            `INSERT INTO surgical_intra_op_logs (tenant_id, procedure_id, estimated_blood_loss, actual_blood_loss, anesthesia_start, anesthesia_end, tourniquet_time_min)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(procedure_id), estimated_blood_loss ?? null, actual_blood_loss ?? null,
             anesthesia_start || null, anesthesia_end || null, tourniquet_time_min ?? null]
        );
        res.status(201).json({ ok: true, log: r.rows[0], computed: { anesthesia_minutes: anesMinutes, blood_loss_variance_ml: bloodVariance } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ROBOTIC LOGS =====
router.get('/robotic-logs', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { procedure_id, robot_model, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgical_robotic_logs WHERE tenant_id = $1`;
        if (procedure_id) { sql += ` AND procedure_id = $${params.length + 1}`; params.push(String(procedure_id)); }
        if (robot_model) { sql += ` AND robot_model = $${params.length + 1}`; params.push(robot_model); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/robotic-logs', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { procedure_id, robot_model, console_time_min, port_locations } = req.body;
        if (!procedure_id) return res.status(400).json({ ok: false, error: 'procedure_id_required' });
        if (!robot_model) return res.status(400).json({ ok: false, error: 'robot_model_required' });
        if (console_time_min !== undefined && console_time_min < 0) return res.status(400).json({ ok: false, error: 'invalid_console_time' });

        const r = await db.query(
            `INSERT INTO surgical_robotic_logs (tenant_id, procedure_id, robot_model, console_time_min, port_locations)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [String(req.tenantId), String(procedure_id), robot_model, console_time_min ?? null, port_locations || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SURGICAL TIME LOGS (anesthesia/incision/closure/anes_end) =====
router.get('/time-logs', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { patient_id, doctor_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM surgical_time_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (doctor_id) { sql += ` AND doctor_id = $${params.length + 1}`; params.push(doctor_id); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/time-logs', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { patient_id, doctor_id, procedure_name, anesthesia_start_time, incision_time, closure_time, anesthesia_end_time } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (incision_time && closure_time && new Date(closure_time) < new Date(incision_time)) return res.status(400).json({ ok: false, error: 'closure_before_incision' });

        const surgicalMinutes = surgeryDuration(incision_time, closure_time);
        const anesTotalMinutes = surgeryDuration(anesthesia_start_time, anesthesia_end_time);
        const turnoverMinutes = (surgicalMinutes !== null && anesTotalMinutes !== null) ? anesTotalMinutes - surgicalMinutes : null;

        const r = await db.query(
            `INSERT INTO surgical_time_logs (tenant_id, patient_id, doctor_id, procedure_name, anesthesia_start_time, incision_time, closure_time, anesthesia_end_time)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [req.tenantId, patient_id, doctor_id || req.user?.id || null, procedure_name || null,
             anesthesia_start_time || null, incision_time || null, closure_time || null, anesthesia_end_time || null]
        );
        res.status(201).json({
            ok: true, log: r.rows[0],
            computed: { surgical_minutes: surgicalMinutes, anesthesia_total_minutes: anesTotalMinutes, turnover_minutes: turnoverMinutes }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/asa-mortality', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { asa_class } = req.query;
        if (!asa_class) return res.status(400).json({ ok: false, error: 'asa_class_required' });
        const mortality = asaMortality(asa_class);
        if (mortality === null) return res.status(400).json({ ok: false, error: 'invalid_asa_class' });
        res.json({ ok: true, asa_class: String(asa_class), mortality_pct: mortality });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/mallampati', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { score } = req.query;
        if (!score) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, score: parseInt(score), difficulty: mallampatiDifficulty(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/airway-risk', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { mallampati, asa_class } = req.query;
        if (!mallampati || !asa_class) return res.status(400).json({ ok: false, error: 'mallampati_and_asa_required' });
        res.json({ ok: true, mallampati: parseInt(mallampati), asa_class: parseInt(asa_class), risk: airwayRisk(mallampati, asa_class) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const surgeries = await db.query(`SELECT priority, status, surgery_type, COUNT(*) AS count FROM surgeries WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY priority, status, surgery_type ORDER BY count DESC`, [req.tenantId]);
        const asa = await db.query(`SELECT asa_class, emergency, COUNT(*) AS count FROM surgery_asa_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY asa_class, emergency ORDER BY asa_class`, [req.tenantId]);
        const wound = await db.query(`SELECT wound_status, drainage_type, COUNT(*) AS count FROM surgery_wound_logs WHERE tenant_id = $1 AND check_date >= NOW() - INTERVAL '90 days' GROUP BY wound_status, drainage_type ORDER BY count DESC`, [req.tenantId]);
        const timeouts = await db.query(`SELECT phase, status, COUNT(*) AS count FROM surgery_timeouts WHERE tenant_id = $1 GROUP BY phase, status`, [req.tenantId]);
        res.json({ ok: true, surgeries_90d: surgeries.rows, asa_distribution_90d: asa.rows, wound_status_90d: wound.rows, timeout_breakdown: timeouts.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
