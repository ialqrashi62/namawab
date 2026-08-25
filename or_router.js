// filepath: namaweb/or_router.js
// Operating Room module — surgeries, WHO checklist, operative notes.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/rooms', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT id, room_name, room_name_ar, location, equipment, status, notes FROM operating_rooms WHERE tenant_id = $1 ORDER BY room_name`, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, rooms: r.rows });
    } catch (err) { console.error('GET /api/or/rooms', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/schedules', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist', 'nurse', 'admin'), async (req, res) => {
    try {
        const { date, status, operating_room, surgeon_id } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (date) { params.push(date); conditions.push(`scheduled_date = $${params.length}`); }
        if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
        if (operating_room) { params.push(operating_room); conditions.push(`operating_room = $${params.length}`); }
        if (surgeon_id) { params.push(surgeon_id); conditions.push(`surgeon_id = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 50, 200));
        const r = await db.query(`
            SELECT id, patient_id, patient_name, surgeon_id, surgeon_name, anesthetist_id, anesthetist_name,
                   procedure_name, surgery_type, operating_room, priority, scheduled_date, scheduled_time,
                   estimated_duration, actual_start, actual_end, status, preop_status
            FROM surgeries WHERE ${conditions.join(' AND ')}
            ORDER BY scheduled_date DESC, scheduled_time DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, surgeries: r.rows });
    } catch (err) { console.error('GET /api/or/schedules', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/schedules/today', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, patient_id, patient_name, surgeon_name, anesthetist_name, procedure_name, operating_room,
                   scheduled_time, status, priority
            FROM surgeries WHERE tenant_id = $1 AND scheduled_date = CURRENT_DATE
            ORDER BY scheduled_time LIMIT 50
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, surgeries: r.rows });
    } catch (err) { console.error('GET /api/or/schedules/today', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/schedules', requireAuth, requireTenantScope, requireRole('surgeon', 'admin'), async (req, res) => {
    try {
        const { patient_id, patient_name, surgeon_id, surgeon_name, anesthetist_id, anesthetist_name, procedure_name, procedure_name_ar, surgery_type, operating_room, priority, scheduled_date, scheduled_time, estimated_duration, notes } = req.body;
        if (!patient_id || !procedure_name || !scheduled_date) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'procedure_name', 'scheduled_date'] });
        const r = await db.query(`
            INSERT INTO surgeries (tenant_id, patient_id, patient_name, surgeon_id, surgeon_name, anesthetist_id, anesthetist_name, procedure_name, procedure_name_ar, surgery_type, operating_room, priority, scheduled_date, scheduled_time, estimated_duration, notes, status)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'scheduled') RETURNING id
        `, [req.tenantId, patient_id, patient_name || '', surgeon_id || req.userId, surgeon_name || '', anesthetist_id || null, anesthetist_name || '', procedure_name, procedure_name_ar || '', surgery_type || 'elective', operating_room || '', priority || 'normal', scheduled_date, scheduled_time || null, estimated_duration || null, notes || '']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/or/schedules', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/schedules/:id/start', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE surgeries SET actual_start = NOW(), status = 'in_progress' WHERE id = $1 AND tenant_id = $2 AND status = 'scheduled' RETURNING id, status, actual_start
        `, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_not_scheduled' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/or/schedules/:id/start', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/schedules/:id/complete', requireAuth, requireTenantScope, requireRole('surgeon', 'admin'), async (req, res) => {
    try {
        const { post_op_notes } = req.body;
        const r = await db.query(`
            UPDATE surgeries SET actual_end = NOW(), status = 'completed', post_op_notes = COALESCE($3, post_op_notes)
            WHERE id = $1 AND tenant_id = $2 AND status = 'in_progress' RETURNING id, status, actual_end
        `, [req.params.id, req.tenantId, post_op_notes || null]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_not_in_progress' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/or/schedules/:id/complete', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/asa-assessments', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist', 'admin'), async (req, res) => {
    try {
        const { asa_class } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (asa_class) { params.push(asa_class); conditions.push(`asa_class = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, encounter_id, asa_class, emergency, label,
                   mortality_pct, recommendation, assessed_by, created_at
            FROM surgery_asa_assessments WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, assessments: r.rows });
    } catch (err) { console.error('GET /api/or/asa-assessments', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/who-checklist', requireAuth, requireTenantScope, requireRole('surgeon', 'nurse', 'anesthesiologist'), async (req, res) => {
    try {
        const { surgery_id, patient_id, sign_in, time_out, sign_out } = req.body;
        if (!surgery_id || !patient_id) return res.status(400).json({ error: 'missing_required', required: ['surgery_id', 'patient_id'] });
        // Use legacy WHO checklist (surgical_checklists table — three columns sign_in/time_out/sign_out)
        const r = await db.query(`
            INSERT INTO surgical_checklists (tenant_id, patient_id, doctor_id, surgery_date, procedure_name, sign_in_confirmed, time_out_confirmed, sign_out_confirmed, notes)
            VALUES ($1,$2,$3,CURRENT_DATE,$4,$5,$6,$7,$8) RETURNING id
        `, [req.tenantId, patient_id, req.userId, req.body.procedure_name || '', sign_in || false, time_out || false, sign_out || false, req.body.notes || '']);
        // Also insert into who_surgical_checklist for stateful tracking
        await db.query(`
            INSERT INTO who_surgical_checklist (tenant_id, surgery_id, patient_id, sign_in_completed, sign_in_completed_by, sign_in_at, time_out_completed, time_out_completed_by, time_out_at, sign_out_completed, sign_out_completed_by, sign_out_at, state)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'in_progress')
            ON CONFLICT (surgery_id) DO NOTHING
        `, [req.tenantId, surgery_id, patient_id, sign_in||false, req.userName||'', sign_in?new Date().toISOString():null, time_out||false, req.userName||'', time_out?new Date().toISOString():null, sign_out||false, req.userName||'', sign_out?new Date().toISOString():null]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/or/who-checklist', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/who-checklist/:surgery_id', requireAuth, requireTenantScope, requireRole('surgeon', 'anesthesiologist', 'nurse', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`SELECT * FROM who_surgical_checklist WHERE tenant_id = $1 AND surgery_id = $2`, [req.tenantId, req.params.surgery_id]);
        res.json({ ok: true, found: r.rows.length > 0, checklist: r.rows[0] || null });
    } catch (err) { console.error('GET /api/or/who-checklist/:surgery_id', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/operative-notes/:surgery_id', requireAuth, requireTenantScope, requireRole('surgeon', 'admin'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, surgery_id, patient_id, procedure_description, findings, complications,
                   blood_loss_final, counts_verified, specimen, surgeon_signature, created_at
            FROM operative_notes WHERE tenant_id = $1 AND surgery_id = $2 ORDER BY created_at DESC
        `, [req.tenantId, req.params.surgery_id]);
        res.json({ ok: true, total: r.rows.length, notes: r.rows });
    } catch (err) { console.error('GET /api/or/operative-notes', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/operative-notes', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { surgery_id, patient_id, procedure_description, findings, complications, blood_loss_final, counts_verified, specimen } = req.body;
        if (!surgery_id || !patient_id || !procedure_description) return res.status(400).json({ error: 'missing_required', required: ['surgery_id', 'patient_id', 'procedure_description'] });
        const r = await db.query(`
            INSERT INTO operative_notes (tenant_id, surgery_id, patient_id, procedure_description, findings, complications, blood_loss_final, counts_verified, specimen, surgeon_signature)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id
        `, [req.tenantId, surgery_id, patient_id, procedure_description, findings || '', complications || '', blood_loss_final || 0, counts_verified || false, specimen || '', req.userName || 'surgeon']);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/or/operative-notes', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'surgeon'), async (req, res) => {
    try {
        const surgeries = await db.query(`
            SELECT COUNT(*) as total,
                   COUNT(*) FILTER (WHERE status = 'scheduled') as scheduled,
                   COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
                   COUNT(*) FILTER (WHERE status = 'completed') as completed,
                   COUNT(*) FILTER (WHERE surgery_type = 'emergency') as emergency,
                   COUNT(*) FILTER (WHERE surgery_type = 'elective') as elective,
                   COUNT(*) FILTER (WHERE scheduled_date = CURRENT_DATE) as scheduled_today
            FROM surgeries WHERE tenant_id = $1
        `, [req.tenantId]);
        const asa = await db.query(`
            SELECT asa_class, COUNT(*) as cnt FROM surgery_asa_assessments
            WHERE tenant_id = $1 GROUP BY asa_class ORDER BY asa_class
        `, [req.tenantId]);
        const checklist = await db.query(`
            SELECT COUNT(*) FILTER (WHERE state = 'completed') as completed,
                   COUNT(*) FILTER (WHERE state = 'in_progress') as in_progress,
                   COUNT(*) FILTER (WHERE sign_in_completed AND sign_out_completed) as fully_signed
            FROM who_surgical_checklist WHERE tenant_id = $1
        `, [req.tenantId]);
        res.json({ ok: true, surgeries: surgeries.rows[0], asa_distribution: asa.rows, who_checklist: checklist.rows[0] });
    } catch (err) { console.error('GET /api/or/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['rooms', 'schedules', 'who-checklist', 'asa', 'operative-notes', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
