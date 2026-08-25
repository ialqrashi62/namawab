'use strict';
// Wave 101 — Blood Bank: units + donors + crossmatch + transfusions + reactions
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

const VALID_BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const VALID_RH = ['+','-'];
const VALID_COMPONENTS = ['whole_blood','prbc','platelets','ffp','cryoprecipitate','granulocytes','plasma'];
const VALID_UNIT_STATUS = ['available','reserved','in_use','transfused','expired','discarded','quarantine'];
const VALID_CROSSMATCH = ['compatible','incompatible','inconclusive'];
const VALID_REACTION = ['febrile_non_hemolytic','allergic_urticarial','anaphylactic','acute_hemolytic','delayed_hemolytic','TRALI','TACO','bacterial_contamination','other'];
const VALID_SEVERITY = ['mild','moderate','severe','life_threatening','fatal'];

function daysUntil(date) {
    if (!date) return null;
    return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

function compatibilityCheck(patientType, unitType) {
    if (!patientType || !unitType) return { compatible: null, note: 'unknown' };
    const compatibleMap = {
        'O-': ['O-'],
        'O+': ['O-','O+'],
        'A-': ['O-','A-'],
        'A+': ['O-','O+','A-','A+'],
        'B-': ['O-','B-'],
        'B+': ['O-','O+','B-','B+'],
        'AB-': ['O-','A-','B-','AB-'],
        'AB+': ['O-','O+','A-','A+','B-','B+','AB-','AB+']
    };
    return { compatible: (compatibleMap[patientType] || []).includes(unitType), note: compatibleMap[patientType] ? '' : 'no_recipient_data' };
}

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'blood-bank',
        endpoints: [
            'GET /units',
            'GET /units/:id',
            'POST /units',
            'PUT /units/:id',
            'GET /units/expiring',
            'GET /units/available',
            'GET /donors',
            'POST /donors',
            'GET /crossmatch',
            'POST /crossmatch',
            'POST /crossmatch/:id/compatibility-check',
            'GET /transfusions',
            'POST /transfusions',
            'GET /transfusions/patient/:patientId',
            'GET /reactions',
            'POST /reactions',
            'GET /reactions/critical',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

// ===== UNITS =====
router.get('/units', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { blood_type, component, status, limit = 200 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT u.*, d.donor_name FROM blood_bank_units u LEFT JOIN blood_bank_donors d ON d.id = u.donor_id WHERE u.tenant_id = $1`;
        if (blood_type) { sql += ` AND u.blood_type = $${params.length + 1}`; params.push(blood_type); }
        if (component) { sql += ` AND u.component = $${params.length + 1}`; params.push(component); }
        if (status) { sql += ` AND u.status = $${params.length + 1}`; params.push(status); }
        sql += ` ORDER BY u.expiry_date ASC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(x => ({ ...x, days_to_expiry: daysUntil(x.expiry_date) }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/units/:id', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM blood_bank_units WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'unit_not_found' });
        res.json({ ok: true, unit: r.rows[0], days_to_expiry: daysUntil(r.rows[0].expiry_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/units', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { bag_number, blood_type, rh_factor, component, donor_id, collection_date = new Date(), expiry_date, volume_ml, storage_location, created_by } = req.body;
        if (!bag_number) return res.status(400).json({ ok: false, error: 'bag_number_required' });
        if (!blood_type || !VALID_BLOOD_TYPES.includes(blood_type)) return res.status(400).json({ ok: false, error: 'invalid_blood_type' });
        if (!component || !VALID_COMPONENTS.includes(component)) return res.status(400).json({ ok: false, error: 'invalid_component' });
        if (!expiry_date) return res.status(400).json({ ok: false, error: 'expiry_date_required' });

        const r = await db.query(
            `INSERT INTO blood_bank_units (bag_number, blood_type, rh_factor, component, donor_id, collection_date, expiry_date, volume_ml, status, storage_location, created_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'available',$9,$10,$11) RETURNING *`,
            [bag_number, blood_type, rh_factor || blood_type.slice(-1), component, donor_id || null, collection_date, expiry_date,
             volume_ml || 450, storage_location || null, created_by || req.user?.id || null, req.tenantId]
        );
        res.status(201).json({ ok: true, unit: r.rows[0], days_to_expiry: daysUntil(r.rows[0].expiry_date) });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/units/:id', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const allowed = ['status','storage_location','notes'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) {
                if (k === 'status' && !VALID_UNIT_STATUS.includes(req.body[k])) return res.status(400).json({ ok: false, error: 'invalid_status' });
                sets.push(`${k} = $${i++}`); params.push(req.body[k]);
            }
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        sets.push(`updated_at = NOW()`);
        const r = await db.query(`UPDATE blood_bank_units SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`, params);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'unit_not_found' });
        res.json({ ok: true, unit: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/units/expiring', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { days = 7 } = req.query;
        const r = await db.query(
            `SELECT u.*, d.donor_name FROM blood_bank_units u LEFT JOIN blood_bank_donors d ON d.id = u.donor_id
             WHERE u.tenant_id = $1 AND u.status = 'available' AND u.expiry_date <= NOW() + ($2 || ' days')::INTERVAL ORDER BY u.expiry_date ASC`,
            [req.tenantId, days]
        );
        const enriched = r.rows.map(x => ({ ...x, days_to_expiry: daysUntil(x.expiry_date) }));
        res.json({ ok: true, threshold_days: parseInt(days), count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/units/available', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { blood_type, component } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT id, bag_number, blood_type, component, expiry_date, storage_location, volume_ml FROM blood_bank_units
                   WHERE tenant_id = $1 AND status = 'available' AND expiry_date > NOW()`;
        if (blood_type) { sql += ` AND blood_type = $${params.length + 1}`; params.push(blood_type); }
        if (component) { sql += ` AND component = $${params.length + 1}`; params.push(component); }
        sql += ` ORDER BY expiry_date ASC LIMIT 100`;
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== DONORS =====
router.get('/donors', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { blood_type, is_eligible, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM blood_bank_donors WHERE tenant_id = $1`;
        if (blood_type) { sql += ` AND blood_type = $${params.length + 1}`; params.push(blood_type); }
        if (is_eligible !== undefined) { sql += ` AND is_eligible = $${params.length + 1}`; params.push(is_eligible === 'true'); }
        sql += ` ORDER BY donor_name LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/donors', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { donor_name, donor_name_ar, national_id, phone, blood_type, rh_factor, age, gender, medical_history, is_eligible = true, created_by } = req.body;
        if (!donor_name) return res.status(400).json({ ok: false, error: 'donor_name_required' });
        if (blood_type && !VALID_BLOOD_TYPES.includes(blood_type)) return res.status(400).json({ ok: false, error: 'invalid_blood_type' });
        if (age !== undefined && (age < 18 || age > 70)) return res.status(400).json({ ok: false, error: 'donor_age_out_of_range' });

        const r = await db.query(
            `INSERT INTO blood_bank_donors (donor_name, donor_name_ar, national_id, phone, blood_type, rh_factor, age, gender, medical_history, is_eligible, created_by, tenant_id)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [donor_name, donor_name_ar || null, national_id || null, phone || null, blood_type || null,
             rh_factor || (blood_type ? blood_type.slice(-1) : null), age || null, gender || null,
             medical_history ? JSON.stringify(medical_history) : null, is_eligible,
             created_by || req.user?.id || null, req.tenantId]
        );
        res.status(201).json({ ok: true, donor: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== CROSSMATCH =====
router.get('/crossmatch', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { patient_id, unit_id, result, surgery_id, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM blood_bank_crossmatch WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (unit_id) { sql += ` AND unit_id = $${params.length + 1}`; params.push(unit_id); }
        if (result) { sql += ` AND result = $${params.length + 1}`; params.push(result); }
        if (surgery_id) { sql += ` AND surgery_id = $${params.length + 1}`; params.push(surgery_id); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/crossmatch', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { patient_id, patient_name, patient_blood_type, units_needed = 1, unit_id, surgery_id, notes, created_by } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (patient_blood_type && !VALID_BLOOD_TYPES.includes(patient_blood_type)) return res.status(400).json({ ok: false, error: 'invalid_patient_blood_type' });

        const r = await db.query(
            `INSERT INTO blood_bank_crossmatch (tenant_id, patient_id, patient_name, patient_blood_type, units_needed, unit_id, surgery_id, notes, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [req.tenantId, patient_id, patient_name || null, patient_blood_type || null, units_needed,
             unit_id || null, surgery_id || null, notes || null, created_by || req.user?.id || null]
        );
        res.status(201).json({ ok: true, crossmatch: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/crossmatch/:id/compatibility-check', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { result } = req.body;
        if (!result) return res.status(400).json({ ok: false, error: 'result_required' });
        if (!VALID_CROSSMATCH.includes(result)) return res.status(400).json({ ok: false, error: 'invalid_crossmatch_result' });

        const cm = await db.query(`SELECT * FROM blood_bank_crossmatch WHERE tenant_id = $1 AND id = $2`, [req.tenantId, req.params.id]);
        if (!cm.rows.length) return res.status(404).json({ ok: false, error: 'crossmatch_not_found' });
        const row = cm.rows[0];

        let unitType = null;
        if (row.unit_id) {
            const u = await db.query(`SELECT blood_type FROM blood_bank_units WHERE tenant_id = $1 AND id = $2`, [req.tenantId, row.unit_id]);
            if (u.rows.length) unitType = u.rows[0].blood_type;
        }
        const compat = compatibilityCheck(row.patient_blood_type, unitType);

        const r = await db.query(
            `UPDATE blood_bank_crossmatch SET result = $3, notes = COALESCE($4, notes) || ' [Auto-check: ' || $5 || ']' WHERE tenant_id = $1 AND id = $2 RETURNING *`,
            [req.tenantId, req.params.id, result, req.body.notes || null, `type_check:${compat.compatible ? 'match' : 'mismatch'}`]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'crossmatch_not_found' });
        res.json({ ok: true, crossmatch: r.rows[0], auto_compatibility: compat });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== TRANSFUSIONS =====
router.get('/transfusions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, blood_type, adverse_reaction, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM blood_bank_transfusions WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (blood_type) { sql += ` AND blood_type = $${params.length + 1}`; params.push(blood_type); }
        if (adverse_reaction !== undefined) { sql += ` AND adverse_reaction = $${params.length + 1}`; params.push(adverse_reaction === 'true'); }
        sql += ` ORDER BY start_time DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        const enriched = r.rows.map(x => ({
            ...x,
            duration_minutes: x.start_time && x.end_time ? Math.round((new Date(x.end_time) - new Date(x.start_time)) / 60000) : null
        }));
        res.json({ ok: true, count: enriched.length, rows: enriched });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/transfusions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, unit_id, crossmatch_id, administered_by, start_time = new Date(), volume_ml, vital_signs_before, notes } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!unit_id) return res.status(400).json({ ok: false, error: 'unit_id_required' });

        const unit = await db.query(`SELECT * FROM blood_bank_units WHERE tenant_id = $1 AND id = $2`, [req.tenantId, unit_id]);
        if (!unit.rows.length) return res.status(404).json({ ok: false, error: 'unit_not_found' });
        const u = unit.rows[0];
        if (u.status !== 'available') return res.status(409).json({ ok: false, error: 'unit_not_available', current_status: u.status });

        const r = await db.query(
            `INSERT INTO blood_bank_transfusions (tenant_id, patient_id, patient_name, unit_id, bag_number, blood_type, component, administered_by, start_time, volume_ml, vital_signs_before, notes, crossmatch_id, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
            [req.tenantId, patient_id, patient_name || null, unit_id, u.bag_number, u.blood_type, u.component,
             administered_by || req.user?.id || null, start_time, volume_ml || u.volume_ml,
             vital_signs_before ? JSON.stringify(vital_signs_before) : null, notes || null,
             crossmatch_id || null, req.user?.id || null]
        );
        await db.query(`UPDATE blood_bank_units SET status = 'in_use', updated_at = NOW() WHERE tenant_id = $1 AND id = $2`, [req.tenantId, unit_id]);
        res.status(201).json({ ok: true, transfusion: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/transfusions/patient/:patientId', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM blood_bank_transfusions WHERE tenant_id = $1 AND patient_id = $2 ORDER BY start_time DESC LIMIT 30`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ===== REACTIONS =====
router.get('/reactions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, severity, limit = 100 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT * FROM blood_bank_transfusion_reactions WHERE tenant_id = $1`;
        if (patient_id) { sql += ` AND patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/reactions', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { transfusion_id, unit_id, patient_id, reaction_type, severity, reaction_details, vital_signs_after, action_taken, reported_by, created_by } = req.body;
        if (!transfusion_id) return res.status(400).json({ ok: false, error: 'transfusion_id_required' });
        if (!reaction_type) return res.status(400).json({ ok: false, error: 'reaction_type_required' });
        if (!VALID_REACTION.includes(reaction_type)) return res.status(400).json({ ok: false, error: 'invalid_reaction_type' });
        if (severity && !VALID_SEVERITY.includes(severity)) return res.status(400).json({ ok: false, error: 'invalid_severity' });

        const r = await db.query(
            `INSERT INTO blood_bank_transfusion_reactions (tenant_id, transfusion_id, unit_id, patient_id, reaction_type, severity, reaction_details, vital_signs_after, action_taken, reported_by, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [req.tenantId, transfusion_id, unit_id || null, patient_id || null, reaction_type, severity || 'moderate',
             reaction_details || null, vital_signs_after ? JSON.stringify(vital_signs_after) : null,
             action_taken || null, reported_by || req.user?.full_name || null, created_by || req.user?.id || null]
        );
        await db.query(`UPDATE blood_bank_transfusions SET adverse_reaction = true, reaction_details = $3 WHERE tenant_id = $1 AND id = $2`, [req.tenantId, transfusion_id, reaction_type]);
        res.status(201).json({ ok: true, reaction: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/reactions/critical', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM blood_bank_transfusion_reactions WHERE tenant_id = $1 AND severity IN ('severe','life_threatening','fatal') ORDER BY created_at DESC LIMIT 100`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows, alert: 'Critical transfusion reactions require immediate clinical review (hemovigilance).' });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const u = await db.query(
            `SELECT status, blood_type, COUNT(*) AS count FROM blood_bank_units WHERE tenant_id = $1 GROUP BY status, blood_type ORDER BY status, blood_type`,
            [req.tenantId]
        );
        const t = await db.query(
            `SELECT COUNT(*) AS total_transfusions, COUNT(*) FILTER (WHERE adverse_reaction = true) AS with_reactions,
                    SUM(volume_ml) AS total_volume_ml
             FROM blood_bank_transfusions WHERE tenant_id = $1 AND start_time >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const r = await db.query(
            `SELECT severity, COUNT(*) AS count FROM blood_bank_transfusion_reactions WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days' GROUP BY severity ORDER BY count DESC`,
            [req.tenantId]
        );
        res.json({ ok: true, units: u.rows, transfusions_90d: t.rows[0], reactions_90d: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
