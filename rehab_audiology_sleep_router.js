'use strict';
// Wave 107 — Rehabilitation (PT/OT/SLP) + Audiology (audiograms + cochlear) + Sleep medicine (PSG)
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_THERAPY = ['physical','occupational','speech','cardiac','pulmonary','neuro','pediatric','aquatic','vestibular','lymphedema'];
const VALID_REHAB_STATUS = ['active','on_hold','discharged','completed','transferred','deceased'];
const VALID_GOAL_STATUS = ['not_started','in_progress','achieved','on_hold','abandoned'];
const VALID_GAIT = ['normal','antalgic','spastic','ataxic','hemiparetic','trendelenburg','steppage','festinating','non_ambulatory'];
const VALID_MMT = ['0','1','2','3-','3','3+','4-','4','4+','5-','5'];
const VALID_COMM = ['pre_intentional','intentional','emerging_symbolic','functional','complex','fluent','non_communicative'];
const VALID_VOICE = ['normal','hoarse','breathy','rough','strained','aphonic','tremulous','monotone','hypernasal','hyponasal'];
const VALID_DYSPHAGIA = ['normal','mild','moderate','severe','profound','npo'];
const VALID_HEARING_LOSS = ['normal','mild','moderate','moderately_severe','severe','profound','profound_unilateral'];
const VALID_TYMP = ['A','As','Ad','B','C','flat','normal','reduced','absent','stiff','hypermobile'];
const VALID_OTOSCOPY = ['normal','wax_occlusion','tympanosclerosis','perforation','effusion','retracted','bulging','normal_landmarks','cholesteatoma','otitis_externa'];
const VALID_SLEEP_DX = ['normal','obstructive','central','mixed','positional','upper_airway_resistance','narcolepsy','restless_leg','periodic_limb_movement','parasomnia','insomnia'];
const VALID_AHI = ['normal','mild','moderate','severe'];
const VALID_RISK = ['low','moderate','high','critical'];
const VALID_COCHLEAR_BRAND = ['Cochlear','Advanced_Bionics','MEDEL','Oticon','Neurelec'];

function pureToneAverage(ac_500, ac_1000, ac_2000, ac_4000) {
    const vals = [ac_500, ac_1000, ac_2000, ac_4000].filter(v => v !== undefined && v !== null).map(v => parseFloat(v));
    if (vals.length < 3) return null;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

function hearingLossFromPTA(pta) {
    if (pta === null) return null;
    if (pta <= 20) return 'normal';
    if (pta <= 40) return 'mild';
    if (pta <= 55) return 'moderate';
    if (pta <= 70) return 'moderately_severe';
    if (pta <= 90) return 'severe';
    return 'profound';
}

function airBoneGapSeverity(abg) {
    if (abg === null || abg === undefined) return null;
    if (abg <= 10) return 'normal';
    if (abg <= 20) return 'mild_conductive';
    if (abg <= 30) return 'moderate_conductive';
    return 'large_conductive';
}

function ahiSeverity(ahi) {
    if (ahi === undefined || ahi === null) return null;
    if (ahi < 5) return 'normal';
    if (ahi < 15) return 'mild';
    if (ahi < 30) return 'moderate';
    return 'severe';
}

function oxygenSeverity(oxygen) {
    if (oxygen === undefined || oxygen === null) return null;
    if (oxygen < 80) return 'critical';
    if (oxygen < 85) return 'severe';
    if (oxygen < 90) return 'moderate';
    return 'normal';
}

function romProgress(rom) {
    if (rom === undefined || rom === null) return null;
    if (rom >= 130) return 'full';
    if (rom >= 90) return 'functional';
    if (rom >= 45) return 'limited';
    return 'severely_limited';
}

function mmtStrength(grade) {
    if (grade === undefined || grade === null) return null;
    const map = { '0': 'no_contraction', '1': 'flicker', '2': 'gravity_eliminated', '3-': 'against_gravity_min', '3': 'against_gravity', '3+': 'against_gravity_moderate',
        '4-': 'against_gravity_with_resistance_min', '4': 'against_resistance', '4+': 'against_resistance_strong', '5-': 'near_normal', '5': 'normal' };
    return map[String(grade)] || 'unknown';
}

function fimBands(fim) {
    if (fim === undefined || fim === null) return null;
    if (fim < 18) return 'minimal';
    if (fim < 36) return 'limited';
    if (fim < 54) return 'moderate';
    if (fim < 72) return 'minimal_assistance';
    if (fim < 90) return 'supervision';
    if (fim < 108) return 'modified_independence';
    if (fim < 126) return 'complete_independence';
    return 'complete_independence';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'rehab-audiology-sleep',
        endpoints: [
            'GET /rehab/patients',
            'POST /rehab/patients',
            'GET /rehab/patients/:id/goals',
            'POST /rehab/patients/:id/goals',
            'GET /rehab/plans',
            'POST /rehab/plans',
            'GET /rehab/sessions',
            'POST /rehab/sessions',
            'GET /rehab/physical-logs',
            'POST /rehab/physical-logs',
            'GET /rehab/occupational-logs',
            'POST /rehab/occupational-logs',
            'GET /rehab/speech-logs',
            'POST /rehab/speech-logs',
            'POST /audiogram',
            'GET /audiogram',
            'POST /cochlear-implant',
            'GET /cochlear-implant',
            'GET /sleep-studies',
            'POST /sleep-studies',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== REHAB PATIENTS =====
router.get('/rehab/patients', requireAuth, requireTenantScope, requireRole('rehab_therapist'), async (req, res) => {
    try {
        const { patient_id, therapy_type, status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT r.*, p.full_name AS patient_lookup FROM rehab_patients r LEFT JOIN patients p ON p.id = r.patient_id WHERE r.tenant_id = $1`;
        if (patient_id) { sql += ` AND r.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (therapy_type) { sql += ` AND r.therapy_type = $${params.length + 1}`; params.push(therapy_type); }
        if (status) { sql += ` AND r.status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/patients', requireAuth, requireTenantScope, requireRole('rehab_therapist'), async (req, res) => {
    try {
        const { patient_id, patient_name, diagnosis, referral_source, therapist, therapy_type, start_date, target_end_date, status, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (therapy_type && !VALID_THERAPY.includes(therapy_type)) return res.status(400).json({ ok: false, error: 'invalid_therapy_type', valid: VALID_THERAPY });
        if (status && !VALID_REHAB_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });
        if (start_date && target_end_date && new Date(target_end_date) < new Date(start_date)) return res.status(400).json({ ok: false, error: 'end_before_start' });

        const r = await db.query(
            `INSERT INTO rehab_patients (tenant_id, patient_id, patient_name, diagnosis, referral_source, therapist, therapy_type, start_date, target_end_date, status, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [req.tenantId, patient_id, patient_name || null, diagnosis || null, referral_source || null, therapist || null,
             therapy_type || null, start_date || null, target_end_date || null, status || 'active', notes || null]
        );
        res.status(201).json({ ok: true, patient: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB GOALS =====
router.get('/rehab/patients/:id/goals', requireAuth, requireTenantScope, requireRole('rehab_therapist'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM rehab_goals WHERE tenant_id = $1 AND rehab_patient_id = $2 ORDER BY target_date`, [req.tenantId, req.params.id]);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/patients/:id/goals', requireAuth, requireTenantScope, requireRole('rehab_therapist'), async (req, res) => {
    try {
        const { goal_description, target_date, progress, status, notes } = req.body;
        if (!goal_description) return res.status(400).json({ ok: false, error: 'goal_description_required' });
        if (progress !== undefined && (progress < 0 || progress > 100)) return res.status(400).json({ ok: false, error: 'progress_out_of_range_0_100' });
        if (status && !VALID_GOAL_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status' });

        const r = await db.query(
            `INSERT INTO rehab_goals (tenant_id, rehab_patient_id, goal_description, target_date, progress, status, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [req.tenantId, req.params.id, goal_description, target_date || null, progress ?? 0, status || 'not_started', notes || null]
        );
        res.status(201).json({ ok: true, goal: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB PLANS (FIM-based) =====
router.get('/rehab/plans', requireAuth, requireTenantScope, requireRole('rehab_therapist'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT p.*, pt.full_name AS patient_name FROM rehab_plans p LEFT JOIN patients pt ON pt.id::text = p.patient_id WHERE p.tenant_id = $1`;
        if (patient_id) { sql += ` AND p.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/plans', requireAuth, requireTenantScope, requireRole('rehab_therapist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, functional_independent_measure, goals, discharge_target, progress, barriers, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (functional_independent_measure !== undefined && (functional_independent_measure < 18 || functional_independent_measure > 126)) return res.status(400).json({ ok: false, error: 'fim_out_of_range_18_126' });

        const r = await db.query(
            `INSERT INTO rehab_plans (tenant_id, patient_id, encounter_id, functional_independent_measure, goals, discharge_target, progress, barriers, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             functional_independent_measure ?? null, goals || null, discharge_target || null, progress || null, barriers || null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, plan: r.rows[0], computed: { fim_band: fimBands(functional_independent_measure) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB SESSIONS =====
router.get('/rehab/sessions', requireAuth, requireTenantScope, requireRole('rehab_therapist'), async (req, res) => {
    try {
        const { patient_id, session_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_lookup FROM rehab_sessions s LEFT JOIN patients p ON p.id = s.patient_id WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (session_type) { sql += ` AND s.session_type = $${params.length + 1}`; params.push(session_type); }
        sql += ` ORDER BY s.session_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/sessions', requireAuth, requireTenantScope, requireRole('rehab_therapist'), async (req, res) => {
    try {
        const { rehab_patient_id, patient_id, session_date, session_number, therapist, session_type, exercises, duration_minutes, pain_before, pain_after, progress_notes, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (duration_minutes !== undefined && duration_minutes < 0) return res.status(400).json({ ok: false, error: 'invalid_duration' });
        if (pain_before !== undefined && (pain_before < 0 || pain_before > 10)) return res.status(400).json({ ok: false, error: 'pain_before_out_of_range' });
        if (pain_after !== undefined && (pain_after < 0 || pain_after > 10)) return res.status(400).json({ ok: false, error: 'pain_after_out_of_range' });

        const pain_delta = (pain_before !== undefined && pain_after !== undefined) ? parseInt(pain_after) - parseInt(pain_before) : null;

        const r = await db.query(
            `INSERT INTO rehab_sessions (tenant_id, rehab_patient_id, patient_id, session_date, session_number, therapist, session_type, exercises, duration_minutes, pain_before, pain_after, progress_notes, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [req.tenantId, rehab_patient_id || null, patient_id, session_date || null, session_number || null, therapist || null,
             session_type || null, exercises || null, duration_minutes ?? null, pain_before ?? null, pain_after ?? null,
             progress_notes || null, status || 'completed']
        );
        res.status(201).json({ ok: true, session: r.rows[0], computed: { pain_delta } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB PHYSICAL LOGS (ROM + MMT + gait + balance) =====
router.get('/rehab/physical-logs', requireAuth, requireTenantScope, requireRole('physical_therapist'), async (req, res) => {
    try {
        const { patient_id, joint_name, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM rehab_physical_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (joint_name) { sql += ` AND joint_name = $${params.length + 1}`; params.push(joint_name); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/physical-logs', requireAuth, requireTenantScope, requireRole('physical_therapist'), async (req, res) => {
    try {
        const { patient_id, log_date, joint_name, rom_degrees, mmt_grade, gait_status, balance_score } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (rom_degrees !== undefined && (rom_degrees < 0 || rom_degrees > 360)) return res.status(400).json({ ok: false, error: 'rom_out_of_range_0_360' });
        if (mmt_grade !== undefined && !VALID_MMT.includes(String(mmt_grade))) return res.status(400).json({ ok: false, error: 'invalid_mmt_grade' });
        if (gait_status && !VALID_GAIT.includes(gait_status)) return res.status(400).json({ ok: false, error: 'invalid_gait' });
        if (balance_score !== undefined && (balance_score < 0 || balance_score > 56)) return res.status(400).json({ ok: false, error: 'balance_out_of_range_0_56' });

        const r = await db.query(
            `INSERT INTO rehab_physical_logs (tenant_id, patient_id, log_date, joint_name, rom_degrees, mmt_grade, gait_status, balance_score)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_date || new Date().toISOString(),
             joint_name || null, rom_degrees ?? null, mmt_grade ?? null, gait_status || null, balance_score ?? null]
        );
        res.status(201).json({ ok: true, log: r.rows[0], computed: { rom_band: romProgress(rom_degrees), strength: mmtStrength(mmt_grade) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB OCCUPATIONAL LOGS (ADL + cognitive) =====
router.get('/rehab/occupational-logs', requireAuth, requireTenantScope, requireRole('occupational_therapist'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM rehab_occupational_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/occupational-logs', requireAuth, requireTenantScope, requireRole('occupational_therapist'), async (req, res) => {
    try {
        const { patient_id, log_date, adl_score, adaptive_equipment_needed, cognitive_function_score } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (adl_score !== undefined && (adl_score < 0 || adl_score > 100)) return res.status(400).json({ ok: false, error: 'adl_out_of_range_0_100' });
        if (cognitive_function_score !== undefined && (cognitive_function_score < 0 || cognitive_function_score > 30)) return res.status(400).json({ ok: false, error: 'moca_out_of_range_0_30' });

        const r = await db.query(
            `INSERT INTO rehab_occupational_logs (tenant_id, patient_id, log_date, adl_score, adaptive_equipment_needed, cognitive_function_score)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_date || new Date().toISOString(),
             adl_score ?? null, adaptive_equipment_needed || null, cognitive_function_score ?? null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB SPEECH LOGS =====
router.get('/rehab/speech-logs', requireAuth, requireTenantScope, requireRole('speech_therapist'), async (req, res) => {
    try {
        const { patient_id, communication_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM rehab_speech_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (communication_level) { sql += ` AND communication_level = $${params.length + 1}`; params.push(communication_level); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/speech-logs', requireAuth, requireTenantScope, requireRole('speech_therapist'), async (req, res) => {
    try {
        const { patient_id, log_date, dysphagia_grade, communication_level, voice_quality } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (dysphagia_grade !== undefined && !VALID_DYSPHAGIA.includes(String(dysphagia_grade))) return res.status(400).json({ ok: false, error: 'invalid_dysphagia_grade' });
        if (communication_level && !VALID_COMM.includes(communication_level)) return res.status(400).json({ ok: false, error: 'invalid_communication_level' });
        if (voice_quality && !VALID_VOICE.includes(voice_quality)) return res.status(400).json({ ok: false, error: 'invalid_voice_quality' });

        const r = await db.query(
            `INSERT INTO rehab_speech_logs (tenant_id, patient_id, log_date, dysphagia_grade, communication_level, voice_quality)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_date || new Date().toISOString(),
             dysphagia_grade ?? null, communication_level || null, voice_quality || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== AUDIOGRAM RECORDS =====
router.get('/audiogram', requireAuth, requireTenantScope, requireRole('audiologist'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT a.*, p.full_name AS patient_name FROM audiogram_records a LEFT JOIN patients p ON p.id = a.patient_id WHERE a.tenant_id = $1`;
        if (patient_id) { sql += ` AND a.patient_id = $${params.length + 1}`; params.push(patient_id); }
        sql += ` ORDER BY a.test_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/audiogram', requireAuth, requireTenantScope, requireRole('audiologist'), async (req, res) => {
    try {
        const { patient_id, doctor_id, test_date, right_ac_500, right_ac_1000, right_ac_2000, right_ac_4000, left_ac_500, left_ac_1000, left_ac_2000, left_ac_4000, right_bc_500, right_bc_1000, right_bc_2000, left_bc_500, left_bc_1000, left_bc_2000, right_srt, left_srt, right_sd_score, left_sd_score, otoscopy_right, otoscopy_left, tympanometry_right, tympanometry_left, interpretation, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!test_date) return res.status(400).json({ ok: false, error: 'test_date_required' });
        if (tympanometry_right && !VALID_TYMP.includes(tympanometry_right)) return res.status(400).json({ ok: false, error: 'invalid_tymp_right' });
        if (tympanometry_left && !VALID_TYMP.includes(tympanometry_left)) return res.status(400).json({ ok: false, error: 'invalid_tymp_left' });
        if (otoscopy_right && !VALID_OTOSCOPY.includes(otoscopy_right)) return res.status(400).json({ ok: false, error: 'invalid_otoscopy_right' });
        if (otoscopy_left && !VALID_OTOSCOPY.includes(otoscopy_left)) return res.status(400).json({ ok: false, error: 'invalid_otoscopy_left' });

        const right_pta = pureToneAverage(right_ac_500, right_ac_1000, right_ac_2000, right_ac_4000);
        const left_pta = pureToneAverage(left_ac_500, left_ac_1000, left_ac_2000, left_ac_4000);
        const right_abg = (right_ac_500 !== undefined && right_bc_500 !== undefined) ? parseFloat(right_ac_500) - parseFloat(right_bc_500) : null;
        const left_abg = (left_ac_500 !== undefined && left_bc_500 !== undefined) ? parseFloat(left_ac_500) - parseFloat(left_bc_500) : null;

        const r = await db.query(
            `INSERT INTO audiogram_records (tenant_id, patient_id, doctor_id, test_date,
                right_ac_250, right_ac_500, right_ac_1000, right_ac_2000, right_ac_4000, right_ac_8000,
                left_ac_250, left_ac_500, left_ac_1000, left_ac_2000, left_ac_4000, left_ac_8000,
                right_bc_250, right_bc_500, right_bc_1000, right_bc_2000, right_bc_4000,
                left_bc_250, left_bc_500, left_bc_1000, left_bc_2000, left_bc_4000,
                right_srt, left_srt, right_sd_score, left_sd_score, otoscopy_right, otoscopy_left, tympanometry_right, tympanometry_left, interpretation, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36) RETURNING *`,
            [req.tenantId, patient_id, doctor_id || req.user?.id || null, test_date,
             req.body.right_ac_250 ?? null, right_ac_500 ?? null, right_ac_1000 ?? null, right_ac_2000 ?? null, right_ac_4000 ?? null, req.body.right_ac_8000 ?? null,
             req.body.left_ac_250 ?? null, left_ac_500 ?? null, left_ac_1000 ?? null, left_ac_2000 ?? null, left_ac_4000 ?? null, req.body.left_ac_8000 ?? null,
             req.body.right_bc_250 ?? null, right_bc_500 ?? null, right_bc_1000 ?? null, right_bc_2000 ?? null, req.body.right_bc_4000 ?? null,
             req.body.left_bc_250 ?? null, left_bc_500 ?? null, left_bc_1000 ?? null, left_bc_2000 ?? null, req.body.left_bc_4000 ?? null,
             right_srt ?? null, left_srt ?? null, right_sd_score ?? null, left_sd_score ?? null,
             otoscopy_right || null, otoscopy_left || null, tympanometry_right || null, tympanometry_left || null,
             interpretation || null, notes || null]
        );
        res.status(201).json({
            ok: true, audiogram: r.rows[0],
            computed: {
                right_pta_db: right_pta,
                left_pta_db: left_pta,
                right_hearing_loss: hearingLossFromPTA(right_pta),
                left_hearing_loss: hearingLossFromPTA(left_pta),
                right_air_bone_gap: right_abg, right_abg_severity: airBoneGapSeverity(right_abg),
                left_air_bone_gap: left_abg, left_abg_severity: airBoneGapSeverity(left_abg)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COCHLEAR IMPLANT REGISTRY =====
router.get('/cochlear-implant', requireAuth, requireTenantScope, requireRole('audiologist'), async (req, res) => {
    try {
        const { patient_id, implant_brand, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cochlear_implant_registry WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (implant_brand) { sql += ` AND implant_brand = $${params.length + 1}`; params.push(implant_brand); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cochlear-implant', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { patient_id, procedure_id, implant_brand, implant_model, serial_number, mapping_parameters } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!procedure_id) return res.status(400).json({ ok: false, error: 'procedure_id_required' });
        if (!implant_brand) return res.status(400).json({ ok: false, error: 'implant_brand_required' });
        if (!VALID_COCHLEAR_BRAND.includes(implant_brand)) return res.status(400).json({ ok: false, error: 'invalid_implant_brand', valid: VALID_COCHLEAR_BRAND });
        if (!serial_number) return res.status(400).json({ ok: false, error: 'serial_number_required' });

        const r = await db.query(
            `INSERT INTO cochlear_implant_registry (tenant_id, patient_id, procedure_id, implant_brand, implant_model, serial_number, mapping_parameters)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), String(procedure_id), implant_brand, implant_model || null, serial_number, mapping_parameters || null]
        );
        res.status(201).json({ ok: true, implant: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SLEEP STUDIES (PSG) =====
router.get('/sleep-studies', requireAuth, requireTenantScope, requireRole('sleep_physician'), async (req, res) => {
    try {
        const { patient_id, diagnosis, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT s.*, p.full_name AS patient_name FROM pulmonology_sleep_studies s LEFT JOIN patients p ON p.id::text = s.patient_id WHERE s.tenant_id = $1`;
        if (patient_id) { sql += ` AND s.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (diagnosis) { sql += ` AND s.diagnosis = $${params.length + 1}`; params.push(diagnosis); }
        sql += ` ORDER BY s.study_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/sleep-studies', requireAuth, requireTenantScope, requireRole('sleep_physician'), async (req, res) => {
    try {
        const { patient_id, encounter_id, study_date, ahi_index, lowest_oxygen_saturation, sleep_efficiency, diagnosis, recommendation } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (ahi_index !== undefined && ahi_index < 0) return res.status(400).json({ ok: false, error: 'invalid_ahi' });
        if (lowest_oxygen_saturation !== undefined && (lowest_oxygen_saturation < 0 || lowest_oxygen_saturation > 100)) return res.status(400).json({ ok: false, error: 'oxygen_out_of_range_0_100' });
        if (sleep_efficiency !== undefined && (sleep_efficiency < 0 || sleep_efficiency > 100)) return res.status(400).json({ ok: false, error: 'efficiency_out_of_range_0_100' });
        if (diagnosis && !VALID_SLEEP_DX.includes(diagnosis)) return res.status(400).json({ ok: false, error: 'invalid_diagnosis' });

        const r = await db.query(
            `INSERT INTO pulmonology_sleep_studies (tenant_id, patient_id, encounter_id, study_date, ahi_index, lowest_oxygen_saturation, sleep_efficiency, diagnosis, recommendation)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             study_date || new Date().toISOString(), ahi_index ?? null, lowest_oxygen_saturation ?? null,
             sleep_efficiency ?? null, diagnosis || null, recommendation || null]
        );
        res.status(201).json({
            ok: true, study: r.rows[0],
            computed: {
                ahi_severity: ahiSeverity(ahi_index),
                oxygen_severity: oxygenSeverity(lowest_oxygen_saturation)
            }
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const rehab = await db.query(
            `SELECT therapy_type, status, COUNT(*) AS count FROM rehab_patients WHERE tenant_id = $1 GROUP BY therapy_type, status ORDER BY count DESC`,
            [req.tenantId]
        );
        const audio = await db.query(
            `SELECT COUNT(*) AS total_audiograms, AVG((COALESCE(right_ac_500,0)+COALESCE(right_ac_1000,0)+COALESCE(right_ac_2000,0))/3) AS avg_right_pta
             FROM audiogram_records WHERE tenant_id = $1 AND test_date >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const cochlear = await db.query(
            `SELECT implant_brand, COUNT(*) AS count FROM cochlear_implant_registry WHERE tenant_id = $1 GROUP BY implant_brand`,
            [req.tenantId]
        );
        const sleep = await db.query(
            `SELECT diagnosis, AVG(ahi_index) AS avg_ahi, COUNT(*) AS count FROM pulmonology_sleep_studies
             WHERE tenant_id = $1 AND study_date >= NOW() - INTERVAL '90 days' GROUP BY diagnosis ORDER BY count DESC`,
            [req.tenantId]
        );
        const rom = await db.query(
            `SELECT AVG(rom_degrees) AS avg_rom, AVG(balance_score) AS avg_balance FROM rehab_physical_logs
             WHERE tenant_id = $1 AND log_date >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        res.json({ ok: true, rehab: rehab.rows, audiometry_90d: audio.rows[0], cochlear_distribution: cochlear.rows, sleep_90d: sleep.rows, pt_90d: rom.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
