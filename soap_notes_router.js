// filepath: namaweb/soap_notes_router.js
// SOAP note endpoints
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const soapEngine = require('./soap_note_engine');

// ============================================================
// POST /api/soap-notes/generate
// Body: { patient_id, chief_complaint?, subjective_extra? }
// Returns generated SOAP content (does NOT persist; use POST /api/soap-notes to save)
// ============================================================
router.post('/generate', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const patientId = +req.body.patient_id;
        if (!patientId) {
            return res.status(400).json({ error: 'missing_patient_id' });
        }
        const result = await soapEngine.generateSoapNote(req.tenantId, patientId, {
            chief_complaint: req.body.chief_complaint || '',
            subjective_extra: req.body.subjective_extra || ''
        });
        if (result.error) {
            return res.status(404).json({ error: result.error });
        }
        res.json({ ok: true, ...result });
    } catch (err) {
        console.error('POST /api/soap-notes/generate', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/soap-notes
// Save a SOAP note
// ============================================================
router.post('/', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const { patient_id, chief_complaint, subjective, objective, assessment, plan, diagnosis_codes, encounter_id } = req.body;
        if (!patient_id) {
            return res.status(400).json({ error: 'missing_patient_id' });
        }
        const result = await db.query(`
            INSERT INTO soap_notes
                (tenant_id, patient_id, authored_by, encounter_id, subjective, objective, assessment, plan, chief_complaint, diagnosis_codes, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
            RETURNING id
        `, [req.tenantId, patient_id, req.userId, encounter_id || null, subjective || '', objective || '', assessment || '', plan || '', chief_complaint || '', JSON.stringify(diagnosis_codes || [])]);
        res.status(201).json({ ok: true, id: result.rows[0].id });
    } catch (err) {
        console.error('POST /api/soap-notes', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/soap-notes?patient_id=X
// ============================================================
router.get('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const patientId = req.query.patient_id;
        if (!patientId) {
            return res.status(400).json({ error: 'missing_patient_id' });
        }
        const limit = Math.min(+req.query.limit || 20, 100);
        const result = await db.query(`
            SELECT id, chief_complaint, subjective, objective, assessment, plan, diagnosis_codes,
                   signed_at, locked_at, created_at, authored_by, encounter_id
            FROM soap_notes
            WHERE tenant_id = $1 AND patient_id = $2
            ORDER BY created_at DESC
            LIMIT $3
        `, [req.tenantId, patientId, limit]);
        res.json({ ok: true, total: result.rows.length, notes: result.rows });
    } catch (err) {
        console.error('GET /api/soap-notes', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/soap-notes/:id/sign
// Sign a SOAP note (locks from further edits unless unlocked)
// ============================================================
router.post('/:id/sign', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const noteId = req.params.id;
        const result = await db.query(`
            UPDATE soap_notes
            SET signed_at = NOW(), locked_at = NOW(), updated_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND signed_at IS NULL
            RETURNING id, signed_at, locked_at
        `, [noteId, req.tenantId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'note_not_found_or_already_signed' });
        }
        res.json({ ok: true, ...result.rows[0] });
    } catch (err) {
        console.error('POST /api/soap-notes/sign', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/soap-notes/health
// ============================================================
router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', timestamp: new Date().toISOString() });
});

module.exports = router;