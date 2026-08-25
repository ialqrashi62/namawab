// filepath: namaweb/pulmonary_rehab_router.js
// pulmonary_rehab — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./pulmonary_rehab_engine');

// GET /api/pulmonary_rehab/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'pulmonary_rehab', version: engine.VERSION }));

// GET /api/pulmonary_rehab/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'pulmonary_rehab' });
        } catch (err) {
            console.error('GET /pulmonary_rehab/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/pulmonary_rehab/assessments/sixMinuteWalk
router.post('/assessments/sixMinuteWalk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.pulmonary_rehabSixMinuteWalk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.sixMinuteWalk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /pulmonary_rehab/sixMinuteWalk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/pulmonary_rehab/assessments/dyspneaScale
router.post('/assessments/dyspneaScale',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.pulmonary_rehabDyspneaScale || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.dyspneaScale(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /pulmonary_rehab/dyspneaScale', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/pulmonary_rehab/assessments/exerciseTolerance
router.post('/assessments/exerciseTolerance',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.pulmonary_rehabExerciseTolerance || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.exerciseTolerance(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /pulmonary_rehab/exerciseTolerance', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/pulmonary_rehab/assessments/qualityOfLifeScore
router.post('/assessments/qualityOfLifeScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.pulmonary_rehabQualityOfLifeScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.qualityOfLifeScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /pulmonary_rehab/qualityOfLifeScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/pulmonary_rehab/assessments/programCompletion
router.post('/assessments/programCompletion',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.pulmonary_rehabProgramCompletion || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.programCompletion(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /pulmonary_rehab/programCompletion', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
