// filepath: namaweb/encounter_router.js
// Patient encounters lifecycle: visit_lifecycle + admissions + transfers.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/lifecycle', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { status, stage, patient_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (stage) { params.push(stage); conditions.push(`stage = $${params.length}`); }
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, appointment_id, doctor, department, status, stage,
                   triage_level, pain_score, arrived_at, triage_at, consult_start, created_at
            FROM visit_lifecycle WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, visits: r.rows });
    } catch (err) { console.error('GET /api/encounter/lifecycle', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/admissions', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { status, department, admission_type } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (department) { params.push(department); conditions.push(`department = $${params.length}`); }
        if (admission_type) { params.push(admission_type); conditions.push(`admission_type = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, admission_type, admission_date, admitting_doctor,
                   attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code,
                   expected_los, insurance_auth, status, discharge_date, discharge_type, created_at
            FROM admissions WHERE ${conditions.join(' AND ')}
            ORDER BY admission_date DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, admissions: r.rows });
    } catch (err) { console.error('GET /api/encounter/admissions', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/admissions/current', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, patient_name, department, ward_id, bed_id, diagnosis, admitting_doctor,
                   attending_doctor, admission_date, expected_los, status
            FROM admissions WHERE tenant_id = $1 AND status = 'admitted'
            ORDER BY admission_date ASC LIMIT 200
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, current_admissions: r.rows });
    } catch (err) { console.error('GET /api/encounter/admissions/current', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/admissions', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { patient_id, patient_name, admission_type, department, ward_id, bed_id, diagnosis, icd10_code, admitting_doctor, attending_doctor, expected_los, insurance_auth } = req.body;
        if (!patient_id || !admission_type || !department) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'admission_type', 'department'] });
        const r = await db.query(`
            INSERT INTO admissions (tenant_id, patient_id, patient_name, admission_type, admission_date, admitting_doctor, attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code, expected_los, insurance_auth, status)
            VALUES ($1,$2,$3,$4,NOW(),$5,$6,$7,$8,$9,$10,$11,$12,$13,'admitted') RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', admission_type, admitting_doctor || req.userName || '', attending_doctor || req.userName || '', department, ward_id || null, bed_id || null, diagnosis || '', icd10_code || '', expected_los || 1, insurance_auth || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/encounter/admissions', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/admissions/:id/transfer', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { to_ward, to_bed, transfer_reason } = req.body;
        if (!to_ward) return res.status(400).json({ error: 'missing_required', required: ['to_ward'] });
        // Get current location
        const curr = await db.query(`SELECT ward_id, bed_id FROM admissions WHERE id = $1 AND tenant_id = $2 AND status = 'admitted'`, [req.params.id, req.tenantId]);
        if (curr.rows.length === 0) return res.status(404).json({ error: 'admission_not_found_or_not_active' });
        const fromW = curr.rows[0].ward_id, fromB = curr.rows[0].bed_id;
        // Record transfer
        await db.query(`
            INSERT INTO bed_transfers (tenant_id, admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by, transfer_date)
            VALUES ($1,$2,(SELECT patient_id FROM admissions WHERE id = $2),$3,$4,$5,$6,$7,$8,NOW())
        `, [req.tenantId, req.params.id, fromW, fromB, to_ward, to_bed || null, transfer_reason || '', req.userId]);
        // Update admission
        const r = await db.query(`UPDATE admissions SET ward_id = $2, bed_id = $3 WHERE id = $1 RETURNING id, ward_id, bed_id`, [req.params.id, to_ward, to_bed || null]);
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/encounter/admissions/:id/transfer', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/admissions/:id/discharge', requireAuth, requireTenantScope, requireRole('doctor', 'admin'), async (req, res) => {
    try {
        const { discharge_type, discharge_summary, discharge_instructions, discharge_medications, followup_date, followup_doctor } = req.body;
        const r = await db.query(`
            UPDATE admissions SET status = 'discharged', discharge_date = NOW(),
                                  discharge_type = COALESCE($3, discharge_type),
                                  discharge_summary = COALESCE($4, discharge_summary),
                                  discharge_instructions = COALESCE($5, discharge_instructions),
                                  discharge_medications = COALESCE($6, discharge_medications),
                                  followup_date = $7, followup_doctor = $8
            WHERE id = $1 AND tenant_id = $2 AND status = 'admitted' RETURNING id, status, discharge_date, discharge_type
        `, [req.params.id, req.tenantId, discharge_type || null, discharge_summary || null, discharge_instructions || null, discharge_medications || null, followup_date || null, followup_doctor || null]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_discharged' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/encounter/admissions/:id/discharge', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/transfers', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, admission_id, patient_id, from_ward, from_bed, to_ward, to_bed,
                   transfer_reason, transferred_by, transfer_date
            FROM bed_transfers WHERE tenant_id = $1 ORDER BY transfer_date DESC LIMIT 100
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, transfers: r.rows });
    } catch (err) { console.error('GET /api/encounter/transfers', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/cds-alerts', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { status, severity } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (severity) { params.push(severity); conditions.push(`severity = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, patient_id, alert_type, severity, title, message, status,
                   acknowledged_by, acknowledged_at, resolved_at, created_at
            FROM cds_alerts WHERE ${conditions.join(' AND ')}
            ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'moderate' THEN 3 ELSE 4 END,
                     created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, alerts: r.rows });
    } catch (err) { console.error('GET /api/encounter/cds-alerts', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/cds-alerts/:id/acknowledge', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE cds_alerts SET status = 'acknowledged', acknowledged_by = $3, acknowledged_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND acknowledged_at IS NULL RETURNING id, status, acknowledged_at
        `, [req.params.id, req.tenantId, req.userId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_ack' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/encounter/cds-alerts/:id/acknowledge', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const a = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE status = 'admitted') as currently_admitted,
                   COUNT(*) FILTER (WHERE status = 'discharged' AND discharge_date >= CURRENT_DATE) as discharged_today,
                   COUNT(*) FILTER (WHERE admission_date::date = CURRENT_DATE) as admitted_today,
                   AVG(expected_los)::numeric(10,2) as avg_expected_los
            FROM admissions WHERE tenant_id = $1
        `, [req.tenantId]);
        const tr = await db.query(`
            SELECT COUNT(*) FILTER (WHERE transfer_date >= NOW() - INTERVAL '24 hours') as transfers_24h
            FROM bed_transfers WHERE tenant_id = $1
        `, [req.tenantId]);
        const alerts = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status = 'open') as open_alerts,
                   COUNT(*) FILTER (WHERE severity = 'critical') as critical
            FROM cds_alerts WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, admissions: a.rows[0], transfers_24h: tr.rows[0].transfers_24h, alerts: alerts.rows[0] });
    } catch (err) { console.error('GET /api/encounter/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['lifecycle', 'admissions', 'transfers', 'cds-alerts', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
