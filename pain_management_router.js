// filepath: namaweb/pain_management_router.js
// pain_management — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./pain_management_engine');

// GET /api/pain_management/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'pain_management', version: engine.VERSION }));

// GET /api/pain_management/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'pain_management' });
        } catch (err) {
            console.error('GET /pain_management/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/pain_management/assessments/painLadder
router.post('/assessments/painLadder',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.pain_managementPainLadder || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.painLadder(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /pain_management/painLadder', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/pain_management/assessments/opioidRiskScore
router.post('/assessments/opioidRiskScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.pain_managementOpioidRiskScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.opioidRiskScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /pain_management/opioidRiskScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/pain_management/assessments/neuropathicPainScore
router.post('/assessments/neuropathicPainScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.pain_managementNeuropathicPainScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.neuropathicPainScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /pain_management/neuropathicPainScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/pain_management/assessments/chronicPainImpact
router.post('/assessments/chronicPainImpact',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.pain_managementChronicPainImpact || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.chronicPainImpact(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /pain_management/chronicPainImpact', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/pain_management/assessments/fibromyalgiaScore
router.post('/assessments/fibromyalgiaScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.pain_managementFibromyalgiaScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.fibromyalgiaScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /pain_management/fibromyalgiaScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
