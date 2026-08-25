'use strict';
// Wave 129 — Women Health + Maternal-Fetal + Peds + Nephrology/Diabetes/Dialysis + Rehab + Nursing + IPC + Pharmacy
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_GRAVIDA_STATUS = ['ongoing','completed','miscarriage','ectopic','molar','terminated','postpartum'];
const VALID_TRIMESTER = ['first','second','third','unknown'];
const VALID_DELIVERY_MODE = ['normal','c_section','vacuum','forceps','vaginal_breach','induced','water_birth','assisted'];
const VALID_DELIVERY_OUTCOME = ['live_birth','stillbirth','neonatal_death','alive_mother_alive_baby','alive_mother_stillbirth'];
const VALID_NST_RESULT = ['reactive','non_reactive','unsatisfactory','equivocal'];
const VALID_AMNIOTIC = ['clear','meconium_stained','bloody','absent','polyhydramnios','oligohydramnios'];
const VALID_RISK = ['low','moderate','high','very_high'];
const VALID_INSULIN = ['rapid_acting','short_acting','intermediate','long_acting','ultra_long','premixed','basal_only','basal_bolus'];
const VALID_DIALYSIS = ['HD','HDF','HFD','PD','CRRT','SLED','plasmapheresis','hemoperfusion'];
const VALID_EDEMA = ['none','+','++','+++','++++'];
const VALID_URINE_PROTEIN = ['negative','trace','+1','+2','+3','+4'];
const VALID_OB_PRESENTATION = ['cephalic','breech','transverse','oblique','vertex','face','brow'];
const VALID_BABY_GENDER = ['M','F','ambiguous','unknown'];
const VALID_FEEDING = ['breast','formula','mixed','tube','NPO','TPN'];
const VALID_REHAB_STATUS = ['active','completed','paused','discharged','transferred','on_hold'];
const VALID_NURSING_SHIFT = ['day','evening','night','morning','afternoon','overnight'];
const VALID_RISK_LEVEL = ['low','moderate','high','very_high','critical'];
const VALID_ISOLATION_TYPE = ['standard','contact','droplet','airborne','protective','reverse','neutropenic'];
const VALID_PAIN_SCALE = ['NRS','VAS','FLACC','Wong_Baker','VRS','FPS_R'];
const VALID_OUTBREAK_STATUS = ['suspected','active','contained','resolved','monitoring'];
const VALID_PRESCRIPTION_STATUS = ['pending','in_progress','dispensed','verified','rejected','on_hold'];
const VALID_PHYSIOTHERAPY = ['PT','OT','SLP','recreational','aquatic','manual','neuro','pediatric','geriatric','sports','cardiopulmonary'];

function bmiCalc(weightKg, heightCm) {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);
    if (isNaN(w) || isNaN(h) || h <= 0) return null;
    const hM = h / 100;
    return Math.round((w / (hM * hM)) * 10) / 10;
}

function bmiCategory(bmi) {
    if (bmi === null) return null;
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    if (bmi < 35) return 'obese_class_1';
    if (bmi < 40) return 'obese_class_2';
    return 'obese_class_3';
}

function pregnancyEDD(lmpDate) {
    if (!lmpDate) return null;
    const d = new Date(lmpDate);
    if (isNaN(d.getTime())) return null;
    d.setDate(d.getDate() + 280);
    return d.toISOString().slice(0, 10);
}

function gestationalAgeWeeks(lmpDate, asOfDate) {
    if (!lmpDate) return null;
    const lmp = new Date(lmpDate);
    const asOf = asOfDate ? new Date(asOfDate) : new Date();
    if (isNaN(lmp.getTime())) return null;
    const days = Math.floor((asOf - lmp) / (1000 * 60 * 60 * 24));
    return Math.floor(days / 7);
}

function trimesterFromWeeks(weeks) {
    const w = parseFloat(weeks);
    if (isNaN(w)) return null;
    if (w < 13) return 'first';
    if (w < 27) return 'second';
    if (w <= 42) return 'third';
    return 'post_term';
}

function efwFromBiometry(bpd, hc, ac, fl) {
    const vals = [bpd, hc, ac, fl].map(v => parseFloat(v)).filter(v => !isNaN(v));
    if (vals.length < 3) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10;
}

function apgarTotal(one, five, ten) {
    const vals = [one, five, ten].map(v => parseInt(v)).filter(v => !isNaN(v));
    if (vals.length === 0) return null;
    return vals.reduce((a, b) => a + b, 0);
}

function glucoseStatus(value, type) {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    if (type === 'fasting') {
        if (v < 70) return 'hypoglycemia';
        if (v < 100) return 'normal';
        if (v < 126) return 'prediabetes';
        return 'diabetes';
    } else if (type === 'postprandial' || type === 'random') {
        if (v < 70) return 'hypoglycemia';
        if (v < 140) return 'normal';
        if (v < 200) return 'prediabetes';
        return 'diabetes';
    } else if (type === 'hba1c') {
        if (v < 5.7) return 'normal';
        if (v < 6.5) return 'prediabetes';
        return 'diabetes';
    }
    return 'unknown';
}

function ktV(ureaBefore, ureaAfter, weightLoss, treatmentTime) {
    const ub = parseFloat(ureaBefore);
    const ua = parseFloat(ureaAfter);
    const wl = parseFloat(weightLoss);
    const t = parseFloat(treatmentTime);
    if (isNaN(ub) || isNaN(ua) || isNaN(wl) || isNaN(t) || ub <= 0) return null;
    const ratio = ua / ub;
    const kt = -Math.log(0.001) * ratio;
    return Math.round((kt / t) * 100) / 100;
}

function ktVAdequacy(ktv) {
    if (ktv === null) return null;
    if (ktv >= 1.4) return 'adequate';
    if (ktv >= 1.2) return 'borderline';
    return 'inadequate';
}

function ufVolume(preWeight, postWeight) {
    const pre = parseFloat(preWeight);
    const post = parseFloat(postWeight);
    if (isNaN(pre) || isNaN(post)) return null;
    return Math.round((pre - post) * 1000) / 10; // assuming kg to L
}

function nursingPainInterpretation(score, scale) {
    const s = parseInt(score);
    if (isNaN(s)) return null;
    if (scale === 'NRS' || scale === 'VAS' || scale === 'VRS' || scale === 'Wong_Baker') {
        if (s === 0) return 'no_pain';
        if (s <= 3) return 'mild';
        if (s <= 6) return 'moderate';
        if (s <= 8) return 'severe';
        return 'worst_possible';
    }
    if (scale === 'FLACC') {
        if (s === 0) return 'relaxed';
        if (s <= 3) return 'mild_discomfort';
        if (s <= 6) return 'moderate_pain';
        return 'severe_pain';
    }
    return 'unknown';
}

function bradenRisk(score) {
    const s = parseInt(score);
    if (isNaN(s)) return null;
    if (s >= 19) return 'no_risk';
    if (s >= 15) return 'mild_risk';
    if (s >= 13) return 'moderate_risk';
    if (s >= 10) return 'high_risk';
    return 'very_high_risk';
}

function morseFallRisk(score) {
    const s = parseInt(score);
    if (isNaN(s)) return null;
    if (s < 25) return 'low_risk';
    if (s < 45) return 'moderate_risk';
    return 'high_risk';
}

function news2Score(rr, spo2, temp, sbp, hr, consciousness) {
    let score = 0;
    const r = parseInt(rr);
    if (!isNaN(r)) {
        if (r <= 8) score += 3;
        else if (r <= 11) score += 1;
        else if (r <= 20) score += 0;
        else if (r <= 24) score += 2;
        else score += 3;
    }
    const s = parseInt(spo2);
    if (!isNaN(s)) {
        if (s <= 91) score += 3;
        else if (s <= 93) score += 2;
        else if (s <= 95) score += 1;
    }
    const t = parseFloat(temp);
    if (!isNaN(t)) {
        if (t <= 35) score += 3;
        else if (t <= 36) score += 1;
        else if (t <= 38) score += 0;
        else if (t <= 39) score += 1;
        else score += 2;
    }
    const sb = parseInt(sbp);
    if (!isNaN(sb)) {
        if (sb <= 90) score += 3;
        else if (sb <= 100) score += 2;
        else if (sb <= 110) score += 1;
        else if (sb <= 219) score += 0;
        else score += 3;
    }
    const h = parseInt(hr);
    if (!isNaN(h)) {
        if (h <= 40) score += 3;
        else if (h <= 50) score += 1;
        else if (h <= 90) score += 0;
        else if (h <= 110) score += 1;
        else if (h <= 130) score += 2;
        else score += 3;
    }
    if (consciousness && consciousness !== 'alert') score += 3;
    return score;
}

function news2Risk(score) {
    if (score === null || isNaN(score)) return null;
    if (score >= 7) return 'high';
    if (score >= 5) return 'medium';
    if (score >= 1) return 'low';
    return 'very_low';
}

function handoffCompleteness(h) {
    if (!h) return 0;
    const fields = ['sbar_s', 'sbar_b', 'sbar_a', 'sbar_r'];
    return Math.round((fields.filter(f => h[f] && h[f].length > 0).length / fields.length) * 100);
}

function complianceRate(compliant, total) {
    const c = parseInt(compliant);
    const t = parseInt(total);
    if (isNaN(c) || isNaN(t) || t <= 0) return null;
    return Math.round((c / t) * 1000) / 10;
}

function pregnancyRiskScore(pregnancy) {
    if (!pregnancy) return null;
    let score = 0;
    if (parseInt(pregnancy.previous_cs || 0) > 0) score += 2;
    if (parseInt(pregnancy.abortions || 0) > 0) score += 1;
    if (pregnancy.risk_level === 'high') score += 3;
    if (pregnancy.risk_level === 'very_high') score += 5;
    if (pregnancy.chronic_conditions && pregnancy.chronic_conditions !== '') score += 2;
    if (pregnancy.previous_complications && pregnancy.previous_complications !== '') score += 2;
    if (parseInt(pregnancy.para || 0) >= 5) score += 1;
    if (parseInt(pregnancy.gravida || 0) >= 5) score += 1;
    if (score >= 5) return 'high_risk';
    if (score >= 2) return 'moderate_risk';
    return 'low_risk';
}

function flaccSeverity(score) {
    const s = parseInt(score);
    if (isNaN(s)) return null;
    if (s === 0) return 'relaxed_comfortable';
    if (s <= 3) return 'mild_discomfort';
    if (s <= 6) return 'moderate_pain';
    if (s <= 9) return 'severe_pain';
    return 'severe_distress';
}

function patCatFromRow(row) {
    if (row.kyphosis && row.kyphosis === 'severe') return 'pat_cat_1';
    if (row.lordosis) return 'pat_cat_2';
    if (row.scoliosis && row.scoliosis === 'severe') return 'pat_cat_3';
    if (row.scoliosis && row.scoliosis !== 'severe') return 'pat_cat_4';
    if (row.pelvic_tilt) return 'pat_cat_5';
    if (row.hip_pathology) return 'pat_cat_6';
    if (row.knee_pathology) return 'pat_cat_7';
    return 'pat_cat_normal';
}

function efwPercentile(efw, gaWeeks) {
    const v = parseFloat(efw);
    const w = parseFloat(gaWeeks);
    if (isNaN(v) || isNaN(w)) return null;
    if (v < 500) return '<10';
    if (v < 1500) return '10-50';
    if (v < 2500) return '50';
    if (v < 3500) return '50-90';
    return '>90';
}

function ulnarLengthToGA(efw) {
    const v = parseFloat(efw);
    if (isNaN(v)) return null;
    if (v < 100) return 12;
    if (v < 500) return 20;
    if (v < 1000) return 27;
    if (v < 2000) return 32;
    if (v < 3000) return 37;
    return 40;
}

function ioBalance(intake, output) {
    const i = parseInt(intake) || 0;
    const o = parseInt(output) || 0;
    const balance = i - o;
    let status = 'balanced';
    if (Math.abs(balance) > 1000) status = 'severe_imbalance';
    else if (Math.abs(balance) > 500) status = 'moderate_imbalance';
    else if (balance > 200) status = 'positive';
    else if (balance < -200) status = 'negative';
    return { balance, status };
}

function dispenseDays(quantityPerDay, qty) {
    const qpd = parseFloat(quantityPerDay);
    const q = parseInt(qty);
    if (isNaN(qpd) || isNaN(q) || qpd <= 0) return null;
    return Math.round((q / qpd) * 10) / 10;
}

function priceAfterDiscount(base, discountPct) {
    const b = parseFloat(base);
    const d = parseFloat(discountPct);
    if (isNaN(b) || isNaN(d)) return null;
    return Math.round((b * (1 - d / 100)) * 100) / 100;
}

function handHygieneCompliance(compliant, observed) {
    const c = parseInt(compliant);
    const o = parseInt(observed);
    if (isNaN(c) || isNaN(o) || o <= 0) return null;
    return Math.round((c / o) * 1000) / 10;
}

function growthZScore(measurement, refValue, refSd) {
    const m = parseFloat(measurement);
    const r = parseFloat(refValue);
    const s = parseFloat(refSd);
    if (isNaN(m) || isNaN(r) || isNaN(s) || s <= 0) return null;
    return Math.round(((m - r) / s) * 10) / 10;
}

function pregnancyWeekProgression(lmpDate) {
    if (!lmpDate) return null;
    const d = new Date(lmpDate);
    if (isNaN(d.getTime())) return null;
    const today = new Date();
    const days = Math.floor((today - d) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const daysInWeek = days % 7;
    return { total_days: days, weeks, days_remaining_in_week: daysInWeek };
}

function bpClass(systolic, diastolic, gravid) {
    const s = parseInt(systolic);
    const d = parseInt(diastolic);
    if (isNaN(s) || isNaN(d)) return null;
    if (gravid) {
        if (s >= 160 || d >= 110) return 'severe_preeclampsia';
        if (s >= 140 || d >= 90) return 'preeclampsia';
        if (s >= 130 || d >= 80) return 'gestational_htn';
        return 'normal';
    }
    if (s >= 180 || d >= 120) return 'hypertensive_crisis';
    if (s >= 140 || d >= 90) return 'stage_2';
    if (s >= 130 || d >= 80) return 'stage_1';
    if (s >= 120) return 'elevated';
    return 'normal';
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true, version: '1.0.0', module: 'women-peds-nephro-rehab-nursing-ipc-pharmacy',
        endpoints: [
            'GET/POST /obgyn/pregnancies',
            'GET/POST /obgyn/antenatal-visits',
            'GET/POST /obgyn/ultrasounds',
            'GET/POST /obgyn/nst',
            'GET/POST /obgyn/partogram',
            'GET/POST /obgyn/deliveries',
            'GET/POST /obgyn/delivery-logs',
            'GET/POST /obgyn/delivery-records',
            'GET/POST /obgyn/neonatal',
            'GET/POST /obgyn/lab-panels',
            'GET/POST /obgyn/encounters',
            'GET/POST /obgyn/anc-tracking',
            'GET/POST /obgyn/ivf-logs',
            'GET/POST /maternal-fetal/metrics',
            'GET/POST /maternal-fetal/visits',
            'GET/POST /pediatric/growth',
            'GET/POST /pediatric/immunizations',
            'GET/POST /dialysis/sessions',
            'GET/POST /dialysis/assessments',
            'GET/POST /diabetes/glucose',
            'GET/POST /insulin/regimens',
            'GET/POST /nephrology/assessments',
            'GET/POST /flap-monitoring',
            'GET/POST /rehab/patients',
            'GET/POST /rehab/sessions',
            'GET/POST /rehab/assessments',
            'GET/POST /rehab/goals',
            'GET/POST /rehab/occupational',
            'GET/POST /rehab/speech',
            'GET/POST /cardiac-rehab',
            'GET/POST /speech-therapy',
            'GET/POST /stroke-unit',
            'GET/POST /nursing/assessments',
            'GET/POST /nursing/pain',
            'GET/POST /nursing/risk',
            'GET/POST /nursing/care-plans',
            'GET/POST /nursing/io',
            'GET/POST /nursing/io-records',
            'GET/POST /nursing/handover',
            'GET/POST /nursing/scores',
            'GET/POST /nursing/vitals',
            'GET/POST /medication/reconciliations',
            'GET/POST /ipc/hand-hygiene',
            'GET/POST /ipc/isolation',
            'GET/POST /ipc/surveillance',
            'GET/POST /ipc/outbreaks',
            'GET/POST /pharmacy/drug-catalog',
            'GET/POST /pharmacy/opening-balances',
            'GET/POST /pharmacy/prescriptions-queue',
            'GET/POST /pharmacy/dispense',
            'GET/POST /pharmacy/sales',
            'GET/POST /pharmacy/sale-items',
            'GET /bmi-calc',
            'GET /pregnancy-edd',
            'GET /gestational-age',
            'GET /trimester',
            'GET /efw-biometry',
            'GET /efw-percentile',
            'GET /pregnancy-week-progression',
            'GET /pregnancy-risk',
            'GET /bp-class',
            'GET /glucose-status',
            'GET /kt-v',
            'GET /kt-v-adequacy',
            'GET /uf-volume',
            'GET /nursing-pain',
            'GET /braden-risk',
            'GET /morse-fall',
            'GET /news2',
            'GET /news2-risk',
            'GET /handoff-completeness',
            'GET /compliance-rate',
            'GET /hand-hygiene-compliance',
            'GET /flacc-severity',
            'GET /bmi-category',
            'GET /growth-zscore',
            'GET /dispense-days',
            'GET /price-after-discount',
            'GET /io-balance',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== OBGYN: PREGNANCIES =====
router.get('/obgyn/pregnancies', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, risk_level, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM obgyn_pregnancies WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(p => ({ ...p, edd_calc: pregnancyEDD(p.lmp), computed_risk: pregnancyRiskScore(p) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/pregnancies', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, lmp, edd, gravida, para, abortions, living_children, blood_group, rh_factor, risk_level, pre_pregnancy_weight, height, allergies, chronic_conditions, previous_cs, previous_complications, attending_doctor, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (risk_level && !VALID_RISK.includes(risk_level)) return res.status(400).json({ ok: false, error: 'invalid_risk', valid: VALID_RISK });
        if (status && !VALID_GRAVIDA_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_GRAVIDA_STATUS });
        const computedEdd = edd || pregnancyEDD(lmp);
        const r = await db.query(
            `INSERT INTO obgyn_pregnancies (patient_id, patient_name, lmp, edd, gravida, para, abortions, living_children, blood_group, rh_factor, risk_level, pre_pregnancy_weight, height, allergies, chronic_conditions, previous_cs, previous_complications, attending_doctor, status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING *`,
            [parseInt(patient_id), patient_name || null, lmp || null, computedEdd, gravida || 1, para || 0,
             abortions || 0, living_children || 0, blood_group || null, rh_factor || null,
             risk_level || 'low', parseFloat(pre_pregnancy_weight || 0), parseFloat(height || 0),
             allergies || null, chronic_conditions || null, previous_cs ? 1 : 0, previous_complications || null,
             attending_doctor || null, status || 'ongoing', req.tenantId]
        );
        res.status(201).json({ ok: true, pregnancy: r.rows[0], edd_calc: computedEdd, computed_risk: pregnancyRiskScore(r.rows[0]) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OBGYN: ANTENATAL VISITS =====
router.get('/obgyn/antenatal-visits', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { pregnancy_id, patient_id, days = 365, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM obgyn_antenatal_visits WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (pregnancy_id) { sql += ` AND pregnancy_id = $${params.length + 1}`; params.push(parseInt(pregnancy_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY visit_number DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(v => ({ ...v, bp_class: bpClass(v.systolic, v.diastolic, true) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/antenatal-visits', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { pregnancy_id, patient_id, visit_number, gestational_age, weight, weight_gain, blood_pressure, systolic, diastolic, fundal_height, fetal_heart_rate, fetal_presentation, fetal_movement, edema, proteinuria, glucose_urine, hemoglobin, complaints, examination_notes, plan, next_visit, doctor, risk_flags } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO obgyn_antenatal_visits (tenant_id, pregnancy_id, patient_id, visit_number, gestational_age, weight, weight_gain, blood_pressure, systolic, diastolic, fundal_height, fetal_heart_rate, fetal_presentation, fetal_movement, edema, proteinuria, glucose_urine, hemoglobin, complaints, examination_notes, plan, next_visit, doctor, risk_flags)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) RETURNING *`,
            [req.tenantId, pregnancy_id || null, parseInt(patient_id), visit_number || 1,
             gestational_age || null, parseFloat(weight || 0), parseFloat(weight_gain || 0),
             blood_pressure || null, systolic || null, diastolic || null, parseFloat(fundal_height || 0),
             fetal_heart_rate || null, fetal_presentation || null, fetal_movement || null,
             edema || null, proteinuria || null, glucose_urine || null, parseFloat(hemoglobin || 0),
             complaints || null, examination_notes || null, plan || null, next_visit || null,
             doctor || null, risk_flags || null]
        );
        res.status(201).json({ ok: true, visit: r.rows[0], bp_class: bpClass(systolic, diastolic, true) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OBGYN: ULTRASOUNDS =====
router.get('/obgyn/ultrasounds', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { pregnancy_id, patient_id, scan_type, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM obgyn_ultrasounds WHERE tenant_id = $1`;
        if (pregnancy_id) { sql += ` AND pregnancy_id = $${params.length + 1}`; params.push(parseInt(pregnancy_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (scan_type) { sql += ` AND scan_type = $${params.length + 1}`; params.push(scan_type); }
        sql += ` ORDER BY scan_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(u => ({ ...u, efw_calc: efwFromBiometry(u.bpd, u.hc, u.ac, u.fl), efw_pct: efwPercentile(u.efw, u.gestational_age) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/ultrasounds', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { pregnancy_id, patient_id, scan_type, gestational_age, scan_date, bpd, hc, ac, fl, efw, efw_percentile, amniotic_fluid_index, placenta_location, placenta_grade, fetal_heart_rate, fetal_presentation, fetal_gender, number_of_fetuses, cervical_length, anomalies, findings, impression, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO obgyn_ultrasounds (tenant_id, pregnancy_id, patient_id, scan_type, gestational_age, scan_date, bpd, hc, ac, fl, efw, efw_percentile, amniotic_fluid_index, placenta_location, placenta_grade, fetal_heart_rate, fetal_presentation, fetal_gender, number_of_fetuses, cervical_length, anomalies, findings, impression, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) RETURNING *`,
            [req.tenantId, pregnancy_id || null, parseInt(patient_id), scan_type || null, gestational_age || null,
             scan_date || null, parseFloat(bpd || 0), parseFloat(hc || 0), parseFloat(ac || 0), parseFloat(fl || 0),
             parseFloat(efw || 0), efw_percentile || null, parseFloat(amniotic_fluid_index || 0),
             placenta_location || null, placenta_grade || null, fetal_heart_rate || null,
             fetal_presentation || null, fetal_gender || null, number_of_fetuses || 1,
             parseFloat(cervical_length || 0), anomalies || null, findings || null,
             impression || null, performed_by || null]
        );
        res.status(201).json({ ok: true, ultrasound: r.rows[0], efw_calc: efwFromBiometry(bpd, hc, ac, fl), efw_pct: efwPercentile(efw, gestational_age) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OBGYN: NST =====
router.get('/obgyn/nst', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { pregnancy_id, patient_id, result, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM obgyn_nst WHERE tenant_id = $1`;
        if (pregnancy_id) { sql += ` AND pregnancy_id = $${params.length + 1}`; params.push(parseInt(pregnancy_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (result) { sql += ` AND result = $${params.length + 1}`; params.push(result); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/nst', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { pregnancy_id, patient_id, duration_minutes, baseline_fhr, variability, accelerations, decelerations, contractions, result, interpretation, action_taken, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (result && !VALID_NST_RESULT.includes(result)) return res.status(400).json({ ok: false, error: 'invalid_result', valid: VALID_NST_RESULT });
        const r = await db.query(
            `INSERT INTO obgyn_nst (tenant_id, pregnancy_id, patient_id, duration_minutes, baseline_fhr, variability, accelerations, decelerations, contractions, result, interpretation, action_taken, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [req.tenantId, pregnancy_id || null, parseInt(patient_id), duration_minutes || 20,
             baseline_fhr || null, variability || null, accelerations || 0, decelerations || null,
             contractions || 0, result || 'pending', interpretation || null, action_taken || null,
             performed_by || null]
        );
        res.status(201).json({ ok: true, nst: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OBGYN: PARTOGRAM =====
router.get('/obgyn/partogram', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { pregnancy_id, patient_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM obgyn_partogram WHERE tenant_id = $1`;
        if (pregnancy_id) { sql += ` AND pregnancy_id = $${params.length + 1}`; params.push(parseInt(pregnancy_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY recorded_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/partogram', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { pregnancy_id, patient_id, cervical_dilation, cervical_effacement, descent_station, contractions_per_10min, contraction_duration, contraction_intensity, fetal_heart_rate_baseline, fetal_heart_rate_variability, decelerations, molding, caput_succedaneum, meconium, amniotic_fluid, maternal_bp, maternal_hr, maternal_temp, oxytocin_units, notes, alert_flags, recorded_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (amniotic_fluid && !VALID_AMNIOTIC.includes(amniotic_fluid)) return res.status(400).json({ ok: false, error: 'invalid_amniotic', valid: VALID_AMNIOTIC });
        const r = await db.query(
            `INSERT INTO obgyn_partogram (tenant_id, pregnancy_id, patient_id, cervical_dilation, cervical_effacement, descent_station, contractions_per_10min, contraction_duration, contraction_intensity, fetal_heart_rate_baseline, fetal_heart_rate_variability, decelerations, molding, caput_succedaneum, meconium, amniotic_fluid, maternal_bp, maternal_hr, maternal_temp, oxytocin_units, notes, alert_flags, recorded_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23) RETURNING *`,
            [req.tenantId, pregnancy_id || null, parseInt(patient_id), cervical_dilation || 0, cervical_effacement || 0,
             descent_station || 0, contractions_per_10min || 0, contraction_duration || 0,
             contraction_intensity || null, fetal_heart_rate_baseline || null,
             fetal_heart_rate_variability || null, decelerations || null, molding || null,
             caput_succedaneum || null, meconium ? 1 : 0, amniotic_fluid || null, maternal_bp || null,
             maternal_hr || null, parseFloat(maternal_temp || 0), parseFloat(oxytocin_units || 0),
             notes || null, alert_flags || null, recorded_by || null]
        );
        res.status(201).json({ ok: true, partogram: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OBGYN: DELIVERIES =====
router.get('/obgyn/deliveries', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { pregnancy_id, patient_id, delivery_type, outcome, days = 365, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM obgyn_deliveries WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (pregnancy_id) { sql += ` AND pregnancy_id = $${params.length + 1}`; params.push(parseInt(pregnancy_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (delivery_type) { sql += ` AND delivery_type = $${params.length + 1}`; params.push(delivery_type); }
        if (outcome) { sql += ` AND outcome = $${params.length + 1}`; params.push(outcome); }
        sql += ` ORDER BY delivery_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/deliveries', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { pregnancy_id, patient_id, delivery_date, gestational_age_at_delivery, delivery_type, outcome, birth_weight, apgar_1min, apgar_5min, complications, gender, neonatal_outcome } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (delivery_type && !VALID_DELIVERY_MODE.includes(delivery_type)) return res.status(400).json({ ok: false, error: 'invalid_delivery_type', valid: VALID_DELIVERY_MODE });
        if (outcome && !VALID_DELIVERY_OUTCOME.includes(outcome)) return res.status(400).json({ ok: false, error: 'invalid_outcome', valid: VALID_DELIVERY_OUTCOME });
        const r = await db.query(
            `INSERT INTO obgyn_deliveries (tenant_id, pregnancy_id, patient_id, delivery_date, gestational_age_at_delivery, delivery_type, outcome, birth_weight, apgar_1min, apgar_5min, complications, gender, neonatal_outcome)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [req.tenantId, pregnancy_id || null, parseInt(patient_id), delivery_date || null,
             gestational_age_at_delivery || null, delivery_type || null, outcome || null,
             parseFloat(birth_weight || 0), apgar_1min || null, apgar_5min || null,
             complications || null, gender || null, neonatal_outcome || null]
        );
        res.status(201).json({ ok: true, delivery: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OBGYN: DELIVERY LOGS =====
router.get('/obgyn/delivery-logs', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, delivery_mode, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM obgyn_delivery_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (delivery_mode) { sql += ` AND delivery_mode = $${params.length + 1}`; params.push(delivery_mode); }
        sql += ` ORDER BY delivery_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/delivery-logs', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, delivery_date, delivery_mode, delivery_duration_min, apgar_1min, apgar_5min, birth_weight_g, maternal_blood_loss_ml, pph_status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO obgyn_delivery_logs (tenant_id, patient_id, delivery_date, delivery_mode, delivery_duration_min, apgar_1min, apgar_5min, birth_weight_g, maternal_blood_loss_ml, pph_status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [String(req.tenantId), String(patient_id), delivery_date || new Date().toISOString(),
             delivery_mode || null, delivery_duration_min || null, apgar_1min || null, apgar_5min || null,
             birth_weight_g || null, maternal_blood_loss_ml || null, pph_status ? true : false]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OBGYN: DELIVERY RECORDS =====
router.get('/obgyn/delivery-records', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, delivery_mode, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM obgyn_delivery_records WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (delivery_mode) { sql += ` AND delivery_mode = $${params.length + 1}`; params.push(delivery_mode); }
        sql += ` ORDER BY delivery_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/delivery-records', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { encounter_id, patient_id, delivery_date, delivery_mode, baby_gender, baby_weight_g, apgar_1min, apgar_5min, complications } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO obgyn_delivery_records (encounter_id, tenant_id, patient_id, delivery_date, delivery_mode, baby_gender, baby_weight_g, apgar_1min, apgar_5min, complications)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [encounter_id ? String(encounter_id) : null, String(req.tenantId), String(patient_id),
             delivery_date || new Date().toISOString(), delivery_mode || null, baby_gender || null,
             baby_weight_g || null, apgar_1min || null, apgar_5min || null, complications || null]
        );
        res.status(201).json({ ok: true, record: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OBGYN: NEONATAL =====
router.get('/obgyn/neonatal', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { delivery_id, baby_patient_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM obgyn_neonatal WHERE tenant_id = $1`;
        if (delivery_id) { sql += ` AND delivery_id = $${params.length + 1}`; params.push(parseInt(delivery_id)); }
        if (baby_patient_id) { sql += ` AND baby_patient_id = $${params.length + 1}`; params.push(parseInt(baby_patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/neonatal', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { delivery_id, baby_patient_id, apgar_1min, apgar_5min, apgar_10min, birth_weight_grams, length_cm, head_circumference_cm, blood_group, coombs_test, resuscitation_needed, resuscitation_type, birth_injury, jaundice_onset, phototherapy_needed, hypoglycemia, hypothermia, congenital_abnormalities, feeding_type, feeding_established, discharge_destination, discharge_status, follow_up_plan, recorded_by } = req.body;
        if (!baby_patient_id) return res.status(400).json({ ok: false, error: 'baby_patient_id_required' });
        if (feeding_type && !VALID_FEEDING.includes(feeding_type)) return res.status(400).json({ ok: false, error: 'invalid_feeding', valid: VALID_FEEDING });
        const r = await db.query(
            `INSERT INTO obgyn_neonatal (tenant_id, delivery_id, baby_patient_id, apgar_1min, apgar_5min, apgar_10min, birth_weight_grams, length_cm, head_circumference_cm, blood_group, coombs_test, resuscitation_needed, resuscitation_type, birth_injury, jaundice_onset, phototherapy_needed, hypoglycemia, hypothermia, congenital_abnormalities, feeding_type, feeding_established, discharge_destination, discharge_status, follow_up_plan, recorded_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25) RETURNING *`,
            [req.tenantId, delivery_id || null, parseInt(baby_patient_id), apgar_1min || null, apgar_5min || null,
             apgar_10min || null, birth_weight_grams || null, parseFloat(length_cm || 0),
             parseFloat(head_circumference_cm || 0), blood_group || null, coombs_test || null,
             resuscitation_needed ? 1 : 0, resuscitation_type || null, birth_injury || null,
             jaundice_onset || null, phototherapy_needed ? 1 : 0, hypoglycemia ? 1 : 0,
             hypothermia ? 1 : 0, congenital_abnormalities || null, feeding_type || null,
             feeding_established ? 1 : 0, discharge_destination || null, discharge_status || null,
             follow_up_plan || null, recorded_by || null]
        );
        res.status(201).json({ ok: true, neonatal: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OBGYN: LAB PANELS =====
router.get('/obgyn/lab-panels', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { trimester, is_active, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM obgyn_lab_panels WHERE 1=1`;
        if (trimester) { sql += ` AND trimester = $${params.length + 1}`; params.push(trimester); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY panel_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/lab-panels', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { panel_name, panel_name_ar, trimester, tests, is_active } = req.body;
        if (!panel_name) return res.status(400).json({ ok: false, error: 'panel_name_required' });
        if (trimester && !VALID_TRIMESTER.includes(trimester)) return res.status(400).json({ ok: false, error: 'invalid_trimester', valid: VALID_TRIMESTER });
        const r = await db.query(
            `INSERT INTO obgyn_lab_panels (tenant_id, panel_name, panel_name_ar, trimester, tests, is_active)
             VALUES (1,$1,$2,$3,$4,$5) RETURNING *`,
            [panel_name, panel_name_ar || null, trimester || null, tests || null,
             is_active === undefined ? 1 : (is_active ? 1 : 0)]
        );
        res.status(201).json({ ok: true, panel: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OBGYN: ENCOUNTERS =====
router.get('/obgyn/encounters', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, visit_type, status, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM obgyn_encounters WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (visit_type) { sql += ` AND visit_type = $${params.length + 1}`; params.push(visit_type); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY encounter_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/encounters', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, encounter_date, visit_type, gravida, para, lmp, edd, gestational_age_weeks, chief_complaint, physical_exam_findings, diagnosis_code, treatment_plan, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO obgyn_encounters (tenant_id, patient_id, doctor_id, encounter_date, visit_type, gravida, para, lmp, edd, gestational_age_weeks, chief_complaint, physical_exam_findings, diagnosis_code, treatment_plan, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
            [String(req.tenantId), String(patient_id), doctor_id ? String(doctor_id) : null,
             encounter_date || new Date().toISOString(), visit_type || null, gravida || null, para || null,
             lmp || null, edd || null, gestational_age_weeks !== undefined ? gestational_age_weeks : null,
             chief_complaint || null, typeof physical_exam_findings === 'object' ? JSON.stringify(physical_exam_findings) : (physical_exam_findings || null),
             diagnosis_code || null, treatment_plan || null, status || 'active']
        );
        res.status(201).json({ ok: true, encounter: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OBGYN: ANC TRACKING =====
router.get('/obgyn/anc-tracking', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { encounter_id, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM obgyn_anc_tracking WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (encounter_id) { sql += ` AND encounter_id::text = $${params.length + 1}`; params.push(String(encounter_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({ ...a, bp_class: bpClass(a.maternal_bp, null, true) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/anc-tracking', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { encounter_id, fundal_height_cm, fetal_heart_rate, fetal_presentation, maternal_bp, maternal_weight_kg, edema_grade, urine_protein } = req.body;
        if (edema_grade && !VALID_EDEMA.includes(edema_grade)) return res.status(400).json({ ok: false, error: 'invalid_edema', valid: VALID_EDEMA });
        if (urine_protein && !VALID_URINE_PROTEIN.includes(urine_protein)) return res.status(400).json({ ok: false, error: 'invalid_protein', valid: VALID_URINE_PROTEIN });
        const r = await db.query(
            `INSERT INTO obgyn_anc_tracking (encounter_id, tenant_id, fundal_height_cm, fetal_heart_rate, fetal_presentation, maternal_bp, maternal_weight_kg, edema_grade, urine_protein)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [encounter_id ? String(encounter_id) : null, String(req.tenantId), fundal_height_cm || null,
             fetal_heart_rate || null, fetal_presentation || null, maternal_bp || null,
             maternal_weight_kg || null, edema_grade || null, urine_protein || null]
        );
        res.status(201).json({ ok: true, anc: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== OBGYN: IVF LOGS =====
router.get('/obgyn/ivf-logs', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, cycle_id, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM obgyn_ivf_lab_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (cycle_id) { sql += ` AND cycle_id = $${params.length + 1}`; params.push(cycle_id); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/obgyn/ivf-logs', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, cycle_id, log_date, oocyte_count, fertilization_rate, embryo_grade, embryo_stage, transfer_date, cryopreservation_count } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO obgyn_ivf_lab_logs (tenant_id, patient_id, cycle_id, log_date, oocyte_count, fertilization_rate, embryo_grade, embryo_stage, transfer_date, cryopreservation_count)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [String(req.tenantId), String(patient_id), cycle_id || null, log_date || new Date().toISOString(),
             oocyte_count || null, fertilization_rate || null, embryo_grade || null,
             embryo_stage || null, transfer_date || null, cryopreservation_count || null]
        );
        res.status(201).json({ ok: true, ivf_log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MATERNAL-FETAL: METRICS =====
router.get('/maternal-fetal/metrics', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, days = 365, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM maternal_fetal_metrics WHERE tenant_id::text = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(m => ({ ...m, trimester: trimesterFromWeeks(m.gestational_age_weeks) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/maternal-fetal/metrics', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, gestational_age_weeks, bpd_mm, hc_mm, ac_mm, fl_mm, estimated_fetal_weight_g, growth_percentile, doppler_velocity_cm_s } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO maternal_fetal_metrics (tenant_id, patient_id, gestational_age_weeks, bpd_mm, hc_mm, ac_mm, fl_mm, estimated_fetal_weight_g, growth_percentile, doppler_velocity_cm_s)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [String(req.tenantId), String(patient_id), gestational_age_weeks || null,
             bpd_mm || null, hc_mm || null, ac_mm || null, fl_mm || null,
             estimated_fetal_weight_g || null, growth_percentile || null, doppler_velocity_cm_s || null]
        );
        res.status(201).json({ ok: true, metrics: r.rows[0], trimester: trimesterFromWeeks(gestational_age_weeks) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MATERNAL-FETAL: VISITS =====
router.get('/maternal-fetal/visits', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM maternal_fetal_visits WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/maternal-fetal/visits', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, ga_weeks, fhr, presentation, placenta_location, complications } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO maternal_fetal_visits (tenant_id, patient_id, encounter_id, ga_weeks, fhr, presentation, placenta_location, complications)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             ga_weeks || null, fhr || null, presentation || null, placenta_location || null, complications || null]
        );
        res.status(201).json({ ok: true, mf_visit: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PEDIATRIC: GROWTH =====
router.get('/pediatric/growth', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, days = 365, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pediatric_growth_records WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY record_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(g => ({ ...g, bmi: bmiCalc(g.weight_kg, g.height_cm), bmi_category: bmiCategory(bmiCalc(g.weight_kg, g.height_cm)) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pediatric/growth', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, record_date, apgar_1min, apgar_5min, weight_kg, height_cm, head_circ_cm } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO pediatric_growth_records (patient_id, doctor_id, record_date, apgar_1min, apgar_5min, weight_kg, height_cm, head_circ_cm, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, record_date || null,
             apgar_1min || null, apgar_5min || null, parseFloat(weight_kg || 0),
             parseFloat(height_cm || 0), parseFloat(head_circ_cm || 0), req.tenantId]
        );
        res.status(201).json({ ok: true, growth: r.rows[0], bmi: bmiCalc(weight_kg, height_cm), bmi_category: bmiCategory(bmiCalc(weight_kg, height_cm)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PEDIATRIC: IMMUNIZATIONS =====
router.get('/pediatric/immunizations', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, days = 365, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pediatric_immunizations WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY given_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pediatric/immunizations', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, vaccine_name, dose_number, given_date, batch_number, site, route, next_due, reaction, given_by, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!vaccine_name) return res.status(400).json({ ok: false, error: 'vaccine_name_required' });
        const r = await db.query(
            `INSERT INTO pediatric_immunizations (patient_id, vaccine_name, dose_number, given_date, batch_number, site, route, next_due, reaction, given_by, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [parseInt(patient_id), vaccine_name, dose_number || 1, given_date || null, batch_number || null,
             site || null, route || null, next_due || null, reaction || null, given_by || null,
             notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, immunization: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DIALYSIS: SESSIONS =====
router.get('/dialysis/sessions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM dialysis_sessions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY session_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(d => ({ ...d, uf_volume: ufVolume(d.pre_weight_kg || d.weight_pre, d.post_weight_kg || d.weight_post) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/dialysis/sessions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, session_date, weight_pre, weight_post, blood_flow_rate, ultrafiltration_volume, duration_hours, notes, dialysis_type, ultrafiltration_target_liters, blood_flow_rate_ml_min, dialysate_flow_rate_ml_min, pre_weight_kg, post_weight_kg } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (dialysis_type && !VALID_DIALYSIS.includes(dialysis_type)) return res.status(400).json({ ok: false, error: 'invalid_dialysis_type', valid: VALID_DIALYSIS });
        const r = await db.query(
            `INSERT INTO dialysis_sessions (patient_id, doctor_id, session_date, weight_pre, weight_post, blood_flow_rate, ultrafiltration_volume, duration_hours, notes, tenant_id, dialysis_type, ultrafiltration_target_liters, blood_flow_rate_ml_min, dialysate_flow_rate_ml_min, pre_weight_kg, post_weight_kg)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, session_date || null,
             parseFloat(weight_pre || 0), parseFloat(weight_post || 0), blood_flow_rate || null,
             parseFloat(ultrafiltration_volume || 0), parseFloat(duration_hours || 0), notes || null,
             req.tenantId, dialysis_type || 'HD',
             ultrafiltration_target_liters !== undefined ? ultrafiltration_target_liters : null,
             blood_flow_rate_ml_min || null, dialysate_flow_rate_ml_min || null,
             pre_weight_kg !== undefined ? pre_weight_kg : weight_pre,
             post_weight_kg !== undefined ? post_weight_kg : weight_post]
        );
        res.status(201).json({ ok: true, session: r.rows[0], uf_volume: ufVolume(pre_weight_kg || weight_pre, post_weight_kg || weight_post) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DIALYSIS: ASSESSMENTS =====
router.get('/dialysis/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM dialysis_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/dialysis/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO dialysis_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_id ? parseInt(encounter_id) : null,
             engine_name || null, input_payload || null, output_payload || null,
             score !== undefined ? score : null, risk_level || null, recommendation || null,
             performed_by ? parseInt(performed_by) : null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DIABETES: GLUCOSE LOGS =====
router.get('/diabetes/glucose', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, log_type, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM diabetes_glucose_logs WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (log_type) { sql += ` AND log_type = $${params.length + 1}`; params.push(log_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(g => ({ ...g, status: glucoseStatus(g.glucose_value, g.log_type) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/diabetes/glucose', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, glucose_value, log_type, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO diabetes_glucose_logs (patient_id, doctor_id, glucose_value, log_type, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null,
             parseFloat(glucose_value || 0), log_type || 'random', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, log: r.rows[0], status: glucoseStatus(glucose_value, log_type) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== INSULIN: REGIMENS =====
router.get('/insulin/regimens', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, is_active, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM insulin_regimens WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/insulin/regimens', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, doctor_id, insulin_type, dosage, is_active } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (insulin_type && !VALID_INSULIN.includes(insulin_type)) return res.status(400).json({ ok: false, error: 'invalid_insulin_type', valid: VALID_INSULIN });
        const r = await db.query(
            `INSERT INTO insulin_regimens (patient_id, doctor_id, insulin_type, dosage, is_active, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, insulin_type || 'basal_bolus',
             dosage || null, is_active !== false, req.tenantId]
        );
        res.status(201).json({ ok: true, regimen: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NEPHROLOGY: ASSESSMENTS =====
router.get('/nephrology/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM nephrology_assessments WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nephrology/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO nephrology_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             engine_name || null, input_payload || null, output_payload || null,
             score !== undefined ? score : null, risk_level || null, recommendation || null,
             performed_by ? parseInt(performed_by) : null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== FLAP MONITORING =====
router.get('/flap-monitoring', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, perfusion_status, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM flap_monitoring_metrics WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (perfusion_status) { sql += ` AND perfusion_status = $${params.length + 1}`; params.push(perfusion_status); }
        sql += ` ORDER BY log_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/flap-monitoring', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, procedure_id, log_time, perfusion_status, capillary_refill_sec, color_status, temperature_c } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO flap_monitoring_metrics (tenant_id, patient_id, procedure_id, log_time, perfusion_status, capillary_refill_sec, color_status, temperature_c)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), procedure_id ? String(procedure_id) : null,
             log_time || new Date().toISOString(), perfusion_status || null, capillary_refill_sec || null,
             color_status || null, temperature_c || null]
        );
        res.status(201).json({ ok: true, flap: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB: PATIENTS =====
router.get('/rehab/patients', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM rehab_patients WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/patients', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, diagnosis, referral_source, therapist, therapy_type, start_date, target_end_date, status, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (status && !VALID_REHAB_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_REHAB_STATUS });
        const r = await db.query(
            `INSERT INTO rehab_patients (patient_id, patient_name, diagnosis, referral_source, therapist, therapy_type, start_date, target_end_date, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [parseInt(patient_id), patient_name || null, diagnosis || null, referral_source || null,
             therapist || null, therapy_type || null, start_date || null, target_end_date || null,
             status || 'active', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, rehab_patient: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB: SESSIONS =====
router.get('/rehab/sessions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { rehab_patient_id, patient_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM rehab_sessions WHERE tenant_id = $1`;
        if (rehab_patient_id) { sql += ` AND rehab_patient_id = $${params.length + 1}`; params.push(parseInt(rehab_patient_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY session_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/sessions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { rehab_patient_id, patient_id, session_date, session_number, therapist, session_type, exercises, duration_minutes, pain_before, pain_after, progress_notes, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (session_type && !VALID_PHYSIOTHERAPY.includes(session_type)) return res.status(400).json({ ok: false, error: 'invalid_session_type', valid: VALID_PHYSIOTHERAPY });
        const r = await db.query(
            `INSERT INTO rehab_sessions (rehab_patient_id, patient_id, session_date, session_number, therapist, session_type, exercises, duration_minutes, pain_before, pain_after, progress_notes, status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [rehab_patient_id || null, parseInt(patient_id), session_date || null, session_number || 1,
             therapist || null, session_type || 'PT', exercises || null, duration_minutes || 30,
             pain_before || 0, pain_after || 0, progress_notes || null, status || 'completed', req.tenantId]
        );
        res.status(201).json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB: ASSESSMENTS =====
router.get('/rehab/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { rehab_patient_id, patient_id, assessment_type, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM rehab_assessments WHERE tenant_id = $1`;
        if (rehab_patient_id) { sql += ` AND rehab_patient_id = $${params.length + 1}`; params.push(parseInt(rehab_patient_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (assessment_type) { sql += ` AND assessment_type = $${params.length + 1}`; params.push(assessment_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { rehab_patient_id, patient_id, assessment_type, rom_scores, strength_scores, functional_scores, balance_scores, pain_level, assessor } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO rehab_assessments (rehab_patient_id, patient_id, assessment_type, rom_scores, strength_scores, functional_scores, balance_scores, pain_level, assessor, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [rehab_patient_id || null, parseInt(patient_id), assessment_type || null, rom_scores || null,
             strength_scores || null, functional_scores || null, balance_scores || null,
             pain_level || 0, assessor || null, req.tenantId]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB: GOALS =====
router.get('/rehab/goals', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { rehab_patient_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM rehab_goals WHERE tenant_id = $1`;
        if (rehab_patient_id) { sql += ` AND rehab_patient_id = $${params.length + 1}`; params.push(parseInt(rehab_patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY target_date NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/goals', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { rehab_patient_id, goal_description, target_date, progress, status, notes } = req.body;
        if (!rehab_patient_id) return res.status(400).json({ ok: false, error: 'rehab_patient_id_required' });
        const r = await db.query(
            `INSERT INTO rehab_goals (rehab_patient_id, goal_description, target_date, progress, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [parseInt(rehab_patient_id), goal_description || null, target_date || null,
             progress || 0, status || 'active', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, goal: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB: OCCUPATIONAL LOGS =====
router.get('/rehab/occupational', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM rehab_occupational_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/occupational', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, log_date, adl_score, adaptive_equipment_needed, cognitive_function_score } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO rehab_occupational_logs (tenant_id, patient_id, log_date, adl_score, adaptive_equipment_needed, cognitive_function_score)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_date || new Date().toISOString(),
             adl_score || null, adaptive_equipment_needed || null, cognitive_function_score || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REHAB: SPEECH LOGS =====
router.get('/rehab/speech', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM rehab_speech_logs WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY log_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/rehab/speech', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, log_date, dysphagia_grade, communication_level, voice_quality } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO rehab_speech_logs (tenant_id, patient_id, log_date, dysphagia_grade, communication_level, voice_quality)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_date || new Date().toISOString(),
             dysphagia_grade || null, communication_level || null, voice_quality || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CARDIAC REHAB SESSIONS =====
router.get('/cardiac-rehab', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM cardiac_rehab_sessions WHERE tenant_id::text = $1`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cardiac-rehab', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, session_number, vo2_max, mets_achieved, bp_resting, ecg_findings } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO cardiac_rehab_sessions (tenant_id, patient_id, encounter_id, session_number, vo2_max, mets_achieved, bp_resting, ecg_findings)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), encounter_id ? String(encounter_id) : null,
             session_number || 1, vo2_max || null, mets_achieved || null, bp_resting || null, ecg_findings || null]
        );
        res.status(201).json({ ok: true, session: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SPEECH THERAPY ASSESSMENTS =====
router.get('/speech-therapy', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM speech_therapy_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/speech-therapy', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO speech_therapy_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_id ? parseInt(encounter_id) : null,
             engine_name || null, input_payload || null, output_payload || null,
             score !== undefined ? score : null, risk_level || null, recommendation || null,
             performed_by ? parseInt(performed_by) : null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STROKE UNIT ASSESSMENTS =====
router.get('/stroke-unit', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, risk_level, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM stroke_unit_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/stroke-unit', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO stroke_unit_assessments (tenant_id, patient_id, encounter_id, engine_name, input_payload, output_payload, score, risk_level, recommendation, performed_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), encounter_id ? parseInt(encounter_id) : null,
             engine_name || null, input_payload || null, output_payload || null,
             score !== undefined ? score : null, risk_level || null, recommendation || null,
             performed_by ? parseInt(performed_by) : null]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NURSING: ASSESSMENTS =====
router.get('/nursing/assessments', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, assessment_type, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM nursing_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (assessment_type) { sql += ` AND assessment_type = $${params.length + 1}`; params.push(assessment_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({ ...a,
            braden_risk: bradenRisk(a.braden_score), morse_fall: morseFallRisk(a.fall_risk_score)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nursing/assessments', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, patient_name, assessment_type, fall_risk_score, braden_score, pain_score, gcs_score, nurse, shift, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO nursing_assessments (patient_id, patient_name, assessment_type, fall_risk_score, braden_score, pain_score, gcs_score, nurse, shift, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [parseInt(patient_id), patient_name || null, assessment_type || null,
             fall_risk_score || 0, braden_score || 0, pain_score || 0, gcs_score || 15,
             nurse || null, shift || 'day', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, assessment: r.rows[0],
            braden_risk: bradenRisk(braden_score), morse_fall: morseFallRisk(fall_risk_score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NURSING: PAIN =====
router.get('/nursing/pain', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, pain_scale, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM nursing_pain_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (pain_scale) { sql += ` AND pain_scale = $${params.length + 1}`; params.push(pain_scale); }
        sql += ` ORDER BY assessed_at DESC NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(p => ({ ...p, interpretation: nursingPainInterpretation(p.pain_score, p.pain_scale) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nursing/pain', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, patient_name, admission_id, pain_scale, pain_score, pain_location, pain_character, pain_radiation, pain_onset, pain_duration, aggravating_factors, relieving_factors, current_analgesia, pain_goal, reassessment_time, notes, assessed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (pain_scale && !VALID_PAIN_SCALE.includes(pain_scale)) return res.status(400).json({ ok: false, error: 'invalid_pain_scale', valid: VALID_PAIN_SCALE });
        const r = await db.query(
            `INSERT INTO nursing_pain_assessments (patient_id, patient_name, admission_id, pain_scale, pain_score, pain_location, pain_character, pain_radiation, pain_onset, pain_duration, aggravating_factors, relieving_factors, current_analgesia, pain_goal, reassessment_time, notes, assessed_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
            [parseInt(patient_id), patient_name || null, admission_id || null, pain_scale || 'NRS',
             pain_score || 0, pain_location || null, pain_character || null, pain_radiation || null,
             pain_onset || null, pain_duration || null, aggravating_factors || null,
             relieving_factors || null, current_analgesia || null, pain_goal || null,
             reassessment_time || null, notes || null, assessed_by || null, req.tenantId]
        );
        res.status(201).json({ ok: true, pain: r.rows[0], interpretation: nursingPainInterpretation(pain_score, pain_scale) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NURSING: RISK =====
router.get('/nursing/risk', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, assessment_type, risk_level, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM nursing_risk_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (assessment_type) { sql += ` AND assessment_type = $${params.length + 1}`; params.push(assessment_type); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nursing/risk', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, admission_id, assessment_type, total_score, risk_level, details, assessed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO nursing_risk_assessments (patient_id, admission_id, assessment_type, total_score, risk_level, details, assessed_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [parseInt(patient_id), admission_id || null, assessment_type || null, total_score || 0,
             risk_level || null, typeof details === 'object' ? JSON.stringify(details) : (details || null),
             assessed_by || null, req.tenantId]
        );
        res.status(201).json({ ok: true, risk: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NURSING: CARE PLANS =====
router.get('/nursing/care-plans', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM nursing_care_plans WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nursing/care-plans', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, patient_name, admission_id, diagnosis, priority, goals, interventions, expected_outcomes, nurse, status, review_date } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO nursing_care_plans (patient_id, patient_name, admission_id, diagnosis, priority, goals, interventions, expected_outcomes, nurse, status, review_date, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [parseInt(patient_id), patient_name || null, admission_id || null, diagnosis || null,
             priority || null, goals || null, interventions || null, expected_outcomes || null,
             nurse || null, status || 'active', review_date || null, req.tenantId]
        );
        res.status(201).json({ ok: true, care_plan: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NURSING: I/O =====
router.get('/nursing/io', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, entry_type, days = 7, limit = 500 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM nursing_io WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (entry_type) { sql += ` AND entry_type = $${params.length + 1}`; params.push(entry_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nursing/io', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, entry_type, source, volume_ml, entry_time, shift, nurse_name, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!entry_type) return res.status(400).json({ ok: false, error: 'entry_type_required' });
        const r = await db.query(
            `INSERT INTO nursing_io (tenant_id, patient_id, entry_type, source, volume_ml, entry_time, shift, nurse_name, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, parseInt(patient_id), entry_type, source || null, volume_ml || 0,
             entry_time || null, shift || 'day', nurse_name || null, notes || null]
        );
        res.status(201).json({ ok: true, io: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NURSING: I/O RECORDS =====
router.get('/nursing/io-records', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, direction, days = 7, limit = 500 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM nursing_io_records WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (direction) { sql += ` AND direction = $${params.length + 1}`; params.push(direction); }
        sql += ` ORDER BY recorded_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nursing/io-records', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, direction, category, amount_ml, recorded_by_name, shift, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!direction) return res.status(400).json({ ok: false, error: 'direction_required' });
        const r = await db.query(
            `INSERT INTO nursing_io_records (tenant_id, patient_id, direction, category, amount_ml, recorded_by, recorded_by_name, shift, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, parseInt(patient_id), direction, category || null, amount_ml || 0,
             req.user?.id ? parseInt(req.user.id) : null, recorded_by_name || null,
             shift || 'day', notes || null]
        );
        res.status(201).json({ ok: true, io_record: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NURSING: HANDOVER (SBAR + NEWS2) =====
router.get('/nursing/handover', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, shift, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM nursing_handover WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (shift) { sql += ` AND shift = $${params.length + 1}`; params.push(shift); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(h => ({ ...h,
            completeness: handoffCompleteness(h), news2_risk: news2Risk(h.news2_score)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nursing/handover', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, nurse_name, shift, sbar_s, sbar_b, sbar_a, sbar_r, news2_score } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (shift && !VALID_NURSING_SHIFT.includes(shift)) return res.status(400).json({ ok: false, error: 'invalid_shift', valid: VALID_NURSING_SHIFT });
        const r = await db.query(
            `INSERT INTO nursing_handover (tenant_id, patient_id, nurse_name, shift, sbar_s, sbar_b, sbar_a, sbar_r, news2_score)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, parseInt(patient_id), nurse_name || null, shift || 'day',
             sbar_s || null, sbar_b || null, sbar_a || null, sbar_r || null,
             news2_score !== undefined ? news2_score : null]
        );
        res.status(201).json({ ok: true, handover: r.rows[0],
            completeness: handoffCompleteness(r.rows[0]), news2_risk: news2Risk(news2_score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NURSING: SCORES =====
router.get('/nursing/scores', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, score_type, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM nursing_scores WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (score_type) { sql += ` AND score_type = $${params.length + 1}`; params.push(score_type); }
        sql += ` ORDER BY recorded_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nursing/scores', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, score_type, score, band, inputs_json, recorded_by_name, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO nursing_scores (tenant_id, patient_id, score_type, score, band, inputs_json, recorded_by, recorded_by_name, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, parseInt(patient_id), score_type || null, score || 0, band || null,
             inputs_json || null, req.user?.id ? parseInt(req.user.id) : null,
             recorded_by_name || null, notes || null]
        );
        res.status(201).json({ ok: true, nursing_score: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NURSING: VITALS =====
router.get('/nursing/vitals', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, days = 7, limit = 500 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM nursing_vitals WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nursing/vitals', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, patient_name, bp, temp, weight, height, pulse, o2_sat, respiratory_rate, blood_sugar, notes, chronic_diseases, current_medications, allergies } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO nursing_vitals (patient_id, patient_name, bp, temp, weight, height, pulse, o2_sat, respiratory_rate, blood_sugar, notes, chronic_diseases, current_medications, allergies, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
            [parseInt(patient_id), patient_name || null, bp || null, parseFloat(temp || 0),
             parseFloat(weight || 0), parseFloat(height || 0), pulse || 0, o2_sat || 0,
             respiratory_rate || 0, blood_sugar || null, notes || null,
             chronic_diseases || null, current_medications || null, allergies || null, req.tenantId]
        );
        res.status(201).json({ ok: true, vitals: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MEDICATION RECONCILIATIONS =====
router.get('/medication/reconciliations', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, status, reconciliation_type, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM medication_reconciliations WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (reconciliation_type) { sql += ` AND reconciliation_type = $${params.length + 1}`; params.push(reconciliation_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/medication/reconciliations', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, admission_id, reconciliation_type, performed_by_name, status, home_medications, hospital_medications, discrepancies, allergy_verified, high_alert_checked, patient_counselled, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO medication_reconciliations (patient_id, admission_id, reconciliation_type, performed_by_name, status, home_medications, hospital_medications, discrepancies, allergy_verified, high_alert_checked, patient_counselled, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [parseInt(patient_id), admission_id || null, reconciliation_type || 'admission',
             performed_by_name || null, status || 'in_progress',
             typeof home_medications === 'object' ? JSON.stringify(home_medications) : (home_medications || null),
             typeof hospital_medications === 'object' ? JSON.stringify(hospital_medications) : (hospital_medications || null),
             typeof discrepancies === 'object' ? JSON.stringify(discrepancies) : (discrepancies || null),
             allergy_verified ? true : false, high_alert_checked ? true : false, patient_counselled ? true : false,
             notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, reconciliation: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== IPC: HAND HYGIENE =====
router.get('/ipc/hand-hygiene', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { department, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM hand_hygiene_audits WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        sql += ` ORDER BY audit_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({ ...a, computed_compliance: handHygieneCompliance(a.moments_compliant, a.moments_observed) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ipc/hand-hygiene', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { audit_date, auditor, department, moments_observed, moments_compliant, notes } = req.body;
        if (!audit_date) return res.status(400).json({ ok: false, error: 'audit_date_required' });
        const compliance_rate = handHygieneCompliance(moments_compliant, moments_observed);
        const r = await db.query(
            `INSERT INTO hand_hygiene_audits (audit_date, auditor, department, moments_observed, moments_compliant, compliance_rate, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [audit_date, auditor || null, department || null, moments_observed || 0, moments_compliant || 0,
             compliance_rate, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, audit: r.rows[0], computed_compliance: compliance_rate });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== IPC: ISOLATION =====
router.get('/ipc/isolation', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { patient_id, precaution_type, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM hai_isolation WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (precaution_type) { sql += ` AND precaution_type = $${params.length + 1}`; params.push(precaution_type); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY effective_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ipc/isolation', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { patient_id, patient_name, hai_category, organism, precaution_type, ward, bed, status, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (precaution_type && !VALID_ISOLATION_TYPE.includes(precaution_type)) return res.status(400).json({ ok: false, error: 'invalid_precaution_type', valid: VALID_ISOLATION_TYPE });
        const r = await db.query(
            `INSERT INTO hai_isolation (tenant_id, patient_id, patient_name, hai_category, organism, precaution_type, ward, bed, status, notes, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [req.tenantId, parseInt(patient_id), patient_name || null, hai_category || null,
             organism || null, precaution_type || 'standard', ward || null, bed || null,
             status || 'active', notes || null, req.user?.username || null]
        );
        res.status(201).json({ ok: true, isolation: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== IPC: SURVEILLANCE =====
router.get('/ipc/surveillance', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { patient_id, infection_type, hai_category, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM infection_surveillance WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (infection_type) { sql += ` AND infection_type = $${params.length + 1}`; params.push(infection_type); }
        if (hai_category) { sql += ` AND hai_category = $${params.length + 1}`; params.push(hai_category); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ipc/surveillance', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { patient_id, patient_name, infection_type, infection_site, organism, sensitivity, detection_date, hai_category, device_related, device_type, ward, bed, isolation_type, outcome, reported_by, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (isolation_type && !VALID_ISOLATION_TYPE.includes(isolation_type)) return res.status(400).json({ ok: false, error: 'invalid_isolation_type', valid: VALID_ISOLATION_TYPE });
        const r = await db.query(
            `INSERT INTO infection_surveillance (patient_id, patient_name, infection_type, infection_site, organism, sensitivity, detection_date, hai_category, device_related, device_type, ward, bed, isolation_type, outcome, reported_by, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
            [parseInt(patient_id), patient_name || null, infection_type || null, infection_site || null,
             organism || null, sensitivity || null, detection_date || null, hai_category || null,
             device_related ? 1 : 0, device_type || null, ward || null, bed || null,
             isolation_type || null, outcome || null, reported_by || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, surveillance: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== IPC: OUTBREAKS =====
router.get('/ipc/outbreaks', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, organism, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM infection_outbreaks WHERE tenant_id = $1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (organism) { sql += ` AND organism = $${params.length + 1}`; params.push(organism); }
        sql += ` ORDER BY start_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ipc/outbreaks', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { outbreak_name, organism, start_date, end_date, affected_ward, total_cases, investigation_notes, control_measures, status, reported_by } = req.body;
        if (!outbreak_name) return res.status(400).json({ ok: false, error: 'outbreak_name_required' });
        if (status && !VALID_OUTBREAK_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_OUTBREAK_STATUS });
        const r = await db.query(
            `INSERT INTO infection_outbreaks (outbreak_name, organism, start_date, end_date, affected_ward, total_cases, investigation_notes, control_measures, status, reported_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [outbreak_name, organism || null, start_date || null, end_date || null,
             affected_ward || null, total_cases || 0, investigation_notes || null,
             control_measures || null, status || 'suspected', reported_by || null, req.tenantId]
        );
        res.status(201).json({ ok: true, outbreak: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PHARMACY: DRUG CATALOG =====
router.get('/pharmacy/drug-catalog', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { category, is_active, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pharmacy_drug_catalog WHERE tenant_id = $1`;
        if (category) { sql += ` AND category = $${params.length + 1}`; params.push(category); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY drug_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pharmacy/drug-catalog', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { drug_name, active_ingredient, barcode, category, unit, selling_price, cost_price, stock_qty, min_qty, expiry_date, is_active, is_controlled, schedule_class } = req.body;
        if (!drug_name) return res.status(400).json({ ok: false, error: 'drug_name_required' });
        const r = await db.query(
            `INSERT INTO pharmacy_drug_catalog (drug_name, active_ingredient, barcode, category, unit, selling_price, cost_price, stock_qty, min_qty, expiry_date, is_active, tenant_id, is_controlled, schedule_class)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
            [drug_name, active_ingredient || null, barcode || null, category || null, unit || null,
             parseFloat(selling_price || 0), parseFloat(cost_price || 0), stock_qty || 0, min_qty || 0,
             expiry_date || null, is_active === undefined ? 1 : (is_active ? 1 : 0), req.tenantId,
             is_controlled ? 1 : 0, schedule_class || null]
        );
        res.status(201).json({ ok: true, drug: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PHARMACY: OPENING BALANCES =====
router.get('/pharmacy/opening-balances', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { drug_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pharmacy_opening_balances WHERE tenant_id = $1`;
        if (drug_id) { sql += ` AND drug_id = $${params.length + 1}`; params.push(parseInt(drug_id)); }
        sql += ` ORDER BY entry_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pharmacy/opening-balances', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { drug_id, qty, unit_cost, expiry_date, batch_number } = req.body;
        if (!drug_id) return res.status(400).json({ ok: false, error: 'drug_id_required' });
        const r = await db.query(
            `INSERT INTO pharmacy_opening_balances (drug_id, qty, unit_cost, expiry_date, batch_number, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [parseInt(drug_id), qty || 0, parseFloat(unit_cost || 0), expiry_date || null, batch_number || null, req.tenantId]
        );
        res.status(201).json({ ok: true, opening: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PHARMACY: PRESCRIPTIONS QUEUE =====
router.get('/pharmacy/prescriptions-queue', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { patient_id, status, days = 7, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pharmacy_prescriptions_queue WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pharmacy/prescriptions-queue', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { patient_id, doctor_id, medication_name, dosage, quantity_per_day, frequency, duration, price, payment_method, prescription_text, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!medication_name) return res.status(400).json({ ok: false, error: 'medication_name_required' });
        if (status && !VALID_PRESCRIPTION_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_PRESCRIPTION_STATUS });
        const r = await db.query(
            `INSERT INTO pharmacy_prescriptions_queue (patient_id, doctor_id, medication_name, dosage, quantity_per_day, frequency, duration, price, payment_method, prescription_text, status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [parseInt(patient_id), doctor_id ? parseInt(doctor_id) : null, medication_name,
             dosage || null, quantity_per_day || null, frequency || null, duration || null,
             price !== undefined ? price : null, payment_method || null,
             prescription_text || null, status || 'pending', req.tenantId]
        );
        res.status(201).json({ ok: true, prescription: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PHARMACY: DISPENSE =====
router.get('/pharmacy/dispense', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { patient_id, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pharmacy_dispense WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pharmacy/dispense', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { prescription_id, patient_id, drug_id, drug_batch_id, drug_name, qty, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!drug_id) return res.status(400).json({ ok: false, error: 'drug_id_required' });
        const r = await db.query(
            `INSERT INTO pharmacy_dispense (tenant_id, prescription_id, patient_id, drug_id, drug_batch_id, drug_name, qty, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [req.tenantId, prescription_id || null, parseInt(patient_id), parseInt(drug_id),
             drug_batch_id || null, drug_name || null, qty || 1, status || 'dispensed']
        );
        res.status(201).json({ ok: true, dispense: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PHARMACY: SALES =====
router.get('/pharmacy/sales', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { patient_id, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pharmacy_sales WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pharmacy/sales', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { patient_id, sale_type, total_amount, discount, insurance_coverage, patient_share, payment_method, cashier, invoice_number } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO pharmacy_sales (patient_id, sale_type, total_amount, discount, insurance_coverage, patient_share, payment_method, cashier, invoice_number, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [parseInt(patient_id), sale_type || 'prescription', parseFloat(total_amount || 0),
             parseFloat(discount || 0), parseFloat(insurance_coverage || 0), parseFloat(patient_share || 0),
             payment_method || 'cash', cashier || null, invoice_number || null, req.tenantId]
        );
        res.status(201).json({ ok: true, sale: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PHARMACY: SALE ITEMS =====
router.get('/pharmacy/sale-items', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { sale_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM pharmacy_sale_items WHERE tenant_id = $1`;
        if (sale_id) { sql += ` AND sale_id = $${params.length + 1}`; params.push(parseInt(sale_id)); }
        sql += ` ORDER BY id DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/pharmacy/sale-items', requireAuth, requireTenantScope, requireRole('pharmacist'), async (req, res) => {
    try {
        const { sale_id, drug_id, qty, unit_price, bonus_qty, discount } = req.body;
        if (!sale_id) return res.status(400).json({ ok: false, error: 'sale_id_required' });
        const total = (parseFloat(qty || 0) * parseFloat(unit_price || 0)) - parseFloat(discount || 0);
        const r = await db.query(
            `INSERT INTO pharmacy_sale_items (sale_id, drug_id, qty, unit_price, total_price, bonus_qty, discount, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [parseInt(sale_id), drug_id || null, qty || 1, parseFloat(unit_price || 0),
             total, bonus_qty || 0, parseFloat(discount || 0), req.tenantId]
        );
        res.status(201).json({ ok: true, sale_item: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/bmi-calc', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { weight_kg, height_cm } = req.query;
        if (!weight_kg || !height_cm) return res.status(400).json({ ok: false, error: 'both_required' });
        const bmi = bmiCalc(weight_kg, height_cm);
        res.json({ ok: true, bmi, category: bmiCategory(bmi) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pregnancy-edd', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { lmp } = req.query;
        if (!lmp) return res.status(400).json({ ok: false, error: 'lmp_required' });
        res.json({ ok: true, edd: pregnancyEDD(lmp) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/gestational-age', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { lmp, as_of } = req.query;
        if (!lmp) return res.status(400).json({ ok: false, error: 'lmp_required' });
        res.json({ ok: true, weeks: pregnancyWeekProgression(lmp) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/trimester', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { weeks } = req.query;
        if (weeks === undefined) return res.status(400).json({ ok: false, error: 'weeks_required' });
        res.json({ ok: true, trimester: trimesterFromWeeks(weeks) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/efw-biometry', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { bpd, hc, ac, fl } = req.query;
        res.json({ ok: true, efw_estimate: efwFromBiometry(bpd, hc, ac, fl) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/efw-percentile', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { efw, ga_weeks } = req.query;
        res.json({ ok: true, percentile: efwPercentile(efw, ga_weeks) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pregnancy-week-progression', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { lmp } = req.query;
        res.json({ ok: true, progression: pregnancyWeekProgression(lmp) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pregnancy-risk', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { pregnancy } = req.query;
        if (!pregnancy) return res.status(400).json({ ok: false, error: 'pregnancy_required' });
        let parsed = pregnancy;
        if (typeof pregnancy === 'string') {
            try { parsed = JSON.parse(pregnancy); } catch (e) {}
        }
        res.json({ ok: true, risk: pregnancyRiskScore(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/bp-class', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { systolic, diastolic, gravid } = req.query;
        if (systolic === undefined || diastolic === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, classification: bpClass(systolic, diastolic, gravid === 'true') });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/glucose-status', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { value, type } = req.query;
        if (value === undefined || !type) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, status: glucoseStatus(value, type) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/kt-v', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { urea_before, urea_after, weight_loss, treatment_time } = req.query;
        res.json({ ok: true, ktv: ktV(urea_before, urea_after, weight_loss, treatment_time) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/kt-v-adequacy', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { ktv } = req.query;
        res.json({ ok: true, adequacy: ktVAdequacy(ktv) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/uf-volume', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { pre_weight, post_weight } = req.query;
        res.json({ ok: true, uf_volume: ufVolume(pre_weight, post_weight) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/nursing-pain', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { score, scale } = req.query;
        if (score === undefined || !scale) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, interpretation: nursingPainInterpretation(score, scale) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/braden-risk', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, risk: bradenRisk(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/morse-fall', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, risk: morseFallRisk(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/news2', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { rr, spo2, temp, sbp, hr, consciousness } = req.query;
        res.json({ ok: true, score: news2Score(rr, spo2, temp, sbp, hr, consciousness) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/news2-risk', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, risk: news2Risk(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/handoff-completeness', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { handoff } = req.query;
        if (!handoff) return res.status(400).json({ ok: false, error: 'handoff_required' });
        let parsed = handoff;
        if (typeof handoff === 'string') {
            try { parsed = JSON.parse(handoff); } catch (e) {}
        }
        res.json({ ok: true, completeness_pct: handoffCompleteness(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/compliance-rate', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { compliant, total } = req.query;
        if (compliant === undefined || total === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, rate: complianceRate(compliant, total) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/hand-hygiene-compliance', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { compliant, observed } = req.query;
        if (compliant === undefined || observed === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, rate: handHygieneCompliance(compliant, observed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/flacc-severity', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, severity: flaccSeverity(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/bmi-category', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { bmi } = req.query;
        if (bmi === undefined) return res.status(400).json({ ok: false, error: 'bmi_required' });
        res.json({ ok: true, category: bmiCategory(bmi) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/growth-zscore', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { measurement, ref_value, ref_sd } = req.query;
        if (measurement === undefined || ref_value === undefined || ref_sd === undefined) return res.status(400).json({ ok: false, error: 'all_required' });
        res.json({ ok: true, zscore: growthZScore(measurement, ref_value, ref_sd) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/dispense-days', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { quantity_per_day, qty } = req.query;
        if (quantity_per_day === undefined || qty === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, days: dispenseDays(quantity_per_day, qty) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/price-after-discount', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { base, discount_pct } = req.query;
        if (base === undefined || discount_pct === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, final_price: priceAfterDiscount(base, discount_pct) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/io-balance', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { intake, output } = req.query;
        res.json({ ok: true, balance: ioBalance(intake, output) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STATS =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const preg = await db.query(`SELECT status, risk_level, COUNT(*) AS count FROM obgyn_pregnancies WHERE tenant_id = $1 GROUP BY status, risk_level`, [req.tenantId]);
        const dly = await db.query(`SELECT delivery_type, COUNT(*) AS count FROM obgyn_deliveries WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY delivery_type`, [req.tenantId]);
        const dx = await db.query(`SELECT is_active, COUNT(*) AS count FROM insulin_regimens WHERE tenant_id = $1 GROUP BY is_active`, [req.tenantId]);
        const dial = await db.query(`SELECT COUNT(*) AS count FROM dialysis_sessions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days'`, [req.tenantId]);
        const rehab = await db.query(`SELECT status, COUNT(*) AS count FROM rehab_patients WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        const nsg = await db.query(`SELECT COUNT(*) AS count FROM nursing_assessments WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '7 days'`, [req.tenantId]);
        const hh = await db.query(`SELECT AVG(compliance_rate) AS avg_rate FROM hand_hygiene_audits WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days'`, [req.tenantId]);
        const rx = await db.query(`SELECT status, COUNT(*) AS count FROM pharmacy_prescriptions_queue WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '7 days' GROUP BY status`, [req.tenantId]);
        res.json({
            ok: true,
            pregnancies: preg.rows,
            deliveries_90d: dly.rows,
            insulin_regimens: dx.rows,
            dialysis_30d: parseInt(dial.rows[0].count),
            rehab_patients: rehab.rows,
            nursing_assessments_7d: parseInt(nsg.rows[0].count),
            hand_hygiene_avg_30d: parseFloat(hh.rows[0].avg_rate || 0),
            pharmacy_rx_7d: rx.rows
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
