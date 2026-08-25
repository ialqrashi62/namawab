// filepath: namaweb/plastic_surgery_router.js
// plastic_surgery — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./plastic_surgery_engine');

// GET /api/plastic_surgery/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'plastic_surgery', version: engine.VERSION }));

// GET /api/plastic_surgery/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'plastic_surgery' });
        } catch (err) {
            console.error('GET /plastic_surgery/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/plastic_surgery/assessments/burnSeverity
router.post('/assessments/burnSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.plastic_surgeryBurnSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.burnSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /plastic_surgery/burnSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/plastic_surgery/assessments/reconstructionFlapScore
router.post('/assessments/reconstructionFlapScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.plastic_surgeryReconstructionFlapScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.reconstructionFlapScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /plastic_surgery/reconstructionFlapScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/plastic_surgery/assessments/cosmeticRiskScore
router.post('/assessments/cosmeticRiskScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.plastic_surgeryCosmeticRiskScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.cosmeticRiskScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /plastic_surgery/cosmeticRiskScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/plastic_surgery/assessments/scarringRisk
router.post('/assessments/scarringRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.plastic_surgeryScarringRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.scarringRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /plastic_surgery/scarringRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/plastic_surgery/assessments/tissueViabilityIndex
router.post('/assessments/tissueViabilityIndex',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.plastic_surgeryTissueViabilityIndex || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.tissueViabilityIndex(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /plastic_surgery/tissueViabilityIndex', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
