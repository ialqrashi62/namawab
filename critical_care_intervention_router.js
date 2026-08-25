'use strict';
// Wave 105 — Critical care (hemodynamics + ventilation + sepsis bundle + shock titration) + interventional (stent + vascular graft)
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_VENT_MODE = ['AC','SIMV','PRVC','PSV','CPAP','BiPAP','HFOV','NIV','pressure_control','volume_control','tube_only'];
const VALID_WEANING = ['full_support','partial_support','spontaneous_trial','extubated','failed_wean','reintubated'];
const VALID_TITRATION = ['increase','decrease','maintain','switch_drug','hold','restart'];
const VALID_BUNDLE = ['compliant','partially_compliant','non_compliant','pending'];
const VALID_VESSEL = ['LAD','RCA','LCX','LM','RCA_distal','PDA','LIMA','RIMA','SVG','graft','AV_fistula','other'];
const VALID_STENT_MATERIAL = ['DES','BMS','BVS','covered','drug_eluting_balloon'];
const VALID_GRAFT = ['Dacron','PTFE','autologous_vein','autologous_artery','cryopreserved','xenograft','composite'];
const VALID_PATENCY = ['patent','stenotic','occluded','partially_occluded','unknown'];

function shockIndex(hr, sbp) {
    if (!hr || !sbp) return null;
    return Math.round((parseFloat(hr) / parseFloat(sbp)) * 100) / 100;
}

function mapSeverity(map) {
    if (map === undefined || map === null) return null;
    if (map < 65) return 'critical';
    if (map < 75) return 'low';
    return 'normal';
}

function rsbiPredictWeaning(rsbi) {
    if (rsbi === undefined || rsbi === null) return null;
    return parseFloat(rsbi) < 105 ? 'likely_successful' : 'likely_failed';
}

function oxygenationIndex(fio2, peep, pao2) {
    if (!fio2 || !peep || !pao2) return null;
    const ratio = parseFloat(pao2) / (parseFloat(fio2) / 100);
    return Math.round(ratio * 10) / 10;
}

function sepsisBundleCompliance(payload) {
    const checks = [];
    if (payload.lactate_initial !== undefined) checks.push('lactate_measured');
    if (payload.lactate_followup !== undefined) checks.push('lactate_recheck');
    if (payload.antibiotics_administered) checks.push('antibiotics_within_1h');
    if (payload.fluid_resuscitation_ml && payload.fluid_resuscitation_ml >= 1500) checks.push('fluid_30mlkg');
    const score = checks.length;
    if (score >= 4) return 'compliant';
    if (score >= 2) return 'partially_compliant';
    if (score >= 1) return 'non_compliant';
    return 'pending';
}

function steroidRisk(dose, weight) {
    if (!dose || !weight) return null;
    const perKg = parseFloat(dose) / parseFloat(weight);
    if (perKg > 5) return 'high';
    if (perKg > 2) return 'moderate';
    return 'low';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'critical-care-intervention',
        endpoints: [
            'GET /hemodynamics',
            'POST /hemodynamics',
            'GET /ventilation',
            'POST /ventilation',
            'GET /sepsis-bundle',
            'POST /sepsis-bundle',
            'GET /shock-titration',
            'POST /shock-titration',
            'GET /stents',
            'POST /stents',
            'GET /grafts',
            'POST /grafts',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== HEMODYNAMICS (critical care) =====
router.get('/hemodynamics', requireAuth, requireTenantScope, requireRole('intensivist'), async (req, res) => {
    try {
        const { patient_id, since, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM crit_care_hemodynamics WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (since) { sql += ` AND log_time >= $${params.length + 1}`; params.push(since); }
        sql += ` ORDER BY log_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/hemodynamics', requireAuth, requireTenantScope, requireRole('intensivist'), async (req, res) => {
    try {
        const { patient_id, log_time, map_value, cvp_value, cardiac_output, stroke_volume, heart_rate } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (map_value !== undefined && (map_value < 0 || map_value > 200)) return res.status(400).json({ ok: false, error: 'invalid_map' });
        if (cardiac_output !== undefined && cardiac_output <= 0) return res.status(400).json({ ok: false, error: 'invalid_co' });

        const r = await db.query(
            `INSERT INTO crit_care_hemodynamics (tenant_id, patient_id, log_time, map_value, cvp_value, cardiac_output, stroke_volume, heart_rate)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_time || new Date().toISOString(),
             map_value ?? null, cvp_value ?? null, cardiac_output ?? null, stroke_volume ?? null, heart_rate ?? null]
        );
        res.json({ ok: true, log: r.rows[0], computed: { map_severity: mapSeverity(map_value) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== VENTILATION LOGS =====
router.get('/ventilation', requireAuth, requireTenantScope, requireRole('intensivist'), async (req, res) => {
    try {
        const { patient_id, vent_mode, weaning_status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM crit_care_ventilation_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (vent_mode) { sql += ` AND vent_mode = $${params.length + 1}`; params.push(vent_mode); }
        if (weaning_status) { sql += ` AND weaning_status = $${params.length + 1}`; params.push(weaning_status); }
        sql += ` ORDER BY log_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ventilation', requireAuth, requireTenantScope, requireRole('intensivist'), async (req, res) => {
    try {
        const { patient_id, log_time, vent_mode, rsbi_value, weaning_status, fio2_percent, peep_cmh2o, pao2_mmhg } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (vent_mode && !VALID_VENT_MODE.includes(vent_mode)) return res.status(400).json({ ok: false, error: 'invalid_vent_mode' });
        if (weaning_status && !VALID_WEANING.includes(weaning_status)) return res.status(400).json({ ok: false, error: 'invalid_weaning' });
        if (fio2_percent !== undefined && (fio2_percent < 21 || fio2_percent > 100)) return res.status(400).json({ ok: false, error: 'fio2_out_of_range_21_100' });
        if (peep_cmh2o !== undefined && (peep_cmh2o < 0 || peep_cmh2o > 30)) return res.status(400).json({ ok: false, error: 'peep_out_of_range_0_30' });

        const r = await db.query(
            `INSERT INTO crit_care_ventilation_logs (tenant_id, patient_id, log_time, vent_mode, rsbi_value, weaning_status, fio2_percent, peep_cmh2o)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_time || new Date().toISOString(),
             vent_mode || null, rsbi_value ?? null, weaning_status || null,
             fio2_percent ?? null, peep_cmh2o ?? null]
        );
        const oi = oxygenationIndex(fio2_percent, peep_cmh2o, pao2_mmhg);
        const weaningPrediction = rsbiPredictWeaning(rsbi_value);
        res.json({ ok: true, log: r.rows[0], computed: { oxygenation_index: oi, weaning_prediction: weaningPrediction } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SEPSIS BUNDLE TRACKING (SSC 1-hour bundle) =====
router.get('/sepsis-bundle', requireAuth, requireTenantScope, requireRole('intensivist'), async (req, res) => {
    try {
        const { patient_id, bundle_compliance_status, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM sepsis_bundle_tracking WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (bundle_compliance_status) { sql += ` AND bundle_compliance_status = $${params.length + 1}`; params.push(bundle_compliance_status); }
        sql += ` ORDER BY bundle_start_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/sepsis-bundle', requireAuth, requireTenantScope, requireRole('intensivist'), async (req, res) => {
    try {
        const { patient_id, bundle_start_time, lactate_initial, lactate_followup, antibiotics_administered, fluid_resuscitation_ml } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (lactate_initial !== undefined && lactate_initial < 0) return res.status(400).json({ ok: false, error: 'invalid_lactate' });
        if (fluid_resuscitation_ml !== undefined && fluid_resuscitation_ml < 0) return res.status(400).json({ ok: false, error: 'invalid_fluid' });

        const bundle = sepsisBundleCompliance({ lactate_initial, lactate_followup, antibiotics_administered, fluid_resuscitation_ml });

        const r = await db.query(
            `INSERT INTO sepsis_bundle_tracking (tenant_id, patient_id, bundle_start_time, lactate_initial, lactate_followup, antibiotics_administered, fluid_resuscitation_ml, bundle_compliance_status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), bundle_start_time || new Date().toISOString(),
             lactate_initial ?? null, lactate_followup ?? null, !!antibiotics_administered,
             fluid_resuscitation_ml ?? null, bundle]
        );
        res.status(201).json({ ok: true, bundle: r.rows[0], computed: { bundle_compliance_status: bundle } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SHOCK TITRATION LOGS (vasopressors) =====
router.get('/shock-titration', requireAuth, requireTenantScope, requireRole('intensivist'), async (req, res) => {
    try {
        const { patient_id, drug_name, titration_action, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM shock_titration_logs WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(String(patient_id)); }
        if (drug_name) { sql += ` AND drug_name = $${params.length + 1}`; params.push(drug_name); }
        if (titration_action) { sql += ` AND titration_action = $${params.length + 1}`; params.push(titration_action); }
        sql += ` ORDER BY log_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/shock-titration', requireAuth, requireTenantScope, requireRole('intensivist'), async (req, res) => {
    try {
        const { patient_id, log_time, drug_name, dose_mcg_kg_min, response_map_value, titration_action } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!drug_name) return res.status(400).json({ ok: false, error: 'drug_name_required' });
        if (dose_mcg_kg_min !== undefined && dose_mcg_kg_min < 0) return res.status(400).json({ ok: false, error: 'invalid_dose' });
        if (titration_action && !VALID_TITRATION.includes(titration_action)) return res.status(400).json({ ok: false, error: 'invalid_titration_action' });

        const r = await db.query(
            `INSERT INTO shock_titration_logs (tenant_id, patient_id, log_time, drug_name, dose_mcg_kg_min, response_map_value, titration_action)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_time || new Date().toISOString(),
             drug_name, dose_mcg_kg_min ?? null, response_map_value ?? null, titration_action || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0], computed: { map_severity: mapSeverity(response_map_value) } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STENT REGISTRY =====
router.get('/stents', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { session_id, vessel_segment, material, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM stent_registry WHERE tenant_id = $1`;
        if (session_id) { sql += ` AND session_id = $${params.length + 1}`; params.push(String(session_id)); }
        if (vessel_segment) { sql += ` AND vessel_segment = $${params.length + 1}`; params.push(vessel_segment); }
        if (material) { sql += ` AND material = $${params.length + 1}`; params.push(material); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/stents', requireAuth, requireTenantScope, requireRole('cardiologist'), async (req, res) => {
    try {
        const { session_id, vessel_segment, stent_brand, diameter_mm, length_mm, material, pressure_post_dilation } = req.body;
        if (!session_id) return res.status(400).json({ ok: false, error: 'session_id_required' });
        if (!vessel_segment || !VALID_VESSEL.includes(vessel_segment)) return res.status(400).json({ ok: false, error: 'invalid_vessel_segment', valid: VALID_VESSEL });
        if (!stent_brand) return res.status(400).json({ ok: false, error: 'stent_brand_required' });
        if (diameter_mm === undefined || diameter_mm <= 0) return res.status(400).json({ ok: false, error: 'diameter_required_positive' });
        if (length_mm === undefined || length_mm <= 0) return res.status(400).json({ ok: false, error: 'length_required_positive' });
        if (material && !VALID_STENT_MATERIAL.includes(material)) return res.status(400).json({ ok: false, error: 'invalid_material' });
        if (pressure_post_dilation !== undefined && (pressure_post_dilation < 1 || pressure_post_dilation > 30)) return res.status(400).json({ ok: false, error: 'pressure_out_of_range_1_30' });

        const r = await db.query(
            `INSERT INTO stent_registry (tenant_id, session_id, vessel_segment, stent_brand, diameter_mm, length_mm, material, pressure_post_dilation)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(session_id), vessel_segment, stent_brand, diameter_mm, length_mm, material || null, pressure_post_dilation ?? null]
        );
        res.status(201).json({ ok: true, stent: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== VASCULAR GRAFT REGISTRY =====
router.get('/grafts', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { procedure_id, graft_type, patency_check_result, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM vascular_graft_registry WHERE tenant_id = $1`;
        if (procedure_id) { sql += ` AND procedure_id = $${params.length + 1}`; params.push(String(procedure_id)); }
        if (graft_type) { sql += ` AND graft_type = $${params.length + 1}`; params.push(graft_type); }
        if (patency_check_result) { sql += ` AND patency_check_result = $${params.length + 1}`; params.push(patency_check_result); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/grafts', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { procedure_id, graft_type, material, diameter_mm, location, patency_check_result } = req.body;
        if (!procedure_id) return res.status(400).json({ ok: false, error: 'procedure_id_required' });
        if (!graft_type || !VALID_GRAFT.includes(graft_type)) return res.status(400).json({ ok: false, error: 'invalid_graft_type' });
        if (patency_check_result && !VALID_PATENCY.includes(patency_check_result)) return res.status(400).json({ ok: false, error: 'invalid_patency' });
        if (diameter_mm !== undefined && diameter_mm <= 0) return res.status(400).json({ ok: false, error: 'invalid_diameter' });

        const r = await db.query(
            `INSERT INTO vascular_graft_registry (tenant_id, procedure_id, graft_type, material, diameter_mm, location, patency_check_result)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(procedure_id), graft_type, material || null,
             diameter_mm ?? null, location || null, patency_check_result || null]
        );
        res.status(201).json({ ok: true, graft: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const hem = await db.query(
            `SELECT COUNT(*) AS samples, AVG(map_value) AS avg_map, AVG(cardiac_output) AS avg_co FROM crit_care_hemodynamics
             WHERE tenant_id = $1 AND log_time >= NOW() - INTERVAL '30 days'`,
            [req.tenantId]
        );
        const vent = await db.query(
            `SELECT vent_mode, weaning_status, COUNT(*) AS count FROM crit_care_ventilation_logs
             WHERE tenant_id = $1 AND log_time >= NOW() - INTERVAL '30 days' GROUP BY vent_mode, weaning_status ORDER BY count DESC`,
            [req.tenantId]
        );
        const sepsis = await db.query(
            `SELECT bundle_compliance_status, COUNT(*) AS count FROM sepsis_bundle_tracking
             WHERE tenant_id = $1 AND bundle_start_time >= NOW() - INTERVAL '90 days' GROUP BY bundle_compliance_status`,
            [req.tenantId]
        );
        const shock = await db.query(
            `SELECT drug_name, titration_action, COUNT(*) AS count FROM shock_titration_logs
             WHERE tenant_id = $1 AND log_time >= NOW() - INTERVAL '30 days' GROUP BY drug_name, titration_action ORDER BY count DESC`,
            [req.tenantId]
        );
        const stents = await db.query(
            `SELECT vessel_segment, material, COUNT(*) AS count FROM stent_registry
             WHERE tenant_id = $1 GROUP BY vessel_segment, material ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, hemodynamics_30d: hem.rows[0], ventilation_30d: vent.rows, sepsis_90d: sepsis.rows, shock_30d: shock.rows, stent_distribution: stents.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
