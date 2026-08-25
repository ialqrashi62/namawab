'use strict';
// Wave 84 — Operative Notes: surgical documentation with safety counts
const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        module: 'operative-notes',
        endpoints: [
            'GET /notes',
            'GET /notes/:id',
            'POST /notes',
            'PUT /notes/:id',
            'GET /notes/patient/:patientId',
            'GET /notes/surgery/:surgeryId',
            'GET /incomplete-counts',
            'GET /stats'
        ],
        timestamp: new Date().toISOString()
    });
});

router.get('/notes', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { patient_id, surgeon_signature, limit = 50 } = req.query;
        const params = [req.tenantId];
        let sql = `SELECT n.*, p.full_name AS patient_name, p.mrn FROM operative_notes n LEFT JOIN patients p ON p.id = n.patient_id WHERE n.tenant_id = $1`;
        if (patient_id) { sql += ` AND n.patient_id = $${params.length + 1}`; params.push(patient_id); }
        if (surgeon_signature) { sql += ` AND n.surgeon_signature = $${params.length + 1}`; params.push(surgeon_signature); }
        sql += ` ORDER BY n.created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
        const r = await db.query(sql, params);
        res.json({ ok: true, count: r.rows.length, rows: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/notes/:id', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT n.*, p.full_name AS patient_name, p.mrn FROM operative_notes n LEFT JOIN patients p ON p.id = n.patient_id
             WHERE n.tenant_id = $1 AND n.id = $2`,
            [req.tenantId, req.params.id]
        );
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'note_not_found' });
        res.json({ ok: true, note: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.post('/notes', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const { surgery_id, patient_id, procedure_description, findings, complications, blood_loss_final, counts_verified = false, specimen, surgeon_signature } = req.body;
        if (!patient_id) return res.status(400).json({ ok: false, error: 'patient_id_required' });
        if (!procedure_description) return res.status(400).json({ ok: false, error: 'procedure_description_required' });
        if (!surgeon_signature) return res.status(400).json({ ok: false, error: 'surgeon_signature_required_for_attestation' });

        const r = await db.query(
            `INSERT INTO operative_notes (tenant_id, surgery_id, patient_id, procedure_description, findings, complications, blood_loss_final, counts_verified, specimen, surgeon_signature)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [req.tenantId, surgery_id || null, patient_id, procedure_description, findings || null, complications || null,
             blood_loss_final !== undefined ? blood_loss_final : null, counts_verified, specimen || null, surgeon_signature]
        );
        res.status(201).json({ ok: true, note: r.rows[0], counts_verified_warning: !counts_verified });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.put('/notes/:id', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const allowed = ['procedure_description','findings','complications','blood_loss_final','counts_verified','specimen','surgeon_signature'];
        const sets = [];
        const params = [req.tenantId, req.params.id];
        let i = 3;
        for (const k of allowed) {
            if (k in req.body) { sets.push(`${k} = $${i++}`); params.push(req.body[k]); }
        }
        if (!sets.length) return res.status(400).json({ ok: false, error: 'no_fields' });
        const r = await db.query(`UPDATE operative_notes SET ${sets.join(', ')} WHERE tenant_id = $1 AND id = $2 RETURNING *`, params);
        if (!r.rows.length) return res.status(404).json({ ok: false, error: 'note_not_found' });
        res.json({ ok: true, note: r.rows[0] });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/notes/patient/:patientId', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT * FROM operative_notes WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC LIMIT 30`,
            [req.tenantId, req.params.patientId]
        );
        res.json({ ok: true, count: r.rows.length, latest: r.rows[0] || null, history: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/notes/surgery/:surgeryId', requireAuth, requireTenantScope, requireRole('surgeon'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT n.*, p.full_name AS patient_name FROM operative_notes n LEFT JOIN patients p ON p.id = n.patient_id
             WHERE n.tenant_id = $1 AND n.surgery_id = $2`,
            [req.tenantId, req.params.surgeryId]
        );
        res.json({ ok: true, count: r.rows.length, notes: r.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/incomplete-counts', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT n.*, p.full_name AS patient_name FROM operative_notes n LEFT JOIN patients p ON p.id = n.patient_id
             WHERE n.tenant_id = $1 AND (n.counts_verified = false OR n.counts_verified IS NULL) ORDER BY n.created_at DESC LIMIT 100`,
            [req.tenantId]
        );
        res.json({ ok: true, count: r.rows.length, rows: r.rows, safety_warning: 'These cases have unverified surgical counts (sponges/instruments/needles). Investigate immediately.' });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/stats', requireAuth, requireTenantScope, requireRole('admin'), async (req, res) => {
    try {
        const r = await db.query(
            `SELECT COUNT(*) AS total_notes, COUNT(*) FILTER (WHERE counts_verified = true) AS counts_verified_count,
                    AVG(blood_loss_final)::NUMERIC(10,2) AS avg_blood_loss, MAX(blood_loss_final) AS max_blood_loss,
                    COUNT(*) FILTER (WHERE complications IS NOT NULL AND complications != '') AS with_complications
             FROM operative_notes WHERE n.tenant_id = $1 AND created_at >= NOW() - INTERVAL '90 days'`,
            [req.tenantId]
        );
        const sig = await db.query(
            `SELECT surgeon_signature, COUNT(*) AS count FROM operative_notes WHERE tenant_id = $1 AND surgeon_signature IS NOT NULL
             GROUP BY surgeon_signature ORDER BY count DESC LIMIT 10`,
            [req.tenantId]
        );
        res.json({ ok: true, summary_90d: r.rows[0], top_surgeons: sig.rows });
    } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

module.exports = router;
