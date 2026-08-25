// filepath: namaweb/bloodbank_router.js
// Blood bank: units inventory + donors + crossmatch + transfusion + reaction monitoring.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// ABO compat matrix (recipient → donor)
const COMPAT = {
    'O-': ['O-'], 'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'], 'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'], 'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
};

// Inventory of units
router.get('/units', requireAuth, requireTenantScope, requireRole('lab_tech', 'doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { blood_type, status } = req.query;
        let sql = `SELECT id, bag_number, blood_type, rh_factor, component, collection_date, expiry_date, volume_ml, status, storage_location
                   FROM blood_bank_units WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (blood_type) { params.push(blood_type); sql += ` AND blood_type = $${params.length}`; }
        if (status) { params.push(status); sql += ` AND status = $${params.length}`; }
        sql += ` ORDER BY expiry_date ASC LIMIT 500`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, units: r.rows });
    } catch (err) { console.error('GET /api/bb/units', err); res.status(500).json({ error: 'internal_error' }); }
});

// Expiring-soon units (within N days)
router.get('/expiring', requireAuth, requireTenantScope, requireRole('lab_tech', 'admin'), async (req, res) => {
    try {
        const days = +(req.query.days || 7);
        const r = await db.query(`
            SELECT id, bag_number, blood_type, component, expiry_date, EXTRACT(DAY FROM (expiry_date::timestamp - NOW())) as days_left
            FROM blood_bank_units WHERE tenant_id = $1 AND status = 'available' AND expiry_date <= NOW() + ($2 || ' days')::interval
            ORDER BY expiry_date ASC LIMIT 100
        `, [req.tenantId, days]);
        res.json({ ok: true, total: r.rows.length, units: r.rows });
    } catch (err) { console.error('GET /api/bb/expiring', err); res.status(500).json({ error: 'internal_error' }); }
});

// Compatibility check
router.get('/compat/:recipient_type', requireAuth, requireTenantScope, requireRole('lab_tech', 'doctor'), async (req, res) => {
    const compatible = COMPAT[req.params.recipient_type] || [];
    res.json({ ok: true, recipient: req.params.recipient_type, compatible_donor_types: compatible });
});

// Donor registry
router.post('/donors', requireAuth, requireTenantScope, requireRole('lab_tech', 'admin'), async (req, res) => {
    try {
        const { donor_name, donor_name_ar, national_id, phone, blood_type, rh_factor, age, gender, last_donation_date, medical_history, notes } = req.body;
        if (!donor_name || !blood_type) return res.status(400).json({ error: 'missing_required' });
        const eligible = age && +age >= 18 && +age <= 65 && (!last_donation_date || (Date.now() - new Date(last_donation_date).getTime()) / (1000 * 60 * 60 * 24 * 56) >= 1);
        const r = await db.query(`
            INSERT INTO blood_bank_donors (tenant_id, donor_name, donor_name_ar, national_id, phone, blood_type, rh_factor, age, gender, last_donation_date, is_eligible, medical_history, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id
        `, [req.tenantId, donor_name, donor_name_ar || '', national_id || '', phone || '', blood_type, rh_factor || '+', age || null, gender || '', last_donation_date || null, eligible, medical_history || '', notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id, is_eligible: eligible });
    } catch (err) { console.error('POST /api/bb/donors', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/donors', requireAuth, requireTenantScope, requireRole('lab_tech', 'doctor', 'admin'), async (req, res) => {
    try {
        const { blood_type, eligible_only } = req.query;
        let sql = `SELECT id, donor_name, donor_name_ar, national_id, phone, blood_type, rh_factor, age, gender, last_donation_date, is_eligible FROM blood_bank_donors WHERE tenant_id = $1`;
        const params = [req.tenantId];
        if (blood_type) { params.push(blood_type); sql += ` AND blood_type = $${params.length}`; }
        if (eligible_only === 'true') sql += ` AND is_eligible = true`;
        sql += ` ORDER BY donor_name ASC LIMIT 200`;
        const r = await db.query(sql, params);
        res.json({ ok: true, total: r.rows.length, donors: r.rows });
    } catch (err) { console.error('GET /api/bb/donors', err); res.status(500).json({ error: 'internal_error' }); }
});

// Crossmatch (anti-A/anti-B + antibody screen)
router.post('/crossmatch', requireAuth, requireTenantScope, requireRole('lab_tech'), async (req, res) => {
    try {
        const { patient_id, patient_name, patient_blood_type, unit_id, units_needed, surgery_id, notes, lab_technician } = req.body;
        if (!patient_id || !patient_blood_type || !unit_id) return res.status(400).json({ error: 'missing_required' });
        // Look up unit
        const u = await db.query(`SELECT blood_type, status FROM blood_bank_units WHERE tenant_id = $1 AND id = $2`, [req.tenantId, unit_id]);
        if (!u.rows.length) return res.status(404).json({ error: 'unit_not_found' });
        const donorType = u.rows[0].blood_type;
        const compatible = (COMPAT[patient_blood_type] || []).includes(donorType);
        const result = compatible ? 'compatible' : 'incompatible';
        const r = await db.query(`
            INSERT INTO blood_bank_crossmatch (tenant_id, patient_id, patient_name, patient_blood_type, unit_id, units_needed, surgery_id, lab_technician, result, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', patient_blood_type, unit_id, units_needed || 1, surgery_id || null, lab_technician || req.userName || '', result, notes || '']);
        // If compatible, mark unit as reserved
        if (compatible) {
            await db.query(`UPDATE blood_bank_units SET status = 'reserved' WHERE tenant_id = $1 AND id = $2`, [req.tenantId, unit_id]);
        }
        res.status(201).json({ ok: true, id: r.rows[0].id, compatible, result });
    } catch (err) { console.error('POST /api/bb/crossmatch', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/crossmatch/:patient_id', requireAuth, requireTenantScope, requireRole('lab_tech', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_blood_type, unit_id, units_needed, surgery_id, result, lab_technician, created_at
            FROM blood_bank_crossmatch WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, crossmatches: r.rows });
    } catch (err) { console.error('GET /api/bb/crossmatch', err); res.status(500).json({ error: 'internal_error' }); }
});

// Transfusion administration
router.post('/transfusion', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, unit_id, bag_number, blood_type, component, start_time, end_time, volume_ml, vital_signs_before, vital_signs_after, administered_by, notes } = req.body;
        if (!patient_id || !unit_id || !start_time) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO blood_bank_transfusions (tenant_id, patient_id, patient_name, unit_id, bag_number, blood_type, component, administered_by, start_time, end_time, volume_ml, vital_signs_before, vital_signs_after, adverse_reaction, notes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,false,$14) RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', unit_id, bag_number || '', blood_type || '', component || 'PRBC', administered_by || req.userName || '', start_time, end_time || null, volume_ml || null, vital_signs_before || '', vital_signs_after || '', notes || '']);
        // Mark unit as used
        await db.query(`UPDATE blood_bank_units SET status = 'transfused' WHERE tenant_id = $1 AND id = $2`, [req.tenantId, unit_id]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/bb/transfusion', err); res.status(500).json({ error: 'internal_error' }); }
});

// Transfusion reaction
router.post('/reaction', requireAuth, requireTenantScope, requireRole('nurse', 'doctor'), async (req, res) => {
    try {
        const { transfusion_id, unit_id, patient_id, reaction_type, severity, reaction_details, vital_signs_after, action_taken, reported_by } = req.body;
        if (!transfusion_id || !patient_id || !reaction_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO blood_bank_transfusion_reactions (tenant_id, transfusion_id, unit_id, patient_id, reaction_type, severity, reaction_details, vital_signs_after, action_taken, reported_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id
        `, [req.tenantId, transfusion_id, unit_id || null, patient_id, reaction_type, severity || 'moderate', reaction_details || '', vital_signs_after || '', action_taken || '', reported_by || req.userName || '']);
        // Flag the transfusion as having a reaction
        if (transfusion_id) {
            await db.query(`UPDATE blood_bank_transfusions SET adverse_reaction = true, reaction_details = $2 WHERE tenant_id = $1 AND id = $3`, [req.tenantId, reaction_details || '', transfusion_id]);
        }
        res.status(201).json({ ok: true, id: r.rows[0].id, severity_flag: severity });
    } catch (err) { console.error('POST /api/bb/reaction', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/reactions', requireAuth, requireTenantScope, requireRole('blood_bank_director', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, transfusion_id, unit_id, patient_id, reaction_type, severity, reported_by, created_at
            FROM blood_bank_transfusion_reactions WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, reactions: r.rows });
    } catch (err) { console.error('GET /api/bb/reactions', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/inventory-summary', requireAuth, requireTenantScope, requireRole('blood_bank_director', 'admin', 'lab_tech'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT blood_type, rh_factor, status, COUNT(*) as unit_count, SUM(volume_ml) as total_volume_ml
            FROM blood_bank_units WHERE tenant_id = $1 GROUP BY blood_type, rh_factor, status ORDER BY blood_type, status
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, inventory: r.rows });
    } catch (err) { console.error('GET /api/bb/inventory-summary', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['units', 'donors', 'crossmatch', 'transfusion', 'reaction', 'inventory-summary'], timestamp: new Date().toISOString() });
});

module.exports = router;
