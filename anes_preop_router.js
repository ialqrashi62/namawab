// filepath: namaweb/anes_preop_router.js
// Pre-op assessment + Anesthesia records + ASA classification + pre-op test ordering + count sheets + timeouts.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// --- Pre-op assessment ---
router.post('/preop', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist'), async (req, res) => {
    try {
        const { surgery_id, patient_id, npo_confirmed, allergies_reviewed, allergies_notes, medications_reviewed, medications_notes, labs_reviewed, labs_notes, imaging_reviewed, imaging_notes, blood_type_confirmed, blood_reserved, consent_signed, anesthesia_clearance, nursing_assessment, nursing_notes, cardiac_clearance, cardiac_notes, pulmonary_clearance, infection_screening, dvt_prophylaxis, overall_status, assessed_by } = req.body;
        if (!surgery_id || !patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO surgery_preop_assessments (tenant_id, surgery_id, patient_id, npo_confirmed, allergies_reviewed, allergies_notes, medications_reviewed, medications_notes, labs_reviewed, labs_notes, imaging_reviewed, imaging_notes, blood_type_confirmed, blood_reserved, consent_signed, anesthesia_clearance, nursing_assessment, nursing_notes, cardiac_clearance, cardiac_notes, pulmonary_clearance, infection_screening, dvt_prophylaxis, overall_status, assessed_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
            RETURNING id
        `, [req.tenantId, surgery_id, patient_id, !!npo_confirmed, !!allergies_reviewed, allergies_notes || '', !!medications_reviewed, medications_notes || '', !!labs_reviewed, labs_notes || '', !!imaging_reviewed, imaging_notes || '', !!blood_type_confirmed, !!blood_reserved, !!consent_signed, !!anesthesia_clearance, !!nursing_assessment, nursing_notes || '', !!cardiac_clearance, cardiac_notes || '', !!pulmonary_clearance, !!infection_screening, !!dvt_prophylaxis, overall_status || 'pending', assessed_by || req.userName || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/anes/preop', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/preop/:surgery_id', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT * FROM surgery_preop_assessments WHERE tenant_id = $1 AND surgery_id = $2
            ORDER BY created_at DESC LIMIT 1
        `, [req.tenantId, req.params.surgery_id]);
        res.json({ ok: true, assessment: r.rows[0] || null });
    } catch (err) { console.error('GET /api/anes/preop', err); res.status(500).json({ error: 'internal_error' }); }
});

// Pre-op tests ordering + results
router.post('/preop-tests', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist'), async (req, res) => {
    try {
        const { surgery_id, patient_id, tests } = req.body;
        if (!surgery_id || !patient_id || !Array.isArray(tests) || !tests.length) return res.status(400).json({ error: 'missing_required' });
        const inserted = [];
        for (const t of tests) {
            const r = await db.query(`
                INSERT INTO surgery_preop_tests (tenant_id, surgery_id, patient_id, test_type, test_name, is_required, is_completed, result_summary, order_id, notes)
                VALUES ($1,$2,$3,$4,$5,COALESCE($6,true),COALESCE($7,false),$8,$9,$10) RETURNING id
            `, [req.tenantId, surgery_id, patient_id, t.test_type || 'lab', t.test_name || '', t.is_required !== false, t.is_completed === true, t.result_summary || '', t.order_id || null, t.notes || '']);
            inserted.push(r.rows[0].id);
        }
        res.status(201).json({ ok: true, ids: inserted, count: inserted.length });
    } catch (err) { console.error('POST /api/anes/preop-tests', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/preop-tests/:surgery_id', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, test_type, test_name, is_required, is_completed, result_summary, created_at
            FROM surgery_preop_tests WHERE tenant_id = $1 AND surgery_id = $2 ORDER BY created_at DESC
        `, [req.tenantId, req.params.surgery_id]);
        const total = r.rows.length;
        const completed = r.rows.filter(x => x.is_completed).length;
        res.json({ ok: true, total, completed, completion_pct: total ? Math.round(100 * completed / total) : 0, tests: r.rows });
    } catch (err) { console.error('GET /api/anes/preop-tests', err); res.status(500).json({ error: 'internal_error' }); }
});

// ASA classification with mortality lookup
const ASA_MORTALITY = { '1': 0.06, '2': 0.27, '3': 1.8, '4': 7.8, '5': 33, '6': 99 };
router.post('/asa', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, asa_class, emergency, label, recommendation, assessed_by } = req.body;
        if (!patient_id || !asa_class || !ASA_MORTALITY[asa_class]) return res.status(400).json({ error: 'invalid_asa_class' });
        const mortality = ASA_MORTALITY[asa_class];
        const r = await db.query(`
            INSERT INTO surgery_asa_assessments (tenant_id, patient_id, encounter_id, assessed_by, asa_class, emergency, label, mortality_pct, recommendation)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, assessed_by || req.userName || '', asa_class, !!emergency, label || '', mortality, recommendation || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id, mortality_pct: mortality });
    } catch (err) { console.error('POST /api/anes/asa', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/asa/:patient_id', requireAuth, requireTenantScope, requireRole('anesthesiologist', 'surgeon'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, encounter_id, asa_class, emergency, label, mortality_pct, recommendation, assessed_by, created_at
            FROM surgery_asa_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, asa: r.rows });
    } catch (err) { console.error('GET /api/anes/asa', err); res.status(500).json({ error: 'internal_error' }); }
});

// Anesthesia record (intra-op)
router.post('/intraop', requireAuth, requireTenantScope, requireRole('anesthesiologist'), async (req, res) => {
    try {
        const { surgery_id, patient_id, anesthetist_name, asa_class, anesthesia_type, airway_assessment, mallampati_score, premedication, induction_agents, maintenance_agents, muscle_relaxants, monitors_used, iv_access, fluid_given, blood_loss_ml, complications, recovery_notes, notes } = req.body;
        if (!surgery_id || !patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO surgery_anesthesia_records (tenant_id, surgery_id, patient_id, anesthetist_name, asa_class, anesthesia_type, airway_assessment, mallampati_score, premedication, induction_agents, maintenance_agents, muscle_relaxants, monitors_used, iv_access, fluid_given, blood_loss_ml, complications, recovery_notes, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING id
        `, [req.tenantId, surgery_id, patient_id, anesthetist_name || req.userName || '', asa_class || null, anesthesia_type || 'general', airway_assessment || '', mallampati_score || null, premedication || '', induction_agents || '', maintenance_agents || '', muscle_relaxants || '', monitors_used || '', iv_access || '', fluid_given || '', blood_loss_ml || null, complications || '', recovery_notes || '', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/anes/intraop', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/intraop/:surgery_id', requireAuth, requireTenantScope, requireRole('anesthesiologist', 'surgeon'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM surgery_anesthesia_records WHERE tenant_id = $1 AND surgery_id = $2 ORDER BY created_at DESC LIMIT 1`, [req.tenantId, req.params.surgery_id]);
        res.json({ ok: true, record: r.rows[0] || null });
    } catch (err) { console.error('GET /api/anes/intraop', err); res.status(500).json({ error: 'internal_error' }); }
});

// Surgical count sheet (sponges / needles / instruments) — discrepancy detection
router.post('/count', requireAuth, requireTenantScope, requireRole('or_nurse', 'surgeon'), async (req, res) => {
    try {
        const { surgery_id, sponge_count_initial, sponge_count_final, needle_count_initial, needle_count_final, instrument_count_initial, instrument_count_final, witness1_name, witness2_name, notes } = req.body;
        if (!surgery_id) return res.status(400).json({ error: 'missing_required' });
        const spongeMatch = Number(sponge_count_initial) === Number(sponge_count_final);
        const needleMatch = Number(needle_count_initial) === Number(needle_count_final);
        const instrumentMatch = Number(instrument_count_initial) === Number(instrument_count_final);
        const allMatch = spongeMatch && needleMatch && instrumentMatch;
        const r = await db.query(`
            INSERT INTO surgery_count_sheets (tenant_id, surgery_id, sponge_count_initial, sponge_count_final, needle_count_initial, needle_count_final, instrument_count_initial, instrument_count_final, counts_match, witness1_name, witness2_name, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id
        `, [req.tenantId, surgery_id, sponge_count_initial || 0, sponge_count_final || 0, needle_count_initial || 0, needle_count_final || 0, instrument_count_initial || 0, instrument_count_final || 0, allMatch, witness1_name || '', witness2_name || '', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id, counts_match: allMatch, spongeMatch, needleMatch, instrumentMatch });
    } catch (err) { console.error('POST /api/anes/count', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/count/:surgery_id', requireAuth, requireTenantScope, requireRole('or_nurse', 'surgeon'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT * FROM surgery_count_sheets WHERE tenant_id = $1 AND surgery_id = $2 ORDER BY created_at DESC LIMIT 1
        `, [req.tenantId, req.params.surgery_id]);
        res.json({ ok: true, count_sheet: r.rows[0] || null });
    } catch (err) { console.error('GET /api/anes/count', err); res.status(500).json({ error: 'internal_error' }); }
});

// Surgical timeout (final pre-incision pause)
router.post('/timeout', requireAuth, requireTenantScope, requireRole('surgeon', 'or_nurse'), async (req, res) => {
    try {
        const { patient_id, encounter_id, phase, completed_items, missing_items, can_proceed } = req.body;
        if (!patient_id) return res.status(400).json({ error: 'missing_required' });
        const completionPct = (completed_items && Array.isArray(completed_items)) ? Math.round(100 * completed_items.length / Math.max(1, (completed_items.length + (missing_items || []).length))) : 0;
        const r = await db.query(`
            INSERT INTO surgery_timeouts (tenant_id, patient_id, encounter_id, phase, completed_items, missing_items, completion_pct, can_proceed, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9,'pending')) RETURNING id
        `, [req.tenantId, patient_id, encounter_id || null, phase || 'pre_incision', completed_items || [], missing_items || [], completionPct, !!can_proceed, req.body.status || (can_proceed ? 'cleared' : 'blocked')]);
        res.status(201).json({ ok: true, id: r.rows[0].id, completion_pct: completionPct });
    } catch (err) { console.error('POST /api/anes/timeout', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/timeout/:encounter_id', requireAuth, requireTenantScope, requireRole('surgeon', 'or_nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, phase, completion_pct, can_proceed, status, created_at
            FROM surgery_timeouts WHERE tenant_id = $1 AND encounter_id = $2 ORDER BY created_at DESC LIMIT 20
        `, [req.tenantId, req.params.encounter_id]);
        res.json({ ok: true, total: r.rows.length, timeouts: r.rows });
    } catch (err) { console.error('GET /api/anes/timeout', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['preop', 'preop-tests', 'asa', 'intraop', 'count', 'timeout'], timestamp: new Date().toISOString() });
});

module.exports = router;
