// filepath: namaweb/burn_unit_router.js
// burn_unit — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./burn_unit_engine');

// GET /api/burn_unit/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'burn_unit', version: engine.VERSION }));

// GET /api/burn_unit/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'burn_unit' });
        } catch (err) {
            console.error('GET /burn_unit/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/burn_unit/assessments/parklandFormula
router.post('/assessments/parklandFormula',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.burn_unitParklandFormula || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.parklandFormula(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /burn_unit/parklandFormula', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/burn_unit/assessments/absiScore
router.post('/assessments/absiScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.burn_unitAbsiScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.absiScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /burn_unit/absiScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/burn_unit/assessments/burnDepthClassification
router.post('/assessments/burnDepthClassification',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.burn_unitBurnDepthClassification || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.burnDepthClassification(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /burn_unit/burnDepthClassification', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/burn_unit/assessments/inhalationInjuryRisk
router.post('/assessments/inhalationInjuryRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.burn_unitInhalationInjuryRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.inhalationInjuryRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /burn_unit/inhalationInjuryRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/burn_unit/assessments/fluidResuscitationRate
router.post('/assessments/fluidResuscitationRate',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.burn_unitFluidResuscitationRate || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.fluidResuscitationRate(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /burn_unit/fluidResuscitationRate', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
