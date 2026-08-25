// filepath: namaweb/physiotherapy_router.js
// physiotherapy — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./physiotherapy_engine');

// GET /api/physiotherapy/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'physiotherapy', version: engine.VERSION }));

// GET /api/physiotherapy/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'physiotherapy' });
        } catch (err) {
            console.error('GET /physiotherapy/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/physiotherapy/assessments/rangeOfMotion
router.post('/assessments/rangeOfMotion',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.physiotherapyRangeOfMotion || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.rangeOfMotion(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /physiotherapy/rangeOfMotion', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/physiotherapy/assessments/muscleStrengthMRC
router.post('/assessments/muscleStrengthMRC',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.physiotherapyMuscleStrengthMRC || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.muscleStrengthMRC(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /physiotherapy/muscleStrengthMRC', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/physiotherapy/assessments/flexibilityTest
router.post('/assessments/flexibilityTest',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.physiotherapyFlexibilityTest || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.flexibilityTest(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /physiotherapy/flexibilityTest', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/physiotherapy/assessments/enduranceTest
router.post('/assessments/enduranceTest',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.physiotherapyEnduranceTest || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.enduranceTest(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /physiotherapy/enduranceTest', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/physiotherapy/assessments/painOnMovement
router.post('/assessments/painOnMovement',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.physiotherapyPainOnMovement || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.painOnMovement(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /physiotherapy/painOnMovement', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
