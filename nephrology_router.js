'use strict';
// Wave 102 — Nephrology: CKD staging (KDIGO) + HD adequacy Kt/V + transplant + renal dose adjustment
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_ALBUMINURIA = ['A1','A2','A3'];
const VALID_RISK = ['low','moderate','high','very_high'];
const VALID_ADEQUACY = ['adequate','suboptimal','inadequate'];
const VALID_DONOR = ['living_related','living_unrelated','deceased','paired_exchange'];
const VALID_ORGANS = ['kidney','liver','heart','lung','pancreas','cornea','bone_marrow','heart_lung','kidney_pancreas'];

function kdigoStageFromEGFR(egfr) {
    if (egfr === null || egfr === undefined) return null;
    if (egfr >= 90) return 'G1';
    if (egfr >= 60) return 'G2';
    if (egfr >= 45) return 'G3a';
    if (egfr >= 30) return 'G3b';
    if (egfr >= 15) return 'G4';
    return 'G5';
}

function kdigoCompositeRisk(g, a) {
    const map = { G1: 1, G2: 1, G3a: 2, G3b: 3, G4: 4, G5: 4 };
    const aMap = { A1: 1, A2: 2, A3: 3 };
    const score = (map[g] || 0) * (aMap[a] || 1);
    if (score <= 1) return 'low';
    if (score <= 3) return 'moderate';
    if (score <= 6) return 'high';
    return 'very_high';
}

function adequacyFromKtV(ktv) {
    if (ktv === null || ktv === undefined) return null;
    if (ktv >= 1.4) return 'adequate';
    if (ktv >= 1.2) return 'suboptimal';
    return 'inadequate';
}

function computeKtV(spktv, weeklyKtV, urr) {
    const spk = parseFloat(spktv);
    const wk = parseFloat(weeklyKtV);
    const u = parseFloat(urr);
    let ktv = null;
    if (!isNaN(spk)) ktv = spk;
    else if (!isNaN(wk)) ktv = wk / 3;
    else if (!isNaN(u)) ktv = Math.log(0.01 * (100 - u)) * -0.6;
    return ktv === null ? null : Math.round(ktv * 100) / 100;
}

function cockcroftGault(age, weight, creatinine, sex) {
    if (!age || !weight || !creatinine) return null;
    const factor = sex === 'female' ? 0.85 : 1;
    return Math.round(((140 - parseFloat(age)) * parseFloat(weight) * factor) / (72 * parseFloat(creatinine)) * 10) / 10;
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'nephrology',
        endpoints: [
            'GET /ckd',
            'GET /ckd/:id',
            'POST /ckd',
            'GET /ckd/patient/:patientId',
            'GET /hd-adequacy',
            'POST /hd-adequacy',
            'GET /transplant-records',
            'POST /transplant-records',
            'GET /dose-adjustments',
            'POST /dose-adjustments',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== CKD ASSESSMENTS =====
router.get('/ckd', requireAuth, requireTenantScope, requireRole('nephrologist'), async (req, res) => {
    try {
        const { patient_id, kdigo_stage, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT c.*, p.full_name AS patient_name, p.mrn, u.full_name AS assessed_by_name FROM nephrology_ckd_assessments c
                   LEFT JOIN patients p ON p.id = c.patient_id LEFT JOIN users u ON u.id = c.assessed_by WHERE c.tenant_id = $1`;
        if (patient_id) { sql += ` AND c.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (kdigo_stage) { sql += ` AND c.kdigo_stage = $${params.length + 1}`; params.push(kdigo_stage); }
        if (risk_level) { sql += ` AND c.risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ckd/:id', requireAuth, requireTenantScope, requireRole('nephrologist'), async (req, res) => {
    try {
        const r = await db.query(`SELECT c.*, p.full_name AS patient_name FROM nephrology_ckd_assessments c LEFT JOIN patients p ON p.id = c.patient_id WHERE c.tenant_id = $1 AND c.id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'ckd_assessment_not_found' });
        res.json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ckd', requireAuth, requireTenantScope, requireRole('nephrologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, assessed_by, age, sex, creatinine_mg_dl, egfr, albuminuria_category, two_year_esrd_risk, five_year_esrd_risk } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!VALID_ALBUMINURIA.includes(albuminuria_category)) return res.status(400).json({ ok: false, error: 'invalid_albuminuria_category', valid: VALID_ALBUMINURIA });
        if (creatinine_mg_dl !== undefined && creatinine_mg_dl <= 0) return res.status(400).json({ ok: false, error: 'invalid_creatinine' });

        const computedEGFR = egfr || (age && creatinine_mg_dl ? cockcroftGault(age, 70, creatinine_mg_dl, sex) : null);
        const kdigo_stage = kdigoStageFromEGFR(computedEGFR);
        const risk_level = kdigoCompositeRisk(kdigo_stage, albuminuria_category);

        const r = await db.query(
            `INSERT INTO nephrology_ckd_assessments (tenant_id, patient_id, encounter_id, assessed_by, age, sex, creatinine_mg_dl, egfr, albuminuria_category, kdigo_stage, risk_level, two_year_esrd_risk, five_year_esrd_risk)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, assessed_by || req.user?.id || null,
             age || null, sex || null, creatinine_mg_dl || null, computedEGFR,
             albuminuria_category, kdigo_stage, risk_level, two_year_esrd_risk || null, five_year_esrd_risk || null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0], computed: { egfr: computedEGFR, kdigo_stage, risk_level } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ckd/patient/:patientId', requireAuth, requireTenantScope, requireRole('nephrologist'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM nephrology_ckd_assessments WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 30`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, latest: r.rows[0] || null, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== HD ADEQUACY =====
router.get('/hd-adequacy', requireAuth, requireTenantScope, requireRole('nephrologist'), async (req, res) => {
    try {
        const { patient_id, adequacy, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT a.*, p.full_name AS patient_name FROM nephrology_hd_adequacy a LEFT JOIN patients p ON p.id = a.patient_id WHERE a.tenant_id = $1`;
        if (patient_id) { sql += ` AND a.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (adequacy) { sql += ` AND a.adequacy = $${params.length + 1}`; params.push(adequacy); }
        sql += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/hd-adequacy', requireAuth, requireTenantScope, requireRole('nephrologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, assessed_by, pre_bun_mg_dl, post_bun_mg_dl, spktv, weekly_ktv, urr_pct } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const ktv = computeKtV(spktv, weekly_ktv, urr_pct);
        const adequacy = ktv !== null ? adequacyFromKtV(ktv) : null;
        const r = await db.query(
            `INSERT INTO nephrology_hd_adequacy (tenant_id, patient_id, encounter_id, assessed_by, pre_bun_mg_dl, post_bun_mg_dl, spktv, weekly_ktv, urr_pct, adequacy)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, assessed_by || req.user?.id || null,
             pre_bun_mg_dl || null, post_bun_mg_dl || null, spktv || null, weekly_ktv || null, urr_pct || null, adequacy]
        );
        res.status(201).json({ ok: true, adequacy: r.rows[0], computed: { ktv, adequacy } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TRANSPLANT RECORDS =====
router.get('/transplant-records', requireAuth, requireTenantScope, requireRole('nephrologist'), async (req, res) => {
    try {
        const { patient_id, organ, donor_type, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT t.*, p.full_name AS patient_name FROM transplant_records t LEFT JOIN patients p ON p.id = t.patient_id WHERE t.tenant_id = $1`;
        if (patient_id) { sql += ` AND t.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (organ) { sql += ` AND t.organ = $${params.length + 1}`; params.push(organ); }
        if (donor_type) { sql += ` AND t.donor_type = $${params.length + 1}`; params.push(donor_type); }
        sql += ` ORDER BY t.date_transplant DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/transplant-records', requireAuth, requireTenantScope, requireRole('nephrologist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, organ, donor_type, match_score, date_transplant, follow_up_status, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!organ) return res.status(400).json({ ok: false, error: 'organ_required' });
        if (!VALID_ORGANS.includes(organ)) return res.status(400).json({ ok: false, error: 'invalid_organ' });
        if (donor_type && !VALID_DONOR.includes(donor_type)) return res.status(400).json({ ok: false, error: 'invalid_donor_type' });
        if (match_score !== undefined && (match_score < 0 || match_score > 100)) return res.status(400).json({ ok: false, error: 'match_score_out_of_range' });

        const r = await db.query(
            `INSERT INTO transplant_records (tenant_id, patient_id, encounter_id, organ, donor_type, match_score, date_transplant, follow_up_status, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, organ, donor_type || null, match_score || null,
             date_transplant || null, follow_up_status || 'pending', created_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, record: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== RENAL DOSE ADJUSTMENTS =====
router.get('/dose-adjustments', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { patient_id, drug_name, ckd_stage, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT r.*, p.full_name AS patient_name FROM renal_dose_adjustments r LEFT JOIN patients p ON p.id = r.patient_id WHERE r.tenant_id = $1`;
        if (patient_id) { sql += ` AND r.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (drug_name) { sql += ` AND r.drug_name ILIKE $${params.length + 1}`; params.push(`%${drug_name}%`); }
        if (ckd_stage) { sql += ` AND r.ckd_stage = $${params.length + 1}`; params.push(ckd_stage); }
        sql += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/dose-adjustments', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { patient_id, encounter_id, adjusted_by, drug_name, standard_dose_mg, crcl_ml_per_min, ckd_stage, adjustment_factor, frequency_per_day, recommendation } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!drug_name) return res.status(400).json({ ok: false, error: 'drug_name_required' });
        if (!standard_dose_mg || standard_dose_mg <= 0) return res.status(400).json({ ok: false, error: 'standard_dose_required_positive' });

        const factor = adjustment_factor !== undefined ? parseFloat(adjustment_factor) : (crcl_ml_per_min ? Math.min(1, parseFloat(crcl_ml_per_min) / 100) : 1);
        const adjusted_dose_mg = Math.round(parseFloat(standard_dose_mg) * factor * 100) / 100;

        const r = await db.query(
            `INSERT INTO renal_dose_adjustments (tenant_id, patient_id, encounter_id, adjusted_by, drug_name, standard_dose_mg, crcl_ml_per_min, ckd_stage, adjustment_factor, adjusted_dose_mg, frequency_per_day, recommendation)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [req.tenantId, patient_id, encounter_id || null, adjusted_by || req.user?.id || null, drug_name,
             standard_dose_mg, crcl_ml_per_min || null, ckd_stage || null, factor, adjusted_dose_mg,
             frequency_per_day || null, recommendation || null]
        );
        res.status(201).json({ ok: true, adjustment: r.rows[0], computed: { adjustment_factor: factor, adjusted_dose_mg } });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const ckd = await db.query(
            `SELECT kdigo_stage, risk_level, COUNT(*) AS count FROM nephrology_ckd_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'
             GROUP BY kdigo_stage, risk_level ORDER BY count DESC`,
            [req.tenantId]
        );
        const hd = await db.query(
            `SELECT adequacy, COUNT(*) AS count FROM nephrology_hd_adequacy WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY adequacy`,
            [req.tenantId]
        );
        const tr = await db.query(
            `SELECT organ, donor_type, COUNT(*) AS count FROM transplant_records WHERE tenant_id = $1 GROUP BY organ, donor_type`,
            [req.tenantId]
        );
        const rd = await db.query(
            `SELECT drug_name, COUNT(*) AS count FROM renal_dose_adjustments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'
             GROUP BY drug_name ORDER BY count DESC LIMIT 15`,
            [req.tenantId]
        );
        res.json({ ok: true, ckd_breakdown: ckd.rows, hd_adequacy: hd.rows, transplants: tr.rows, top_adjusted_drugs: rd.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
