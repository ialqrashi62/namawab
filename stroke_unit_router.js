// filepath: namaweb/stroke_unit_router.js
// stroke_unit — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./stroke_unit_engine');

// GET /api/stroke_unit/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'stroke_unit', version: engine.VERSION }));

// GET /api/stroke_unit/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'stroke_unit' });
        } catch (err) {
            console.error('GET /stroke_unit/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/stroke_unit/assessments/nihssScore
router.post('/assessments/nihssScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.stroke_unitNihssScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.nihssScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /stroke_unit/nihssScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/stroke_unit/assessments/modifiedRankinScale
router.post('/assessments/modifiedRankinScale',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.stroke_unitModifiedRankinScale || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.modifiedRankinScale(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /stroke_unit/modifiedRankinScale', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/stroke_unit/assessments/barthelIndex
router.post('/assessments/barthelIndex',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.stroke_unitBarthelIndex || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.barthelIndex(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /stroke_unit/barthelIndex', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/stroke_unit/assessments/ashworthSpasticity
router.post('/assessments/ashworthSpasticity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.stroke_unitAshworthSpasticity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.ashworthSpasticity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /stroke_unit/ashworthSpasticity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/stroke_unit/assessments/strokeRecoveryStage
router.post('/assessments/strokeRecoveryStage',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.stroke_unitStrokeRecoveryStage || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.strokeRecoveryStage(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /stroke_unit/strokeRecoveryStage', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
