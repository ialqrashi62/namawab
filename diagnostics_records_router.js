'use strict';
// Wave 126 — Diagnostics & Records (Lab, Radiology, Pathology, Endoscopy, Biopsy, Consent, ROI, Med Records, Certificates)
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_ABNORMAL_FLAG = ['L','H','HH','LL','N','A','AA'];
const VALID_SPECIMEN_STATE = ['collected','received','rejected','processing','completed','discarded'];
const VALID_LOINC_SCALE = ['Qn','Ord','Nom','Nar','Multi'];
const VALID_REPORT_STATUS = ['preliminary','final','corrected','cancelled','amended'];
const VALID_QC_LEVEL = ['L1','L2','L3','normal','abnormal'];
const VALID_WESTGARD = ['1_2s','1_3s','2_2s','R_4s','4_1s','10x'];
const VALID_SPECIMEN_TYPE = ['blood','urine','stool','sputum','csf','tissue','swab','serum','plasma','other'];
const VALID_PATH_PRIORITY = ['routine','urgent','stat'];
const VALID_PATH_STATUS = ['accessioned','grossed','processing','embedded','cutting','staining','reporting','completed','cancelled'];
const VALID_STAIN = ['H&E','IHC','special','immunofluorescence','frozen','cytology','molecular'];
const VALID_EMBEDDING = ['paraffin','frozen','cell_block','cytology','molecular'];
const VALID_MED_CERT_TYPE = ['sick_leave','fitness','disability','referral','medical_report','birth_fitness','compensation'];
const VALID_CONSENT_FORM_TYPE = ['general','surgical','anesthesia','blood_transfusion','research','photography','data_share','procedure_specific'];
const VALID_CONSENT_STATUS = ['draft','pending_signature','signed','declined','revoked','expired'];
const VALID_ROI_STATUS = ['pending','approved','rejected','fulfilled','cancelled','expired'];
const VALID_GRAM = ['positive','negative','mixed','none_seen'];
const VALID_RAD_ADV_KINETIC = ['type_I','type_II','type_III','plateau','washout','persistent'];
const VALID_IHC_SCORE = [0,1,2,3];

function deltaCheck(currentValue, prevValue) {
    const c = parseFloat(currentValue);
    const p = parseFloat(prevValue);
    if (isNaN(c) || isNaN(p) || p === 0) return null;
    return Math.round(((c - p) / p) * 1000) / 10;
}

function deltaSignificant(deltaPct, threshold = 20) {
    if (deltaPct === null) return false;
    return Math.abs(deltaPct) > threshold;
}

function refRangeCheck(value, low, high) {
    const v = parseFloat(value);
    if (isNaN(v)) return 'unknown';
    if (low !== undefined && low !== null && v < parseFloat(low)) return 'low';
    if (high !== undefined && high !== null && v > parseFloat(high)) return 'high';
    return 'normal';
}

function westgardEvaluate(z, sd) {
    if (z === undefined || z === null || sd === undefined || sd === null) return null;
    const abs = Math.abs(z);
    if (abs >= 3) return '1_3s';
    if (abs >= 2) return '1_2s';
    return 'within_2sd';
}

function suvInterpretation(suvMax) {
    const v = parseFloat(suvMax);
    if (isNaN(v)) return null;
    if (v < 2.5) return 'low_suspicion';
    if (v < 4) return 'equivocal';
    return 'high_suspicion';
}

function ihcInterpretation(marker, score) {
    if (!marker) return null;
    if (score === 3) return 'strongly_positive';
    if (score === 2) return 'moderately_positive';
    if (score === 1) return 'weakly_positive';
    return 'negative';
}

function gramInterpretation(gram, organism) {
    if (!gram || !organism) return null;
    return `${gram}_${organism}`;
}

function pathTATDays(receivedAt, reportedAt) {
    if (!receivedAt || !reportedAt) return null;
    const r = new Date(receivedAt);
    const rep = new Date(reportedAt);
    if (isNaN(r.getTime()) || isNaN(rep.getTime())) return null;
    return Math.round((rep - r) / (1000 * 60 * 60 * 24));
}

function consentValidity(signedAt, expiryDays = 90) {
    if (!signedAt) return 'unsigned';
    const d = new Date(signedAt);
    if (isNaN(d.getTime())) return 'invalid';
    const ageDays = Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));
    if (ageDays < 0) return 'future_dated';
    if (ageDays > expiryDays) return 'expired';
    return 'valid';
}

function roiSLA(requestDate, status) {
    if (!requestDate) return null;
    const d = new Date(requestDate);
    if (isNaN(d.getTime())) return null;
    const age = Math.ceil((new Date() - d) / (1000 * 60 * 60 * 24));
    if (status === 'fulfilled') return { age_days: age, completed: true };
    if (age <= 7) return { age_days: age, completed: false, sla_remaining_days: 7 - age };
    return { age_days: age, completed: false, sla_remaining_days: 0, overdue: true };
}

function certDaysRemaining(endDate) {
    if (!endDate) return null;
    const d = new Date(endDate);
    if (isNaN(d.getTime())) return null;
    return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true, version: '1.0.0', module: 'diagnostics-records',
        endpoints: [
            'GET/POST /lab/samples',
            'GET/POST /lab/results',
            'GET/POST /lab/microbiology',
            'GET/POST /lab/qc',
            'GET/POST /lab/loinc',
            'GET/POST /lab/critical-callbacks',
            'GET/POST /lab-radiology/orders',
            'GET /ref-range-check',
            'GET /delta-check',
            'GET /westgard',
            'GET/POST /radiology/advanced-metrics',
            'GET/POST /nuclear-medicine',
            'GET /suv-interpretation',
            'GET/POST /pathology/specimens',
            'GET/POST /pathology/blocks',
            'GET/POST /pathology/slides',
            'GET/POST /pathology/cases',
            'GET/POST /pathology/digital',
            'GET/POST /endoscopy/reports',
            'GET/POST /biopsy/samples',
            'GET /path-tat',
            'GET /ihc-interpretation',
            'GET/POST /consent/forms',
            'GET/POST /roi/requests',
            'GET/POST /medical/certificates',
            'GET /consent-validity',
            'GET /roi-sla',
            'GET /cert-days-remaining',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== LAB SAMPLES =====
router.get('/lab/samples', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { patient_id, state, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM lab_samples WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (state) { sql += ` AND state = $${params.length + 1}`; params.push(state); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/lab/samples', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { lab_order_id, patient_id, barcode, state, collected_by, received_by, rejected_reason, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!barcode) return res.status(400).json({ ok: false, error: 'barcode_required' });
        if (state && !VALID_SPECIMEN_STATE.includes(state)) return res.status(400).json({ ok: false, error: 'invalid_state', valid: VALID_SPECIMEN_STATE });
        const r = await db.query(
            `INSERT INTO lab_samples (tenant_id, lab_order_id, patient_id, barcode, state, collected_by, received_by, rejected_reason, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, lab_order_id || null, parseInt(patient_id), barcode, state || 'collected',
             collected_by || null, received_by || null, rejected_reason || null, notes || null]
        );
        res.status(201).json({ ok: true, sample: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== LAB RESULTS =====
router.get('/lab/results', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { order_id, patient_id, is_abnormal, is_critical, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM lab_results WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (order_id) { sql += ` AND order_id = $${params.length + 1}`; params.push(parseInt(order_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (is_abnormal !== undefined) { sql += ` AND is_abnormal = $${params.length + 1}`; params.push(parseInt(is_abnormal)); }
        if (is_critical !== undefined) { sql += ` AND is_critical = $${params.length + 1}`; params.push(parseInt(is_critical)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(x => ({ ...x, range_check: refRangeCheck(x.value, x.ref_low, x.ref_high), delta_significant: deltaSignificant(x.delta_pct) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/lab/results', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { order_id, test_id, result_value, is_abnormal, notes, lab_sample_id, loinc, test_name, value, unit, normal_range, ref_low, ref_high, abnormal_flag, delta_pct, is_critical, status } = req.body;
        if (!test_id) return res.status(400).json({ ok: false, error: 'test_id_required' });
        const r = await db.query(
            `INSERT INTO lab_results (order_id, test_id, result_value, is_abnormal, notes, tenant_id, lab_sample_id, loinc, test_name, value, unit, normal_range, ref_low, ref_high, abnormal_flag, delta_pct, is_critical, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
            [order_id || null, parseInt(test_id), result_value || null, is_abnormal ? 1 : 0,
             notes || null, req.tenantId, lab_sample_id || null, loinc || null,
             test_name || null, value || null, unit || null, normal_range || null,
             ref_low !== undefined ? ref_low : null, ref_high !== undefined ? ref_high : null,
             abnormal_flag || null, delta_pct !== undefined ? delta_pct : null,
             is_critical ? 1 : 0, status || 'preliminary']
        );
        res.status(201).json({ ok: true, result: r.rows[0], range_check: refRangeCheck(value, ref_low, ref_high) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== LAB MICROBIOLOGY =====
router.get('/lab/microbiology', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { patient_id, specimen_type, report_status, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM lab_microbiology WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (specimen_type) { sql += ` AND specimen_type = $${params.length + 1}`; params.push(specimen_type); }
        if (report_status) { sql += ` AND report_status = $${params.length + 1}`; params.push(report_status); }
        sql += ` ORDER BY collection_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(m => ({ ...m, gram_organism: gramInterpretation(m.gram_stain, m.organism_identified) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/lab/microbiology', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { order_id, patient_id, admission_id, specimen_type, collection_date, collection_time, collection_site, gram_stain, preliminary_result, final_result, organism_identified, colony_count, sensitivity_results, antibiogram_profile, report_status, reported_by, critical_value, loinc_code } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (specimen_type && !VALID_SPECIMEN_TYPE.includes(specimen_type)) return res.status(400).json({ ok: false, error: 'invalid_specimen_type', valid: VALID_SPECIMEN_TYPE });
        if (gram_stain && !VALID_GRAM.includes(gram_stain)) return res.status(400).json({ ok: false, error: 'invalid_gram', valid: VALID_GRAM });
        const r = await db.query(
            `INSERT INTO lab_microbiology (order_id, patient_id, admission_id, specimen_type, collection_date, collection_time, collection_site, gram_stain, preliminary_result, final_result, organism_identified, colony_count, sensitivity_results, antibiogram_profile, report_status, reported_by, critical_value, loinc_code, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *`,
            [order_id || null, parseInt(patient_id), admission_id || null, specimen_type || null,
             collection_date || null, collection_time || null, collection_site || null,
             gram_stain || null, preliminary_result || null, final_result || null,
             organism_identified || null, colony_count || null,
             typeof sensitivity_results === 'object' ? JSON.stringify(sensitivity_results) : (sensitivity_results || null),
             antibiogram_profile || null, report_status || 'preliminary',
             reported_by || null, critical_value ? true : false, loinc_code || null, req.tenantId]
        );
        res.status(201).json({ ok: true, micro: r.rows[0], gram_organism: gramInterpretation(gram_stain, organism_identified) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== LAB QC =====
router.get('/lab/qc', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { analyzer, analyte, breach_only, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM lab_qc WHERE tenant_id = $1 AND at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (analyzer) { sql += ` AND analyzer = $${params.length + 1}`; params.push(analyzer); }
        if (analyte) { sql += ` AND analyte = $${params.length + 1}`; params.push(analyte); }
        if (breach_only === 'true') sql += ` AND breach = 1`;
        sql += ` ORDER BY at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/lab/qc', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { analyzer, analyte, level, value, target, sd, z, westgard_flag, breach, reagent_lot } = req.body;
        if (!analyzer || !analyte) return res.status(400).json({ ok: false, error: 'analyzer_and_analyte_required' });
        const r = await db.query(
            `INSERT INTO lab_qc (tenant_id, analyzer, analyte, level, value, target, sd, z, westgard_flag, breach, reagent_lot)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [req.tenantId, analyzer, analyte, level || null, parseFloat(value || 0),
             parseFloat(target || 0), parseFloat(sd || 0), parseFloat(z || 0),
             westgard_flag || null, breach ? 1 : 0, reagent_lot || null]
        );
        res.status(201).json({ ok: true, qc: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== LAB LOINC CODES =====
router.get('/lab/loinc', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { is_active, scale, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM lab_loinc_codes WHERE 1=1`;
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        if (scale) { sql += ` AND scale = $${params.length + 1}`; params.push(scale); }
        sql += ` ORDER BY short_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/lab/loinc', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { loinc_code, short_name, long_name, component, property, time_aspect, system, scale, method, class_name, panel_name, specimen_type, unit, normal_range_male, normal_range_female, is_active } = req.body;
        if (!loinc_code) return res.status(400).json({ ok: false, error: 'loinc_code_required' });
        if (scale && !VALID_LOINC_SCALE.includes(scale)) return res.status(400).json({ ok: false, error: 'invalid_scale', valid: VALID_LOINC_SCALE });
        const r = await db.query(
            `INSERT INTO lab_loinc_codes (loinc_code, short_name, long_name, component, property, time_aspect, system, scale, method, class_name, panel_name, specimen_type, unit, normal_range_male, normal_range_female, is_active, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
            [loinc_code, short_name || null, long_name || null, component || null, property || null,
             time_aspect || null, system || null, scale || null, method || null, class_name || null,
             panel_name || null, specimen_type || null, unit || null,
             normal_range_male || null, normal_range_female || null, is_active !== false, req.tenantId]
        );
        res.status(201).json({ ok: true, loinc: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== LAB CRITICAL CALLBACKS =====
router.get('/lab/critical-callbacks', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { ack, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM lab_critical_callbacks WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (ack !== undefined) { sql += ` AND ack = $${params.length + 1}`; params.push(parseInt(ack)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/lab/critical-callbacks', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { result_id, notified_to, notified_by_name, ack, notes } = req.body;
        if (!result_id) return res.status(400).json({ ok: false, error: 'result_id_required' });
        const r = await db.query(
            `INSERT INTO lab_critical_callbacks (tenant_id, result_id, notified_to, notified_by_name, ack, notes)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [req.tenantId, parseInt(result_id), notified_to || null, notified_by_name || null,
             ack ? 1 : 0, notes || null]
        );
        res.status(201).json({ ok: true, callback: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== LAB+RADIOLOGY ORDERS =====
router.get('/lab-radiology/orders', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, order_type, is_radiology, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM lab_radiology_orders WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (order_type) { sql += ` AND order_type = $${params.length + 1}`; params.push(order_type); }
        if (is_radiology !== undefined) { sql += ` AND is_radiology = $${params.length + 1}`; params.push(parseInt(is_radiology)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/lab-radiology/orders', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, order_type, description, status, sample_serial, is_radiology, price } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO lab_radiology_orders (patient_id, doctor_id, order_type, description, status, sample_serial, is_radiology, price, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, order_type || null,
             description || null, status || 'pending', sample_serial || null,
             is_radiology ? 1 : 0, parseFloat(price || 0), req.tenantId]
        );
        res.status(201).json({ ok: true, order: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== LAB UTILITIES =====
router.get('/ref-range-check', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => {
    try {
        const { value, low, high } = req.query;
        if (value === undefined) return res.status(400).json({ ok: false, error: 'value_required' });
        res.json({ ok: true, value: parseFloat(value), low: low !== undefined ? parseFloat(low) : null, high: high !== undefined ? parseFloat(high) : null, result: refRangeCheck(value, low, high) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/delta-check', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => {
    try {
        const { current, previous, threshold } = req.query;
        if (current === undefined || previous === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        const delta = deltaCheck(current, previous);
        const sig = deltaSignificant(delta, threshold ? parseFloat(threshold) : 20);
        res.json({ ok: true, delta_pct: delta, significant: sig });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/westgard', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => {
    try {
        const { z, sd } = req.query;
        if (z === undefined || sd === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, evaluation: westgardEvaluate(parseFloat(z), parseFloat(sd)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== RADIOLOGY ADVANCED METRICS =====
router.get('/radiology/advanced-metrics', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM radiology_advanced_metrics WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/radiology/advanced-metrics', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, procedure_id, lesion_volume_mm3, kinetic_curve_type, contrast_enhancement_rate, ai_detection_confidence } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO radiology_advanced_metrics (tenant_id, patient_id, procedure_id, lesion_volume_mm3, kinetic_curve_type, contrast_enhancement_rate, ai_detection_confidence)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), procedure_id ? String(procedure_id) : null,
             lesion_volume_mm3 || null, kinetic_curve_type || null,
             contrast_enhancement_rate || null, ai_detection_confidence || null]
        );
        res.status(201).json({ ok: true, metric: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NUCLEAR MEDICINE =====
router.get('/nuclear-medicine', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM nuclear_med_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(n => ({ ...n, suv_interpretation: suvInterpretation(n.suv_max) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nuclear-medicine', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, tracer_used, suv_max, uptake_region, quantification_value } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO nuclear_med_logs (tenant_id, patient_id, tracer_used, suv_max, uptake_region, quantification_value)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [String(req.tenantId), String(patient_id), tracer_used || null, suv_max || null,
             uptake_region || null, quantification_value || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0], suv_interpretation: suvInterpretation(suv_max) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/suv-interpretation', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { suv_max } = req.query;
        if (suv_max === undefined) return res.status(400).json({ ok: false, error: 'suv_max_required' });
        res.json({ ok: true, interpretation: suvInterpretation(suv_max) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATHOLOGY SPECIMENS =====
router.get('/pathology/specimens', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { patient_id, specimen_type, state, priority, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM path_specimens WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (specimen_type) { sql += ` AND specimen_type = $${params.length + 1}`; params.push(specimen_type); }
        if (state) { sql += ` AND state = $${params.length + 1}`; params.push(state); }
        if (priority) { sql += ` AND priority = $${params.length + 1}`; params.push(priority); }
        sql += ` ORDER BY received_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pathology/specimens', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { patient_id, visit_id, accession_number, specimen_type, site, clinical_details, priority, state, blocks_count } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (priority && !VALID_PATH_PRIORITY.includes(priority)) return res.status(400).json({ ok: false, error: 'invalid_priority', valid: VALID_PATH_PRIORITY });
        if (state && !VALID_PATH_STATUS.includes(state)) return res.status(400).json({ ok: false, error: 'invalid_state', valid: VALID_PATH_STATUS });
        const r = await db.query(
            `INSERT INTO path_specimens (tenant_id, patient_id, visit_id, accession_number, specimen_type, site, clinical_details, priority, state, blocks_count)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), visit_id || null, accession_number || null,
             specimen_type || null, site || null, clinical_details || null,
             priority || 'routine', state || 'accessioned', blocks_count || 0]
        );
        res.status(201).json({ ok: true, specimen: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATHOLOGY BLOCKS =====
router.get('/pathology/blocks', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { specimen_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM path_blocks WHERE tenant_id = $1`;
        if (specimen_id) { sql += ` AND specimen_id = $${params.length + 1}`; params.push(parseInt(specimen_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pathology/blocks', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { specimen_id, block_no, cassette_label, embedding_type } = req.body;
        if (!specimen_id) return res.status(400).json({ ok: false, error: 'specimen_id_required' });
        if (embedding_type && !VALID_EMBEDDING.includes(embedding_type)) return res.status(400).json({ ok: false, error: 'invalid_embedding_type', valid: VALID_EMBEDDING });
        const r = await db.query(
            `INSERT INTO path_blocks (tenant_id, specimen_id, block_no, cassette_label, embedding_type)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [req.tenantId, parseInt(specimen_id), block_no || null, cassette_label || null, embedding_type || 'paraffin']
        );
        res.status(201).json({ ok: true, block: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATHOLOGY SLIDES =====
router.get('/pathology/slides', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { block_id, specimen_id, stain_type, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM path_slides WHERE tenant_id = $1`;
        if (block_id) { sql += ` AND block_id = $${params.length + 1}`; params.push(parseInt(block_id)); }
        if (specimen_id) { sql += ` AND specimen_id = $${params.length + 1}`; params.push(parseInt(specimen_id)); }
        if (stain_type) { sql += ` AND stain_type = $${params.length + 1}`; params.push(stain_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pathology/slides', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { block_id, specimen_id, slide_no, stain_type } = req.body;
        if (!block_id) return res.status(400).json({ ok: false, error: 'block_id_required' });
        if (stain_type && !VALID_STAIN.includes(stain_type)) return res.status(400).json({ ok: false, error: 'invalid_stain', valid: VALID_STAIN });
        const r = await db.query(
            `INSERT INTO path_slides (tenant_id, block_id, specimen_id, slide_no, stain_type)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [req.tenantId, parseInt(block_id), specimen_id || null, slide_no || null, stain_type || 'H&E']
        );
        res.status(201).json({ ok: true, slide: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATHOLOGY CASES =====
router.get('/pathology/cases', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { patient_id, status, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pathology_cases WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY received_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({ ...c, tat_days: pathTATDays(c.received_date, c.report_date) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pathology/cases', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { patient_id, patient_name, specimen_type, collection_date, received_date, pathologist, gross_description, microscopic_findings, diagnosis, icd_code, stage, grade, status, report_date, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO pathology_cases (patient_id, patient_name, specimen_type, collection_date, received_date, pathologist, gross_description, microscopic_findings, diagnosis, icd_code, stage, grade, status, report_date, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
            [parseInt(patient_id), patient_name || null, specimen_type || null,
             collection_date || null, received_date || null, pathologist || null,
             gross_description || null, microscopic_findings || null,
             diagnosis || null, icd_code || null, stage || null, grade || null,
             status || 'processing', report_date || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, case_row: r.rows[0], tat_days: pathTATDays(received_date, report_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATHOLOGY DIGITAL (IHC/Molecular) =====
router.get('/pathology/digital', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { patient_id, ihc_marker, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM pathology_digital_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (ihc_marker) { sql += ` AND ihc_marker = $${params.length + 1}`; params.push(ihc_marker); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(d => ({ ...d, ihc_interpretation: ihcInterpretation(d.ihc_marker, d.ihc_score) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pathology/digital', requireAuth, requireTenantScope, requireRole('lab'), async (req, res) => {
    try {
        const { patient_id, slide_id, ihc_marker, ihc_score, molecular_typing, digital_slide_url } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (ihc_score !== undefined && ihc_score !== null && !VALID_IHC_SCORE.includes(parseInt(ihc_score))) return res.status(400).json({ ok: false, error: 'invalid_ihc_score', valid: VALID_IHC_SCORE });
        const r = await db.query(
            `INSERT INTO pathology_digital_logs (tenant_id, patient_id, slide_id, ihc_marker, ihc_score, molecular_typing, digital_slide_url)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), slide_id || null, ihc_marker || null,
             ihc_score !== undefined && ihc_score !== null ? parseInt(ihc_score) : null,
             molecular_typing || null, digital_slide_url || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0], ihc_interpretation: ihcInterpretation(ihc_marker, ihc_score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ENDOSCOPY =====
router.get('/endoscopy/reports', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, endoscopy_type, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM endoscopy_reports WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (endoscopy_type) { sql += ` AND endoscopy_type = $${params.length + 1}`; params.push(endoscopy_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/endoscopy/reports', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, endoscopy_type, indications, findings, complications, recommendations } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO endoscopy_reports (patient_id, doctor_id, endoscopy_type, indications, findings, complications, recommendations, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, endoscopy_type || null,
             indications || null, findings || null, complications || null, recommendations || null, req.tenantId]
        );
        res.status(201).json({ ok: true, report: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BIOPSY =====
router.get('/biopsy/samples', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM biopsy_samples WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/biopsy/samples', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, specimen_source, clinical_notes, status, result_findings } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO biopsy_samples (patient_id, doctor_id, specimen_source, clinical_notes, status, result_findings, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, specimen_source || null,
             clinical_notes || null, status || 'collected', result_findings || null, req.tenantId]
        );
        res.status(201).json({ ok: true, biopsy: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PATH UTILITIES =====
router.get('/path-tat', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { received_at, reported_at } = req.query;
        if (!received_at || !reported_at) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, tat_days: pathTATDays(received_at, reported_at) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ihc-interpretation', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { marker, score } = req.query;
        if (marker === undefined || score === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, interpretation: ihcInterpretation(marker, parseInt(score)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CONSENT FORMS =====
router.get('/consent/forms', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { patient_id, form_type, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT id, patient_id, patient_name, form_type, form_title, form_title_ar, doctor_name, language, status, surgery_id, signed_at, created_at, tenant_id, facility_id FROM consent_forms WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (form_type) { sql += ` AND form_type = $${params.length + 1}`; params.push(form_type); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({ ...c, validity: consentValidity(c.signed_at) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/consent/forms', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { patient_id, patient_name, form_type, form_title, form_title_ar, content, doctor_name, witness_name, language, status, surgery_id, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!form_type) return res.status(400).json({ ok: false, error: 'form_type_required' });
        if (form_type && !VALID_CONSENT_FORM_TYPE.includes(form_type)) return res.status(400).json({ ok: false, error: 'invalid_form_type', valid: VALID_CONSENT_FORM_TYPE });
        if (status && !VALID_CONSENT_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_CONSENT_STATUS });
        const r = await db.query(
            `INSERT INTO consent_forms (patient_id, patient_name, form_type, form_title, form_title_ar, content, doctor_name, witness_name, language, status, surgery_id, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id, patient_id, form_type, status, created_at`,
            [parseInt(patient_id), patient_name || null, form_type, form_title || null, form_title_ar || null,
             content || null, doctor_name || null, witness_name || null, language || 'ar',
             status || 'pending_signature', surgery_id || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, form: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ROI (Release of Information) =====
router.get('/roi/requests', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { patient_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM roi_requests WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(x => ({ ...x, sla: roiSLA(x.created_at, x.status) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/roi/requests', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { patient_id, requester, purpose, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (status && !VALID_ROI_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_ROI_STATUS });
        const r = await db.query(
            `INSERT INTO roi_requests (tenant_id, patient_id, requester, purpose, status, requested_by)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [req.tenantId, parseInt(patient_id), requester || null, purpose || null, status || 'pending', req.user?.id ? parseInt(req.user.id) : null]
        );
        res.status(201).json({ ok: true, roi: r.rows[0], sla: roiSLA(r.rows[0].created_at, r.rows[0].status) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MEDICAL CERTIFICATES =====
router.get('/medical/certificates', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, cert_type, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM medical_certificates WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (cert_type) { sql += ` AND cert_type = $${params.length + 1}`; params.push(cert_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({ ...c, days_remaining: certDaysRemaining(c.end_date) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/medical/certificates', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, doctor_id, doctor_name, cert_type, diagnosis, notes, start_date, end_date, days } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!cert_type) return res.status(400).json({ ok: false, error: 'cert_type_required' });
        if (cert_type && !VALID_MED_CERT_TYPE.includes(cert_type)) return res.status(400).json({ ok: false, error: 'invalid_cert_type', valid: VALID_MED_CERT_TYPE });
        const r = await db.query(
            `INSERT INTO medical_certificates (patient_id, patient_name, doctor_id, doctor_name, cert_type, diagnosis, notes, start_date, end_date, days, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [parseInt(patient_id), patient_name || null, doctor_id ? parseInt(doctor_id) : null,
             doctor_name || null, cert_type, diagnosis || null, notes || null,
             start_date || null, end_date || null, days || null, req.tenantId]
        );
        res.status(201).json({ ok: true, certificate: r.rows[0], days_remaining: certDaysRemaining(end_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/consent-validity', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { signed_at, expiry_days } = req.query;
        res.json({ ok: true, validity: consentValidity(signed_at, expiry_days ? parseInt(expiry_days) : 90) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/roi-sla', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { request_date, status } = req.query;
        res.json({ ok: true, sla: roiSLA(request_date, status) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cert-days-remaining', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { end_date } = req.query;
        if (!end_date) return res.status(400).json({ ok: false, error: 'end_date_required' });
        res.json({ ok: true, days_remaining: certDaysRemaining(end_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STATS =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const samples = await db.query(`SELECT state, COUNT(*) AS count FROM lab_samples WHERE tenant_id = $1 GROUP BY state`, [req.tenantId]);
        const results = await db.query(`SELECT is_abnormal, is_critical, COUNT(*) AS count FROM lab_results WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '7 days' GROUP BY is_abnormal, is_critical`, [req.tenantId]);
        const micro = await db.query(`SELECT report_status, COUNT(*) AS count FROM lab_microbiology WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days' GROUP BY report_status`, [req.tenantId]);
        const qc = await db.query(`SELECT COUNT(*) AS breach_count FROM lab_qc WHERE tenant_id = $1 AND breach = 1 AND at >= NOW() - INTERVAL '30 days'`, [req.tenantId]);
        const path = await db.query(`SELECT state, priority, COUNT(*) AS count FROM path_specimens WHERE tenant_id = $1 GROUP BY state, priority`, [req.tenantId]);
        const cases = await db.query(`SELECT status, COUNT(*) AS count FROM pathology_cases WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        const consents = await db.query(`SELECT status, COUNT(*) AS count FROM consent_forms WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        const roi = await db.query(`SELECT status, COUNT(*) AS count FROM roi_requests WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        const certs = await db.query(`SELECT cert_type, COUNT(*) AS count FROM medical_certificates WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY cert_type`, [req.tenantId]);
        res.json({
            ok: true,
            lab: { samples: samples.rows, results_7d: results.rows, micro_30d: micro.rows, qc_breaches_30d: parseInt(qc.rows[0].breach_count) },
            pathology: { specimens: path.rows, cases: cases.rows },
            consent_forms: consents.rows,
            roi_requests: roi.rows,
            certificates_90d: certs.rows
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
