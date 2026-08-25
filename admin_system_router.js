'use strict';
// Wave 130 — Admin / Multi-tenant / RBAC / Plans / Facilities / Quality / AI-CDS / Diet / Knowledge / Templates
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_TENANT_STATUS = ['active','trial','suspended','expired','cancelled','pending'];
const VALID_PLAN_TYPE = ['trial','starter','professional','enterprise','custom'];
const VALID_FACILITY_TYPE = ['medical_city','general_hospital','tertiary_hospital','specialized_hospital','polyclinic','phc','specialty_center','diagnostic_center','rehabilitation_center','dialysis_center','dental_center','mental_health_center','home_healthcare_unit','mobile_clinic','virtual_clinic','health_unit'];
const VALID_INTEGRATION = ['NPHIES','ZATCA','Mudad','Absher','MOH','Lab_System','PACS','RIS','HL7','FHIR','DICOM','Smsa','SMS_Provider','Email','Payment_Gateway'];
const VALID_INCIDENT_SEVERITY = ['low','medium','high','critical','catastrophic','near_miss'];
const VALID_INCIDENT_STATUS = ['reported','under_review','investigating','corrective_action','closed','verified'];
const VALID_CAPA_TYPE = ['corrective','preventive','both'];
const VALID_CAPA_STATUS = ['open','in_progress','completed','verified','overdue','cancelled'];
const VALID_RISK_LEVEL = ['very_low','low','moderate','high','very_high','extreme'];
const VALID_KPI_STATUS = ['on_track','at_risk','off_track','achieved'];
const VALID_CDS_SEVERITY = ['info','warning','critical','urgent','life_threatening'];
const VALID_CDS_STATUS = ['active','acknowledged','resolved','snoozed','dismissed'];
const VALID_SAC = ['SAC1','SAC2','SAC3','SAC4','SAC5','near_miss','no_harm'];
const VALID_DIET_TYPE = ['regular','diabetic','cardiac','renal','low_sodium','high_protein','liquid','soft','pureed','NPO'];
const VALID_TEXTURE = ['regular','soft','mechanical_soft','pureed','liquid_thick','liquid_thin'];
const VALID_MEAL_TYPE = ['breakfast','mid_morning','lunch','afternoon_snack','dinner','late_snack','supper'];
const VALID_NUTRITION_RISK = ['low','moderate','high','severe','malnourished'];
const VALID_KNOWLEDGE_DEPT = ['cardiology','endocrinology','nephrology','oncology','pediatrics','emergency','icu','obgyn','surgery','pharmacy'];
const VALID_SURVEY_TYPE = ['NPS','CSAT','CES','PRE_VISIT','POST_VISIT','PROCEDURE_FEEDBACK','STAFF_FEEDBACK','CUSTOM'];
const VALID_TENANT_ARCHETYPE = ['general_hospital','specialty_clinic','dental_center','imaging_center','lab_only','pharmacy','rehab','home_care'];
const VALID_FEEDBACK_TYPE = ['complaint','compliment','suggestion','experience','complaint_followup'];

function passwordStrength(pwd) {
    if (!pwd || pwd.length < 8) return 'weak';
    let score = 0;
    if (pwd.length >= 12) score += 2;
    else if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 2;
    if (score >= 6) return 'very_strong';
    if (score >= 4) return 'strong';
    if (score >= 2) return 'moderate';
    return 'weak';
}

function riskScore(likelihood, impact) {
    const l = parseInt(likelihood) || 0;
    const i = parseInt(impact) || 0;
    return l * i;
}

function riskLevelFromScore(score) {
    if (score >= 20) return 'extreme';
    if (score >= 15) return 'very_high';
    if (score >= 10) return 'high';
    if (score >= 5) return 'moderate';
    return 'low';
}

function kpiProgress(actual, target) {
    const a = parseFloat(actual);
    const t = parseFloat(target);
    if (isNaN(a) || isNaN(t) || t === 0) return null;
    return Math.round((a / t) * 1000) / 10;
}

function ageInDays(date) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    return Math.floor((new Date() - d) / (1000 * 60 * 60 * 24));
}

function tenantHealth(tenant) {
    if (!tenant) return null;
    const issues = [];
    if (tenant.status === 'suspended') issues.push('suspended');
    if (tenant.status === 'expired') issues.push('expired');
    if (tenant.trial_ends_at) {
        const d = new Date(tenant.trial_ends_at);
        if (!isNaN(d.getTime()) && d < new Date()) issues.push('trial_expired');
    }
    if (issues.length === 0) return 'healthy';
    if (issues.length === 1) return 'at_risk';
    return 'critical';
}

function planPriceMonthly(monthly, yearly) {
    const m = parseFloat(monthly || 0);
    const y = parseFloat(yearly || 0);
    if (m === 0) return 0;
    if (y === 0) return m;
    return Math.round((y / 12) * 100) / 100;
}

function planDiscount(monthly, yearly) {
    const m = parseFloat(monthly || 0);
    const y = parseFloat(yearly || 0);
    if (m === 0 || y === 0) return 0;
    const monthly_equiv = y / 12;
    if (monthly_equiv >= m) return 0;
    return Math.round((1 - monthly_equiv / m) * 1000) / 10;
}

function capaOverdue(dueDate, status) {
    if (!dueDate || status === 'completed' || status === 'verified' || status === 'cancelled') return false;
    return new Date(dueDate) < new Date();
}

function integrationHealth(lastSync) {
    if (!lastSync) return 'never_synced';
    const days = ageInDays(lastSync);
    if (days === null) return 'unknown';
    if (days > 7) return 'stale';
    if (days > 1) return 'delayed';
    return 'healthy';
}

function rcaStatusToMaturity(rcaStatus) {
    const map = { pending: 'level_1', investigating: 'level_2', root_cause: 'level_3', corrective: 'level_4', verified: 'level_5' };
    return map[rcaStatus] || 'level_0';
}

function vectorSimilarity(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length) return null;
    let dot = 0, mag1 = 0, mag2 = 0;
    for (let i = 0; i < arr1.length; i++) {
        dot += (arr1[i] || 0) * (arr2[i] || 0);
        mag1 += (arr1[i] || 0) ** 2;
        mag2 += (arr2[i] || 0) ** 2;
    }
    if (mag1 === 0 || mag2 === 0) return 0;
    return Math.round((dot / (Math.sqrt(mag1) * Math.sqrt(mag2))) * 1000) / 1000;
}

function sepsisBundleCompliance(bundle) {
    if (!bundle) return null;
    let score = 0;
    if (bundle.lactate_initial !== null) score += 1;
    if (bundle.antibiotics_administered) score += 2;
    if (bundle.fluid_resuscitation_ml && bundle.fluid_resuscitation_ml >= 30) score += 2;
    if (bundle.lactate_followup !== null) score += 1;
    const total = 6;
    return {
        score,
        total,
        compliance_pct: Math.round((score / total) * 100),
        complete: score === total
    };
}

function shockResponseAssessment(mapValue, baselineMap) {
    if (!mapValue || !baselineMap) return null;
    const cv = parseFloat(mapValue);
    const bl = parseFloat(baselineMap);
    const ratio = cv / bl;
    if (ratio >= 1.0) return 'no_response';
    if (ratio >= 0.85) return 'mild_response';
    if (ratio >= 0.7) return 'good_response';
    return 'excellent_response';
}

function satisfactionOverall(cleanliness, courtesy, wait, comm, pain, food) {
    const vals = [cleanliness, courtesy, wait, comm, pain, food].map(v => parseInt(v)).filter(v => !isNaN(v));
    if (vals.length === 0) return null;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

function satisfactionColor(rating) {
    const r = parseInt(rating);
    if (isNaN(r)) return null;
    if (r >= 9) return 'green';
    if (r >= 7) return 'yellow';
    if (r >= 5) return 'orange';
    return 'red';
}

function npsCategory(score) {
    const s = parseInt(score);
    if (isNaN(s)) return null;
    if (s >= 9) return 'promoter';
    if (s >= 7) return 'passive';
    return 'detractor';
}

function npsScore(responses) {
    if (!Array.isArray(responses) || responses.length === 0) return null;
    const counts = { promoter: 0, passive: 0, detractor: 0 };
    responses.forEach(r => {
        const c = npsCategory(r);
        if (c) counts[c]++;
    });
    const total = counts.promoter + counts.passive + counts.detractor;
    if (total === 0) return null;
    return Math.round(((counts.promoter - counts.detractor) / total) * 100);
}

function tenantSubdomainValid(s) {
    if (!s) return null;
    if (s.length < 3 || s.length > 63) return false;
    return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(s);
}

function usernameValid(u) {
    if (!u) return null;
    if (u.length < 3 || u.length > 50) return false;
    return /^[a-zA-Z0-9_.-]+$/.test(u);
}

function permissionSet(perms) {
    if (!perms) return [];
    if (Array.isArray(perms)) return perms;
    if (typeof perms === 'string') {
        try { return JSON.parse(perms); } catch (e) { return perms.split(',').map(s => s.trim()).filter(Boolean); }
    }
    return [];
}

function userHasPermission(userPerms, key) {
    const perms = permissionSet(userPerms);
    return perms.includes(key) || perms.includes('*') || perms.includes('admin') || perms.includes('all');
}

function rcaRcaMaturityScore(rca) {
    if (!rca) return 0;
    let score = 0;
    if (rca.root_cause) score += 1;
    if (rca.corrective_action) score += 1;
    if (rca.preventive_action) score += 1;
    if (rca.status === 'closed') score += 1;
    if (rca.status === 'verified') score += 1;
    return score;
}

function rcaCompletenessPercent(rca) {
    if (!rca) return 0;
    return Math.round((rcaRcaMaturityScore(rca) / 5) * 100);
}

function tenantTrialRemainingDays(trialEndsAt) {
    if (!trialEndsAt) return null;
    const d = new Date(trialEndsAt);
    if (isNaN(d.getTime())) return null;
    return Math.max(0, Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24)));
}

function cdsResponseTime(createdAt, ackAt) {
    if (!createdAt || !ackAt) return null;
    const c = new Date(createdAt);
    const a = new Date(ackAt);
    if (isNaN(c.getTime()) || isNaN(a.getTime())) return null;
    return Math.round((a - c) / 60000);
}

function dailyMealsCompliance(consumedPct) {
    const c = parseInt(consumedPct);
    if (isNaN(c)) return null;
    if (c >= 75) return 'good_intake';
    if (c >= 50) return 'moderate_intake';
    if (c >= 25) return 'poor_intake';
    return 'refused';
}

function alertAcknowledgementRate(alerts) {
    if (!Array.isArray(alerts) || alerts.length === 0) return null;
    const acked = alerts.filter(a => a.acknowledged_at).length;
    return Math.round((acked / alerts.length) * 1000) / 10;
}

function sepsisTimeToBundle(startTime) {
    if (!startTime) return null;
    const s = new Date(startTime);
    if (isNaN(s.getTime())) return null;
    return Math.round((new Date() - s) / 60000);
}

function shockTimeToResponse(logTime) {
    if (!logTime) return null;
    const s = new Date(logTime);
    if (isNaN(s.getTime())) return null;
    return Math.round((new Date() - s) / 60000);
}

function satisfactionCategory(overallRating) {
    const r = parseFloat(overallRating);
    if (isNaN(r)) return null;
    if (r >= 8) return 'excellent';
    if (r >= 6) return 'good';
    if (r >= 4) return 'fair';
    return 'poor';
}

function cmsEmbeddingDistance(a, b) {
    const sim = vectorSimilarity(a, b);
    return sim === null ? null : Math.round((1 - sim) * 1000) / 1000;
}

function facilityBedsUtilization(beds, occupied) {
    const total = parseInt(beds || 0);
    const occ = parseInt(occupied || 0);
    if (total === 0) return null;
    return Math.round((occ / total) * 1000) / 10;
}

function userMfaRequired(perms) {
    if (!perms) return false;
    const set = permissionSet(perms);
    return set.includes('admin') || set.includes('doctor') || set.includes('pharmacist') || set.includes('*');
}

function taxonomyWeight(score) {
    const s = parseInt(score);
    if (isNaN(s)) return 0;
    if (s >= 16) return 5;
    if (s >= 9) return 4;
    if (s >= 4) return 3;
    if (s >= 1) return 2;
    return 1;
}

function npsDetailed(scores) {
    if (!Array.isArray(scores)) return null;
    const counts = { promoter: 0, passive: 0, detractor: 0 };
    scores.forEach(s => { const c = npsCategory(s); if (c) counts[c]++; });
    const total = counts.promoter + counts.passive + counts.detractor;
    if (total === 0) return null;
    return {
        ...counts,
        total,
        nps: Math.round(((counts.promoter - counts.detractor) / total) * 100)
    };
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true, version: '1.0.0', module: 'admin-system-masterdata',
        endpoints: [
            'GET/POST /tenants',
            'GET/POST /facilities',
            'GET/POST /branches',
            'GET/POST /departments',
            'GET/POST /clinical-departments',
            'GET/POST /facility-modules',
            'GET/POST /plans',
            'GET/POST /plan-entitlements',
            'GET/POST /tenant-plan-assignments',
            'GET/POST /tenant-settings',
            'GET/POST /company-settings',
            'GET/POST /integration-settings',
            'GET/POST /employees',
            'GET/POST /system-users',
            'GET/POST /user-tenants',
            'GET/POST /user-facilities',
            'GET/POST /user-permissions',
            'GET/POST /role-permissions',
            'GET/POST /permissions',
            'GET/POST /quality/capa',
            'GET/POST /quality/kpis',
            'GET/POST /quality/incidents',
            'GET/POST /quality/risk-register',
            'GET/POST /quality/patient-satisfaction',
            'GET/POST /feedback',
            'GET/POST /surveys',
            'GET/POST /survey-responses',
            'GET/POST /clinical-incidents',
            'GET/POST /incident-reports',
            'GET/POST /cds/alerts',
            'GET/POST /ai/cds-log',
            'GET/POST /sepsis-bundle',
            'GET/POST /shock-titration',
            'GET/POST /clinical-templates',
            'GET/POST /clinical-smart-templates',
            'GET/POST /form-templates',
            'GET/POST /clinical-knowledge-vectors',
            'GET/POST /diet/orders',
            'GET/POST /diet/meals',
            'GET/POST /nutrition/assessments',
            'GET /password-strength',
            'GET /risk-score',
            'GET /risk-level',
            'GET /kpi-progress',
            'GET /tenant-health',
            'GET /tenant-subdomain-valid',
            'GET /username-valid',
            'GET /plan-price-monthly',
            'GET /plan-discount',
            'GET /capa-overdue',
            'GET /integration-health',
            'GET /cds-response-time',
            'GET /cds-ack-rate',
            'GET /vector-similarity',
            'GET /cms-embedding-distance',
            'GET /sepsis-bundle-compliance',
            'GET /sepsis-time-to-bundle',
            'GET /shock-response-assessment',
            'GET /shock-time-to-response',
            'GET /satisfaction-overall',
            'GET /satisfaction-category',
            'GET /nps',
            'GET /nps-category',
            'GET /nps-detailed',
            'GET /tenant-trial-remaining',
            'GET /capa-completeness',
            'GET /beds-utilization',
            'GET /user-mfa-required',
            'GET /daily-meals-compliance',
            'GET /rca-maturity',
            'GET /user-has-permission',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== TENANTS =====
router.get('/tenants', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, plan_type, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM tenants WHERE 1=1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (plan_type) { sql += ` AND plan_type = $${params.length + 1}`; params.push(plan_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(t => ({
            ...t,
            health: tenantHealth(t),
            trial_remaining_days: tenantTrialRemainingDays(t.trial_ends_at),
            age_days: ageInDays(t.created_at)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/tenants', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { name, subdomain, status, plan_type, archetype, moh_license, cr_no, vat_no, trial_ends_at } = req.body;
        if (!name) return res.status(400).json({ ok: false, error: 'name_required' });
        if (subdomain && !tenantSubdomainValid(subdomain)) return res.status(400).json({ ok: false, error: 'invalid_subdomain' });
        if (status && !VALID_TENANT_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_TENANT_STATUS });
        if (plan_type && !VALID_PLAN_TYPE.includes(plan_type)) return res.status(400).json({ ok: false, error: 'invalid_plan_type', valid: VALID_PLAN_TYPE });
        if (archetype && !VALID_TENANT_ARCHETYPE.includes(archetype)) return res.status(400).json({ ok: false, error: 'invalid_archetype', valid: VALID_TENANT_ARCHETYPE });
        const r = await db.query(
            `INSERT INTO tenants (name, subdomain, status, plan_type, archetype, moh_license, cr_no, vat_no, trial_ends_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [name, subdomain || null, status || 'trial', plan_type || 'trial',
             archetype || null, moh_license || null, cr_no || null, vat_no || null,
             trial_ends_at || null]
        );
        res.status(201).json({ ok: true, tenant: r.rows[0], health: tenantHealth(r.rows[0]) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== FACILITIES =====
router.get('/facilities', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { type, tenant_id_param, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM facilities WHERE 1=1`;
        if (type) { sql += ` AND type = $${params.length + 1}`; params.push(type); }
        if (tenant_id_param) { sql += ` AND tenant_id = $${params.length + 1}`; params.push(parseInt(tenant_id_param)); }
        sql += ` ORDER BY name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/facilities', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { tenant_id, name, tax_number, type, beds, currency, timezone, parent_facility_id } = req.body;
        if (!name) return res.status(400).json({ ok: false, error: 'name_required' });
        if (type && !VALID_FACILITY_TYPE.includes(type)) return res.status(400).json({ ok: false, error: 'invalid_type', valid: VALID_FACILITY_TYPE });
        const r = await db.query(
            `INSERT INTO facilities (tenant_id, name, tax_number, type, beds, currency, timezone, parent_facility_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [tenant_id || null, name, tax_number || null, type || 'general_hospital', beds || 0,
             currency || 'SAR', timezone || 'Asia/Riyadh', parent_facility_id || null]
        );
        res.status(201).json({ ok: true, facility: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BRANCHES =====
router.get('/branches', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { facility_id, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM branches WHERE 1=1`;
        if (facility_id) { sql += ` AND facility_id = $${params.length + 1}`; params.push(parseInt(facility_id)); }
        sql += ` ORDER BY name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/branches', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { facility_id, name, address } = req.body;
        if (!name) return res.status(400).json({ ok: false, error: 'name_required' });
        const r = await db.query(
            `INSERT INTO branches (facility_id, name, address)
             VALUES ($1,$2,$3) RETURNING *`,
            [facility_id || null, name, address || null]
        );
        res.status(201).json({ ok: true, branch: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DEPARTMENTS =====
router.get('/departments', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { branch_id, is_active, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM departments WHERE 1=1`;
        if (branch_id) { sql += ` AND branch_id = $${params.length + 1}`; params.push(parseInt(branch_id)); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        sql += ` ORDER BY name_en LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/departments', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { branch_id, name_ar, name_en, is_active } = req.body;
        if (!name_en) return res.status(400).json({ ok: false, error: 'name_en_required' });
        const r = await db.query(
            `INSERT INTO departments (branch_id, name_ar, name_en, is_active)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [branch_id || null, name_ar || null, name_en, is_active !== false]
        );
        res.status(201).json({ ok: true, department: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CLINICAL DEPARTMENTS =====
router.get('/clinical-departments', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { code, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM clinical_departments WHERE 1=1`;
        if (code) { sql += ` AND code = $${params.length + 1}`; params.push(code); }
        sql += ` ORDER BY name_en LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/clinical-departments', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { code, name_ar, name_en, owner_role } = req.body;
        if (!code) return res.status(400).json({ ok: false, error: 'code_required' });
        const r = await db.query(
            `INSERT INTO clinical_departments (tenant_id, code, name_ar, name_en, owner_role)
             VALUES (1,$1,$2,$3,$4) RETURNING *`,
            [code, name_ar || null, name_en || null, owner_role || null]
        );
        res.status(201).json({ ok: true, clinical_dept: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== FACILITY MODULES =====
router.get('/facility-modules', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { enabled, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM facility_modules WHERE 1=1`;
        if (enabled !== undefined) { sql += ` AND enabled = $${params.length + 1}`; params.push(enabled === 'true'); }
        sql += ` ORDER BY module_index LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/facility-modules', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { tenant_id, module_index, enabled } = req.body;
        if (module_index === undefined) return res.status(400).json({ ok: false, error: 'module_index_required' });
        const r = await db.query(
            `INSERT INTO facility_modules (tenant_id, module_index, enabled)
             VALUES ($1,$2,$3) RETURNING *`,
            [tenant_id || null, module_index, enabled ? true : false]
        );
        res.status(201).json({ ok: true, module: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PLANS =====
router.get('/plans', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { active, limit = 50 } = req.query;
        const params = [];
        let sql = `SELECT * FROM plans WHERE 1=1`;
        if (active !== undefined) { sql += ` AND active = $${params.length + 1}`; params.push(active === 'true'); }
        sql += ` ORDER BY sort_order LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(p => ({ ...p,
            monthly_equiv: planPriceMonthly(p.monthly_price, p.yearly_price),
            yearly_discount_pct: planDiscount(p.monthly_price, p.yearly_price)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/plans', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { plan_key, name_ar, name_en, description_ar, description_en, currency, monthly_price, yearly_price, trial_days, active, sort_order } = req.body;
        if (!plan_key) return res.status(400).json({ ok: false, error: 'plan_key_required' });
        const r = await db.query(
            `INSERT INTO plans (plan_key, name_ar, name_en, description_ar, description_en, currency, monthly_price, yearly_price, trial_days, active, sort_order)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [plan_key, name_ar || null, name_en || null, description_ar || null, description_en || null,
             currency || 'SAR', parseFloat(monthly_price || 0), parseFloat(yearly_price || 0),
             trial_days || 14, active !== false, sort_order || 0]
        );
        res.status(201).json({ ok: true, plan: r.rows[0], monthly_equiv: planPriceMonthly(monthly_price, yearly_price) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PLAN ENTITLEMENTS =====
router.get('/plan-entitlements', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { plan_id, support_level, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM plan_entitlements WHERE 1=1`;
        if (plan_id) { sql += ` AND plan_id = $${params.length + 1}`; params.push(parseInt(plan_id)); }
        if (support_level) { sql += ` AND support_level = $${params.length + 1}`; params.push(support_level); }
        sql += ` ORDER BY plan_id LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/plan-entitlements', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { plan_id, max_users, max_branches, max_invoices_per_month, modules_enabled, support_level, api_access, custom_domain } = req.body;
        if (!plan_id) return res.status(400).json({ ok: false, error: 'plan_id_required' });
        const r = await db.query(
            `INSERT INTO plan_entitlements (plan_id, max_users, max_branches, max_invoices_per_month, modules_enabled, support_level, api_access, custom_domain)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [parseInt(plan_id), max_users || 0, max_branches || 0, max_invoices_per_month || 0,
             modules_enabled || null, support_level || 'standard', api_access ? true : false, custom_domain ? true : false]
        );
        res.status(201).json({ ok: true, entitlement: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TENANT PLAN ASSIGNMENTS =====
router.get('/tenant-plan-assignments', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { tenant_id, plan_key, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM tenant_plan_assignments WHERE 1=1`;
        if (tenant_id) { sql += ` AND tenant_id = $${params.length + 1}`; params.push(parseInt(tenant_id)); }
        if (plan_key) { sql += ` AND plan_key = $${params.length + 1}`; params.push(plan_key); }
        sql += ` ORDER BY assigned_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/tenant-plan-assignments', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { tenant_id, plan_key, assignment_source, effective_from, effective_to } = req.body;
        if (!tenant_id || !plan_key) return res.status(400).json({ ok: false, error: 'tenant_id_and_plan_key_required' });
        const r = await db.query(
            `INSERT INTO tenant_plan_assignments (tenant_id, plan_key, assignment_source, assigned_by, effective_from, effective_to)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [parseInt(tenant_id), plan_key, assignment_source || 'manual',
             req.user?.id ? parseInt(req.user.id) : null, effective_from || new Date().toISOString(), effective_to || null]
        );
        res.status(201).json({ ok: true, assignment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TENANT SETTINGS =====
router.get('/tenant-settings', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { limit = 200 } = req.query;
        const params = [req.tenantId];
        const r = await db.query(`SELECT * FROM tenant_settings WHERE tenant_id = $1 ORDER BY setting_key LIMIT $2`, [req.tenantId, parseInt(limit)]);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/tenant-settings', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { tenant_id, setting_key, setting_value } = req.body;
        if (!setting_key) return res.status(400).json({ ok: false, error: 'setting_key_required' });
        const r = await db.query(
            `INSERT INTO tenant_settings (tenant_id, setting_key, setting_value)
             VALUES ($1,$2,$3) RETURNING *`,
            [tenant_id || req.tenantId, setting_key, setting_value || null]
        );
        res.status(201).json({ ok: true, setting: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== COMPANY SETTINGS =====
router.get('/company-settings', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM company_settings WHERE tenant_id = $1 ORDER BY setting_key`, [req.tenantId]);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/company-settings', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { setting_key, setting_value } = req.body;
        if (!setting_key) return res.status(400).json({ ok: false, error: 'setting_key_required' });
        const r = await db.query(
            `INSERT INTO company_settings (setting_key, setting_value, tenant_id)
             VALUES ($1,$2,$3) RETURNING *`,
            [setting_key, setting_value || null, req.tenantId]
        );
        res.status(201).json({ ok: true, setting: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== INTEGRATION SETTINGS =====
router.get('/integration-settings', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, integration_name, provider, endpoint_url, is_enabled, last_sync, tenant_id, created_at FROM integration_settings WHERE tenant_id = $1 ORDER BY integration_name`, [req.tenantId]);
        const enriched = r.rows.map(i => ({ ...i, health: integrationHealth(i.last_sync) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/integration-settings', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { integration_name, provider, api_key, api_secret, endpoint_url, is_enabled, config_json, last_sync } = req.body;
        if (!integration_name) return res.status(400).json({ ok: false, error: 'integration_name_required' });
        if (integration_name && !VALID_INTEGRATION.includes(integration_name)) return res.status(400).json({ ok: false, error: 'invalid_integration_name', valid: VALID_INTEGRATION });
        const r = await db.query(
            `INSERT INTO integration_settings (integration_name, provider, api_key, api_secret, endpoint_url, is_enabled, config_json, last_sync, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, integration_name, provider, endpoint_url, is_enabled, last_sync, tenant_id, created_at`,
            [integration_name, provider || null, api_key || null, api_secret || null, endpoint_url || null,
             is_enabled ? 1 : 0, config_json || null, last_sync || null, req.tenantId]
        );
        res.status(201).json({ ok: true, integration: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== EMPLOYEES =====
router.get('/employees', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, role, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM employees WHERE 1=1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (role) { sql += ` AND role = $${params.length + 1}`; params.push(role); }
        sql += ` ORDER BY name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/employees', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { name, name_ar, name_en, role, department_ar, department_en, status, salary, commission_type, commission_value } = req.body;
        if (!name) return res.status(400).json({ ok: false, error: 'name_required' });
        const r = await db.query(
            `INSERT INTO employees (name, name_ar, name_en, role, department_ar, department_en, status, salary, commission_type, commission_value)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [name, name_ar || null, name_en || null, role || null, department_ar || null, department_en || null,
             status || 'active', parseFloat(salary || 0), commission_type || null, parseFloat(commission_value || 0)]
        );
        res.status(201).json({ ok: true, employee: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SYSTEM USERS =====
router.get('/system-users', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { role, is_active, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT id, username, display_name, role, speciality, is_active, commission_type, commission_value, created_at, last_ip, failed_login_attempts, lockout_until FROM system_users WHERE 1=1`;
        if (role) { sql += ` AND role = $${params.length + 1}`; params.push(role); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY username LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/system-users', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { username, password_hash, display_name, role, speciality, permissions, commission_type, commission_value, is_active } = req.body;
        if (!username) return res.status(400).json({ ok: false, error: 'username_required' });
        if (!password_hash) return res.status(400).json({ ok: false, error: 'password_hash_required' });
        if (!usernameValid(username)) return res.status(400).json({ ok: false, error: 'invalid_username' });
        const r = await db.query(
            `INSERT INTO system_users (username, password_hash, display_name, role, speciality, permissions, commission_type, commission_value, is_active)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, username, display_name, role, is_active, created_at`,
            [username, password_hash, display_name || null, role || null, speciality || null,
             typeof permissions === 'object' ? JSON.stringify(permissions) : (permissions || null),
             commission_type || null, parseFloat(commission_value || 0),
             is_active === undefined ? 1 : (is_active ? 1 : 0)]
        );
        res.status(201).json({ ok: true, user: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== USER TENANTS =====
router.get('/user-tenants', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { user_id, tenant_id, is_active, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM user_tenants WHERE 1=1`;
        if (user_id) { sql += ` AND user_id = $${params.length + 1}`; params.push(parseInt(user_id)); }
        if (tenant_id) { sql += ` AND tenant_id = $${params.length + 1}`; params.push(parseInt(tenant_id)); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        sql += ` ORDER BY user_id LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/user-tenants', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { user_id, tenant_id, is_active } = req.body;
        if (!user_id || !tenant_id) return res.status(400).json({ ok: false, error: 'user_id_and_tenant_id_required' });
        const r = await db.query(
            `INSERT INTO user_tenants (user_id, tenant_id, is_active)
             VALUES ($1,$2,$3) RETURNING *`,
            [parseInt(user_id), parseInt(tenant_id), is_active !== false]
        );
        res.status(201).json({ ok: true, link: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== USER FACILITIES =====
router.get('/user-facilities', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { user_id, facility_id, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM user_facilities WHERE 1=1`;
        if (user_id) { sql += ` AND user_id = $${params.length + 1}`; params.push(parseInt(user_id)); }
        if (facility_id) { sql += ` AND facility_id = $${params.length + 1}`; params.push(parseInt(facility_id)); }
        sql += ` ORDER BY user_id LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/user-facilities', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { user_id, facility_id, branch_id, is_primary } = req.body;
        if (!user_id || !facility_id) return res.status(400).json({ ok: false, error: 'user_id_and_facility_id_required' });
        const r = await db.query(
            `INSERT INTO user_facilities (user_id, facility_id, branch_id, is_primary)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [parseInt(user_id), parseInt(facility_id), branch_id || null, is_primary ? true : false]
        );
        res.status(201).json({ ok: true, link: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== USER PERMISSIONS =====
router.get('/user-permissions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { user_id, module_name, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM user_permissions WHERE 1=1`;
        if (user_id) { sql += ` AND user_id = $${params.length + 1}`; params.push(parseInt(user_id)); }
        if (module_name) { sql += ` AND module_name = $${params.length + 1}`; params.push(module_name); }
        sql += ` ORDER BY user_id, module_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/user-permissions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { user_id, module_name, can_view, can_add, can_edit, can_delete, can_print } = req.body;
        if (!user_id || !module_name) return res.status(400).json({ ok: false, error: 'user_id_and_module_name_required' });
        const r = await db.query(
            `INSERT INTO user_permissions (user_id, module_name, can_view, can_add, can_edit, can_delete, can_print)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [parseInt(user_id), module_name, can_view ? 1 : 0, can_add ? 1 : 0, can_edit ? 1 : 0,
             can_delete ? 1 : 0, can_print ? 1 : 0]
        );
        res.status(201).json({ ok: true, permission: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== ROLE PERMISSIONS =====
router.get('/role-permissions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { role, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM role_permissions WHERE 1=1`;
        if (role) { sql += ` AND role = $${params.length + 1}`; params.push(role); }
        sql += ` ORDER BY role, permission_key LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/role-permissions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { tenant_id, role, permission_key } = req.body;
        if (!role || !permission_key) return res.status(400).json({ ok: false, error: 'role_and_permission_key_required' });
        const r = await db.query(
            `INSERT INTO role_permissions (tenant_id, role, permission_key)
             VALUES ($1,$2,$3) RETURNING *`,
            [tenant_id || null, role, permission_key]
        );
        res.status(201).json({ ok: true, role_permission: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== PERMISSIONS CATALOG =====
router.get('/permissions', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM permissions ORDER BY key`);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/permissions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { key, description } = req.body;
        if (!key) return res.status(400).json({ ok: false, error: 'key_required' });
        const r = await db.query(
            `INSERT INTO permissions (key, description)
             VALUES ($1,$2) RETURNING *`,
            [key, description || null]
        );
        res.status(201).json({ ok: true, permission: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== QUALITY: CAPA =====
router.get('/quality/capa', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, capa_type, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM quality_capa WHERE tenant_id = $1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (capa_type) { sql += ` AND capa_type = $${params.length + 1}`; params.push(capa_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({ ...c, overdue: capaOverdue(c.due_date, c.status) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/quality/capa', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { facility_id, incident_id, capa_type, title, description, root_cause, owner_user_id, owner_name, due_date, status } = req.body;
        if (!title) return res.status(400).json({ ok: false, error: 'title_required' });
        if (capa_type && !VALID_CAPA_TYPE.includes(capa_type)) return res.status(400).json({ ok: false, error: 'invalid_capa_type', valid: VALID_CAPA_TYPE });
        if (status && !VALID_CAPA_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_CAPA_STATUS });
        const r = await db.query(
            `INSERT INTO quality_capa (tenant_id, facility_id, incident_id, capa_type, title, description, root_cause, owner_user_id, owner_name, due_date, status, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [req.tenantId, facility_id || null, incident_id || null, capa_type || 'corrective',
             title, description || null, root_cause || null, owner_user_id || null, owner_name || null,
             due_date || null, status || 'open', req.user?.username || null]
        );
        res.status(201).json({ ok: true, capa: r.rows[0], overdue: capaOverdue(due_date, status) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== QUALITY: KPIS =====
router.get('/quality/kpis', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { category, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM quality_kpis WHERE tenant_id = $1`;
        if (category) { sql += ` AND category = $${params.length + 1}`; params.push(category); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(k => ({ ...k, progress_pct: kpiProgress(k.actual_value, k.target_value) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/quality/kpis', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { kpi_name, kpi_name_ar, category, target_value, actual_value, unit, period, department, status, notes } = req.body;
        if (!kpi_name) return res.status(400).json({ ok: false, error: 'kpi_name_required' });
        if (status && !VALID_KPI_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_KPI_STATUS });
        const r = await db.query(
            `INSERT INTO quality_kpis (kpi_name, kpi_name_ar, category, target_value, actual_value, unit, period, department, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [kpi_name, kpi_name_ar || null, category || null, parseFloat(target_value || 0), parseFloat(actual_value || 0),
             unit || null, period || null, department || null, status || 'on_track', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, kpi: r.rows[0], progress_pct: kpiProgress(actual_value, target_value) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== QUALITY: INCIDENTS =====
router.get('/quality/incidents', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, severity, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM quality_incidents WHERE tenant_id = $1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(i => ({ ...i, completeness_pct: rcaCompletenessPercent(i) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/quality/incidents', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { incident_type, severity, incident_date, incident_time, department, location, patient_id, patient_name, description, immediate_action, reported_by, assigned_to, root_cause, corrective_action, preventive_action, status, harm_level, near_miss, confidential, encounter_id, visit_id, workflow_state } = req.body;
        if (!incident_type) return res.status(400).json({ ok: false, error: 'incident_type_required' });
        if (severity && !VALID_INCIDENT_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity', valid: VALID_INCIDENT_SEVERITY });
        if (status && !VALID_INCIDENT_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_INCIDENT_STATUS });
        const r = await db.query(
            `INSERT INTO quality_incidents (incident_type, severity, incident_date, incident_time, department, location, patient_id, patient_name, description, immediate_action, reported_by, assigned_to, root_cause, corrective_action, preventive_action, status, tenant_id, harm_level, near_miss, confidential, encounter_id, visit_id, workflow_state)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23) RETURNING *`,
            [incident_type, severity || 'low', incident_date || null, incident_time || null,
             department || null, location || null, patient_id || null, patient_name || null,
             description || null, immediate_action || null, reported_by || null, assigned_to || null,
             root_cause || null, corrective_action || null, preventive_action || null,
             status || 'reported', req.tenantId, harm_level || null,
             near_miss ? 1 : 0, confidential ? 1 : 0, encounter_id || null, visit_id || null, workflow_state || null]
        );
        res.status(201).json({ ok: true, incident: r.rows[0], completeness_pct: rcaCompletenessPercent(r.rows[0]) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== QUALITY: RISK REGISTER =====
router.get('/quality/risk-register', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { category, risk_level, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM quality_risk_register WHERE tenant_id = $1`;
        if (category) { sql += ` AND category = $${params.length + 1}`; params.push(category); }
        if (risk_level) { sql += ` AND risk_level = $${params.length + 1}`; params.push(risk_level); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY risk_score DESC NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/quality/risk-register', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { facility_id, incident_id, risk_title, category, likelihood, impact, control_measure, residual_likelihood, residual_impact, owner_name, review_date, status } = req.body;
        if (!risk_title) return res.status(400).json({ ok: false, error: 'risk_title_required' });
        const risk_score = riskScore(likelihood, impact);
        const computed_risk = riskLevelFromScore(risk_score);
        const residual_score = riskScore(residual_likelihood, residual_impact);
        const r = await db.query(
            `INSERT INTO quality_risk_register (tenant_id, facility_id, incident_id, risk_title, category, likelihood, impact, risk_score, risk_level, control_measure, residual_likelihood, residual_impact, residual_score, owner_name, review_date, status, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
            [req.tenantId, facility_id || null, incident_id || null, risk_title, category || null,
             likelihood || 1, impact || 1, risk_score, computed_risk, control_measure || null,
             residual_likelihood || 1, residual_impact || 1, residual_score,
             owner_name || null, review_date || null, status || 'open', req.user?.username || null]
        );
        res.status(201).json({ ok: true, risk: r.rows[0], risk_level_computed: computed_risk, risk_score_computed: risk_score });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== QUALITY: PATIENT SATISFACTION =====
router.get('/quality/patient-satisfaction', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { department, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM quality_patient_satisfaction WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        sql += ` ORDER BY survey_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(s => ({
            ...s,
            overall_avg: satisfactionOverall(s.cleanliness, s.staff_courtesy, s.wait_time, s.communication, s.pain_management, s.food_quality),
            category: satisfactionCategory(s.overall_rating)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/quality/patient-satisfaction', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id, patient_name, department, survey_date, overall_rating, cleanliness, staff_courtesy, wait_time, communication, pain_management, food_quality, comments, would_recommend } = req.body;
        const r = await db.query(
            `INSERT INTO quality_patient_satisfaction (patient_id, patient_name, department, survey_date, overall_rating, cleanliness, staff_courtesy, wait_time, communication, pain_management, food_quality, comments, would_recommend, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
            [patient_id || null, patient_name || null, department || null, survey_date || null,
             overall_rating || null, cleanliness || null, staff_courtesy || null, wait_time || null,
             communication || null, pain_management || null, food_quality || null,
             comments || null, would_recommend || null, req.tenantId]
        );
        res.status(201).json({ ok: true, satisfaction: r.rows[0],
            overall_avg: satisfactionOverall(cleanliness, staff_courtesy, wait_time, communication, pain_management, food_quality),
            category: satisfactionCategory(overall_rating) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== FEEDBACK =====
router.get('/feedback', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { feedback_type, is_resolved, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM patient_feedback WHERE tenant_id = $1`;
        if (feedback_type) { sql += ` AND feedback_type = $${params.length + 1}`; params.push(feedback_type); }
        if (is_resolved !== undefined) { sql += ` AND is_resolved = $${params.length + 1}`; params.push(is_resolved === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/feedback', async (req, res) => {
    try {
        const { patient_id, encounter_id, department, feedback_type, rating, comment, comment_ar } = req.body;
        if (!feedback_type) return res.status(400).json({ ok: false, error: 'feedback_type_required' });
        if (feedback_type && !VALID_FEEDBACK_TYPE.includes(feedback_type)) return res.status(400).json({ ok: false, error: 'invalid_feedback_type', valid: VALID_FEEDBACK_TYPE });
        const r = await db.query(
            `INSERT INTO patient_feedback (tenant_id, patient_id, encounter_id, department, feedback_type, rating, comment, comment_ar)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [req.tenantId || 1, patient_id || null, encounter_id || null, department || null,
             feedback_type, rating || null, comment || null, comment_ar || null]
        );
        res.status(201).json({ ok: true, feedback: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SURVEYS =====
router.get('/surveys', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { survey_type, is_active, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM patient_surveys WHERE tenant_id = $1`;
        if (survey_type) { sql += ` AND survey_type = $${params.length + 1}`; params.push(survey_type); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/surveys', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { survey_code, title, title_ar, description, description_ar, survey_type, questions_json, is_active, start_date, end_date } = req.body;
        if (!title) return res.status(400).json({ ok: false, error: 'title_required' });
        if (survey_type && !VALID_SURVEY_TYPE.includes(survey_type)) return res.status(400).json({ ok: false, error: 'invalid_survey_type', valid: VALID_SURVEY_TYPE });
        const r = await db.query(
            `INSERT INTO patient_surveys (tenant_id, survey_code, title, title_ar, description, description_ar, survey_type, questions_json, is_active, start_date, end_date)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [req.tenantId, survey_code || null, title, title_ar || null, description || null, description_ar || null,
             survey_type || 'CSAT', questions_json || null, is_active !== false, start_date || null, end_date || null]
        );
        res.status(201).json({ ok: true, survey: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SURVEY RESPONSES =====
router.get('/survey-responses', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { survey_id, patient_id, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM survey_responses WHERE tenant_id = $1 AND submitted_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (survey_id) { sql += ` AND survey_id = $${params.length + 1}`; params.push(parseInt(survey_id)); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY submitted_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(s => ({ ...s, nps_category: npsCategory(s.nps_score) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/survey-responses', async (req, res) => {
    try {
        const { survey_id, patient_id, overall_score, nps_score, answers_json, comments } = req.body;
        if (!survey_id) return res.status(400).json({ ok: false, error: 'survey_id_required' });
        const r = await db.query(
            `INSERT INTO survey_responses (tenant_id, survey_id, patient_id, overall_score, nps_score, answers_json, comments)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [req.tenantId || 1, parseInt(survey_id), patient_id || null,
             overall_score || null, nps_score || null, answers_json || null, comments || null]
        );
        res.status(201).json({ ok: true, response: r.rows[0], nps_category: npsCategory(nps_score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CLINICAL INCIDENTS =====
router.get('/clinical-incidents', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { department, severity, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM clinical_incidents WHERE tenant_id = $1`;
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY incident_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/clinical-incidents', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { reporter_name, incident_date, department, severity, description, action_taken, status } = req.body;
        if (!incident_date) return res.status(400).json({ ok: false, error: 'incident_date_required' });
        if (severity && !VALID_INCIDENT_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity', valid: VALID_INCIDENT_SEVERITY });
        const r = await db.query(
            `INSERT INTO clinical_incidents (tenant_id, reporter_name, incident_date, department, severity, description, action_taken, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [req.tenantId, reporter_name || null, incident_date, department || null,
             severity || 'low', description || null, action_taken || null, status || 'reported']
        );
        res.status(201).json({ ok: true, incident: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== INCIDENT REPORTS (Safety/SAC) =====
router.get('/incident-reports', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { incident_type, sac_classification, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM incident_reports WHERE tenant_id = $1`;
        if (incident_type) { sql += ` AND incident_type = $${params.length + 1}`; params.push(incident_type); }
        if (sac_classification) { sql += ` AND sac_classification = $${params.length + 1}`; params.push(sac_classification); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY incident_datetime DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/incident-reports', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { facility_id, incident_type, sac_classification, incident_datetime, location, description, immediate_actions, is_anonymous, reporter_name, status, rca_status, rca_notes } = req.body;
        if (!incident_type) return res.status(400).json({ ok: false, error: 'incident_type_required' });
        if (sac_classification && !VALID_SAC.includes(sac_classification)) return res.status(400).json({ ok: false, error: 'invalid_sac', valid: VALID_SAC });
        const r = await db.query(
            `INSERT INTO incident_reports (tenant_id, facility_id, incident_type, sac_classification, incident_datetime, location, description, immediate_actions, is_anonymous, reporter_name, status, rca_status, rca_notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [req.tenantId, facility_id || null, incident_type, sac_classification || null,
             incident_datetime || null, location || null, description || null, immediate_actions || null,
             is_anonymous ? true : false, reporter_name || null, status || 'reported',
             rca_status || null, rca_notes || null]
        );
        res.status(201).json({ ok: true, report: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CDS ALERTS =====
router.get('/cds/alerts', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, alert_type, severity, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cds_alerts WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (alert_type) { sql += ` AND alert_type = $${params.length + 1}`; params.push(alert_type); }
        if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({ ...a, response_time_min: cdsResponseTime(a.created_at, a.acknowledged_at) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cds/alerts', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, alert_type, severity, title, message, details, triggered_by, triggered_data, status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (severity && !VALID_CDS_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity', valid: VALID_CDS_SEVERITY });
        if (status && !VALID_CDS_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_CDS_STATUS });
        const r = await db.query(
            `INSERT INTO cds_alerts (tenant_id, patient_id, alert_type, severity, title, message, details, triggered_by, triggered_data, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, parseInt(patient_id), alert_type || null, severity || 'info',
             title || null, message || null, typeof details === 'object' ? JSON.stringify(details) : (details || null),
             triggered_by || null, typeof triggered_data === 'object' ? JSON.stringify(triggered_data) : (triggered_data || null),
             status || 'active']
        );
        res.status(201).json({ ok: true, alert: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== AI CDS LOG =====
router.get('/ai/cds-log', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, context_type, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM ai_cds_log WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (context_type) { sql += ` AND context_type = $${params.length + 1}`; params.push(context_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/ai/cds-log', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, user_id, user_name, context_type, input_data, ai_model, ai_response, recommendations, accepted_by_clinician, override_reason, processing_time_ms, tokens_used } = req.body;
        if (!user_id) return res.status(400).json({ ok: false, error: 'user_id_required' });
        const r = await db.query(
            `INSERT INTO ai_cds_log (patient_id, user_id, user_name, context_type, input_data, ai_model, ai_response, recommendations, accepted_by_clinician, override_reason, processing_time_ms, tokens_used, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [patient_id || null, parseInt(user_id), user_name || null, context_type || null,
             typeof input_data === 'object' ? JSON.stringify(input_data) : (input_data || null),
             ai_model || null, typeof ai_response === 'object' ? JSON.stringify(ai_response) : (ai_response || null),
             recommendations || null, accepted_by_clinician ? true : false, override_reason || null,
             processing_time_ms || null, tokens_used || null, req.tenantId]
        );
        res.status(201).json({ ok: true, log: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SEPSIS BUNDLE =====
router.get('/sepsis-bundle', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, days = 30, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM sepsis_bundle_tracking WHERE tenant_id::text = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        sql += ` ORDER BY bundle_start_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(b => ({ ...b, compliance: sepsisBundleCompliance(b), elapsed_min: sepsisTimeToBundle(b.bundle_start_time) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/sepsis-bundle', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, bundle_start_time, lactate_initial, lactate_followup, antibiotics_administered, fluid_resuscitation_ml, bundle_compliance_status } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO sepsis_bundle_tracking (tenant_id, patient_id, bundle_start_time, lactate_initial, lactate_followup, antibiotics_administered, fluid_resuscitation_ml, bundle_compliance_status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [String(req.tenantId), String(patient_id), bundle_start_time || new Date().toISOString(),
             lactate_initial !== undefined ? lactate_initial : null,
             lactate_followup !== undefined ? lactate_followup : null,
             antibiotics_administered ? true : false,
             fluid_resuscitation_ml || null,
             bundle_compliance_status || null]
        );
        res.status(201).json({ ok: true, bundle: r.rows[0], compliance: sepsisBundleCompliance(r.rows[0]) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== SHOCK TITRATION =====
router.get('/shock-titration', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, drug_name, days = 7, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM shock_titration_logs WHERE tenant_id::text = $1 AND log_time >= NOW() - INTERVAL '${parseInt(days)} days'`;
        params.push(String(req.tenantId));
        if (patient_id) { sql += ` AND patient_id::text = $${params.length + 1}`; params.push(String(patient_id)); }
        if (drug_name) { sql += ` AND drug_name = $${params.length + 1}`; params.push(drug_name); }
        sql += ` ORDER BY log_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(s => ({ ...s, response_assessment: shockResponseAssessment(s.response_map_value, 65), elapsed_min: shockTimeToResponse(s.log_time) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/shock-titration', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, log_time, drug_name, dose_mcg_kg_min, response_map_value, titration_action } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO shock_titration_logs (tenant_id, patient_id, log_time, drug_name, dose_mcg_kg_min, response_map_value, titration_action)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [String(req.tenantId), String(patient_id), log_time || new Date().toISOString(),
             drug_name || null, dose_mcg_kg_min !== undefined ? dose_mcg_kg_min : null,
             response_map_value !== undefined ? response_map_value : null,
             titration_action || null]
        );
        res.status(201).json({ ok: true, log: r.rows[0], response_assessment: shockResponseAssessment(response_map_value, 65) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CLINICAL TEMPLATES =====
router.get('/clinical-templates', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { department_id, is_active, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM clinical_templates WHERE 1=1`;
        if (department_id) { sql += ` AND department_id = $${params.length + 1}`; params.push(parseInt(department_id)); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY template_name_en LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/clinical-templates', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { department_id, version, form_structure, is_active, template_name_en, template_name_ar } = req.body;
        if (!template_name_en) return res.status(400).json({ ok: false, error: 'template_name_required' });
        const r = await db.query(
            `INSERT INTO clinical_templates (department_id, version, form_structure, is_active, tenant_id, template_name_en, template_name_ar)
             VALUES ($1,$2,$3,$4,1,$5,$6) RETURNING *`,
            [department_id || null, version || '1.0',
             typeof form_structure === 'object' ? JSON.stringify(form_structure) : (form_structure || null),
             is_active === undefined ? 1 : (is_active ? 1 : 0),
             template_name_en, template_name_ar || null]
        );
        res.status(201).json({ ok: true, template: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CLINICAL SMART TEMPLATES =====
router.get('/clinical-smart-templates', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { doctor_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM clinical_smart_templates WHERE tenant_id = $1`;
        if (doctor_id) { sql += ` AND doctor_id = $${params.length + 1}`; params.push(parseInt(doctor_id)); }
        sql += ` ORDER BY shortcut LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/clinical-smart-templates', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { doctor_id, shortcut, template_text } = req.body;
        if (!shortcut) return res.status(400).json({ ok: false, error: 'shortcut_required' });
        const r = await db.query(
            `INSERT INTO clinical_smart_templates (tenant_id, doctor_id, shortcut, template_text)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [req.tenantId, doctor_id || null, shortcut, template_text || null]
        );
        res.status(201).json({ ok: true, template: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== FORM TEMPLATES =====
router.get('/form-templates', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { department, is_active, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM form_templates WHERE 1=1`;
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY template_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/form-templates', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { template_name, department, form_fields, is_active } = req.body;
        if (!template_name) return res.status(400).json({ ok: false, error: 'template_name_required' });
        const r = await db.query(
            `INSERT INTO form_templates (template_name, department, form_fields, is_active, created_by)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [template_name, department || null, form_fields || null,
             is_active === undefined ? 1 : (is_active ? 1 : 0), req.user?.username || null]
        );
        res.status(201).json({ ok: true, template: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CLINICAL KNOWLEDGE VECTORS =====
router.get('/clinical-knowledge-vectors', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { department_id, tenant_id, limit = 50 } = req.query;
        const params = [];
        let sql = `SELECT id, department_id, content_chunk, metadata, created_at, tenant_id FROM clinical_knowledge_vectors WHERE 1=1`;
        if (department_id) { sql += ` AND department_id = $${params.length + 1}`; params.push(parseInt(department_id)); }
        if (tenant_id) { sql += ` AND tenant_id = $${params.length + 1}`; params.push(parseInt(tenant_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/clinical-knowledge-vectors', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { department_id, content_chunk, embedding, metadata, tenant_id } = req.body;
        if (!content_chunk) return res.status(400).json({ ok: false, error: 'content_chunk_required' });
        const r = await db.query(
            `INSERT INTO clinical_knowledge_vectors (department_id, content_chunk, embedding, metadata, tenant_id)
             VALUES ($1,$2,$3,$4,$5) RETURNING id, department_id, content_chunk, metadata, created_at, tenant_id`,
            [department_id || null, content_chunk,
             Array.isArray(embedding) ? embedding : null,
             typeof metadata === 'object' ? JSON.stringify(metadata) : (metadata || null),
             tenant_id || null]
        );
        res.status(201).json({ ok: true, vector: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DIET: ORDERS =====
router.get('/diet/orders', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, status, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM diet_orders WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/diet/orders', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { admission_id, patient_id, patient_name, diet_type, diet_type_ar, texture, fluid, allergies, restrictions, supplements, ordered_by, meal_preferences, start_date, end_date, status, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (diet_type && !VALID_DIET_TYPE.includes(diet_type)) return res.status(400).json({ ok: false, error: 'invalid_diet_type', valid: VALID_DIET_TYPE });
        if (texture && !VALID_TEXTURE.includes(texture)) return res.status(400).json({ ok: false, error: 'invalid_texture', valid: VALID_TEXTURE });
        const r = await db.query(
            `INSERT INTO diet_orders (admission_id, patient_id, patient_name, diet_type, diet_type_ar, texture, fluid, allergies, restrictions, supplements, ordered_by, meal_preferences, start_date, end_date, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
            [admission_id || null, parseInt(patient_id), patient_name || null, diet_type || null, diet_type_ar || null,
             texture || null, fluid || null, allergies || null, restrictions || null, supplements || null,
             ordered_by || null, meal_preferences || null, start_date || null, end_date || null,
             status || 'active', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, diet_order: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DIET: MEALS =====
router.get('/diet/meals', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { patient_id, meal_type, order_id, days = 7, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM diet_meals WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (meal_type) { sql += ` AND meal_type = $${params.length + 1}`; params.push(meal_type); }
        if (order_id) { sql += ` AND order_id = $${params.length + 1}`; params.push(parseInt(order_id)); }
        sql += ` ORDER BY meal_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(m => ({ ...m, intake_category: dailyMealsCompliance(m.consumed_percentage) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/diet/meals', requireAuth, requireTenantScope, requireRole('nurse'), async (req, res) => {
    try {
        const { order_id, patient_id, meal_type, meal_date, items, calories, delivered, delivered_by, consumed_percentage, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (meal_type && !VALID_MEAL_TYPE.includes(meal_type)) return res.status(400).json({ ok: false, error: 'invalid_meal_type', valid: VALID_MEAL_TYPE });
        const r = await db.query(
            `INSERT INTO diet_meals (order_id, patient_id, meal_type, meal_date, items, calories, delivered, delivered_by, consumed_percentage, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [order_id || null, parseInt(patient_id), meal_type || 'lunch', meal_date || null,
             items || null, calories || 0, delivered ? 1 : 0, delivered_by || null,
             consumed_percentage || 0, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, meal: r.rows[0], intake_category: dailyMealsCompliance(consumed_percentage) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== NUTRITION ASSESSMENTS =====
router.get('/nutrition/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, malnutrition_risk, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM nutrition_assessments WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (malnutrition_risk) { sql += ` AND malnutrition_risk = $${params.length + 1}`; params.push(malnutrition_risk); }
        sql += ` ORDER BY assessment_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/nutrition/assessments', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, assessment_date, height_cm, weight_kg, bmi, bmi_category, ideal_body_weight, caloric_needs, protein_needs, screening_score, malnutrition_risk, plan, assessed_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO nutrition_assessments (patient_id, patient_name, assessment_date, height_cm, weight_kg, bmi, bmi_category, ideal_body_weight, caloric_needs, protein_needs, screening_score, malnutrition_risk, plan, assessed_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
            [parseInt(patient_id), patient_name || null, assessment_date || null,
             parseFloat(height_cm || 0), parseFloat(weight_kg || 0), parseFloat(bmi || 0),
             bmi_category || null, parseFloat(ideal_body_weight || 0),
             caloric_needs || null, parseFloat(protein_needs || 0),
             screening_score || null, malnutrition_risk || null, plan || null, assessed_by || null, req.tenantId]
        );
        res.status(201).json({ ok: true, nutrition: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/password-strength', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { password } = req.query;
        if (!password) return res.status(400).json({ ok: false, error: 'password_required' });
        res.json({ ok: true, strength: passwordStrength(password) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/risk-score', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { likelihood, impact } = req.query;
        if (likelihood === undefined || impact === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, score: riskScore(likelihood, impact), level: riskLevelFromScore(riskScore(likelihood, impact)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/risk-level', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, level: riskLevelFromScore(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/kpi-progress', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { actual, target } = req.query;
        if (actual === undefined || target === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, progress_pct: kpiProgress(actual, target) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/tenant-health', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
    try {
        const { tenant } = req.query;
        if (!tenant) return res.status(400).json({ ok: false, error: 'tenant_required' });
        let parsed = tenant;
        if (typeof tenant === 'string') {
            try { parsed = JSON.parse(tenant); } catch (e) {}
        }
        res.json({ ok: true, health: tenantHealth(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/tenant-subdomain-valid', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { subdomain } = req.query;
        res.json({ ok: true, valid: tenantSubdomainValid(subdomain) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/username-valid', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { username } = req.query;
        res.json({ ok: true, valid: usernameValid(username) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/plan-price-monthly', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { monthly, yearly } = req.query;
        res.json({ ok: true, monthly_equiv: planPriceMonthly(monthly, yearly) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/plan-discount', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { monthly, yearly } = req.query;
        res.json({ ok: true, discount_pct: planDiscount(monthly, yearly) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/capa-overdue', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { due_date, status } = req.query;
        res.json({ ok: true, overdue: capaOverdue(due_date, status) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/integration-health', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { last_sync } = req.query;
        res.json({ ok: true, health: integrationHealth(last_sync) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cds-response-time', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { created_at, acknowledged_at } = req.query;
        res.json({ ok: true, minutes: cdsResponseTime(created_at, acknowledged_at) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cds-ack-rate', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
    try {
        const { alerts } = req.query;
        if (!alerts) return res.status(400).json({ ok: false, error: 'alerts_required' });
        let parsed = alerts;
        if (typeof alerts === 'string') {
            try { parsed = JSON.parse(alerts); } catch (e) {}
        }
        res.json({ ok: true, ack_rate: alertAcknowledgementRate(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/vector-similarity', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { v1, v2 } = req.query;
        if (!v1 || !v2) return res.status(400).json({ ok: false, error: 'both_required' });
        let p1 = v1, p2 = v2;
        if (typeof v1 === 'string') {
            try { p1 = JSON.parse(v1); } catch (e) {}
        }
        if (typeof v2 === 'string') {
            try { p2 = JSON.parse(v2); } catch (e) {}
        }
        res.json({ ok: true, similarity: vectorSimilarity(p1, p2) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cms-embedding-distance', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { v1, v2 } = req.query;
        if (!v1 || !v2) return res.status(400).json({ ok: false, error: 'both_required' });
        let p1 = v1, p2 = v2;
        if (typeof v1 === 'string') { try { p1 = JSON.parse(v1); } catch (e) {} }
        if (typeof v2 === 'string') { try { p2 = JSON.parse(v2); } catch (e) {} }
        res.json({ ok: true, distance: cmsEmbeddingDistance(p1, p2) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/sepsis-bundle-compliance', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { bundle } = req.query;
        if (!bundle) return res.status(400).json({ ok: false, error: 'bundle_required' });
        let parsed = bundle;
        if (typeof bundle === 'string') {
            try { parsed = JSON.parse(bundle); } catch (e) {}
        }
        res.json({ ok: true, compliance: sepsisBundleCompliance(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/sepsis-time-to-bundle', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { start_time } = req.query;
        res.json({ ok: true, minutes: sepsisTimeToBundle(start_time) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/shock-response-assessment', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { map_value, baseline_map } = req.query;
        res.json({ ok: true, response: shockResponseAssessment(map_value, baseline_map) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/shock-time-to-response', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { log_time } = req.query;
        res.json({ ok: true, minutes: shockTimeToResponse(log_time) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/satisfaction-overall', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { cleanliness, courtesy, wait, communication, pain, food } = req.query;
        res.json({ ok: true, overall: satisfactionOverall(cleanliness, courtesy, wait, communication, pain, food) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/satisfaction-category', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { rating } = req.query;
        if (rating === undefined) return res.status(400).json({ ok: false, error: 'rating_required' });
        res.json({ ok: true, category: satisfactionCategory(rating) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/nps', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { responses } = req.query;
        if (!responses) return res.status(400).json({ ok: false, error: 'responses_required' });
        let parsed = responses;
        if (typeof responses === 'string') {
            try { parsed = JSON.parse(responses); } catch (e) { parsed = responses.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)); }
        }
        res.json({ ok: true, nps_score: npsScore(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/nps-category', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { score } = req.query;
        if (score === undefined) return res.status(400).json({ ok: false, error: 'score_required' });
        res.json({ ok: true, category: npsCategory(score) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/nps-detailed', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { scores } = req.query;
        if (!scores) return res.status(400).json({ ok: false, error: 'scores_required' });
        let parsed = scores;
        if (typeof scores === 'string') {
            try { parsed = JSON.parse(scores); } catch (e) { parsed = scores.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)); }
        }
        res.json({ ok: true, detailed: npsDetailed(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/tenant-trial-remaining', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { trial_ends_at } = req.query;
        res.json({ ok: true, days_remaining: tenantTrialRemainingDays(trial_ends_at) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/capa-completeness', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { incident } = req.query;
        if (!incident) return res.status(400).json({ ok: false, error: 'incident_required' });
        let parsed = incident;
        if (typeof incident === 'string') {
            try { parsed = JSON.parse(incident); } catch (e) {}
        }
        res.json({ ok: true, completeness_pct: rcaCompletenessPercent(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/beds-utilization', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { beds, occupied } = req.query;
        res.json({ ok: true, utilization_pct: facilityBedsUtilization(beds, occupied) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/user-mfa-required', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { permissions } = req.query;
        res.json({ ok: true, mfa_required: userMfaRequired(permissions) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/daily-meals-compliance', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { consumed_pct } = req.query;
        res.json({ ok: true, category: dailyMealsCompliance(consumed_pct) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/rca-maturity', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { rca } = req.query;
        if (!rca) return res.status(400).json({ ok: false, error: 'rca_required' });
        let parsed = rca;
        if (typeof rca === 'string') {
            try { parsed = JSON.parse(rca); } catch (e) {}
        }
        res.json({ ok: true, score: rcaRcaMaturityScore(parsed), completeness_pct: rcaCompletenessPercent(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/user-has-permission', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { permissions, key } = req.query;
        if (!key) return res.status(400).json({ ok: false, error: 'key_required' });
        res.json({ ok: true, has_permission: userHasPermission(permissions, key) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STATS =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const users = await db.query(`SELECT role, is_active, COUNT(*) AS count FROM system_users GROUP BY role, is_active`);
        const tenants = await db.query(`SELECT status, COUNT(*) AS count FROM tenants GROUP BY status`);
        const facilities = await db.query(`SELECT type, COUNT(*) AS count FROM facilities GROUP BY type`);
        const intg = await db.query(`SELECT is_enabled, COUNT(*) AS count FROM integration_settings WHERE tenant_id = $1 GROUP BY is_enabled`, [req.tenantId]);
        const cds = await db.query(`SELECT severity, status, COUNT(*) AS count FROM cds_alerts WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '7 days' GROUP BY severity, status`, [req.tenantId]);
        const qi = await db.query(`SELECT status, severity, COUNT(*) AS count FROM quality_incidents WHERE tenant_id = $1 GROUP BY status, severity`, [req.tenantId]);
        const capa = await db.query(`SELECT status, COUNT(*) AS count FROM quality_capa WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        const kpi = await db.query(`SELECT status, COUNT(*) AS count FROM quality_kpis WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        res.json({
            ok: true,
            users: users.rows,
            tenants: tenants.rows,
            facilities: facilities.rows,
            integrations: intg.rows,
            cds_alerts_7d: cds.rows,
            quality_incidents: qi.rows,
            capa: capa.rows,
            kpis: kpi.rows
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
