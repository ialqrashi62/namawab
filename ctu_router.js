// filepath: namaweb/ctu_router.js
// ctu — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./ctu_engine');

// GET /api/ctu/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'ctu', version: engine.VERSION }));

// GET /api/ctu/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'ctu' });
        } catch (err) {
            console.error('GET /ctu/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/ctu/assessments/copdExacerbation
router.post('/assessments/copdExacerbation',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ctuCopdExacerbation || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.copdExacerbation(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ctu/copdExacerbation', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ctu/assessments/asthmaControl
router.post('/assessments/asthmaControl',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ctuAsthmaControl || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.asthmaControl(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ctu/asthmaControl', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ctu/assessments/ardsSeverity
router.post('/assessments/ardsSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ctuArdsSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.ardsSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ctu/ardsSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ctu/assessments/weaningSuccessProbability
router.post('/assessments/weaningSuccessProbability',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ctuWeaningSuccessProbability || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.weaningSuccessProbability(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ctu/weaningSuccessProbability', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ctu/assessments/longTermOxygenNeed
router.post('/assessments/longTermOxygenNeed',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ctuLongTermOxygenNeed || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.longTermOxygenNeed(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ctu/longTermOxygenNeed', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
