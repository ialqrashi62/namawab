// filepath: namaweb/transplant_router.js
// transplant — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./transplant_engine');

// GET /api/transplant/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'transplant', version: engine.VERSION }));

// GET /api/transplant/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'transplant' });
        } catch (err) {
            console.error('GET /transplant/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/transplant/assessments/meldScore
router.post('/assessments/meldScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.transplantMeldScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.meldScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /transplant/meldScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/transplant/assessments/kepaDonorMatch
router.post('/assessments/kepaDonorMatch',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.transplantKepaDonorMatch || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.kepaDonorMatch(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /transplant/kepaDonorMatch', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/transplant/assessments/rejectionRisk
router.post('/assessments/rejectionRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.transplantRejectionRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.rejectionRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /transplant/rejectionRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/transplant/assessments/immunosuppressionLevel
router.post('/assessments/immunosuppressionLevel',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.transplantImmunosuppressionLevel || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.immunosuppressionLevel(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /transplant/immunosuppressionLevel', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/transplant/assessments/graftSurvivalProbability
router.post('/assessments/graftSurvivalProbability',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.transplantGraftSurvivalProbability || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.graftSurvivalProbability(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /transplant/graftSurvivalProbability', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
