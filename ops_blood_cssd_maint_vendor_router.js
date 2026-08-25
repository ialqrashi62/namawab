'use strict';
// Wave 124 — Blood bank + CSSD + Maintenance + Vendors operations
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_BLOOD_TYPE = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const VALID_RH = ['+','-'];
const VALID_BLOOD_COMPONENT = ['whole_blood','red_cells','plasma','platelets','cryoprecipitate','granulocytes'];
const VALID_UNIT_STATUS = ['available','reserved','in_use','transfused','expired','discarded','quarantined'];
const VALID_REACTION_TYPE = ['febrile','allergic','urticarial','anaphylactic','hemolytic','TRALI','TACO','bacterial','other'];
const VALID_REACTION_SEV = ['mild','moderate','severe','life_threatening','fatal'];
const VALID_CSSD_CYCLE_TYPE = ['steam','EO_gas','plasma','dry_heat','formaldehyde','H2O2'];
const VALID_CSSD_STATUS = ['pending','in_progress','completed','released','quarantined','failed','recalled'];
const VALID_PM_FREQ = ['daily','weekly','monthly','quarterly','semi_annual','annual','biennial'];
const VALID_PM_STATUS = ['scheduled','in_progress','completed','overdue','cancelled'];
const VALID_WO_PRIORITY = ['low','medium','high','urgent','emergency'];
const VALID_WO_STATUS = ['open','assigned','in_progress','on_hold','completed','cancelled','closed'];
const VALID_VENDOR_TYPE = ['pharmacy','medical_supply','equipment','food','laundry','cleaning','IT','consulting','maintenance','other'];

function bloodCompatibility(donorType, recipientType) {
    if (!donorType || !recipientType) return null;
    const compat = {
        'O-': ['O-','O+','A-','A+','B-','B+','AB-','AB+'],
        'O+': ['O+','A+','B+','AB+'],
        'A-': ['A-','A+','AB-','AB+'],
        'A+': ['A+','AB+'],
        'B-': ['B-','B+','AB-','AB+'],
        'B+': ['B+','AB+'],
        'AB-': ['AB-','AB+'],
        'AB+': ['AB+']
    };
    return compat[donorType]?.includes(recipientType) || false;
}

function daysToExpiry(expiryDate) {
    if (!expiryDate) return null;
    const d = new Date(expiryDate);
    if (isNaN(d.getTime())) return null;
    return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
}

function unitExpiryAlert(expiryDate) {
    const days = daysToExpiry(expiryDate);
    if (days === null) return 'unknown';
    if (days < 0) return 'expired';
    if (days <= 3) return 'critical';
    if (days <= 7) return 'urgent';
    if (days <= 14) return 'warning';
    return 'safe';
}

function cssdCycleValidation(biTest, ciResult) {
    return {
        bi_pass: biTest === 'pass' || biTest === 'negative',
        ci_pass: ciResult === 'pass' || ciResult === 'negative',
        overall_pass: (biTest === 'pass' || biTest === 'negative') && (ciResult === 'pass' || ciResult === 'negative')
    };
}

function pmCompliance(nextDue) {
    if (!nextDue) return 'unknown';
    const d = new Date(nextDue);
    if (isNaN(d.getTime())) return 'unknown';
    const days = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'overdue';
    if (days <= 7) return 'due_soon';
    if (days <= 30) return 'upcoming';
    return 'scheduled';
}

function woSLA(priority, scheduledDate) {
    if (!priority) return null;
    const slaHours = { emergency: 2, urgent: 8, high: 24, medium: 72, low: 168 };
    return slaHours[priority] || null;
}

function vendorRating(rating) {
    const r = parseInt(rating);
    if (isNaN(r)) return 'unrated';
    if (r >= 5) return 'excellent';
    if (r >= 4) return 'good';
    if (r >= 3) return 'average';
    if (r >= 2) return 'below_average';
    return 'poor';
}

function creditUtilization(outstanding, limit) {
    const o = parseFloat(outstanding || 0);
    const l = parseFloat(limit || 0);
    if (l <= 0) return 0;
    return Math.round((o / l) * 1000) / 10;
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true, version: '1.0.0', module: 'ops-blood-cssd-maint-vendor',
        endpoints: [
            'GET/POST /blood/donors',
            'GET/POST /blood/units',
            'GET/POST /blood/crossmatch',
            'GET/POST /blood/transfusions',
            'GET/POST /blood/reactions',
            'GET /blood/compatibility',
            'GET /blood/expiry-alert',
            'GET/POST /cssd/cycles',
            'GET/POST /cssd/trays',
            'GET/POST /cssd/load-items',
            'GET/POST /cssd/instrument-sets',
            'GET /cssd/cycle-validation',
            'GET/POST /maintenance/equipment',
            'GET/POST /maintenance/pm-schedules',
            'GET/POST /maintenance/work-orders',
            'GET/POST /maintenance/calibrations',
            'GET /pm-compliance',
            'GET/POST /vendors',
            'GET /vendor-rating',
            'GET /credit-utilization',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== BLOOD BANK: DONORS =====
router.get('/blood/donors', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { blood_type, is_eligible, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM blood_bank_donors WHERE tenant_id = $1`;
        if (blood_type) { sql += ` AND blood_type = $${params.length + 1}`; params.push(blood_type); }
        if (is_eligible !== undefined) { sql += ` AND is_eligible = $${params.length + 1}`; params.push(parseInt(is_eligible)); }
        sql += ` ORDER BY donor_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/blood/donors', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { donor_name, donor_name_ar, national_id, phone, blood_type, rh_factor, age, gender, last_donation_date, is_eligible, medical_history, notes } = req.body;
        if (!donor_name) return res.status(400).json({ ok: false, error: 'donor_name_required' });
        if (blood_type && !VALID_BLOOD_TYPE.includes(blood_type)) return res.status(400).json({ ok: false, error: 'invalid_blood_type', valid: VALID_BLOOD_TYPE });
        const r = await db.query(
            `INSERT INTO blood_bank_donors (donor_name, donor_name_ar, national_id, phone, blood_type, rh_factor, age, gender, last_donation_date, is_eligible, medical_history, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [donor_name, donor_name_ar || null, national_id || null, phone || null,
             blood_type || null, rh_factor || null, age || null, gender || null,
             last_donation_date || null, is_eligible === undefined ? 1 : (is_eligible ? 1 : 0),
             medical_history || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, donor: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BLOOD BANK: UNITS =====
router.get('/blood/units', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { blood_type, status, component, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM blood_bank_units WHERE tenant_id = $1`;
        if (blood_type) { sql += ` AND blood_type = $${params.length + 1}`; params.push(blood_type); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (component) { sql += ` AND component = $${params.length + 1}`; params.push(component); }
        sql += ` ORDER BY expiry_date LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(u => ({ ...u, days_to_expiry: daysToExpiry(u.expiry_date), expiry_alert: unitExpiryAlert(u.expiry_date) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/blood/units', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { bag_number, blood_type, rh_factor, component, donor_id, collection_date, expiry_date, volume_ml, storage_location, notes } = req.body;
        if (!bag_number) return res.status(400).json({ ok: false, error: 'bag_number_required' });
        if (blood_type && !VALID_BLOOD_TYPE.includes(blood_type)) return res.status(400).json({ ok: false, error: 'invalid_blood_type', valid: VALID_BLOOD_TYPE });
        if (component && !VALID_BLOOD_COMPONENT.includes(component)) return res.status(400).json({ ok: false, error: 'invalid_component', valid: VALID_BLOOD_COMPONENT });
        const r = await db.query(
            `INSERT INTO blood_bank_units (bag_number, blood_type, rh_factor, component, donor_id, collection_date, expiry_date, volume_ml, status, storage_location, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [bag_number, blood_type || null, rh_factor || '+', component || 'whole_blood',
             donor_id || null, collection_date || null, expiry_date || null, volume_ml || 0,
             'available', storage_location || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, unit: r.rows[0], days_to_expiry: daysToExpiry(expiry_date), expiry_alert: unitExpiryAlert(expiry_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BLOOD BANK: CROSSMATCH =====
router.get('/blood/crossmatch', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, result, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM blood_bank_crossmatch WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (result) { sql += ` AND result = $${params.length + 1}`; params.push(result); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/blood/crossmatch', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, patient_blood_type, units_needed, unit_id, lab_technician, result, surgery_id, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO blood_bank_crossmatch (patient_id, patient_name, patient_blood_type, units_needed, unit_id, lab_technician, result, surgery_id, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [parseInt(patient_id), patient_name || null, patient_blood_type || null,
             units_needed || 1, unit_id || null, lab_technician || null,
             result || 'pending', surgery_id || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, crossmatch: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BLOOD BANK: TRANSFUSIONS =====
router.get('/blood/transfusions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, blood_type, adverse_only, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM blood_bank_transfusions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(parseInt(patient_id)); }
        if (blood_type) { sql += ` AND blood_type = $${params.length + 1}`; params.push(blood_type); }
        if (adverse_only === 'true') sql += ` AND adverse_reaction = 1`;
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/blood/transfusions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, unit_id, bag_number, blood_type, component, administered_by, start_time, end_time, volume_ml, adverse_reaction, reaction_details, vital_signs_before, vital_signs_after, notes, crossmatch_id } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        const r = await db.query(
            `INSERT INTO blood_bank_transfusions (patient_id, patient_name, unit_id, bag_number, blood_type, component, administered_by, start_time, end_time, volume_ml, adverse_reaction, reaction_details, vital_signs_before, vital_signs_after, notes, tenant_id, crossmatch_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
            [parseInt(patient_id), patient_name || null, unit_id || null, bag_number || null,
             blood_type || null, component || null, administered_by || null,
             start_time || null, end_time || null, volume_ml || 0,
             adverse_reaction ? 1 : 0, reaction_details || null,
             vital_signs_before || null, vital_signs_after || null, notes || null,
             req.tenantId, crossmatch_id || null]
        );
        res.status(201).json({ ok: true, transfusion: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BLOOD BANK: REACTIONS =====
router.get('/blood/reactions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { reaction_type, severity, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM blood_bank_transfusion_reactions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (reaction_type) { sql += ` AND reaction_type = $${params.length + 1}`; params.push(reaction_type); }
        if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/blood/reactions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { transfusion_id, unit_id, patient_id, reaction_type, severity, reaction_details, vital_signs_after, action_taken, reported_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (reaction_type && !VALID_REACTION_TYPE.includes(reaction_type)) return res.status(400).json({ ok: false, error: 'invalid_reaction_type', valid: VALID_REACTION_TYPE });
        if (severity && !VALID_REACTION_SEV.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity', valid: VALID_REACTION_SEV });
        const r = await db.query(
            `INSERT INTO blood_bank_transfusion_reactions (tenant_id, transfusion_id, unit_id, patient_id, reaction_type, severity, reaction_details, vital_signs_after, action_taken, reported_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, transfusion_id || null, unit_id || null, parseInt(patient_id),
             reaction_type || 'other', severity || 'mild', reaction_details || null,
             vital_signs_after || null, action_taken || null, reported_by || null]
        );
        res.status(201).json({ ok: true, reaction: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== BLOOD BANK: UTILITIES =====
router.get('/blood/compatibility', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
    try {
        const { donor, recipient } = req.query;
        if (!donor || !recipient) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, donor, recipient, compatible: bloodCompatibility(donor, recipient) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/blood/expiry-alert', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
    try {
        const { expiry_date } = req.query;
        if (!expiry_date) return res.status(400).json({ ok: false, error: 'expiry_date_required' });
        res.json({ ok: true, days_to_expiry: daysToExpiry(expiry_date), alert: unitExpiryAlert(expiry_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CSSD: STERILIZATION CYCLES =====
router.get('/cssd/cycles', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { status, cycle_type, days = 30, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cssd_sterilization_cycles WHERE tenant_id = $1 AND start_time >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (cycle_type) { sql += ` AND cycle_type = $${params.length + 1}`; params.push(cycle_type); }
        sql += ` ORDER BY start_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({ ...c, validation: cssdCycleValidation(c.bi_test_result, c.ci_result) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cssd/cycles', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { cycle_number, machine_name, cycle_type, temperature, pressure, duration_minutes, operator, bi_test_result, ci_result, status, bi_indicator_lot, released_for_issue, notes } = req.body;
        if (!cycle_number) return res.status(400).json({ ok: false, error: 'cycle_number_required' });
        if (cycle_type && !VALID_CSSD_CYCLE_TYPE.includes(cycle_type)) return res.status(400).json({ ok: false, error: 'invalid_cycle_type', valid: VALID_CSSD_CYCLE_TYPE });
        const r = await db.query(
            `INSERT INTO cssd_sterilization_cycles (cycle_number, machine_name, cycle_type, temperature, pressure, duration_minutes, operator, bi_test_result, ci_result, status, bi_indicator_lot, released_for_issue, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
            [cycle_number, machine_name || null, cycle_type || 'steam', temperature || null,
             pressure || null, duration_minutes || null, operator || null,
             bi_test_result || null, ci_result || null, status || 'pending',
             bi_indicator_lot || null, released_for_issue ? 1 : 0, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, cycle: r.rows[0], validation: cssdCycleValidation(bi_test_result, ci_result) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CSSD: TRAYS =====
router.get('/cssd/trays', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { status, department, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cssd_trays WHERE tenant_id = $1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cssd/trays', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { tray_code, set_id, cycle_id, department, status, sterilized_at, issued_to, used_in_surgery_id, notes } = req.body;
        if (!tray_code) return res.status(400).json({ ok: false, error: 'tray_code_required' });
        const r = await db.query(
            `INSERT INTO cssd_trays (tray_code, set_id, cycle_id, department, status, sterilized_at, issued_to, used_in_surgery_id, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [tray_code, set_id || null, cycle_id || null, department || null,
             status || 'sterile', sterilized_at || null, issued_to || null,
             used_in_surgery_id || null, notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, tray: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CSSD: LOAD ITEMS =====
router.get('/cssd/load-items', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { cycle_id, status, limit = 500 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cssd_load_items WHERE tenant_id = $1`;
        if (cycle_id) { sql += ` AND cycle_id = $${params.length + 1}`; params.push(parseInt(cycle_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY id DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cssd/load-items', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { cycle_id, set_id, set_name, barcode, status, used_in_surgery_id, used_date, quantity, notes } = req.body;
        if (!cycle_id) return res.status(400).json({ ok: false, error: 'cycle_id_required' });
        const r = await db.query(
            `INSERT INTO cssd_load_items (cycle_id, set_id, set_name, barcode, status, used_in_surgery_id, used_date, notes, tenant_id, quantity)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [parseInt(cycle_id), set_id || null, set_name || null, barcode || null,
             status || 'sterile', used_in_surgery_id || null, used_date || null,
             notes || null, req.tenantId, quantity || 1]
        );
        res.status(201).json({ ok: true, item: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CSSD: INSTRUMENT SETS =====
router.get('/cssd/instrument-sets', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { category, status, department, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM cssd_instrument_sets WHERE tenant_id = $1`;
        if (category) { sql += ` AND category = $${params.length + 1}`; params.push(category); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        sql += ` ORDER BY set_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/cssd/instrument-sets', requireAuth, requireTenantScope, requireRole('staff'), async (req, res) => {
    try {
        const { set_name, set_name_ar, set_code, category, instrument_count, instruments_list, department, status, notes } = req.body;
        if (!set_name) return res.status(400).json({ ok: false, error: 'set_name_required' });
        const r = await db.query(
            `INSERT INTO cssd_instrument_sets (set_name, set_name_ar, set_code, category, instrument_count, instruments_list, department, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [set_name, set_name_ar || null, set_code || null, category || null,
             instrument_count || 0, instruments_list || null, department || null,
             status || 'available', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, set: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CSSD: UTILITIES =====
router.get('/cssd/cycle-validation', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { bi_test_result, ci_result } = req.query;
        res.json({ ok: true, validation: cssdCycleValidation(bi_test_result, ci_result) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MAINTENANCE: EQUIPMENT =====
router.get('/maintenance/equipment', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, department, category, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM maintenance_equipment WHERE tenant_id = $1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (department) { sql += ` AND department = $${params.length + 1}`; params.push(department); }
        if (category) { sql += ` AND category = $${params.length + 1}`; params.push(category); }
        sql += ` ORDER BY equipment_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/maintenance/equipment', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { equipment_name, equipment_name_ar, equipment_code, category, manufacturer, model, serial_number, department, location, purchase_date, warranty_end, last_calibration, next_calibration, last_pm, next_pm, status, notes } = req.body;
        if (!equipment_name) return res.status(400).json({ ok: false, error: 'equipment_name_required' });
        const r = await db.query(
            `INSERT INTO maintenance_equipment (equipment_name, equipment_name_ar, equipment_code, category, manufacturer, model, serial_number, department, location, purchase_date, warranty_end, last_calibration, next_calibration, last_pm, next_pm, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
            [equipment_name, equipment_name_ar || null, equipment_code || null, category || null,
             manufacturer || null, model || null, serial_number || null, department || null,
             location || null, purchase_date || null, warranty_end || null,
             last_calibration || null, next_calibration || null, last_pm || null, next_pm || null,
             status || 'operational', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, equipment: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MAINTENANCE: PM SCHEDULES =====
router.get('/maintenance/pm-schedules', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { equipment_id, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM maintenance_pm_schedules WHERE tenant_id = $1`;
        if (equipment_id) { sql += ` AND equipment_id = $${params.length + 1}`; params.push(parseInt(equipment_id)); }
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY next_due NULLS LAST LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(p => ({ ...p, compliance: pmCompliance(p.next_due) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/maintenance/pm-schedules', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { equipment_id, pm_type, frequency, last_done, next_due, performed_by, checklist, status, notes } = req.body;
        if (!equipment_id) return res.status(400).json({ ok: false, error: 'equipment_id_required' });
        if (frequency && !VALID_PM_FREQ.includes(frequency)) return res.status(400).json({ ok: false, error: 'invalid_frequency', valid: VALID_PM_FREQ });
        const r = await db.query(
            `INSERT INTO maintenance_pm_schedules (equipment_id, pm_type, frequency, last_done, next_due, performed_by, checklist, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [parseInt(equipment_id), pm_type || null, frequency || 'monthly',
             last_done || null, next_due || null, performed_by || null,
             checklist || null, status || 'scheduled', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, schedule: r.rows[0], compliance: pmCompliance(next_due) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MAINTENANCE: WORK ORDERS =====
router.get('/maintenance/work-orders', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, priority, equipment_id, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM maintenance_work_orders WHERE tenant_id = $1`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        if (priority) { sql += ` AND priority = $${params.length + 1}`; params.push(priority); }
        if (equipment_id) { sql += ` AND equipment_id = $${params.length + 1}`; params.push(parseInt(equipment_id)); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(w => ({ ...w, sla_hours: woSLA(w.priority, w.scheduled_date) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/maintenance/work-orders', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { wo_number, request_type, priority, department, location, equipment_id, description, description_ar, requested_by, assigned_to, scheduled_date, cost, status } = req.body;
        if (!wo_number) return res.status(400).json({ ok: false, error: 'wo_number_required' });
        if (priority && !VALID_WO_PRIORITY.includes(priority)) return res.status(400).json({ ok: false, error: 'invalid_priority', valid: VALID_WO_PRIORITY });
        const r = await db.query(
            `INSERT INTO maintenance_work_orders (wo_number, request_type, priority, department, location, equipment_id, description, description_ar, requested_by, assigned_to, scheduled_date, cost, status, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
            [wo_number, request_type || 'corrective', priority || 'medium',
             department || null, location || null, equipment_id || null,
             description || null, description_ar || null, requested_by || null,
             assigned_to || null, scheduled_date || null, cost || null,
             status || 'open', req.tenantId]
        );
        res.status(201).json({ ok: true, work_order: r.rows[0], sla_hours: woSLA(priority, scheduled_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MAINTENANCE: DEVICE CALIBRATIONS =====
router.get('/maintenance/calibrations', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { status, days = 90, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM device_calibrations WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'`;
        if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY calibration_date DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(c => ({ ...c, days_to_next: daysToExpiry(c.next_calibration_date) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/maintenance/calibrations', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { device_name, serial_number, calibration_date, next_calibration_date, calibrated_by, status, notes } = req.body;
        if (!device_name) return res.status(400).json({ ok: false, error: 'device_name_required' });
        const r = await db.query(
            `INSERT INTO device_calibrations (device_name, serial_number, calibration_date, next_calibration_date, calibrated_by, status, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [device_name, serial_number || null, calibration_date || null,
             next_calibration_date || null, calibrated_by || null,
             status || 'valid', notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, calibration: r.rows[0], days_to_next: daysToExpiry(next_calibration_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== MAINTENANCE: UTILITIES =====
router.get('/pm-compliance', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { next_due } = req.query;
        if (!next_due) return res.status(400).json({ ok: false, error: 'next_due_required' });
        res.json({ ok: true, compliance: pmCompliance(next_due) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== VENDORS =====
router.get('/vendors', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { vendor_type, is_active, is_approved, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM vendors WHERE tenant_id = $1`;
        if (vendor_type) { sql += ` AND vendor_type = $${params.length + 1}`; params.push(vendor_type); }
        if (is_active !== undefined) { sql += ` AND is_active = $${params.length + 1}`; params.push(is_active === 'true'); }
        if (is_approved !== undefined) { sql += ` AND is_approved = $${params.length + 1}`; params.push(is_approved === 'true'); }
        sql += ` ORDER BY vendor_name_en LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(v => ({
            ...v,
            rating_label: vendorRating(v.rating),
            credit_utilization_pct: creditUtilization(v.total_outstanding, v.credit_limit)
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/vendors', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const { vendor_code, vendor_name_ar, vendor_name_en, vendor_type, contact_person, phone, email, address, city, country, vat_number, commercial_register, iban, bank_name, payment_terms, currency, credit_limit, rating, is_approved, contract_start, contract_end, notes } = req.body;
        if (!vendor_name_en) return res.status(400).json({ ok: false, error: 'vendor_name_en_required' });
        if (vendor_type && !VALID_VENDOR_TYPE.includes(vendor_type)) return res.status(400).json({ ok: false, error: 'invalid_vendor_type', valid: VALID_VENDOR_TYPE });
        const r = await db.query(
            `INSERT INTO vendors (vendor_code, vendor_name_ar, vendor_name_en, vendor_type, contact_person, phone, email, address, city, country, vat_number, commercial_register, iban, bank_name, payment_terms, currency, credit_limit, rating, is_approved, approved_by, contract_start, contract_end, notes, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24) RETURNING *`,
            [vendor_code || null, vendor_name_ar || null, vendor_name_en, vendor_type || 'other',
             contact_person || null, phone || null, email || null, address || null,
             city || null, country || null, vat_number || null, commercial_register || null,
             iban || null, bank_name || null, payment_terms || 30, currency || 'SAR',
             credit_limit || 0, rating || null, is_approved ? true : false,
             req.user?.username || null, contract_start || null, contract_end || null,
             notes || null, req.tenantId]
        );
        res.status(201).json({ ok: true, vendor: r.rows[0], rating_label: vendorRating(rating), credit_utilization_pct: creditUtilization(0, credit_limit) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== VENDOR: UTILITIES =====
router.get('/vendor-rating', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { rating } = req.query;
        res.json({ ok: true, label: vendorRating(rating) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/credit-utilization', requireAuth, requireTenantScope, (req, res) => {
    try {
        const { outstanding, limit } = req.query;
        if (outstanding === undefined || limit === undefined) return res.status(400).json({ ok: false, error: 'both_required' });
        res.json({ ok: true, utilization_pct: creditUtilization(parseFloat(outstanding), parseFloat(limit)) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== STATS =====
router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const donors = await db.query(`SELECT blood_type, COUNT(*) AS count FROM blood_bank_donors WHERE tenant_id = $1 AND is_eligible = 1 GROUP BY blood_type`, [req.tenantId]);
        const units = await db.query(`SELECT blood_type, status, COUNT(*) AS count FROM blood_bank_units WHERE tenant_id = $1 GROUP BY blood_type, status`, [req.tenantId]);
        const reactions = await db.query(`SELECT severity, COUNT(*) AS count FROM blood_bank_transfusion_reactions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '30 days' GROUP BY severity`, [req.tenantId]);
        const cssd = await db.query(`SELECT status, COUNT(*) AS count FROM cssd_sterilization_cycles WHERE tenant_id = $1 AND start_time >= NOW() - INTERVAL '30 days' GROUP BY status`, [req.tenantId]);
        const wo = await db.query(`SELECT status, priority, COUNT(*) AS count FROM maintenance_work_orders WHERE tenant_id = $1 GROUP BY status, priority`, [req.tenantId]);
        const pm = await db.query(`SELECT status, COUNT(*) AS count FROM maintenance_pm_schedules WHERE tenant_id = $1 GROUP BY status`, [req.tenantId]);
        const vend = await db.query(`SELECT vendor_type, COUNT(*) AS count FROM vendors WHERE tenant_id = $1 AND is_active = true GROUP BY vendor_type`, [req.tenantId]);
        res.json({
            ok: true,
            blood: { donors_by_type: donors.rows, units_by_type_status: units.rows, recent_reactions: reactions.rows },
            cssd: cssd.rows,
            maintenance: { work_orders: wo.rows, pm_schedules: pm.rows },
            vendors: vend.rows
        });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
