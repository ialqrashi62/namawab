// filepath: namaweb/clinical_notes_router.js
// Clinical notes (SOAP-style) + templates.
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const { patient_id, type, emr_status } = req.query;
        const conditions = ['tenant_id = $1'];
        const params = [req.tenantId];
        if (patient_id) { params.push(patient_id); conditions.push(`patient_id = $${params.length}`); }
        if (type) { params.push(type); conditions.push(`type = $${params.length}`); }
        if (emr_status) { params.push(emr_status); conditions.push(`emr_status = $${params.length}`); }
        params.push(Math.min(+req.query.limit || 100, 500));
        const r = await db.query(`
            SELECT id, patient_id, encounter_ref, type, subjective, objective, assessment, plan,
                   author_id, emr_status, signed_by_user_id, signed_at, locked_at, created_at
            FROM clinical_notes WHERE ${conditions.join(' AND ')}
            ORDER BY created_at DESC LIMIT $${params.length}
        `, params);
        res.json({ ok: true, total: r.rows.length, notes: r.rows });
    } catch (err) { console.error('GET /api/clinical-notes', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, encounter_ref, type, subjective, objective, assessment, plan } = req.body;
        if (!patient_id || !type) return res.status(400).json({ error: 'missing_required', required: ['patient_id', 'type'] });
        const integrity_hash = require('crypto').createHash('sha256').update(JSON.stringify({ patient_id, type, subjective, objective, assessment, plan, ts: Date.now() })).digest('hex');
        const r = await db.query(`
            INSERT INTO clinical_notes (tenant_id, patient_id, encounter_ref, type, subjective, objective, assessment, plan, author_id, emr_status, integrity_hash)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'draft',$10) RETURNING id
        `, [req.tenantId, patient_id, encounter_ref || null, type, subjective || '', objective || '', assessment || '', plan || '', req.userId, integrity_hash]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/clinical-notes', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/:id/sign', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE clinical_notes SET emr_status = 'signed', signed_by_user_id = $3, signed_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND emr_status = 'draft' RETURNING id, emr_status, signed_at
        `, [req.params.id, req.tenantId, req.userId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_already_signed' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/clinical-notes/:id/sign', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/:id/lock', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            UPDATE clinical_notes SET emr_status = 'locked', locked_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND emr_status = 'signed' RETURNING id, emr_status, locked_at
        `, [req.params.id, req.tenantId]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'not_found_or_not_signed' });
        res.json({ ok: true, ...r.rows[0] });
    } catch (err) { console.error('POST /api/clinical-notes/:id/lock', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/templates', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT id, doctor_id, shortcut, template_text, created_at
            FROM clinical_templates WHERE tenant_id = $1 ORDER BY shortcut LIMIT 200
        `, [req.tenantId]);
        res.json({ ok: true, total: r.rows.length, templates: r.rows });
    } catch (err) { console.error('GET /api/clinical-notes/templates', err); res.status(500).json({ error: 'internal_error' }); }
});

router.post('/templates', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { shortcut, template_text } = req.body;
        if (!shortcut || !template_text) return res.status(400).json({ error: 'missing_required', required: ['shortcut', 'template_text'] });
        const r = await db.query(`
            INSERT INTO clinical_templates (tenant_id, doctor_id, shortcut, template_text) VALUES ($1, $2, $3, $4) RETURNING id
        `, [req.tenantId, req.userId, shortcut, template_text]);
        res.status(201).json({ ok: true, id: r.rows[0].id });
    } catch (err) { console.error('POST /api/clinical-notes/templates', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin', 'doctor'), async (req, res) => {
    try {
        const r = await db.query(`
            SELECT COUNT(*) as total_notes,
                   COUNT(*) FILTER (WHERE emr_status = 'draft') as drafts,
                   COUNT(*) FILTER (WHERE emr_status = 'signed') as signed,
                   COUNT(*) FILTER (WHERE emr_status = 'locked') as locked,
                   COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as last_24h
            FROM clinical_notes WHERE tenant_id = $1
        `, [req.tenantId]);
        const byType = await db.query(`
            SELECT type, COUNT(*) as cnt FROM clinical_notes WHERE tenant_id = $1 GROUP BY type ORDER BY cnt DESC LIMIT 10
        `, [req.tenantId]);
        res.json({ ok: true, summary: r.rows[0], by_type: byType.rows });
    } catch (err) { console.error('GET /api/clinical-notes/stats', err); res.status(500).json({ error: 'internal_error' }); }
});

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', endpoints: ['list', 'create', 'sign', 'lock', 'templates', 'stats'], timestamp: new Date().toISOString() });
});

module.exports = router;
