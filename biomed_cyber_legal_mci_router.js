'use strict';
// Wave 131 — BioMedical / Cyber / Legal / MCI Drills / Call Center / Clinical Trials / IRB / Yaqeen / Medical Certs / Government Reports / Queue Ads / Mortuary
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_BIOMED_STATUS = ['active','in_service','out_of_service','retired','under_maintenance','quarantined'];
const VALID_WO_TYPE = ['corrective','preventive','calibration','inspection','emergency','recall'];
const VALID_WO_SEVERITY = ['low','medium','high','critical'];
const VALID_WO_STATUS = ['open','assigned','in_progress','on_hold','awaiting_parts','completed','cancelled','verified'];
const VALID_CYBER_SEVERITY = ['low','medium','high','critical','catastrophic'];
const VALID_CYBER_STATUS = ['detected','investigating','contained','eradicated','recovered','post_incident','closed'];
const VALID_LEGAL_STATUS = ['open','in_progress','mediation','arbitration','court','settled','closed','won','lost'];
const VALID_LEGAL_TYPE = ['malpractice','labor','contract','patient_complaint','regulatory','tax','insurance','vendor'];
const VALID_TRIAL_PHASE = ['preclinical','phase_1','phase_2','phase_3','phase_4','observational','registry'];
const VALID_TRIAL_STATUS = ['planning','recruiting','active','suspended','completed','terminated','published'];
const VALID_IRB_DECISION = ['approved','approved_with_conditions','deferred','rejected','withdrawn'];
const VALID_TICKET_STATUS = ['new','open','pending','escalated','resolved','closed','reopened'];
const VALID_GOV_STATUS = ['draft','pending','submitted','acknowledged','rejected','accepted','late','overdue'];
const VALID_RELEASE_STATUS = ['in_morgue','released_to_family','released_to_police','released_to_embalmers','pending_autopsy','autopsy_complete'];
const VALID_MCI_TYPE = ['mass_casualty','fire','chemical','biological','radiological','active_shooter','natural_disaster','pandemic'];

function warrantyRemaining(endDate) {
    if (!endDate) return null;
    const e = new Date(endDate);
    if (isNaN(e.getTime())) return null;
    return Math.max(0, Math.ceil((e - new Date()) / (1000 * 60 * 60 * 24)));
}

function assetAgeYears(installDate) {
    if (!installDate) return null;
    const d = new Date(installDate);
    if (isNaN(d.getTime())) return null;
    return Math.floor((new Date() - d) / (1000 * 60 * 60 * 24 * 365));
}

function pmOverdue(nextPmDate) {
    if (!nextPmDate) return false;
    return new Date(nextPmDate) < new Date();
}

function calOverdue(nextDue) {
    if (!nextDue) return false;
    return new Date(nextDue) < new Date();
}

function slaDeadlineHours(severity) {
    const map = { critical: 4, high: 24, medium: 72, low: 168 };
    return map[severity] || 168;
}

function woBreachSla(reportedAt, severity, status) {
    if (!reportedAt || status === 'completed' || status === 'cancelled') return false;
    const r = new Date(reportedAt);
    if (isNaN(r.getTime())) return false;
    const sla = slaDeadlineHours(severity);
    const elapsed = (new Date() - r) / (1000 * 60 * 60);
    return elapsed > sla;
}

function downtimeHours(start, end) {
    if (!start) return 0;
    const s = new Date(start);
    const e = end ? new Date(end) : new Date();
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
    return Math.round((e - s) / 60000);
}

function mttrCalc(woArray) {
    if (!Array.isArray(woArray) || woArray.length === 0) return null;
    const completed = woArray.filter(w => w.status === 'completed' && w.reported_at);
    if (completed.length === 0) return null;
    const total = completed.reduce((sum, w) => sum + (downtimeHours(w.reported_at, w.closed_at) || 0), 0);
    return Math.round((total / completed.length) * 10) / 10;
}

function mtbfCalc(failures, days) {
    if (!Array.isArray(failures) || !days || days === 0) return null;
    return Math.round((days / failures.length) * 24 * 10) / 10;
}

function meanTimeBetweenFailures(assetId, woArray) {
    if (!Array.isArray(woArray) || woArray.length < 2) return null;
    const sorted = woArray.filter(w => w.reported_at).sort((a, b) => new Date(a.reported_at) - new Date(b.reported_at));
    if (sorted.length < 2) return null;
    const first = new Date(sorted[0].reported_at);
    const last = new Date(sorted[sorted.length - 1].reported_at);
    const days = (last - first) / (1000 * 60 * 60 * 24);
    return mtbfCalc(sorted, days);
}

function cyberMTTD(detectedAt, containedAt) {
    if (!detectedAt || !containedAt) return null;
    const d = new Date(detectedAt);
    const c = new Date(containedAt);
    if (isNaN(d.getTime()) || isNaN(c.getTime())) return null;
    return Math.round((c - d) / 60000);
}

function cyberMTTR(detectedAt, recoveredAt) {
    if (!detectedAt || !recoveredAt) return null;
    const d = new Date(detectedAt);
    const r = new Date(recoveredAt);
    if (isNaN(d.getTime()) || isNaN(r.getTime())) return null;
    return Math.round((r - d) / (1000 * 60));
}

function ticketAgeHours(createdAt) {
    if (!createdAt) return null;
    const c = new Date(createdAt);
    if (isNaN(c.getTime())) return null;
    return Math.round((new Date() - c) / 3600000);
}

function ticketSlaBreach(createdAt, status) {
    if (!createdAt || status === 'resolved' || status === 'closed') return false;
    return ticketAgeHours(createdAt) > 24;
}

function govReportOverdue(dueDate, status) {
    if (!dueDate || status === 'submitted' || status === 'accepted') return false;
    return new Date(dueDate) < new Date();
}

function govDaysUntilDue(dueDate) {
    if (!dueDate) return null;
    const d = new Date(dueDate);
    if (isNaN(d.getTime())) return null;
    return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
}

function irbApprovalProgress(decision, decisionDate, submissionDate) {
    if (!submissionDate) return 0;
    if (decision === 'approved' || decision === 'rejected' || decision === 'withdrawn') return 100;
    const sub = new Date(submissionDate);
    if (isNaN(sub.getTime())) return 0;
    const days = (new Date() - sub) / (1000 * 60 * 60 * 24);
    return Math.min(99, Math.round((days / 30) * 100));
}

function trialEnrollmentProgress(enrolled, target) {
    const e = parseInt(enrolled) || 0;
    const t = parseInt(target) || 0;
    if (t === 0) return 0;
    return Math.round((e / t) * 1000) / 10;
}

function mortuaryBodyAgeHours(deathTime) {
    if (!deathTime) return null;
    const d = new Date(deathTime);
    if (isNaN(d.getTime())) return null;
    return Math.round((new Date() - d) / 3600000);
}

function mortuaryReleaseEligible(releaseStatus, autopsyRequired) {
    if (autopsyRequired && releaseStatus === 'in_morgue') return false;
    if (releaseStatus === 'released_to_family' || releaseStatus === 'released_to_police') return true;
    return false;
}

function isSaudiNationalId(id) {
    if (!id) return false;
    return /^[12]\d{9}$/.test(String(id));
}

function nationalIdChecksum(id) {
    if (!id || id.length !== 10) return null;
    return id[0] === '1' ? 'citizen' : (id[0] === '2' ? 'resident' : 'unknown');
}

function queueAdRotation(ad) {
    if (!ad) return null;
    if (ad.is_active !== 1 && ad.is_active !== true) return null;
    return Math.min(60, (ad.duration_seconds || 10));
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true, version: '1.0.0', module: 'biomed-cyber-legal-mci-trials-mortuary',
        endpoints: [
            'GET/POST /biomed/assets',
            'GET/POST /biomed/calibrations',
            'GET/POST /biomed/pm-schedule',
            'GET/POST /biomed/work-orders',
            'GET/POST /cyber/incidents',
            'GET/POST /legal/cases',
            'GET/POST /mci/drills',
            'GET/POST /call-center/tickets',
            'GET/POST /clinical-trials',
            'GET/POST /irb/submissions',
            'GET/POST /yaqeen/verifications',
            'GET/POST /medical-certificates',
            'GET/POST /government/reports',
            'GET/POST /queue/advertisements',
            'GET/POST /mortuary/cases',
            'GET/POST /mortuary/records',
            'GET /warranty-remaining',
            'GET /asset-age-years',
            'GET /pm-overdue',
            'GET /cal-overdue',
            'GET /sla-deadline',
            'GET /wo-sla-breach',
            'GET /downtime-hours',
            'GET /mttr',
            'GET /mtbf',
            'GET /cyber-mttd',
            'GET /cyber-mttr',
            'GET /ticket-age',
            'GET /ticket-sla-breach',
            'GET /gov-overdue',
            'GET /gov-days-until-due',
            'GET /irb-progress',
            'GET /trial-progress',
            'GET /mortuary-age',
            'GET /mortuary-release-eligible',
            'GET /saudi-nid-valid',
            'GET /nid-checksum',
            'GET /ad-rotation',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== BIOMED: ASSETS =====
router.get('/biomed/assets', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, category, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM biomed_assets WHERE 1=1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (category) { sql += ` AND category = $${params.length + 1}`; params.push(category); }
        sql += ` ORDER BY asset_tag LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({
            ...a,
            warranty_remaining_days: warrantyRemaining(a.warranty_end),
            age_years: assetAgeYears(a.install_date)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/biomed/assets', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { asset_tag, category, model, serial, manufacturer, location_dept, location_room, install_date, warranty_end, status } = req.body;
        if (!asset_tag) return res.status(400).json({ ok: false, error: 'asset_tag_required' });
        if (status && !VALID_BIOMED_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_BIOMED_STATUS });
        const r = await db.query(
            `INSERT INTO biomed_assets (asset_tag, category, model, serial, manufacturer, location_dept, location_room, install_date, warranty_end, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [asset_tag, category || null, model || null, serial || null, manufacturer || null,
             location_dept || null, location_room || null, install_date || null,
             warranty_end || null, status || 'in_service']
        );
        res.status(201).json({ ok: true, asset: r.rows[0], warranty_remaining_days: warrantyRemaining(warranty_end) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BIOMED: CALIBRATIONS =====
router.get('/biomed/calibrations', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { asset_id, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM biomed_calibrations WHERE 1=1`;
        if (asset_id) { sql += ` AND asset_id = $${params.length + 1}`; params.push(parseInt(asset_id)); }
        sql += ` ORDER BY calibration_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({ ...c, overdue: calOverdue(c.next_due) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/biomed/calibrations', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { asset_id, calibration_date, technician, standard_used, results, next_due } = req.body;
        if (!asset_id || !calibration_date) return res.status(400).json({ ok: false, error: 'asset_id_and_date_required' });
        const r = await db.query(
            `INSERT INTO biomed_calibrations (asset_id, calibration_date, technician, standard_used, results, next_due)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [parseInt(asset_id), calibration_date, technician || null, standard_used || null,
             results || null, next_due || null]
        );
        res.status(201).json({ ok: true, calibration: r.rows[0], overdue: calOverdue(next_due) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BIOMED: PM SCHEDULE =====
router.get('/biomed/pm-schedule', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { overdue_only, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM biomed_pm_schedule WHERE 1=1`;
        if (overdue_only === 'true') { sql += ` AND next_pm_date < CURRENT_DATE`; }
        sql += ` ORDER BY next_pm_date LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(p => ({ ...p, overdue: pmOverdue(p.next_pm_date) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/biomed/pm-schedule', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { asset_id, frequency_days, last_pm_date, next_pm_date } = req.body;
        if (!asset_id) return res.status(400).json({ ok: false, error: 'asset_id_required' });
        const r = await db.query(
            `INSERT INTO biomed_pm_schedule (asset_id, frequency_days, last_pm_date, next_pm_date)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [parseInt(asset_id), parseInt(frequency_days || 90), last_pm_date || null, next_pm_date || null]
        );
        res.status(201).json({ ok: true, schedule: r.rows[0], overdue: pmOverdue(next_pm_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BIOMED: WORK ORDERS =====
router.get('/biomed/work-orders', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, severity, wo_type, asset_id, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM biomed_work_orders WHERE 1=1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
        if (wo_type) { sql += ` AND wo_type = $${params.length + 1}`; params.push(wo_type); }
        if (asset_id) { sql += ` AND asset_id = $${params.length + 1}`; params.push(parseInt(asset_id)); }
        sql += ` ORDER BY reported_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(w => ({
            ...w,
            sla_deadline_hours: slaDeadlineHours(w.severity),
            sla_breach: woBreachSla(w.reported_at, w.severity, w.status),
            downtime_hours: downtimeHours(w.reported_at, w.closed_at)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/biomed/work-orders', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { asset_id, asset_tag, wo_type, severity, reported_at, reported_by, technician, parts, downtime_min, status } = req.body;
        if (!wo_type) return res.status(400).json({ ok: false, error: 'wo_type_required' });
        if (wo_type && !VALID_WO_TYPE.includes(wo_type)) return res.status(400).json({ ok: false, error: 'invalid_wo_type', valid: VALID_WO_TYPE });
        if (severity && !VALID_WO_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity', valid: VALID_WO_SEVERITY });
        if (status && !VALID_WO_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_WO_STATUS });
        const r = await db.query(
            `INSERT INTO biomed_work_orders (asset_id, asset_tag, wo_type, severity, reported_at, reported_by, technician, parts, downtime_min, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [asset_id || null, asset_tag || null, wo_type, severity || 'medium',
             reported_at || new Date().toISOString(), reported_by || null, technician || null,
             parts || null, parseInt(downtime_min || 0), status || 'open']
        );
        res.status(201).json({ ok: true, work_order: r.rows[0], sla_deadline_hours: slaDeadlineHours(severity || 'medium') });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CYBER: INCIDENTS =====
router.get('/cyber/incidents', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { severity, status, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM cyber_incidents WHERE 1=1`;
        if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY detected_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({
            ...c,
            mttd_minutes: cyberMTTD(c.detected_at, c.contained_at),
            mttr_minutes: cyberMTTR(c.detected_at, c.resolved_at)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cyber/incidents', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { severity, incident_type, description, affected_systems, status, detected_at } = req.body;
        if (!incident_type) return res.status(400).json({ ok: false, error: 'incident_type_required' });
        if (severity && !VALID_CYBER_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity', valid: VALID_CYBER_SEVERITY });
        if (status && !VALID_CYBER_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_CYBER_STATUS });
        const r = await db.query(
            `INSERT INTO cyber_incidents (severity, incident_type, description, affected_systems, status, detected_at)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [severity || 'medium', incident_type, description || null, affected_systems || null,
             status || 'detected', detected_at || new Date().toISOString()]
        );
        res.status(201).json({ ok: true, incident: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== LEGAL: CASES =====
router.get('/legal/cases', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, case_type, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM legal_cases WHERE 1=1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (case_type) { sql += ` AND case_type = $${params.length + 1}`; params.push(case_type); }
        sql += ` ORDER BY opened_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({
            ...c,
            age_days: c.opened_at ? Math.floor((new Date() - new Date(c.opened_at)) / (1000 * 60 * 60 * 24)) : null,
            closed: c.status === 'closed' || c.status === 'won' || c.status === 'lost' || c.status === 'settled'
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/legal/cases', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { case_type, subject, counsel, status, amount, opened_at, closed_at } = req.body;
        if (!subject) return res.status(400).json({ ok: false, error: 'subject_required' });
        if (case_type && !VALID_LEGAL_TYPE.includes(case_type)) return res.status(400).json({ ok: false, error: 'invalid_case_type', valid: VALID_LEGAL_TYPE });
        if (status && !VALID_LEGAL_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_LEGAL_STATUS });
        const r = await db.query(
            `INSERT INTO legal_cases (case_type, subject, counsel, status, amount, opened_at, closed_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [case_type || null, subject, counsel || null, status || 'open',
             parseFloat(amount || 0), opened_at || null, closed_at || null]
        );
        res.status(201).json({ ok: true, legal_case: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MCI DRILLS =====
router.get('/mci/drills', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { scenario, drill_type, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM mci_drills WHERE 1=1`;
        if (scenario) { sql += ` AND scenario = $${params.length + 1}`; params.push(scenario); }
        if (drill_type) { sql += ` AND drill_type = $${params.length + 1}`; params.push(drill_type); }
        sql += ` ORDER BY drill_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/mci/drills', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { drill_date, scenario, drill_type, attendance, lessons_learned, commander } = req.body;
        if (!drill_date) return res.status(400).json({ ok: false, error: 'drill_date_required' });
        if (drill_type && !VALID_MCI_TYPE.includes(drill_type)) return res.status(400).json({ ok: false, error: 'invalid_drill_type', valid: VALID_MCI_TYPE });
        const r = await db.query(
            `INSERT INTO mci_drills (drill_date, scenario, drill_type, attendance, lessons_learned, commander)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [drill_date, scenario || null, drill_type || null, parseInt(attendance || 0),
             lessons_learned || null, commander || null]
        );
        res.status(201).json({ ok: true, drill: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CALL CENTER TICKETS =====
router.get('/call-center/tickets', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { status, topic, patient_id, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM call_center_tickets WHERE 1=1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (topic) { sql += ` AND topic = $${params.length + 1}`; params.push(topic); }
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(t => ({
            ...t,
            age_hours: ticketAgeHours(t.created_at),
            sla_breach: ticketSlaBreach(t.created_at, t.status)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/call-center/tickets', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { patient_id, caller, topic, notes, status, agent } = req.body;
        if (!caller) return res.status(400).json({ ok: false, error: 'caller_required' });
        if (status && !VALID_TICKET_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_TICKET_STATUS });
        const r = await db.query(
            `INSERT INTO call_center_tickets (patient_id, caller, topic, notes, status, agent)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [patient_id || null, caller, topic || null, notes || null,
             status || 'new', agent || null]
        );
        res.status(201).json({ ok: true, ticket: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CLINICAL TRIALS =====
router.get('/clinical-trials', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { phase, status, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM clinical_trials WHERE 1=1`;
        if (phase) { sql += ` AND phase = $${params.length + 1}`; params.push(phase); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(t => ({
            ...t,
            irb_progress_pct: irbApprovalProgress(t.status, null, t.created_at)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/clinical-trials', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { trial_name, phase, pi_name, status, irb_approval, sponsor, target_enrollment, enrolled_count, study_design, start_date, end_date } = req.body;
        if (!trial_name) return res.status(400).json({ ok: false, error: 'trial_name_required' });
        if (phase && !VALID_TRIAL_PHASE.includes(phase)) return res.status(400).json({ ok: false, error: 'invalid_phase', valid: VALID_TRIAL_PHASE });
        if (status && !VALID_TRIAL_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_TRIAL_STATUS });
        const r = await db.query(
            `INSERT INTO clinical_trials (trial_name, phase, pi_name, status, irb_approval, sponsor, target_enrollment, enrolled_count, study_design, start_date, end_date)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [trial_name, phase || null, pi_name || null, status || 'planning',
             irb_approval || null, sponsor || null, parseInt(target_enrollment || 0), parseInt(enrolled_count || 0),
             study_design || null, start_date || null, end_date || null]
        );
        res.status(201).json({ ok: true, trial: r.rows[0], enrollment_progress_pct: trialEnrollmentProgress(enrolled_count, target_enrollment) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== IRB SUBMISSIONS =====
router.get('/irb/submissions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { trial_id, decision, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT * FROM irb_submissions WHERE 1=1`;
        if (trial_id) { sql += ` AND trial_id = $${params.length + 1}`; params.push(parseInt(trial_id)); }
        if (decision) { sql += ` AND decision = $${params.length + 1}`; params.push(decision); }
        sql += ` ORDER BY submission_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(s => ({
            ...s,
            review_days: s.submission_date && s.decision_date ?
                Math.floor((new Date(s.decision_date) - new Date(s.submission_date)) / (1000 * 60 * 60 * 24)) : null
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/irb/submissions', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { trial_id, submission_date, decision, decision_date, notes, submitted_by, review_board } = req.body;
        if (!trial_id || !submission_date) return res.status(400).json({ ok: false, error: 'trial_id_and_submission_date_required' });
        if (decision && !VALID_IRB_DECISION.includes(decision)) return res.status(400).json({ ok: false, error: 'invalid_decision', valid: VALID_IRB_DECISION });
        const r = await db.query(
            `INSERT INTO irb_submissions (trial_id, submission_date, decision, decision_date, notes, submitted_by, review_board)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [parseInt(trial_id), submission_date, decision || null, decision_date || null,
             notes || null, submitted_by || null, review_board || null]
        );
        res.status(201).json({ ok: true, submission: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== YAQEEN VERIFICATIONS =====
router.get('/yaqeen/verifications', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, is_verified, verification_status, limit = 200 } = req.query;
        const params = [];
        let sql = `SELECT id, patient_id, national_id, full_name_ar, full_name_en, gender, nationality, is_verified, verification_status, created_at, verified_at FROM yaqeen_verifications WHERE 1=1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (is_verified !== undefined) { sql += ` AND is_verified = $${params.length + 1}`; params.push(parseInt(is_verified)); }
        if (verification_status) { sql += ` AND verification_status = $${params.length + 1}`; params.push(verification_status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(y => ({
            ...y,
            nid_checksum: nationalIdChecksum(y.national_id),
            nid_valid: isSaudiNationalId(y.national_id)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/yaqeen/verifications', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, national_id, dob, id_type, request_payload, response_payload, verification_status, is_verified, full_name_ar, full_name_en, gender, nationality, created_by } = req.body;
        if (!national_id) return res.status(400).json({ ok: false, error: 'national_id_required' });
        if (!isSaudiNationalId(national_id)) return res.status(400).json({ ok: false, error: 'invalid_national_id_format' });
        const r = await db.query(
            `INSERT INTO yaqeen_verifications (patient_id, national_id, dob, id_type, request_payload, response_payload, verification_status, is_verified, full_name_ar, full_name_en, gender, nationality, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id, patient_id, national_id, verification_status, is_verified, created_at`,
            [patient_id || null, national_id, dob || null, id_type || 'national_id',
             request_payload || null, response_payload || null, verification_status || 'pending',
             is_verified ? 1 : 0, full_name_ar || null, full_name_en || null,
             gender || null, nationality || null, created_by || null]
        );
        res.status(201).json({ ok: true, verification: r.rows[0], nid_type: nationalIdChecksum(national_id) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MEDICAL CERTIFICATES =====
router.get('/medical-certificates', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, cert_type, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM medical_certificates WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (cert_type) { sql += ` AND cert_type = $${params.length + 1}`; params.push(cert_type); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/medical-certificates', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, doctor_id, doctor_name, cert_type, diagnosis, notes, start_date, end_date, days } = req.body;
        if (!patient_id || !cert_type) return res.status(400).json({ ok: false, error: 'patient_id_and_cert_type_required' });
        const r = await db.query(
            `INSERT INTO medical_certificates (patient_id, patient_name, doctor_id, doctor_name, cert_type, diagnosis, notes, start_date, end_date, days, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [parseInt(patient_id), patient_name || null, doctor_id || null, doctor_name || null,
             cert_type, diagnosis || null, notes || null, start_date || null, end_date || null,
             parseInt(days || 1), req.tenantId]
        );
        res.status(201).json({ ok: true, certificate: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== GOVERNMENT REPORTS =====
router.get('/government/reports', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { report_type, status, authority, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM government_reports WHERE 1=1`;
        if (report_type) { sql += ` AND report_type = $${params.length + 1}`; params.push(report_type); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (authority) { sql += ` AND authority = $${params.length + 1}`; params.push(authority); }
        sql += ` ORDER BY due_date DESC NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(g => ({
            ...g,
            overdue: govReportOverdue(g.due_date, g.status),
            days_until_due: govDaysUntilDue(g.due_date)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/government/reports', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { report_type, report_name, report_name_ar, reporting_period_start, reporting_period_end, due_date, authority, authority_ar, status, data_json, submitted_by, submitted_to, reference_number, notes } = req.body;
        if (!report_type || !report_name) return res.status(400).json({ ok: false, error: 'report_type_and_name_required' });
        if (status && !VALID_GOV_STATUS.includes(status)) return res.status(400).json({ ok: false, error: 'invalid_status', valid: VALID_GOV_STATUS });
        const r = await db.query(
            `INSERT INTO government_reports (report_type, report_name, report_name_ar, reporting_period_start, reporting_period_end, due_date, authority, authority_ar, status, data_json, submitted_by, submitted_to, reference_number, notes, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
            [report_type, report_name, report_name_ar || null,
             reporting_period_start || null, reporting_period_end || null, due_date || null,
             authority || null, authority_ar || null, status || 'draft',
             typeof data_json === 'object' ? JSON.stringify(data_json) : (data_json || null),
             submitted_by || null, submitted_to || null, reference_number || null, notes || null,
             req.user?.id || null]
        );
        res.status(201).json({ ok: true, report: r.rows[0], days_until_due: govDaysUntilDue(due_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== QUEUE ADVERTISEMENTS =====
router.get('/queue/advertisements', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { is_active, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM queue_advertisements WHERE 1=1`;
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(parseInt(is_active)); }
        sql += ` ORDER BY display_order LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(a => ({ ...a, rotation_seconds: queueAdRotation(a) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/queue/advertisements', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { title, image_path, display_order, duration_seconds, is_active } = req.body;
        if (!title) return res.status(400).json({ ok: false, error: 'title_required' });
        const r = await db.query(
            `INSERT INTO queue_advertisements (title, image_path, display_order, duration_seconds, is_active, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [title, image_path || null, parseInt(display_order || 0), parseInt(duration_seconds || 10),
             is_active === undefined ? 1 : (is_active ? 1 : 0), req.tenantId]
        );
        res.status(201).json({ ok: true, ad: r.rows[0], rotation_seconds: queueAdRotation(r.rows[0]) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MORTUARY CASES =====
router.get('/mortuary/cases', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { release_status, autopsy_required, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM mortuary_cases WHERE tenant_id = $1`;
        if (release_status) { sql += ` AND release_status = $${params.length + 1}`; params.push(release_status); }
        if (autopsy_required !== undefined) { sql += ` AND autopsy_required = $${params.length + 1}`; params.push(parseInt(autopsy_required)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({
            ...c,
            body_age_hours: mortuaryBodyAgeHours(c.date_of_death && c.time_of_death ? `${c.date_of_death}T${c.time_of_death}` : c.date_of_death),
            release_eligible: mortuaryReleaseEligible(c.release_status, c.autopsy_required)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/mortuary/cases', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_id, deceased_name, date_of_death, time_of_death, cause_of_death, icd_code, attending_physician, next_of_kin, next_of_kin_phone, autopsy_required, body_location, release_status, released_to, released_date, death_certificate_number, notes } = req.body;
        if (!deceased_name) return res.status(400).json({ ok: false, error: 'deceased_name_required' });
        if (release_status && !VALID_RELEASE_STATUS.includes(release_status)) return res.status(400).json({ ok: false, error: 'invalid_release_status', valid: VALID_RELEASE_STATUS });
        const r = await db.query(
            `INSERT INTO mortuary_cases (patient_id, deceased_name, date_of_death, time_of_death, cause_of_death, icd_code, attending_physician, next_of_kin, next_of_kin_phone, autopsy_required, body_location, release_status, released_to, released_date, death_certificate_number, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
            [patient_id || null, deceased_name, date_of_death || null, time_of_death || null,
             cause_of_death || null, icd_code || null, attending_physician || null,
             next_of_kin || null, next_of_kin_phone || null,
             autopsy_required ? 1 : 0, body_location || null,
             release_status || 'in_morgue', released_to || null, released_date || null,
             death_certificate_number || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, mortuary_case: r.rows[0], release_eligible: mortuaryReleaseEligible(release_status || 'in_morgue', autopsy_required) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MORTUARY RECORDS =====
router.get('/mortuary/records', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, limit = 100 } = req.query;
        const params = [];
        let sql = `SELECT * FROM mortuary_records WHERE 1=1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({
            ...c,
            body_age_hours: mortuaryBodyAgeHours(c.date_of_death),
            nid_checksum: nationalIdChecksum(c.national_id)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/mortuary/records', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { patient_name, national_id, date_of_death, cause_of_death, attending_physician, death_certificate_number, body_location, released_to, release_date, status, notes } = req.body;
        if (!patient_name) return res.status(400).json({ ok: false, error: 'patient_name_required' });
        const r = await db.query(
            `INSERT INTO mortuary_records (patient_name, national_id, date_of_death, cause_of_death, attending_physician, death_certificate_number, body_location, released_to, release_date, status, notes)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [patient_name, national_id || null, date_of_death || null,
             cause_of_death || null, attending_physician || null,
             death_certificate_number || null, body_location || null,
             released_to || null, release_date || null, status || 'in_morgue', notes || null]
        );
        res.status(201).json({ ok: true, mortuary_record: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== UTILITIES =====
router.get('/warranty-remaining', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { warranty_end } = req.query;
        res.json({ ok: true, days: warrantyRemaining(warranty_end) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/asset-age-years', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { install_date } = req.query;
        res.json({ ok: true, years: assetAgeYears(install_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/pm-overdue', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { next_pm_date } = req.query;
        res.json({ ok: true, overdue: pmOverdue(next_pm_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cal-overdue', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { next_due } = req.query;
        res.json({ ok: true, overdue: calOverdue(next_due) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/sla-deadline', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { severity } = req.query;
        if (!severity) return res.status(400).json({ ok: false, error: 'severity_required' });
        res.json({ ok: true, deadline_hours: slaDeadlineHours(severity) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/wo-sla-breach', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { reported_at, severity, status } = req.query;
        res.json({ ok: true, breach: woBreachSla(reported_at, severity, status) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/downtime-hours', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { start, end } = req.query;
        res.json({ ok: true, hours: downtimeHours(start, end) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/mttr', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { work_orders } = req.query;
        if (!work_orders) return res.status(400).json({ ok: false, error: 'work_orders_required' });
        let parsed = work_orders;
        if (typeof work_orders === 'string') {
            try { parsed = JSON.parse(work_orders); } catch (e) {}
        }
        res.json({ ok: true, mttr_hours: mttrCalc(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/mtbf', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { asset_id, work_orders } = req.query;
        if (!work_orders) return res.status(400).json({ ok: false, error: 'work_orders_required' });
        let parsed = work_orders;
        if (typeof work_orders === 'string') {
            try { parsed = JSON.parse(work_orders); } catch (e) {}
        }
        res.json({ ok: true, mtbf_hours: meanTimeBetweenFailures(asset_id, parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cyber-mttd', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { detected_at, contained_at } = req.query;
        res.json({ ok: true, minutes: cyberMTTD(detected_at, contained_at) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/cyber-mttr', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { detected_at, recovered_at } = req.query;
        res.json({ ok: true, minutes: cyberMTTR(detected_at, recovered_at) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ticket-age', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { created_at } = req.query;
        res.json({ ok: true, hours: ticketAgeHours(created_at) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ticket-sla-breach', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { created_at, status } = req.query;
        res.json({ ok: true, breach: ticketSlaBreach(created_at, status) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/gov-overdue', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { due_date, status } = req.query;
        res.json({ ok: true, overdue: govReportOverdue(due_date, status) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/gov-days-until-due', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { due_date } = req.query;
        res.json({ ok: true, days: govDaysUntilDue(due_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/irb-progress', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { decision, decision_date, submission_date } = req.query;
        res.json({ ok: true, progress_pct: irbApprovalProgress(decision, decision_date, submission_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/trial-progress', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { enrolled, target } = req.query;
        res.json({ ok: true, progress_pct: trialEnrollmentProgress(enrolled, target) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/mortuary-age', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { death_time } = req.query;
        res.json({ ok: true, hours: mortuaryBodyAgeHours(death_time) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/mortuary-release-eligible', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { release_status, autopsy_required } = req.query;
        res.json({ ok: true, eligible: mortuaryReleaseEligible(release_status, autopsy_required === 'true' || autopsy_required === true || parseInt(autopsy_required) === 1) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/saudi-nid-valid', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { national_id } = req.query;
        res.json({ ok: true, valid: isSaudiNationalId(national_id) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/nid-checksum', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { national_id } = req.query;
        res.json({ ok: true, type: nationalIdChecksum(national_id) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/ad-rotation', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { ad } = req.query;
        if (!ad) return res.status(400).json({ ok: false, error: 'ad_required' });
        let parsed = ad;
        if (typeof ad === 'string') {
            try { parsed = JSON.parse(ad); } catch (e) {}
        }
        res.json({ ok: true, rotation_seconds: queueAdRotation(parsed) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STATS =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const assets = await db.query(`SELECT status, COUNT(*) AS count FROM biomed_assets GROUP BY status`);
        const wo = await db.query(`SELECT status, severity, COUNT(*) AS count FROM biomed_work_orders GROUP BY status, severity`);
        const cyber = await db.query(`SELECT severity, status, COUNT(*) AS count FROM cyber_incidents GROUP BY severity, status`);
        const legal = await db.query(`SELECT status, case_type, COUNT(*) AS count FROM legal_cases GROUP BY status, case_type`);
        const tickets = await db.query(`SELECT status, COUNT(*) AS count FROM call_center_tickets GROUP BY status`);
        const trials = await db.query(`SELECT status, phase, COUNT(*) AS count FROM clinical_trials GROUP BY status, phase`);
        const irb = await db.query(`SELECT decision, COUNT(*) AS count FROM irb_submissions GROUP BY decision`);
        const gov = await db.query(`SELECT status, COUNT(*) AS count FROM government_reports GROUP BY status`);
        const mortuary = await db.query(`SELECT release_status, COUNT(*) AS count FROM mortuary_cases WHERE tenant_id = $1 GROUP BY release_status`, [req.tenantId]);
        res.json({
            ok: true,
            assets: assets.rows,
            work_orders: wo.rows,
            cyber_incidents: cyber.rows,
            legal_cases: legal.rows,
            tickets: tickets.rows,
            clinical_trials: trials.rows,
            irb: irb.rows,
            gov_reports: gov.rows,
            mortuary: mortuary.rows
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
