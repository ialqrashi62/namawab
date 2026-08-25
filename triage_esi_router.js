// filepath: namaweb/triage_esi_router.js
// Triage + ESI (Emergency Severity Index 1-5) classification + GCS + trauma workflow.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// ESI levels mapping (1-5)
const ESI_LEVELS = {
    '1': { label: 'Resuscitation', color: 'red', max_wait_min: 0, expected_resources: 'many' },
    '2': { label: 'Emergent', color: 'orange', max_wait_min: 10, expected_resources: 'many' },
    '3': { label: 'Urgent', color: 'yellow', max_wait_min: 30, expected_resources: 'several' },
    '4': { label: 'Less Urgent', color: 'green', max_wait_min: 60, expected_resources: 'one' },
    '5': { label: 'Non-Urgent', color: 'blue', max_wait_min: 120, expected_resources: 'none' }
};

function computeESI({ gcs, sbp, hr, spo2, pain, age, resourceCount, dangerZone }) {
    // ESI 1: intubation/unresponsive or severe hemodynamic compromise
    if (gcs != null && +gcs <= 8) return 1;
    if (sbp != null && +sbp < 70) return 1;
    if (spo2 != null && +spo2 < 85) return 1;
    if (dangerZone === true) return 1;
    // ESI 2: high-risk situation, severe pain/distress, confusion/lethargy
    if (pain != null && +pain >= 8) return 2;
    if (gcs != null && +gcs <= 13) return 2;
    if (hr != null && (+hr >= 150 || +hr < 40)) return 2;
    // ESI 3: many resources needed
    if (resourceCount != null && +resourceCount >= 3) return 3;
    // ESI 4: 1 resource
    if (resourceCount != null && +resourceCount === 1) return 4;
    // ESI 5: no resources (cold, rash, prescription refill)
    return 5;
}

// Triage-classify (compute ESI and persist to emergency_visits)
router.post('/triage', requireAuth, requireTenantScope, requireRole('triage_nurse', 'nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, arrival_mode, arrival_time, chief_complaint, chief_complaint_ar, triage_vitals, pain_score, gcs, sbp, hr, spo2, resource_count, danger_zone, acuity_notes, triage_nurse } = req.body;
        if (!patient_id || !arrival_time) return res.status(400).json({ error: 'missing_required' });
        const esi = computeESI({ gcs, sbp, hr, spo2, pain: pain_score, age: req.body.age, resourceCount: resource_count, dangerZone: danger_zone });
        const level = ESI_LEVELS[String(esi)];
        const r = await db.query(`
            INSERT INTO emergency_visits (tenant_id, patient_id, patient_name, arrival_mode, arrival_time, chief_complaint, chief_complaint_ar, triage_level, triage_color, triage_nurse, triage_vitals, acuity_notes, esi_level, esi_rationale, er_phase, triage_started_at, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'triage',$15,'waiting')
            RETURNING id, esi_level
        `, [req.tenantId, patient_id, patient_name || '', arrival_mode || 'walk-in', arrival_time, chief_complaint || '', chief_complaint_ar || '', String(esi), level.color, triage_nurse || req.userName || '', triage_vitals || '', acuity_notes || '', esi, `gcs:${gcs || 'n/a'};sbp:${sbp || 'n/a'};hr:${hr || 'n/a'};pain:${pain_score || 'n/a'};res:${resource_count || 'n/a'};danger:${danger_zone ? 'y' : 'n'}`, arrival_time]);
        res.status(201).json({ ok: true, id: r.rows[0].id, esi, level });
    } catch (err) { console.error('POST /api/triage/triage', err); res.status(500).json({ error: 'internal_error' }); }
});

// Current queue (by ESI order, lowest first)
router.get('/queue', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'ed_director', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, patient_name, arrival_time, chief_complaint, esi_level, triage_color, er_phase, status, time_to_provider_min
            FROM emergency_visits WHERE tenant_id = $1 AND status IN ('waiting','in_treatment','triage')
            ORDER BY COALESCE(esi_level, 5) ASC, arrival_time ASC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, queue: r.rows });
    } catch (err) { console.error('GET /api/triage/queue', err); res.status(500).json({ error: 'internal_error' }); }
});

// Trauma assessment (ABCDE + GCS)
router.post('/trauma', requireAuth, requireTenantScope, requireRole('ed_doctor', 'trauma_surgeon', 'nurse'), async (req, res) => {
    try {
        const { visit_id, patient_id, airway, breathing, circulation, disability, exposure, gcs_eye, gcs_verbal, gcs_motor, mechanism_of_injury, trauma_team_activated, assessed_by } = req.body;
        if (!visit_id || !patient_id) return res.status(400).json({ error: 'missing_required' });
        const eye = +gcs_eye || 4;
        const verbal = +gcs_verbal || 6;
        const motor = +gcs_motor || 6;
        const gcs_total = eye + verbal + motor;
        const r = await db.query(`
            INSERT INTO emergency_trauma_assessments (tenant_id, visit_id, patient_id, airway, breathing, circulation, disability, exposure, gcs_eye, gcs_verbal, gcs_motor, gcs_total, mechanism_of_injury, trauma_team_activated, assessed_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id, gcs_total
        `, [req.tenantId, visit_id, patient_id, airway || 'patent', breathing || 'normal', circulation || 'adequate', disability || 'none', exposure || 'no_injury', eye, verbal, motor, gcs_total, mechanism_of_injury || '', !!trauma_team_activated, assessed_by || req.userName || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id, gcs_total });
    } catch (err) { console.error('POST /api/triage/trauma', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/trauma/:visit_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT * FROM emergency_trauma_assessments WHERE tenant_id = $1 AND visit_id = $2 ORDER BY created_at DESC LIMIT 5
        `, [req.tenantId, req.params.visit_id]);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/triage/trauma', err); res.status(500).json({ error: 'internal_error' }); }
});

// Provider assignment (transitions waiting → in_treatment)
router.post('/assign/:visit_id', requireAuth, requireTenantScope, requireRole('ed_director', 'nurse', 'charge_nurse'), async (req, res) => {
    try {
        const { assigned_doctor, assigned_bed } = req.body;
        if (!assigned_doctor) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            UPDATE emergency_visits
            SET assigned_doctor = $2, assigned_bed = $3, er_phase = 'treatment', status = 'in_treatment',
                provider_assigned_at = NOW(),
                time_to_provider_min = ROUND(EXTRACT(EPOCH FROM (NOW() - arrival_time::timestamp))/60)::int
            WHERE tenant_id = $1 AND id = $4 RETURNING id
        `, [req.tenantId, assigned_doctor, assigned_bed || null, req.params.visit_id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/triage/assign', err); res.status(500).json({ error: 'internal_error' }); }
});

// ED throughput stats (door-to-doc, LWBS rate, etc.)
router.get('/stats', requireAuth, requireTenantScope, requireRole('ed_director', 'admin', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as visits_today,
                   COUNT(*) FILTER (WHERE esi_level = 1) as esi1_count,
                   COUNT(*) FILTER (WHERE esi_level = 2) as esi2_count,
                   ROUND(AVG(time_to_provider_min)::numeric, 1) as avg_door_to_doc_min,
                   COUNT(*) FILTER (WHERE status = 'waiting' AND arrival_time < NOW() - INTERVAL '1 hour') as long_waits,
                   COUNT(*) FILTER (WHERE disposition_type = 'lwbs' OR disposition_type = 'left_without_being_seen') as lwbs_count
            FROM emergency_visits WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
        `, [req.tenantId]);
        res.json({ ok: true, stats: r.rows[0] });
    } catch (err) { console.error('GET /api/triage/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/levels', (req, res) => {
    res.json({ ok: true, levels: ESI_LEVELS });
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['triage', 'queue', 'trauma', 'assign', 'stats', 'levels'], timestamp: new Date().toISOString() });
});

module.exports = router;
