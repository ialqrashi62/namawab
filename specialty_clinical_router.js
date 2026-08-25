'use strict';
// Wave 127 — Specialty clinical (Cardiology, Pulmonology, ENT, Audiology, Eye, Dental, Portal, Telemed, AI voice)
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_RHYTHM = ['sinus','afib','aflutter','svt','vtach','vfib','paced','junctional','sinus_brady','sinus_tachy'];
const VALID_AXIS = ['normal','left_deviation','right_deviation','extreme_axis'];
const VALID_ECG_TYPE = ['resting_12lead','rhythm_strip','stress','holter','event_monitor','telemetry'];
const VALID_TYMP = ['A','As','Ad','B','C','normal','flat','reduced','increased'];
const VALID_GLAUCOMA_DEVICE = ['none','trabeculectomy','tube_shunt','MIGS','laser_SLT','laser_PI'];
const VALID_IOL_TYPE = ['monofocal','multifocal','toric','accommodating','EDOF','phakic'];
const VALID_DENTAL_SURFACE = ['occlusal','mesial','distal','buccal','lingual','incisal','cervical','multiple'];
const VALID_PFT_INTERP = ['normal','restrictive','obstructive','mixed','severe_obstruction'];
const VALID_GOLD = ['GOLD_1','GOLD_2','GOLD_3','GOLD_4','PRISm'];
const VALID_SMOKING = ['never','former','current','passive','unknown'];
const VALID_SLEEP_DIAG = ['normal','mild_OSA','moderate_OSA','severe_OSA','central_sleep_apnea','mixed_apnea','hypoventilation','upper_airway_resistance'];
const VALID_PROC_TYPE_CARD = ['ECG','echo','stress_test','holter','cath','PCI','EP_study','ablation','TEE','stress_echo'];
const VALID_TELEMED_TYPE = ['consultation','follow_up','second_opinion','emergency','chronic_care'];
const VALID_TELEMED_STATUS = ['scheduled','in_progress','completed','cancelled','no_show','rescheduled'];
const VALID_PORTAL_STATUS = ['pending','confirmed','cancelled','completed','rescheduled'];
const VALID_APPT_STATUS = ['scheduled','arrived','in_consultation','completed','cancelled','no_show','rescheduled','confirmed'];
const VALID_AI_SESSION = ['dictation','consultation','discharge','progress_note','surgical_note','radiology','pathology','other'];

function bpCategory(systolic, diastolic) {
    const s = parseInt(systolic);
    const d = parseInt(diastolic);
    if (isNaN(s) || isNaN(d)) return null;
    if (s >= 180 || d >= 120) return 'hypertensive_crisis';
    if (s >= 140 || d >= 90) return 'stage_2_HTN';
    if (s >= 130 || d >= 80) return 'stage_1_HTN';
    if (s >= 120) return 'elevated';
    return 'normal';
}

function hearLossGrade(ac) {
    const v = parseInt(ac);
    if (isNaN(v)) return null;
    if (v <= 25) return 'normal';
    if (v <= 40) return 'mild';
    if (v <= 55) return 'moderate';
    if (v <= 70) return 'moderately_severe';
    if (v <= 90) return 'severe';
    return 'profound';
}

function iopRiskCategory(iop) {
    const v = parseFloat(iop);
    if (isNaN(v)) return null;
    if (v < 6) return 'hypotony';
    if (v < 22) return 'normal';
    if (v < 30) return 'elevated';
    if (v < 40) return 'high';
    return 'very_high';
}

function cupToDiscRisk(cdr) {
    const v = parseFloat(cdr);
    if (isNaN(v)) return null;
    if (v < 0.3) return 'normal';
    if (v < 0.5) return 'borderline';
    if (v < 0.7) return 'suspicious';
    if (v < 0.9) return 'high_suspicion';
    return 'advanced';
}

function snellenDecimal(va) {
    if (!va) return null;
    const map = { '20/20': 1.0, '20/25': 0.8, '20/30': 0.67, '20/40': 0.5, '20/50': 0.4, '20/60': 0.33, '20/80': 0.25, '20/100': 0.2, '20/200': 0.1, 'CF': 0.05, 'HM': 0.02, 'LP': 0.01, 'NLP': 0 };
    return map[va] !== undefined ? map[va] : null;
}

function periodontalStage(probingDepth) {
    const pd = parseInt(probingDepth);
    if (isNaN(pd)) return null;
    if (pd <= 3) return 'stage_1';
    if (pd <= 5) return 'stage_2';
    if (pd <= 7) return 'stage_3';
    return 'stage_4';
}

function ahiSeverity(ahi) {
    const v = parseFloat(ahi);
    if (isNaN(v)) return null;
    if (v < 5) return 'normal';
    if (v < 15) return 'mild';
    if (v < 30) return 'moderate';
    return 'severe';
}

function goldStage(fev1Predicted) {
    const v = parseFloat(fev1Predicted);
    if (isNaN(v)) return null;
    if (v >= 80) return 'GOLD_1';
    if (v >= 50) return 'GOLD_2';
    if (v >= 30) return 'GOLD_3';
    return 'GOLD_4';
}

function packYears(packsPerDay, years) {
    const p = parseFloat(packsPerDay || 0);
    const y = parseFloat(years || 0);
    return Math.round(p * y * 100) / 100;
}

function cathSyntax(blockage) {
    const b = parseInt(blockage);
    if (isNaN(b) || b < 0) return null;
    if (b < 50) return 'minimal';
    if (b < 70) return 'mild';
    if (b < 90) return 'moderate';
    return 'severe';
}

function telemedDuration(start, end) {
    if (!start || !end) return null;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    return Math.round((e - s) / 60000);
}

function portalAccountAge(createdAt) {
    if (!createdAt) return null;
    const d = new Date(createdAt);
    if (isNaN(d.getTime())) return null;
    return Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));
}

function aiTranscriptionConfidence(score) {
    const s = parseFloat(score);
    if (isNaN(s)) return null;
    if (s >= 0.95) return 'excellent';
    if (s >= 0.85) return 'good';
    if (s >= 0.7) return 'acceptable';
    return 'poor';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true, version: '1.0.0', module: 'specialty-clinical',
        endpoints: [
            'GET/POST /appointments',
            'GET/POST /online-bookings',
            'GET/POST /portal/users',
            'GET/POST /portal/appointments',
            'GET/POST /portal/messages',
            'GET/POST /telemed/sessions',
            'GET/POST /ai/voice-sessions',
            'GET/POST /cardio/visits',
            'GET/POST /cardio/procedures',
            'GET/POST /cardio/cath',
            'GET/POST /cardio/medications',
            'GET/POST /ecg/records',
            'GET/POST /pulmonology/encounters',
            'GET/POST /pulmonology/pft',
            'GET/POST /pulmonology/bronchoscopy',
            'GET/POST /pulmonology/sleep',
            'GET/POST /audiograms',
            'GET/POST /audiometry',
            'GET/POST /cochlear-implants',
            'GET/POST /ent-surgery',
            'GET/POST /eye-exams',
            'GET/POST /glaucoma',
            'GET/POST /iol',
            'GET/POST /ophthalmic-surgery',
            'GET/POST /dental/records',
            'GET/POST /dental/images',
            'GET/POST /dental/periodontal',
            'GET /bp-category',
            'GET /hearing-loss-grade',
            'GET /iop-risk',
            'GET /cup-disc-risk',
            'GET /snellen-decimal',
            'GET /periodontal-stage',
            'GET /ahi-severity',
            'GET /gold-stage',
            'GET /pack-years',
            'GET /cath-syntax',
            'GET /ai-confidence',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== APPOINTMENTS =====
router.get('/appointments', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id, doctor_name, department, status, date_from, date_to, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM appointments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (doctor_name) { sql += ` AND doctor_name = $${params.length + 1}`; params.push(doctor_name); }
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (date_from) { sql += ` AND appt_date >= $${params.length + 1}`; params.push(date_from); }
        if (date_to) { sql += ` AND appt_date <= $${params.length + 1}`; params.push(date_to); }
        sql += ` ORDER BY appt_date DESC, appt_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/appointments', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!appt_date) return res.status(400).json({ ok: false, error: 'appt_date_required' });
        if (status && !VALID_APPT_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_APPT_STATUS });
        const r = await db.query(
            `INSERT INTO appointments (patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes, status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [parseInt(patient_id), patient_name || null, doctor_name || null, department || null,
             appt_date, appt_time || null, notes || null, status || 'scheduled', req.tenantId]
        );
        res.status(201).json({ ok: true, appointment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ONLINE BOOKINGS =====
router.get('/online-bookings', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, department, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM online_bookings WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/online-bookings', async (req, res) => {
    try {
        const { patient_name, phone, email, department, doctor_name, preferred_date, preferred_time, source, notes } = req.body;
        if (!patient_name) return res.status(400).json({ ok: false, error: 'patient_name_required' });
        const r = await db.query(
            `INSERT INTO online_bookings (patient_name, phone, email, department, doctor_name, preferred_date, preferred_time, status, source, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8,$9,$10) RETURNING *`,
            [patient_name, phone || null, email || null, department || null, doctor_name || null,
             preferred_date || null, preferred_time || null, source || 'website', notes || null,
             req.tenantId || 1]
        );
        res.status(201).json({ ok: true, booking: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PORTAL USERS =====
router.get('/portal/users', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { is_active, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT id, patient_id, username, email, phone, is_active, last_login, created_at, tenant_id FROM portal_users WHERE tenant_id = $1`;
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(u => ({ ...u, account_age_days: portalAccountAge(u.created_at) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/portal/users', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, username, password_hash, email, phone, is_active } = req.body;
        if (!username) return res.status(400).json({ ok: false, error: 'username_required' });
        if (!password_hash) return res.status(400).json({ ok: false, error: 'password_hash_required' });
        const r = await db.query(
            `INSERT INTO portal_users (patient_id, username, password_hash, email, phone, is_active, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, patient_id, username, email, is_active, created_at`,
            [patient_id || null, username, password_hash, email || null, phone || null,
             is_active === undefined ? 1 : (is_active ? 1 : 0), req.tenantId]
        );
        res.status(201).json({ ok: true, user: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PORTAL APPOINTMENTS =====
router.get('/portal/appointments', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM portal_appointments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/portal/appointments', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, portal_user_id, department, preferred_date, preferred_time, reason, status, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (status && !VALID_PORTAL_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_PORTAL_STATUS });
        const r = await db.query(
            `INSERT INTO portal_appointments (patient_id, portal_user_id, department, preferred_date, preferred_time, reason, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [parseInt(patient_id), portal_user_id || null, department || null,
             preferred_date || null, preferred_time || null, reason || null,
             status || 'pending', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, portal_appointment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PORTAL MESSAGES =====
router.get('/portal/messages', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, is_read, department, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM portal_messages WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (is_read !== undefined) { sql += ` AND is_read = $${params.length + 1}`; params.push(is_read === 'true'); }
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/portal/messages', async (req, res) => {
    try {
        const { patient_id, sender_type, sender_name, subject, body, department } = req.body;
        if (!patient_id || !body) return res.status(400).json({ ok: false, error: 'patient_id_and_body_required' });
        const r = await db.query(
            `INSERT INTO portal_messages (patient_id, sender_type, sender_name, subject, body, department, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [parseInt(patient_id), sender_type || 'patient', sender_name || null, subject || null,
             body, department || null, req.tenantId || 1]
        );
        res.status(201).json({ ok: true, message: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TELEMEDICINE =====
router.get('/telemed/sessions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor, status, session_type, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM telemedicine_sessions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (doctor) { sql += ` AND doctor = $${params.length + 1}`; params.push(doctor); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (session_type) { sql += ` AND session_type = $${params.length + 1}`; params.push(session_type); }
        sql += ` ORDER BY scheduled_date DESC, scheduled_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/telemed/sessions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, doctor, speciality, session_type, scheduled_date, scheduled_time, duration_minutes, meeting_link, diagnosis, prescription, status, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (session_type && !VALID_TELEMED_TYPE.includes(session_type)) return res.status(400).json({ ok: false, error: 'invalid_session_type', valid: VALID_TELEMED_TYPE });
        if (status && !VALID_TELEMED_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_TELEMED_STATUS });
        const r = await db.query(
            `INSERT INTO telemedicine_sessions (patient_id, patient_name, doctor, speciality, session_type, scheduled_date, scheduled_time, duration_minutes, meeting_link, diagnosis, prescription, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
            [parseInt(patient_id), patient_name || null, doctor || null, speciality || null,
             session_type || 'consultation', scheduled_date || null, scheduled_time || null,
             duration_minutes || 30, meeting_link || null, diagnosis || null, prescription || null,
             status || 'scheduled', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== AI VOICE SESSIONS =====
router.get('/ai/voice-sessions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { user_id, patient_id, session_type, is_finalized, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM ai_voice_sessions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (user_id) { sql += ` AND user_id = $${params.length + 1}`; params.push(parseInt(user_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (session_type) { sql += ` AND session_type = $${params.length + 1}`; params.push(session_type); }
        if (is_finalized !== undefined) { sql += ` AND is_finalized = $${params.length + 1}`; params.push(is_finalized === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(s => ({ ...s, confidence_label: aiTranscriptionConfidence(s.confidence_score) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ai/voice-sessions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { user_id, user_name, patient_id, session_type, audio_duration_sec, transcript_raw, transcript_structured, ai_model, confidence_score, draft_text, final_text, is_finalized } = req.body;
        if (!user_id) return res.status(400).json({ ok: false, error: 'user_id_required' });
        if (session_type && !VALID_AI_SESSION.includes(session_type)) return res.status(400).json({ ok: false, error: 'invalid_session_type', valid: VALID_AI_SESSION });
        const r = await db.query(
            `INSERT INTO ai_voice_sessions (user_id, user_name, patient_id, session_type, audio_duration_sec, transcript_raw, transcript_structured, ai_model, confidence_score, draft_text, final_text, is_finalized, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [parseInt(user_id), user_name || null, patient_id ? parseInt(patient_id) : null,
             session_type || 'dictation', audio_duration_sec || 0, transcript_raw || null,
             typeof transcript_structured === 'object' ? JSON.stringify(transcript_structured) : (transcript_structured || null),
             ai_model || null, confidence_score || 0, draft_text || null, final_text || null,
             is_finalized ? true : false, req.tenantId]
        );
        res.status(201).json({ ok: true, session: r.rows[0], confidence_label: aiTranscriptionConfidence(confidence_score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CARDIOLOGY: VISITS =====
router.get('/cardio/visits', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM cardiology_visits WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(v => ({ ...v, bp_category: bpCategory(v.bp_systolic, v.bp_diastolic) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cardio/visits', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, bp_systolic, bp_diastolic, heart_rate, ef_percentage, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO cardiology_visits (tenant_id, patient_id, doctor_id, bp_systolic, bp_diastolic, heart_rate, ef_percentage, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), doctor_id ? String(doctor_id) : null,
             bp_systolic || null, bp_diastolic || null, heart_rate || null,
             ef_percentage || null, notes || null]
        );
        res.status(201).json({ ok: true, visit: r.rows[0], bp_category: bpCategory(bp_systolic, bp_diastolic) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CARDIOLOGY: PROCEDURES =====
router.get('/cardio/procedures', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, procedure_type, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cardiology_procedures WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (procedure_type) { sql += ` AND procedure_type = $${params.length + 1}`; params.push(procedure_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cardio/procedures', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, procedure_type, findings, recommendations } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (procedure_type && !VALID_PROC_TYPE_CARD.includes(procedure_type)) return res.status(400).json({ ok: false, error: 'invalid_procedure_type', valid: VALID_PROC_TYPE_CARD });
        const r = await db.query(
            `INSERT INTO cardiology_procedures (patient_id, doctor_id, procedure_type, findings, recommendations, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, procedure_type || null,
             findings || null, recommendations || null, req.tenantId]
        );
        res.status(201).json({ ok: true, procedure: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CARDIOLOGY: CATH REPORTS =====
router.get('/cardio/cath', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cardiology_cath_reports WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({ ...c,
            lad_severity: cathSyntax(c.blockage_lad), lcx_severity: cathSyntax(c.blockage_lcx), rca_severity: cathSyntax(c.blockage_rca)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cardio/cath', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, blockage_lad, blockage_lcx, blockage_rca, findings } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO cardiology_cath_reports (patient_id, blockage_lad, blockage_lcx, blockage_rca, findings, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [parseInt(patient_id), blockage_lad || 0, blockage_lcx || 0, blockage_rca || 0, findings || null, req.tenantId]
        );
        res.status(201).json({ ok: true, cath: r.rows[0],
            lad_severity: cathSyntax(blockage_lad), lcx_severity: cathSyntax(blockage_lcx), rca_severity: cathSyntax(blockage_rca) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CARDIOLOGY: MEDICATIONS =====
router.get('/cardio/medications', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, is_active, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM cardiac_medications WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cardio/medications', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, drug_name, dosage, frequency, start_date, end_date, is_active } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO cardiac_medications (tenant_id, patient_id, drug_name, dosage, frequency, start_date, end_date, is_active)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), drug_name || null, dosage || null,
             frequency || null, start_date || null, end_date || null, is_active !== false]
        );
        res.status(201).json({ ok: true, medication: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ECG RECORDS =====
router.get('/ecg/records', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM ecg_records WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ecg/records', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, leads_data, heart_rate, interpretation } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO ecg_records (patient_id, doctor_id, leads_data, heart_rate, interpretation, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null,
             typeof leads_data === 'object' ? JSON.stringify(leads_data) : (leads_data || null),
             heart_rate || null, interpretation || null, req.tenantId]
        );
        res.status(201).json({ ok: true, ecg: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PULMONOLOGY: ENCOUNTERS =====
router.get('/pulmonology/encounters', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, status, days = 90, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM pulmonology_encounters WHERE tenant_id::text = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY encounter_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pulmonology/encounters', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, encounter_date, chief_complaint, respiratory_history, smoking_status, pack_years, physical_exam_findings, diagnosis_code, treatment_plan, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (smoking_status && !VALID_SMOKING.includes(smoking_status)) return res.status(400).json({ ok: false, error: 'invalid_smoking', valid: VALID_SMOKING });
        const r = await db.query(
            `INSERT INTO pulmonology_encounters (tenant_id, patient_id, doctor_id, encounter_date, chief_complaint, respiratory_history, smoking_status, pack_years, physical_exam_findings, diagnosis_code, treatment_plan, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [String(req.tenantId), String(patient_id), doctor_id ? String(doctor_id) : null,
             encounter_date || new Date().toISOString(), chief_complaint || null, respiratory_history || null,
             smoking_status || 'unknown', pack_years || null,
             typeof physical_exam_findings === 'object' ? JSON.stringify(physical_exam_findings) : (physical_exam_findings || null),
             diagnosis_code || null, treatment_plan || null, status || 'active']
        );
        res.status(201).json({ ok: true, encounter: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PULMONOLOGY: PFT =====
router.get('/pulmonology/pft', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, interpretation, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pulmonary_function_tests WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (interpretation) { sql += ` AND interpretation = $${params.length + 1}`; params.push(interpretation); }
        sql += ` ORDER BY test_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pulmonology/pft', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, test_date, fev1, fvc, fev1_fvc_ratio, pef, interpretation, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (interpretation && !VALID_PFT_INTERP.includes(interpretation)) return res.status(400).json({ ok: false, error: 'invalid_interpretation', valid: VALID_PFT_INTERP });
        const r = await db.query(
            `INSERT INTO pulmonary_function_tests (patient_id, doctor_id, test_date, fev1, fvc, fev1_fvc_ratio, pef, interpretation, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, test_date || null,
             fev1 || null, fvc || null, fev1_fvc_ratio || null, pef || null,
             interpretation || 'normal', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, pft: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PULMONOLOGY: BRONCHOSCOPY =====
router.get('/pulmonology/bronchoscopy', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM pulmonology_bronchoscopy WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        sql += ` ORDER BY procedure_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pulmonology/bronchoscopy', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { encounter_id, procedure_date, findings, biopsy_taken, specimen_details, complications } = req.body;
        if (!encounter_id) return res.status(400).json({ ok: false, error: 'encounter_id_required' });
        const r = await db.query(
            `INSERT INTO pulmonology_bronchoscopy (encounter_id, tenant_id, procedure_date, findings, biopsy_taken, specimen_details, complications)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(encounter_id), String(req.tenantId), procedure_date || new Date().toISOString(),
             findings || null, biopsy_taken ? true : false, specimen_details || null, complications || null]
        );
        res.status(201).json({ ok: true, bronchoscopy: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PULMONOLOGY: SLEEP =====
router.get('/pulmonology/sleep', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { diagnosis, days = 365, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM pulmonology_sleep_studies WHERE tenant_id::text = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        params.push(String(req.tenantId));
        if (diagnosis) { sql += ` AND diagnosis = $${params.length + 1}`; params.push(diagnosis); }
        sql += ` ORDER BY study_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(s => ({ ...s, ahi_severity: ahiSeverity(s.ahi_index) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pulmonology/sleep', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { encounter_id, study_date, ahi_index, lowest_oxygen_saturation, sleep_efficiency, diagnosis, recommendation } = req.body;
        if (!encounter_id) return res.status(400).json({ ok: false, error: 'encounter_id_required' });
        if (diagnosis && !VALID_SLEEP_DIAG.includes(diagnosis)) return res.status(400).json({ ok: false, error: 'invalid_diagnosis', valid: VALID_SLEEP_DIAG });
        const r = await db.query(
            `INSERT INTO pulmonology_sleep_studies (encounter_id, tenant_id, study_date, ahi_index, lowest_oxygen_saturation, sleep_efficiency, diagnosis, recommendation)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(encounter_id), String(req.tenantId), study_date || new Date().toISOString(),
             ahi_index || null, lowest_oxygen_saturation || null, sleep_efficiency || null,
             diagnosis || null, recommendation || null]
        );
        res.status(201).json({ ok: true, sleep: r.rows[0], ahi_severity: ahiSeverity(ahi_index) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== AUDIOMETRY: AUDIOGRAM RECORDS =====
router.get('/audiograms', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM audiogram_records WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY test_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({
            ...a,
            right_pta: a.right_ac_500 && a.right_ac_1000 && a.right_ac_2000 ? Math.round((a.right_ac_500 + a.right_ac_1000 + a.right_ac_2000) / 3) : null,
            left_pta: a.left_ac_500 && a.left_ac_1000 && a.left_ac_2000 ? Math.round((a.left_ac_500 + a.left_ac_1000 + a.left_ac_2000) / 3) : null,
            right_grade: hearLossGrade(a.right_ac_1000),
            left_grade: hearLossGrade(a.left_ac_1000)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/audiograms', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, test_date, right_ac_250, right_ac_500, right_ac_1000, right_ac_2000, right_ac_4000, right_ac_8000, left_ac_250, left_ac_500, left_ac_1000, left_ac_2000, left_ac_4000, left_ac_8000, right_bc_500, left_bc_500, right_srt, left_srt, right_sd_score, left_sd_score, otoscopy_right, otoscopy_left, tympanometry_right, tympanometry_left, interpretation, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (tympanometry_right && !VALID_TYMP.includes(tympanometry_right)) return res.status(400).json({ ok: false, error: 'invalid_tympanometry', valid: VALID_TYMP });
        const r = await db.query(
            `INSERT INTO audiogram_records (patient_id, doctor_id, test_date, right_ac_250, right_ac_500, right_ac_1000, right_ac_2000, right_ac_4000, right_ac_8000, left_ac_250, left_ac_500, left_ac_1000, left_ac_2000, left_ac_4000, left_ac_8000, right_bc_250, right_bc_500, right_bc_1000, right_bc_2000, right_bc_4000, left_bc_250, left_bc_500, left_bc_1000, left_bc_2000, left_bc_4000, right_srt, left_srt, right_sd_score, left_sd_score, otoscopy_right, otoscopy_left, tympanometry_right, tympanometry_left, interpretation, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, test_date || null,
             right_ac_250||null, right_ac_500||null, right_ac_1000||null, right_ac_2000||null, right_ac_4000||null, right_ac_8000||null,
             left_ac_250||null, left_ac_500||null, left_ac_1000||null, left_ac_2000||null, left_ac_4000||null, left_ac_8000||null,
             right_bc_250||null, right_bc_500||null, right_bc_1000||null, right_bc_2000||null, right_bc_4000||null,
             left_bc_250||null, left_bc_500||null, left_bc_1000||null, left_bc_2000||null, left_bc_4000||null,
             right_srt||null, left_srt||null, right_sd_score||null, left_sd_score||null,
             otoscopy_right||null, otoscopy_left||null, tympanometry_right||null, tympanometry_left||null,
             interpretation||null, notes||null, req.tenantId]
        );
        res.status(201).json({ ok: true, audiogram: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== AUDIOMETRY METRICS =====
router.get('/audiometry', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, days = 365, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM audiometry_metrics WHERE tenant_id::text = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY log_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/audiometry', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, log_time, frequency_hz, threshold_db, tympanometry_type, air_bone_gap } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO audiometry_metrics (tenant_id, patient_id, log_time, frequency_hz, threshold_db, tympanometry_type, air_bone_gap)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_time || new Date().toISOString(),
             Array.isArray(frequency_hz) ? frequency_hz : null,
             Array.isArray(threshold_db) ? threshold_db : null,
             tympanometry_type || null, air_bone_gap || null]
        );
        res.status(201).json({ ok: true, metric: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COCHLEAR IMPLANTS =====
router.get('/cochlear-implants', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM cochlear_implant_registry WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cochlear-implants', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, procedure_id, implant_brand, implant_model, serial_number, mapping_parameters } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO cochlear_implant_registry (tenant_id, patient_id, procedure_id, implant_brand, implant_model, serial_number, mapping_parameters)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), procedure_id ? String(procedure_id) : null,
             implant_brand || null, implant_model || null, serial_number || null,
             typeof mapping_parameters === 'object' ? JSON.stringify(mapping_parameters) : (mapping_parameters || null)]
        );
        res.status(201).json({ ok: true, implant: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ENT SURGICAL LOGS =====
router.get('/ent-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, side, procedure_type, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM ent_surgical_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (side) { sql += ` AND side = $${params.length + 1}`; params.push(side); }
        if (procedure_type) { sql += ` AND procedure_type = $${params.length + 1}`; params.push(procedure_type); }
        sql += ` ORDER BY operation_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ent-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, side, duration_minutes, complications } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO ent_surgical_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, side, duration_minutes, complications)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), surgeon_id ? String(surgeon_id) : null,
             operation_date || new Date().toISOString(), procedure_type || null, side || null,
             duration_minutes || null, complications || null]
        );
        res.status(201).json({ ok: true, ent_surgery: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== EYE EXAMS =====
router.get('/eye-exams', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, days = 365, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM eye_exams WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY exam_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(e => ({ ...e,
            od_decimal: snellenDecimal(e.od_va_corrected || e.od_va_uncorrected),
            os_decimal: snellenDecimal(e.os_va_corrected || e.os_va_uncorrected),
            od_iop_category: iopRiskCategory(e.od_iop),
            os_iop_category: iopRiskCategory(e.os_iop)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/eye-exams', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, exam_date, od_va_uncorrected, os_va_uncorrected, od_va_corrected, os_va_corrected, od_iop, os_iop, iop_method, od_sphere, os_sphere, od_cylinder, os_cylinder, od_axis, os_axis, slit_lamp_exam, fundoscopy_exam, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO eye_exams (patient_id, doctor_id, exam_date, od_va_uncorrected, os_va_uncorrected, od_va_corrected, os_va_corrected, od_iop, os_iop, iop_method, od_sphere, os_sphere, od_cylinder, os_cylinder, od_axis, os_axis, slit_lamp_exam, fundoscopy_exam, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, exam_date || null,
             od_va_uncorrected || null, os_va_uncorrected || null,
             od_va_corrected || null, os_va_corrected || null,
             od_iop || null, os_iop || null, iop_method || null,
             od_sphere || null, os_sphere || null, od_cylinder || null, os_cylinder || null,
             od_axis || null, os_axis || null, slit_lamp_exam || null, fundoscopy_exam || null,
             notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, eye_exam: r.rows[0],
            od_iop_category: iopRiskCategory(od_iop), os_iop_category: iopRiskCategory(os_iop) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== GLAUCOMA METRICS =====
router.get('/glaucoma', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, days = 365, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM glaucoma_metrics WHERE tenant_id::text = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY log_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(g => ({ ...g,
            iop_risk: iopRiskCategory(g.iop_value), cdr_risk: cupToDiscRisk(g.cup_to_disc_ratio)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/glaucoma', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, log_time, iop_value, drainage_device, cup_to_disc_ratio, visual_field_loss_percent } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (drainage_device && !VALID_GLAUCOMA_DEVICE.includes(drainage_device)) return res.status(400).json({ ok: false, error: 'invalid_device', valid: VALID_GLAUCOMA_DEVICE });
        const r = await db.query(
            `INSERT INTO glaucoma_metrics (tenant_id, patient_id, log_time, iop_value, drainage_device, cup_to_disc_ratio, visual_field_loss_percent)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_time || new Date().toISOString(),
             iop_value || null, drainage_device || null, cup_to_disc_ratio || null, visual_field_loss_percent || null]
        );
        res.status(201).json({ ok: true, glaucoma: r.rows[0],
            iop_risk: iopRiskCategory(iop_value), cdr_risk: cupToDiscRisk(cup_to_disc_ratio) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== IOL REGISTRY =====
router.get('/iol', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, lens_type, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM iol_registry WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (lens_type) { sql += ` AND lens_type = $${params.length + 1}`; params.push(lens_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/iol', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, procedure_id, lens_type, lens_power, lens_brand, lens_serial_number, calculated_power, actual_power } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (lens_type && !VALID_IOL_TYPE.includes(lens_type)) return res.status(400).json({ ok: false, error: 'invalid_lens_type', valid: VALID_IOL_TYPE });
        const r = await db.query(
            `INSERT INTO iol_registry (tenant_id, patient_id, procedure_id, lens_type, lens_power, lens_brand, lens_serial_number, calculated_power, actual_power)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), procedure_id ? String(procedure_id) : null,
             lens_type || null, lens_power || null, lens_brand || null, lens_serial_number || null,
             calculated_power || null, actual_power || null]
        );
        res.status(201).json({ ok: true, iol: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OPHTHALMIC SURGICAL LOGS =====
router.get('/ophthalmic-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, eye_side, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM ophthalmic_surgical_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (eye_side) { sql += ` AND eye_side = $${params.length + 1}`; params.push(eye_side); }
        sql += ` ORDER BY operation_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ophthalmic-surgery', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, eye_side, duration_minutes, complications } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO ophthalmic_surgical_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, eye_side, duration_minutes, complications)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), surgeon_id ? String(surgeon_id) : null,
             operation_date || new Date().toISOString(), procedure_type || null, eye_side || null,
             duration_minutes || null, complications || null]
        );
        res.status(201).json({ ok: true, oph_surgery: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DENTAL: RECORDS =====
router.get('/dental/records', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM dental_records WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY visit_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/dental/records', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, tooth_number, condition, treatment_done, visit_date, affected_surfaces } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (affected_surfaces && !VALID_DENTAL_SURFACE.includes(affected_surfaces)) return res.status(400).json({ ok: false, error: 'invalid_surface', valid: VALID_DENTAL_SURFACE });
        const r = await db.query(
            `INSERT INTO dental_records (patient_id, tooth_number, condition, treatment_done, visit_date, affected_surfaces, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [parseInt(patient_id), tooth_number || null, condition || null, treatment_done || null,
             visit_date || new Date().toISOString(), affected_surfaces || null, req.tenantId]
        );
        res.status(201).json({ ok: true, dental: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DENTAL: IMAGES =====
router.get('/dental/images', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, image_type, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM dental_images WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (image_type) { sql += ` AND image_type = $${params.length + 1}`; params.push(image_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/dental/images', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, tooth_number, image_path, image_type } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!image_path) return res.status(400).json({ ok: false, error: 'image_path_required' });
        const r = await db.query(
            `INSERT INTO dental_images (patient_id, tooth_number, image_path, image_type, tenant_id)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [parseInt(patient_id), tooth_number || null, image_path, image_type || null, req.tenantId]
        );
        res.status(201).json({ ok: true, image: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DENTAL: PERIODONTAL =====
router.get('/dental/periodontal', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM dental_periodontal_exams WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY exam_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(p => ({ ...p, stage: periodontalStage(p.probing_depth) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/dental/periodontal', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, tooth_number, probing_depth, bleeding_on_probing, gingival_recession, exam_date } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO dental_periodontal_exams (patient_id, tooth_number, probing_depth, bleeding_on_probing, gingival_recession, tenant_id, exam_date)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [parseInt(patient_id), tooth_number || null, probing_depth || 0,
             bleeding_on_probing ? true : false, gingival_recession || 0,
             req.tenantId, exam_date || new Date().toISOString()]
        );
        res.status(201).json({ ok: true, exam: r.rows[0], stage: periodontalStage(probing_depth) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/bp-category', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { systolic, diastolic } = req.query;
        if (systolic === undefined || diastolic === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, category: bpCategory(systolic, diastolic) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/hearing-loss-grade', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { ac } = req.query;
        if (ac === undefined) return res.status(400).json({ ok: false, error: 'ac_required' });
        res.json({ ok: true, grade: hearLossGrade(ac) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/iop-risk', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { iop } = req.query;
        if (iop === undefined) return res.status(400).json({ ok: false, error: 'iop_required' });
        res.json({ ok: true, risk: iopRiskCategory(iop) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cup-disc-risk', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { cdr } = req.query;
        if (cdr === undefined) return res.status(400).json({ ok: false, error: 'cdr_required' });
        res.json({ ok: true, risk: cupToDiscRisk(cdr) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/snellen-decimal', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { va } = req.query;
        if (!va) return res.status(400).json({ ok: false, error: 'va_required' });
        res.json({ ok: true, decimal: snellenDecimal(va) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/periodontal-stage', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { probing_depth } = req.query;
        if (probing_depth === undefined) return res.status(400).json({ ok: false, error: 'probing_depth_required' });
        res.json({ ok: true, stage: periodontalStage(probing_depth) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ahi-severity', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { ahi } = req.query;
        if (ahi === undefined) return res.status(400).json({ ok: false, error: 'ahi_required' });
        res.json({ ok: true, severity: ahiSeverity(ahi) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/gold-stage', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { fev1_predicted } = req.query;
        if (fev1_predicted === undefined) return res.status(400).json({ ok: false, error: 'fev1_predicted_required' });
        res.json({ ok: true, stage: goldStage(fev1_predicted) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pack-years', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { packs_per_day, years } = req.query;
        if (packs_per_day === undefined || years === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, pack_years: packYears(packs_per_day, years) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cath-syntax', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { blockage } = req.query;
        if (blockage === undefined) return res.status(400).json({ ok: false, error: 'blockage_required' });
        res.json({ ok: true, severity: cathSyntax(blockage) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ai-confidence', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, label: aiTranscriptionConfidence(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STATS =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const appt = await db.query(`SELECT status, COUNT(*) AS count FROM appointments WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        const ob = await db.query(`SELECT status, COUNT(*) AS count FROM online_bookings WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days' GROUP BY status`, [req.tenantId]);
        const tm = await db.query(`SELECT status, COUNT(*) AS count FROM telemedicine_sessions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days' GROUP BY status`, [req.tenantId]);
        const ai = await db.query(`SELECT is_finalized, COUNT(*) AS count FROM ai_voice_sessions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '7 days' GROUP BY is_finalized`, [req.tenantId]);
        const pum = await db.query(`SELECT COUNT(*) AS count FROM portal_users WHERE tenant_id = $1 AND is_active = 1`, [req.tenantId]);
        const cv = await db.query(`SELECT COUNT(*) AS count FROM cardiology_visits WHERE tenant_id::text = $1`, [String(req.tenantId)]);
        const pft = await db.query(`SELECT interpretation, COUNT(*) AS count FROM pulmonary_function_tests WHERE tenant_id = $1 GROUP BY interpretation`, [req.tenantId]);
        const ey = await db.query(`SELECT COUNT(*) AS count FROM eye_exams WHERE tenant_id = $1`, [req.tenantId]);
        const dent = await db.query(`SELECT COUNT(*) AS count FROM dental_records WHERE tenant_id = $1`, [req.tenantId]);
        res.json({
            ok: true,
            appointments: appt.rows,
            online_bookings_30d: ob.rows,
            telemedicine_30d: tm.rows,
            ai_voice_7d: ai.rows,
            active_portal_users: parseInt(pum.rows[0].count),
            cardiology_visits: parseInt(cv.rows[0].count),
            pft: pft.rows,
            eye_exams: parseInt(ey.rows[0].count),
            dental_records: parseInt(dent.rows[0].count)
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
