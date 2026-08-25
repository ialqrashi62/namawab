// filepath: namaweb/palliative_care_router.js
// palliative_care — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./palliative_care_engine');

// GET /api/palliative_care/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'palliative_care', version: engine.VERSION }));

// GET /api/palliative_care/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'palliative_care' });
        } catch (err) {
            console.error('GET /palliative_care/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/palliative_care/assessments/ppsScore
router.post('/assessments/ppsScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.palliative_carePpsScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.ppsScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /palliative_care/ppsScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/palliative_care/assessments/ecogPerformance
router.post('/assessments/ecogPerformance',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.palliative_careEcogPerformance || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.ecogPerformance(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /palliative_care/ecogPerformance', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/palliative_care/assessments/symptomBurden
router.post('/assessments/symptomBurden',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.palliative_careSymptomBurden || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.symptomBurden(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /palliative_care/symptomBurden', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/palliative_care/assessments/prognosisEstimate
router.post('/assessments/prognosisEstimate',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.palliative_carePrognosisEstimate || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.prognosisEstimate(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /palliative_care/prognosisEstimate', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/palliative_care/assessments/spiritualDistress
router.post('/assessments/spiritualDistress',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.palliative_careSpiritualDistress || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.spiritualDistress(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /palliative_care/spiritualDistress', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
