// filepath: namaweb/adt_router.js
// ADT — Admission / Discharge / Transfer orchestration.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Active admissions list
router.get('/admissions', requireAuth, requireTenantScope, requireRole('nurse', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, patient_name, admission_type, admission_date, admitting_doctor,
                   department, ward_id, bed_id, diagnosis, icd10_code, status, expected_los, insurance_auth
            FROM admissions WHERE tenant_id = $1 AND status = 'active'
            ORDER BY admission_date DESC LIMIT 200
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, admissions: r.rows });
    } catch (err) { console.error('GET /api/adt/admissions', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/admission/:id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT * FROM admissions WHERE tenant_id = $1 AND id = $2
        `, [req.tenantId, req.params.id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, admission: r.rows[0] });
    } catch (err) { console.error('GET /api/adt/admission', err); res.status(500).json({ error: 'internal_error' }); }
});

// Admission create (inpatient admit)
router.post('/admit', requireAuth, requireTenantScope, requireRole('doctor', 'admission_clerk'), async (req, res) => {
    try {
        const { patient_id, patient_name, admission_type, admission_date, admitting_doctor, attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code, diet_order, activity_level, dvt_prophylaxis, expected_los, insurance_auth } = req.body;
        if (!patient_id || !admission_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO admissions (tenant_id, patient_id, patient_name, admission_type, admission_date, admitting_doctor, attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code, diet_order, activity_level, dvt_prophylaxis, expected_los, insurance_auth, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'active') RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', admission_type || 'planned', admission_date, admitting_doctor || '', attending_doctor || '', department || '', ward_id || null, bed_id || null, diagnosis || '', icd10_code || '', diet_order || '', activity_level || '', dvt_prophylaxis || false, expected_los || null, insurance_auth || null]);
        // Update bed to occupied (best-effort)
        if (bed_id) {
            try { await db.query(`UPDATE beds SET status = 'occupied', current_patient_id = $2 WHERE tenant_id = $1 AND id = $3`, [req.tenantId, patient_id, bed_id]); } catch (_) { /* beds schema differs */ }
        }
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/adt/admit', err); res.status(500).json({ error: 'internal_error' }); }
});

// Transfer within hospital
router.post('/transfer', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by, transfer_date } = req.body;
        if (!admission_id || !patient_id || !to_ward) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO bed_transfers (tenant_id, admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by, transfer_date)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,COALESCE($10, NOW())) RETURNING id
        `, [req.tenantId, admission_id, patient_id, from_ward || null, from_bed || null, to_ward, to_bed || null, transfer_reason || '', transferred_by || req.userName || '', transfer_date || null]);
        await db.query(`UPDATE admissions SET ward_id = $2, bed_id = $3 WHERE tenant_id = $1 AND id = $4`, [req.tenantId, to_ward, to_bed || null, admission_id]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/adt/transfer', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/transfers/:patient_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, admission_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by, transfer_date
            FROM bed_transfers WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY transfer_date DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, transfers: r.rows });
    } catch (err) { console.error('GET /api/adt/transfers', err); res.status(500).json({ error: 'internal_error' }); }
});

// Discharge (live & pre-built)
router.post('/discharge', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { id, discharge_date, discharge_type, discharge_summary, discharge_instructions, discharge_medications, followup_date, followup_doctor } = req.body;
        if (!id) return res.status(400).json({ error: 'missing_required_id' });
        const r = await db.query(`
            UPDATE admissions
            SET discharge_date = $2, discharge_type = $3, discharge_summary = $4, discharge_instructions = $5,
                discharge_medications = $6, followup_date = $7, followup_doctor = $8, status = 'discharged'
            WHERE tenant_id = $1 AND id = $9 RETURNING patient_id, bed_id
        `, [req.tenantId, discharge_date || new Date().toISOString(), discharge_type || 'home', discharge_summary || '', discharge_instructions || '', discharge_medications || '', followup_date || null, followup_doctor || '', id]);
        if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
        // Free bed if exists
        if (r.rows[0].bed_id) {
            try { await db.query(`UPDATE beds SET status = 'cleaning', current_patient_id = NULL WHERE tenant_id = $1 AND id = $2`, [req.tenantId, r.rows[0].bed_id]); } catch (_) { /* bed schema differs */ }
        }
        res.json({ ok: true });
    } catch (err) { console.error('POST /api/adt/discharge', err); res.status(500).json({ error: 'internal_error' }); }
});

// Daily rounds (structured SOAPIER-style)
router.post('/rounds', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { admission_id, patient_id, round_date, round_time, doctor_name, subjective, objective, assessment, plan, vitals_summary, orders, diet_changes } = req.body;
        if (!admission_id || !patient_id || !round_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO admission_daily_rounds (tenant_id, admission_id, patient_id, round_date, round_time, doctor_name, subjective, objective, assessment, plan, vitals_summary, orders, diet_changes)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id
        `, [req.tenantId, admission_id, patient_id, round_date, round_time || null, doctor_name || req.userName || '', subjective || '', objective || '', assessment || '', plan || '', vitals_summary || '', orders || '', diet_changes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/adt/rounds', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/rounds/:admission_id', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, round_date, round_time, doctor_name, subjective, objective, assessment, plan, vitals_summary, orders, diet_changes
            FROM admission_daily_rounds WHERE tenant_id = $1 AND admission_id = $2
            ORDER BY round_date DESC, round_time DESC NULLS LAST LIMIT 60
        `, [req.tenantId, req.params.admission_id]);
        res.json({ ok: true, total: r.rows.length, rounds: r.rows });
    } catch (err) { console.error('GET /api/adt/rounds', err); res.status(500).json({ error: 'internal_error' }); }
});

// Inpatient census + LOS analytics
router.get('/census', requireAuth, requireTenantScope, requireRole('admin', 'doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT department, COUNT(*) as active_count, COUNT(*) FILTER (WHERE insurance_auth IS NOT NULL) as insured_count
            FROM admissions WHERE tenant_id = $1 AND status = 'active'
            GROUP BY department ORDER BY active_count DESC
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, departments: r.rows });
    } catch (err) { console.error('GET /api/adt/census', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/los-stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(discharge_date::timestamp, NOW()) - admission_date::timestamp))/86400)::numeric, 1) as avg_los_days,
                   MAX(EXTRACT(DAY FROM (COALESCE(discharge_date::timestamp, NOW()) - admission_date::timestamp))) as max_los_days,
                   COUNT(*) FILTER (WHERE discharge_date IS NULL) as current_inpatient,
                   COUNT(*) as total_30d
            FROM admissions WHERE tenant_id = $1 AND admission_date >= NOW() - INTERVAL '30 days'
        `, [req.tenantId]);
        const dis = await db.query(`
            SELECT discharge_type, COUNT(*) as cnt FROM admissions
            WHERE tenant_id = $1 AND discharge_date >= NOW() - INTERVAL '30 days' GROUP BY discharge_type
        `, [req.tenantId]);
        res.json({ ok: true, stats: r.rows[0], discharges_by_type: dis.rows });
    } catch (err) { console.error('GET /api/adt/los-stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['admissions', 'admit', 'transfer', 'discharge', 'rounds', 'census', 'los-stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
