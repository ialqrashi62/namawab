'use strict';
// Wave 104 — Radiology registry + cardio-thoracic CPB metrics + chaplaincy spiritual care
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_MODALITY = ['xray','ct','mri','ultrasound','mammography','fluoroscopy','pet','nuclear_medicine','dexa','angiography','interventional'];
const VALID_BODY_PART = ['chest','abdomen','pelvis','head','brain','spine','neck','knee','shoulder','ankle','wrist','hip','foot','hand','whole_body','other'];
const VALID_CONTRAST = ['none','iodinated','gadolinium','barium','oral','iv_both'];
const VALID_IMPRESSION = ['normal','benign','indeterminate','suspicious','malignant','critical','inconclusive'];
const VALID_FAITH = ['muslim','christian','jew','buddhist','hindu','sikh','spiritual_not_religious','none','prefer_not_to_say','other'];
const VALID_VISIT_TYPE = ['initial','follow_up','end_of_life','bereavement','crisis','routine','family_meeting','religious_ritual'];
const VALID_KINETIC = ['washout','plateau','progressive','persistent','unknown'];
const VALID_RISK = ['low','moderate','high','critical'];

function impressionSeverity(imp) {
    const map = { normal: 0, benign: 1, inconclusive: 2, indeterminate: 3, suspicious: 4, critical: 5, malignant: 5 };
    return map[imp] ?? null;
}

function cpbDuration(cpbStart, cpbEnd) {
    if (!cpbStart || !cpbEnd) return null;
    const ms = new Date(cpbEnd) - new Date(cpbStart);
    return Math.round(ms / 60000);
}

function clampDuration(crossClampStart, crossClampEnd) {
    if (!crossClampStart || !crossClampEnd) return null;
    const ms = new Date(crossClampEnd) - new Date(crossClampStart);
    return Math.round(ms / 60000);
}

function ejectionFractionRisk(ef) {
    if (ef === undefined || ef === null) return null;
    if (ef >= 55) return 'normal';
    if (ef >= 45) return 'mildly_reduced';
    if (ef >= 35) return 'moderately_reduced';
    if (ef >= 25) return 'severely_reduced';
    return 'very_severe';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'rad-ct-chaplain',
        endpoints: [
            'GET /radiology/studies',
            'GET /radiology/studies/:id',
            'POST /radiology/studies',
            'GET /radiology/advanced-metrics',
            'POST /radiology/advanced-metrics',
            'GET /radiology/catalog',
            'POST /radiology/result-acknowledgement',
            'GET /ct/metrics',
            'POST /ct/metrics',
            'GET /chaplaincy/visits',
            'POST /chaplaincy/visits',
            'GET /chaplaincy/assessments',
            'POST /chaplaincy/assessments',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== RADIOLOGY STUDIES =====
router.get('/radiology/studies', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const { patient_id, modality, body_part, contrast, impression, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT r.*, p.full_name AS patient_name FROM radiology_studies r LEFT JOIN patients p ON p.id::text = r.patient_id WHERE r.tenant_id = $1`;
        if (patient_id) { sql += ` AND r.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (modality) { sql += ` AND r.modality = $${params.length + 1}`; params.push(modality); }
        if (body_part) { sql += ` AND r.body_part = $${params.length + 1}`; params.push(body_part); }
        if (contrast !== undefined) { sql += ` AND r.contrast = $${params.length + 1}`; params.push(contrast === 'true'); }
        if (impression) { sql += ` AND r.impression = $${params.length + 1}`; params.push(impression); }
        sql += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/radiology/studies/:id', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const r = await db.query(`SELECT r.*, p.full_name AS patient_name FROM radiology_studies r LEFT JOIN patients p ON p.id::text = r.patient_id WHERE r.tenant_id = $1 AND r.id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'study_not_found' });
        res.json({ ok: true, study: r.rows[0], severity_score: impressionSeverity(r.rows[0].impression) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/radiology/studies', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, modality, body_part, contrast, findings, impression, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!modality || !VALID_MODALITY.includes(modality)) return res.status(400).json({ ok: false, error: 'invalid_modality', valid: VALID_MODALITY });
        if (!body_part || !VALID_BODY_PART.includes(body_part)) return res.status(400).json({ ok: false, error: 'invalid_body_part', valid: VALID_BODY_PART });
        if (impression && !VALID_IMPRESSION.includes(impression)) return res.status(400).json({ ok: false, error: 'invalid_impression', valid: VALID_IMPRESSION });

        const r = await db.query(
            `INSERT INTO radiology_studies (tenant_id, patient_id, encounter_id, modality, body_part, contrast, findings, impression, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             modality, body_part, !!contrast, findings || null, impression || null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, study: r.rows[0], severity: impressionSeverity(impression) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== RADIOLOGY ADVANCED METRICS (AI + lesion volumetry) =====
router.get('/radiology/advanced-metrics', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const { patient_id, kinetic_curve_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM radiology_advanced_metrics WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (kinetic_curve_type) { sql += ` AND kinetic_curve_type = $${params.length + 1}`; params.push(kinetic_curve_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/radiology/advanced-metrics', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const { patient_id, procedure_id, lesion_volume_mm3, kinetic_curve_type, contrast_enhancement_rate, ai_detection_confidence } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (lesion_volume_mm3 !== undefined && lesion_volume_mm3 < 0) return res.status(400).json({ ok: false, error: 'invalid_volume' });
        if (ai_detection_confidence !== undefined && (ai_detection_confidence < 0 || ai_detection_confidence > 1)) return res.status(400).json({ ok: false, error: 'ai_confidence_out_of_range_0_1' });
        if (kinetic_curve_type && !VALID_KINETIC.includes(kinetic_curve_type)) return res.status(400).json({ ok: false, error: 'invalid_kinetic_curve' });

        const r = await db.query(
            `INSERT INTO radiology_advanced_metrics (tenant_id, patient_id, procedure_id, lesion_volume_mm3, kinetic_curve_type, contrast_enhancement_rate, ai_detection_confidence)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), procedure_id ? String(procedure_id) : null,
             lesion_volume_mm3 ?? null, kinetic_curve_type || null, contrast_enhancement_rate ?? null, ai_detection_confidence ?? null]
        );
        res.status(201).json({ ok: true, metric: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== RADIOLOGY CATALOG =====
router.get('/radiology/catalog', requireAuth, requireTenantScope, requireRole('radiologist'), async (req, res) => {
    try {
        const { modality, q, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM radiology_catalog WHERE 1=1`;
        if (modality) { sql += ` AND modality = $${params.length + 1}`; params.push(modality); }
        if (q) { sql += ` AND exact_name ILIKE $${params.length + 1}`; params.push(`%${q}%`); }
        sql += ` ORDER BY modality, exact_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/radiology/result-acknowledgement', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { result_type, result_id, patient_id, ack_level, note } = req.body;
        if (!result_type) return res.status(400).json({ ok: false, error: 'result_type_required' });
        if (!result_id) return res.status(400).json({ ok: false, error: 'result_id_required' });
        if (!ack_level || !['acknowledged','reviewed','actioned'].includes(ack_level)) return res.status(400).json({ ok: false, error: 'invalid_ack_level', valid: ['acknowledged','reviewed','actioned'] });

        const r = await db.query(
            `INSERT INTO result_acknowledgements (tenant_id, result_type, result_id, patient_id, ack_level, acknowledged_by, acknowledged_by_name, note)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [req.tenantId, result_type, result_id, patient_id || null, ack_level,
             req.user?.id || null, req.user?.full_name || req.user?.username || null, note || null]
        );
        res.status(201).json({ ok: true, acknowledgement: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CARDIO-THORACIC CPB METRICS =====
router.get('/ct/metrics', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { procedure_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cardio_thoracic_metrics WHERE tenant_id = $1`;
        if (procedure_id) { sql += ` AND procedure_id = $${params.length + 1}`; params.push(String(procedure_id)); }
        sql += ` ORDER BY cpb_start DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ct/metrics', requireAuth, requireTenantScope, requireRole('physician'), async (req, res) => {
    try {
        const { procedure_id, cpb_start, cpb_end, cross_clamp_start, cross_clamp_end, pump_flow_rate } = req.body;
        if (!procedure_id) return res.status(400).json({ ok: false, error: 'procedure_id_required' });
        if (!cpb_start) return res.status(400).json({ ok: false, error: 'cpb_start_required' });
        if (cpb_end && new Date(cpb_end) < new Date(cpb_start)) return res.status(400).json({ ok: false, error: 'cpb_end_before_start' });
        if (cross_clamp_start && cross_clamp_end && new Date(cross_clamp_end) < new Date(cross_clamp_start)) return res.status(400).json({ ok: false, error: 'clamp_end_before_start' });

        const cpbMinutes = cpbDuration(cpb_start, cpb_end);
        const clampMinutes = clampDuration(cross_clamp_start, cross_clamp_end);

        const r = await db.query(
            `INSERT INTO cardio_thoracic_metrics (tenant_id, procedure_id, cpb_start, cpb_end, cross_clamp_start, cross_clamp_end, pump_flow_rate)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(procedure_id), cpb_start, cpb_end || null,
             cross_clamp_start || null, cross_clamp_end || null, pump_flow_rate ?? null]
        );
        res.status(201).json({ ok: true, metric: r.rows[0], computed: { cpb_minutes: cpbMinutes, cross_clamp_minutes: clampMinutes } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CHAPLAINCY VISITS =====
router.get('/chaplaincy/visits', requireAuth, requireTenantScope, requireRole('chaplain'), async (req, res) => {
    try {
        const { patient_id, visit_type, faith_tradition, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT c.*, p.full_name AS patient_name FROM chaplaincy_visits c LEFT JOIN patients p ON p.id::text = c.patient_id WHERE c.tenant_id = $1`;
        if (patient_id) { sql += ` AND c.patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (visit_type) { sql += ` AND c.visit_type = $${params.length + 1}`; params.push(visit_type); }
        if (faith_tradition) { sql += ` AND c.faith_tradition = $${params.length + 1}`; params.push(faith_tradition); }
        sql += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/chaplaincy/visits', requireAuth, requireTenantScope, requireRole('chaplain'), async (req, res) => {
    try {
        const { patient_id, encounter_id, visit_type, spiritual_concern, faith_tradition, family_notified, comfort_provided, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!visit_type || !VALID_VISIT_TYPE.includes(visit_type)) return res.status(400).json({ ok: false, error: 'invalid_visit_type', valid: VALID_VISIT_TYPE });
        if (faith_tradition && !VALID_FAITH.includes(faith_tradition)) return res.status(400).json({ ok: false, error: 'invalid_faith_tradition', valid: VALID_FAITH });

        const r = await db.query(
            `INSERT INTO chaplaincy_visits (tenant_id, patient_id, encounter_id, visit_type, spiritual_concern, faith_tradition, family_notified, comfort_provided, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             visit_type, spiritual_concern || null, faith_tradition || null,
             family_notified === true, comfort_provided || null,
             created_by ? String(created_by) : (req.user?.id ? String(req.user.id) : null)]
        );
        res.status(201).json({ ok: true, visit: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CHAPLAINCY ASSESSMENTS (engine pattern) =====
router.get('/chaplaincy/assessments', requireAuth, requireTenantScope, requireRole('chaplain'), async (req, res) => {
    try {
        const { patient_id, engine_name, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM chaplaincy_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (engine_name) { sql += ` AND engine_name = $${params.length + 1}`; params.push(engine_name); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/chaplaincy/assessments', requireAuth, requireTenantScope, requireRole('chaplain'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!engine_name) return res.status(400).json({ ok: false, error: 'engine_name_required' });
        if (risk_level && !VALID_RISK.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk_level' });

        const r = await db.query(
            `INSERT INTO chaplaincy_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, engine_name, input_payload || null,
             req.body.output_payload || null, score ?? null, risk_level || null, recommendation || null,
             performed_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const studies = await db.query(
            `SELECT modality, body_part, COUNT(*) AS count FROM radiology_studies WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY modality, body_part ORDER BY count DESC`,
            [req.tenantId]
        );
        const impression = await db.query(
            `SELECT impression, COUNT(*) AS count FROM radiology_studies WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY impression ORDER BY count DESC`,
            [req.tenantId]
        );
        const cpb = await db.query(
            `SELECT COUNT(*) AS cases, AVG(EXTRACT(EPOCH FROM (cpb_end - cpb_start))/60) AS avg_cpb_minutes FROM cardio_thoracic_metrics WHERE tenant_id = $1 AND cpb_end IS NOT NULL`,
            [req.tenantId]
        );
        const visits = await db.query(
            `SELECT visit_type, faith_tradition, COUNT(*) AS count FROM chaplaincy_visits WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY visit_type, faith_tradition ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, radiology_modalities_90d: studies.rows, impression_breakdown_90d: impression.rows, cpb_stats: cpb.rows[0], chaplaincy_visits_90d: visits.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
