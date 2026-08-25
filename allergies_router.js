// filepath: namaweb/allergies_router.js
// Patient allergies tracker endpoints
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');

// ============================================================
// GET /api/allergies?patient_id=X
// List active allergies (or include inactive with ?include_inactive=true)
// ============================================================
router.get('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'admin'), async (req, res) => {
    try {
        const patientId = req.query.patient_id;
        if (!patientId) {
            return res.status(400).json({ error: 'missing_patient_id' });
        }
        const includeInactive = req.query.include_inactive === 'true';
        const where = includeInactive ? '' : 'AND active = TRUE';
        const result = await db.query(`
            SELECT id, allergen, allergen_type, reaction, severity, onset_date, active, notes, recorded_by, created_at, updated_at
            FROM allergies
            WHERE tenant_id = $1 AND patient_id = $2 ${where}
            ORDER BY
                CASE severity WHEN 'anaphylaxis' THEN 1 WHEN 'severe' THEN 2 WHEN 'moderate' THEN 3 ELSE 4 END,
                created_at DESC
        `, [req.tenantId, patientId]);
        res.json({ ok: true, total: result.rows.length, allergies: result.rows });
    } catch (err) {
        console.error('GET /api/allergies', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/allergies
// Add new allergy
// ============================================================
router.post('/', requireAuth, requireTenantScope, requireRole('doctor', 'nurse'), async (req, res) => {
    try {
        const { patient_id, allergen, allergen_type, reaction, severity, onset_date, notes } = req.body;
        if (!patient_id || !allergen) {
            return res.status(400).json({ error: 'missing_required_fields', required: ['patient_id', 'allergen'] });
        }
        const validSeverity = ['mild', 'moderate', 'severe', 'anaphylaxis'];
        const validType = ['drug', 'food', 'environmental', 'latex', 'other'];
        if (severity && !validSeverity.includes(severity)) {
            return res.status(400).json({ error: 'invalid_severity', valid: validSeverity });
        }
        if (allergen_type && !validType.includes(allergen_type)) {
            return res.status(400).json({ error: 'invalid_allergen_type', valid: validType });
        }
        const result = await db.query(`
            INSERT INTO allergies
                (tenant_id, patient_id, allergen, allergen_type, reaction, severity, onset_date, recorded_by, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `, [req.tenantId, patient_id, allergen, allergen_type || 'drug', reaction || '', severity || 'mild', onset_date || null, req.userId, notes || '']);
        res.status(201).json({ ok: true, id: result.rows[0].id });
    } catch (err) {
        console.error('POST /api/allergies', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// POST /api/allergies/:id/deactivate
// Mark allergy inactive (resolved)
// ============================================================
router.post('/:id/deactivate', requireAuth, requireTenantScope, requireRole('doctor'), async (req, res) => {
    try {
        const result = await db.query(`
            UPDATE allergies
            SET active = FALSE, updated_at = NOW()
            WHERE id = $1 AND tenant_id = $2 AND active = TRUE
            RETURNING id
        `, [req.params.id, req.tenantId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'allergy_not_found_or_already_inactive' });
        }
        res.json({ ok: true, id: result.rows[0].id });
    } catch (err) {
        console.error('POST /api/allergies/deactivate', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/allergies/health
// ============================================================
router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({ ok: true, version: '1.0.0', timestamp: new Date().toISOString() });
});

module.exports = router;