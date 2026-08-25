// filepath: namaweb/movement_router.js
// movement — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./movement_engine');

// GET /api/movement/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'movement', version: engine.VERSION }));

// GET /api/movement/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'movement' });
        } catch (err) {
            console.error('GET /movement/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/movement/assessments/tremorAmplitude
router.post('/assessments/tremorAmplitude',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.movementTremorAmplitude || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.tremorAmplitude(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /movement/tremorAmplitude', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/movement/assessments/bradykinesiaScore
router.post('/assessments/bradykinesiaScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.movementBradykinesiaScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.bradykinesiaScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /movement/bradykinesiaScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/movement/assessments/rigidityRating
router.post('/assessments/rigidityRating',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.movementRigidityRating || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.rigidityRating(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /movement/rigidityRating', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/movement/assessments/posturalInstability
router.post('/assessments/posturalInstability',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.movementPosturalInstability || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.posturalInstability(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /movement/posturalInstability', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/movement/assessments/gaitFreezing
router.post('/assessments/gaitFreezing',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.movementGaitFreezing || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.gaitFreezing(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /movement/gaitFreezing', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
