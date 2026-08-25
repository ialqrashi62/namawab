// filepath: namaweb/rehabilitation_router.js
// rehabilitation — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./rehabilitation_engine');

// GET /api/rehabilitation/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'rehabilitation', version: engine.VERSION }));

// GET /api/rehabilitation/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'rehabilitation' });
        } catch (err) {
            console.error('GET /rehabilitation/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/rehabilitation/assessments/functionalIndependence
router.post('/assessments/functionalIndependence',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.rehabilitationFunctionalIndependence || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.functionalIndependence(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /rehabilitation/functionalIndependence', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/rehabilitation/assessments/bergBalance
router.post('/assessments/bergBalance',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.rehabilitationBergBalance || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.bergBalance(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /rehabilitation/bergBalance', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/rehabilitation/assessments/gaitSpeed
router.post('/assessments/gaitSpeed',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.rehabilitationGaitSpeed || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.gaitSpeed(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /rehabilitation/gaitSpeed', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/rehabilitation/assessments/strokeRecoveryFuglMeyer
router.post('/assessments/strokeRecoveryFuglMeyer',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.rehabilitationStrokeRecoveryFuglMeyer || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.strokeRecoveryFuglMeyer(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /rehabilitation/strokeRecoveryFuglMeyer', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/rehabilitation/assessments/amputationKLevel
router.post('/assessments/amputationKLevel',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.rehabilitationAmputationKLevel || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.amputationKLevel(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /rehabilitation/amputationKLevel', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
