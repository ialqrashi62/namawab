// filepath: namaweb/drug_interactions_router.js
// Drug interaction endpoints
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const drugEngine = require('./drug_interaction_engine');

// ============================================================
// POST /api/drug-interactions/check
// Body: { drugs: string[], patient_id?: number }
// ============================================================
router.post('/check', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'pharmacist', 'admin'), async (req, res) => {
    try {
        const drugs = Array.isArray(req.body.drugs) ? req.body.drugs : [];
        if (drugs.length === 0) {
            return res.status(400).json({ error: 'no_drugs_provided' });
        }
        if (drugs.length > 50) {
            return res.status(400).json({ error: 'too_many_drugs', max: 50 });
        }
        const patientId = req.body.patient_id || null;
        const interactions = drugEngine.checkInteractions(drugs);
        const highSeverityCount = interactions.filter(i =>
            i.severity === 'contraindicated' || i.severity === 'major'
        ).length;

        // Audit log (no PHI - only drug names + interaction summary)
        try {
            await db.query(`
                INSERT INTO drug_interaction_checks
                    (tenant_id, patient_id, checked_by, drugs, interactions, high_severity_count)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [req.tenantId, patientId, req.userId, JSON.stringify(drugs), JSON.stringify(interactions), highSeverityCount]);
        } catch (auditErr) {
            console.error('drug-interaction audit log failed', auditErr.message);
        }

        res.json({
            ok: true,
            drugs_checked: drugs.length,
            interactions_found: interactions.length,
            high_severity_count: highSeverityCount,
            interactions
        });
    } catch (err) {
        console.error('POST /api/drug-interactions/check', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

// ============================================================
// GET /api/drug-interactions/health
// ============================================================
router.get('/health', requireAuth, requireTenantScope, (req, res) => {
    res.json({
        ok: true,
        version: '1.0.0',
        interaction_pairs: drugEngine.getInteractionCount(),
        timestamp: new Date().toISOString()
    });
});

// ============================================================
// GET /api/drug-interactions/recent
// ============================================================
router.get('/recent', requireAuth, requireTenantScope, requireRole('doctor', 'nurse', 'pharmacist', 'admin'), async (req, res) => {
    try {
        const limit = Math.min(+req.query.limit || 20, 100);
        const result = await db.query(`
            SELECT id, drugs, interactions, high_severity_count, patient_id, checked_by, created_at
            FROM drug_interaction_checks
            WHERE tenant_id = $1
            ORDER BY created_at DESC
            LIMIT $2
        `, [req.tenantId, limit]);
        res.json({ ok: true, total: result.rows.length, checks: result.rows });
    } catch (err) {
        console.error('GET /api/drug-interactions/recent', err);
        res.status(500).json({ error: 'internal_error' });
    }
});

module.exports = router;