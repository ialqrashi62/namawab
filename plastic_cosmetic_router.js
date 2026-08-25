'use strict';
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// Cosmetic consent forms
router.get('/cos-consents/:patient_id', requireAuth, requireTenantScope, requireRole('aesthetic_surgeon', 'nurse', 'admin', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, case_id, procedure_name, consent_type, surgeon, risks_explained, alternatives_explained, is_photography_consent, is_anesthesia_consent, witness_name, consent_date, status, created_at FROM cosmetic_consents WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, consents: r.rows });
    } catch (err) { console.error('GET /api/pc/cos-consents', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/cos-consents', requireAuth, requireTenantScope, requireRole('aesthetic_surgeon', 'doctor'), async (req, res) => {
    try {
        const { case_id, patient_id, procedure_name, consent_type, surgeon, risks_explained, alternatives_explained, expected_results, limitations, patient_questions, is_photography_consent, is_anesthesia_consent, is_blood_transfusion_consent, witness_name, patient_signature, witness_signature } = req.body;
        if (!patient_id || !procedure_name) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO cosmetic_consents (tenant_id, case_id, patient_id, procedure_name, consent_type, surgeon, risks_explained, alternatives_explained, expected_results, limitations, patient_questions, is_photography_consent, is_anesthesia_consent, is_blood_transfusion_consent, witness_name, consent_date, patient_signature, witness_signature, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,CURRENT_DATE,$16,$17,'signed') RETURNING id`, [req.tenantId, case_id || null, patient_id, procedure_name, consent_type || 'procedure', surgeon || '', risks_explained || '', alternatives_explained || '', expected_results || '', limitations || '', patient_questions || '', !!is_photography_consent, !!is_anesthesia_consent, !!is_blood_transfusion_consent, witness_name || '', patient_signature || '', witness_signature || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pc/cos-consents', err); res.status(500).json({ error: 'internal_error' }); }
});

// Cosmetic photos
router.get('/cos-photos/:case_id', requireAuth, requireTenantScope, requireRole('aesthetic_surgeon', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, photo_type, photo_angle, photo_date, photo_path, notes, taken_by, created_at FROM cosmetic_photos WHERE tenant_id = $1 AND case_id = $2 ORDER BY photo_date DESC LIMIT 100`, [req.tenantId, req.params.case_id]);
        res.json({ ok: true, total: r.rows.length, photos: r.rows });
    } catch (err) { console.error('GET /api/pc/cos-photos', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/cos-photos', requireAuth, requireTenantScope, requireRole('aesthetic_surgeon', 'doctor'), async (req, res) => {
    try {
        const { case_id, patient_id, photo_type, photo_angle, photo_date, photo_path, notes } = req.body;
        if (!case_id || !patient_id) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO cosmetic_photos (tenant_id, case_id, patient_id, photo_type, photo_angle, photo_date, photo_path, notes, taken_by) VALUES ($1,$2,$3,$4,$5,COALESCE($6,CURRENT_DATE),$7,$8,$9) RETURNING id`, [req.tenantId, case_id, patient_id, photo_type || 'pre-op', photo_angle || 'front', photo_date, photo_path || '', notes || '', req.userName || req.userId]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pc/cos-photos', err); res.status(500).json({ error: 'internal_error' }); }
});

// Cosmetic follow-ups (deep)
router.post('/cos-followups/deep', requireAuth, requireTenantScope, requireRole('aesthetic_surgeon', 'doctor'), async (req, res) => {
    try {
        const { case_id, patient_id, patient_name, followup_date, days_post_op, healing_status, pain_level, swelling, complications, patient_satisfaction, surgeon_notes, surgeon } = req.body;
        if (!case_id || !patient_id || !followup_date) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO cosmetic_followups (tenant_id, case_id, patient_id, patient_name, followup_date, days_post_op, healing_status, pain_level, swelling, complications, patient_satisfaction, surgeon_notes, surgeon) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`, [req.tenantId, case_id, patient_id, patient_name || '', followup_date, days_post_op || null, healing_status || '', pain_level || null, swelling || '', complications || '', patient_satisfaction || null, surgeon_notes || '', surgeon || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pc/cos-followups/deep', err); res.status(500).json({ error: 'internal_error' }); }
});

// Plastic & Burns surgical logs
router.get('/plastic-burns-logs/:patient_id', requireAuth, requireTenantScope, requireRole('plastic_surgeon', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications, created_at FROM plastic_burns_surgical_logs WHERE tenant_id = $1 AND patient_id = $2 ORDER BY operation_date DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, logs: r.rows });
    } catch (err) { console.error('GET /api/pc/plastic-burns-logs', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/plastic-burns-logs', requireAuth, requireTenantScope, requireRole('plastic_surgeon', 'doctor'), async (req, res) => {
    try {
        const { patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications } = req.body;
        if (!patient_id || !procedure_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO plastic_burns_surgical_logs (tenant_id, patient_id, surgeon_id, operation_date, procedure_type, approach, duration_minutes, blood_loss_ml, complications) VALUES ($1,$2,$3,COALESCE($4,CURRENT_DATE),$5,$6,$7,$8,$9) RETURNING id`, [req.tenantId, patient_id, surgeon_id || req.userId, operation_date, procedure_type, approach || '', duration_minutes || null, blood_loss_ml || null, complications || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pc/plastic-burns-logs', err); res.status(500).json({ error: 'internal_error' }); }
});

// Orthopedic implants (joint arthroplasty)
router.get('/ortho-implants/:patient_id', requireAuth, requireTenantScope, requireRole('orthopedic_surgeon', 'doctor', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, implant_date, implant_type, manufacturer, model_name, serial_number, size_dimension, batch_lot_number, clinical_notes, created_at FROM orthopedic_implants WHERE tenant_id = $1 AND patient_id = $2 ORDER BY implant_date DESC LIMIT 50`, [req.tenantId, req.params.patient_id]);
        res.json({ ok: true, total: r.rows.length, implants: r.rows });
    } catch (err) { console.error('GET /api/pc/ortho-implants', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/ortho-implants', requireAuth, requireTenantScope, requireRole('orthopedic_surgeon', 'doctor'), async (req, res) => {
    try {
        const { patient_id, implant_type, manufacturer, model_name, serial_number, size_dimension, batch_lot_number, clinical_notes, implant_date } = req.body;
        if (!patient_id || !implant_type) return res.status(400).json({ error: 'missing_required' });
        const r = await db.query(`INSERT INTO orthopedic_implants (tenant_id, patient_id, doctor_id, implant_date, implant_type, manufacturer, model_name, serial_number, size_dimension, batch_lot_number, clinical_notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`, [req.tenantId, patient_id, req.userId, implant_date || null, implant_type, manufacturer || '', model_name || '', serial_number || '', size_dimension || '', batch_lot_number || '', clinical_notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/pc/ortho-implants', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'aesthetic_surgeon', 'plastic_surgeon', 'orthopedic_surgeon'), async (req, res) => {
    try {
        const c = await db.query(`SELECT COUNT(*) FILTER (WHERE status = 'signed') as signed, COUNT(*) FILTER (WHERE status = 'pending') as pending, COUNT(*) as total FROM cosmetic_consents WHERE tenant_id = $1`, [req.tenantId]);
        const p = await db.query(`SELECT COUNT(*) as total_photos, COUNT(*) FILTER (WHERE photo_type = 'pre-op') as preop_photos, COUNT(*) FILTER (WHERE photo_type = 'post-op') as postop_photos FROM cosmetic_photos WHERE tenant_id = $1`, [req.tenantId]);
        const i = await db.query(`SELECT COUNT(*) as total_implants, COUNT(DISTINCT manufacturer) as unique_manufacturers FROM orthopedic_implants WHERE tenant_id = $1`, [req.tenantId]);
        const b = await db.query(`SELECT COUNT(*) FILTER (WHERE procedure_type LIKE '%Burn%') as burn_procedures, COUNT(*) as total_procedures, AVG(duration_minutes)::numeric(6,0) as avg_duration FROM plastic_burns_surgical_logs WHERE tenant_id = $1`, [req.tenantId]);
        res.json({ ok: true, consents: c.rows[0], photos: p.rows[0], implants: i.rows[0], burns_logs: b.rows[0] });
    } catch (err) { console.error('GET /api/pc/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['cos-consents', 'cos-photos', 'cos-followups/deep', 'plastic-burns-logs', 'ortho-implants', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
