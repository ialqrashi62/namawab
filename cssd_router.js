// filepath: namaweb/cssd_router.js
// CSSD (Central Sterile Supply Department) + Consent forms + Oncology regimens.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// CSSD Sterilization cycles
router.get('/sterilization', requireAuth, requireTenantScope, requireRole('cssd_tech', 'nurse', 'admin', 'doctor'), async (req, res) => {
    try {
        const { status, cycle_type, days } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (cycle_type) { params.push(cycle_type); conditions.push(`cycle_type = $${params.length}`); }
        if (days) { params.push(+days); conditions.push(`start_time >= NOW() - ($` + params.length + ` || ' days')::interval`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, cycle_number, machine_name, cycle_type, temperature, pressure, duration_minutes,
                   start_time, end_time, operator, bi_test_result, ci_result, status,
                   bi_indicator_lot, bi_result_recorded_at, bi_result_by, released_for_issue, created_at
            FROM cssd_sterilization_cycles WHERE ${conditions.join(' AND ')}
            ORDER BY start_time DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, cycles: r.rows });
    } catch (err) { console.error('GET /api/cssd/sterilization', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/sterilization', requireAuth, requireTenantScope, requireRole('cssd_tech', 'admin'), async (req, res) => {
    try {
        const { cycle_number, machine_name, cycle_type, temperature, pressure, duration_minutes, operator } = req.body;
        if (!cycle_number || !machine_name || !cycle_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO cssd_sterilization_cycles (tenant_id, cycle_number, machine_name, cycle_type, temperature, pressure, duration_minutes, start_time, operator, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),$8,'in_progress') RETURNING id
        `, [req.tenantId, cycle_number, machine_name, cycle_type, temperature || null, pressure || null, duration_minutes || null, operator || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cssd/sterilization', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/sterilization/:id/complete', requireAuth, requireTenantScope, requireRole('cssd_tech', 'admin'), async (req, res) => {
    try {
        const { ci_result, bi_test_result, bi_indicator_lot, notes } = req.body;
        const r = await db.query(`
            UPDATE cssd_sterilization_cycles SET end_time = NOW(), status = 'completed', ci_result = COALESCE($3, ci_result), bi_test_result = COALESCE($4, bi_test_result), bi_indicator_lot = COALESCE($5, bi_indicator_lot), notes = COALESCE($6, notes)
            WHERE id = $1 AND tenant_id = $2 RETURNING id, status, end_time, ci_result, bi_test_result
        `, [req.params.id, req.tenantId, ci_result, bi_test_result, bi_indicator_lot, notes || null]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/cssd/sterilization/complete', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/sterilization/:id/release', requireAuth, requireTenantScope, requireRole('cssd_tech', 'admin', 'nurse'), async (req, res) => {
    try {
        // Can only release if BI + CI both pass
        const cyc = await db.query(`SELECT bi_test_result, ci_result FROM cssd_sterilization_cycles WHERE id = $1 AND tenant_id = $2`, [req.params.id, req.tenantId]);
        if (cyc.rows.length === 0) return res.status(404).json({ error: 'not_found' });
        const c = cyc.rows[0];
        if (c.bi_test_result !== 'pass' || c.ci_result !== 'pass') return res.status(400).json({ error: 'cannot_release', reason: 'BI or CI not passing', bi: c.bi_test_result, ci: c.ci_result });
        const r = await db.query(`UPDATE cssd_sterilization_cycles SET released_for_issue = true, bi_result_recorded_at = NOW(), bi_result_by = $3 WHERE id = $1 AND tenant_id = $2 RETURNING id, released_for_issue`, [req.params.id, req.tenantId, req.userName || req.userId]);
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/cssd/sterilization/release', err); res.status(500).json({ error: 'internal_error' }); }
});

// Instrument sets
router.get('/instruments', requireAuth, requireTenantScope, requireRole('cssd_tech', 'nurse', 'surgeon', 'admin'), async (req, res) => {
    try {
        const { department, status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (department) { params.push(department); conditions.push(`department = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, set_name, set_name_ar, set_code, category, instrument_count, department, status, created_at
            FROM cssd_instrument_sets WHERE ${conditions.join(' AND ')}
            ORDER BY set_name LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, sets: r.rows });
    } catch (err) { console.error('GET /api/cssd/instruments', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/instruments', requireAuth, requireTenantScope, requireRole('cssd_tech', 'admin'), async (req, res) => {
    try {
        const { set_name, set_name_ar, set_code, category, instrument_count, instruments_list, department } = req.body;
        if (!set_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO cssd_instrument_sets (tenant_id, set_name, set_name_ar, set_code, category, instrument_count, instruments_list, department, status)
            VALUES ($1,$2,$3,$4,$5,COALESCE($6,0),$7,$8,'ready') RETURNING id
        `, [req.tenantId, set_name, set_name_ar || '', set_code || '', category || 'general', instrument_count, JSON.stringify(instruments_list || []), department || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cssd/instruments', err); res.status(500).json({ error: 'internal_error' }); }
});

// Consent forms
router.get('/consents', requireAuth, requireTenantScope, requireRole('doctor', 'admin', 'nurse'), async (req, res) => {
    try {
        const { form_type, status, patient_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (form_type) { params.push(form_type); conditions.push(`form_type = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, form_type, form_title, form_title_ar, doctor_name, witness_name, signed_at, language, status, surgery_id, created_at
            FROM consent_forms WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, forms: r.rows });
    } catch (err) { console.error('GET /api/cssd/consents', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/consents', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, patient_name, form_type, form_title, form_title_ar, content, doctor_name, witness_name, surgery_id, language } = req.body;
        if (!patient_id || !form_type || !form_title || !content) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'form_type', 'form_title', 'content'] });
        const r = await db.query(`
            INSERT INTO consent_forms (tenant_id, patient_id, patient_name, form_type, form_title, form_title_ar, content, doctor_name, witness_name, surgery_id, language, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,COALESCE($11,'AR'),'pending') RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', form_type, form_title, form_title_ar || '', content, doctor_name || req.userName || '', witness_name || '', surgery_id || null, language]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cssd/consents', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/consents/:id/sign-patient', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { patient_signature, witness_signature } = req.body;
        const r = await db.query(`
            UPDATE consent_forms SET patient_signature = COALESCE($3, patient_signature), witness_signature = COALESCE($4, witness_signature), signed_at = NOW(), status = 'signed'
            WHERE id = $1 AND tenant_id = $2 RETURNING id, status, signed_at
        `, [req.params.id, req.tenantId, patient_signature, witness_signature]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_signed' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/cssd/consents/sign', err); res.status(500).json({ error: 'internal_error' }); }
});

// Oncology regimens
router.get('/oncology-regimens/:patient_id', requireAuth, requireTenantScope, requireRole('oncologist', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, regimen_name, cycle_number, status, start_date, created_at
            FROM oncology_patient_regimens WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY start_date DESC LIMIT 50
        `, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, regimens: r.rows });
    } catch (err) { console.error('GET /api/cssd/oncology', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/oncology-regimens', requireAuth, requireTenantScope, requireRole('oncologist', 'doctor'), async (req, res) => {
    try {
        const { patient_id, regimen_name, cycle_number, status, start_date } = req.body;
        if (!patient_id || !regimen_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`
            INSERT INTO oncology_patient_regimens (tenant_id, patient_id, regimen_name, cycle_number, status, start_date)
            VALUES ($1,$2,$3,$4,COALESCE($5,'active'),COALESCE($6,CURRENT_DATE)) RETURNING id
        `, [req.tenantId, patient_id, regimen_name, cycle_number || null, status, start_date]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/cssd/oncology', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'cssd_tech', 'doctor', 'quality'), async (req, res) => {
    try {
        const c = await db.query(`
            SELECT COUNT(*) as total_cycles,
                   COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
                   COUNT(*) FILTER (WHERE status = 'completed') as completed,
                   COUNT(*) FILTER (WHERE released_for_issue) as released,
                   COUNT(*) FILTER (WHERE bi_test_result = 'pass' OR bi_test_result IS NULL) as bi_pass,
                   COUNT(*) FILTER (WHERE bi_test_result = 'fail') as bi_fail
            FROM cssd_sterilization_cycles WHERE tenant_id = $1
        `, [req.tenantId]);
        const i = await db.query(`
            SELECT COUNT(*) as total_sets,
                   COUNT(*) FILTER (WHERE status = 'ready') as ready,
                   COUNT(*) FILTER (WHERE status = 'in_use') as in_use,
                   COUNT(*) FILTER (WHERE status = 'sterilizing') as sterilizing
            FROM cssd_instrument_sets WHERE tenant_id = $1
        `, [req.tenantId]);
        const co = await db.query(`
            SELECT COUNT(*) FILTER (WHERE status = 'signed') as signed,
                   COUNT(*) FILTER (WHERE status = 'pending') as pending,
                   COUNT(*) as total_forms
            FROM consent_forms WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, cycles: c.rows[0], instrument_sets: i.rows[0], consent_forms: co.rows[0] });
    } catch (err) { console.error('GET /api/cssd/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['sterilization', 'instruments', 'consents', 'oncology-regimens', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
