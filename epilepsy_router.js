// filepath: namaweb/epilepsy_router.js
// epilepsy — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./epilepsy_engine');

// GET /api/epilepsy/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'epilepsy', version: engine.VERSION }));

// GET /api/epilepsy/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'epilepsy' });
        } catch (err) {
            console.error('GET /epilepsy/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/epilepsy/assessments/engelOutcomeClass
router.post('/assessments/engelOutcomeClass',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.epilepsyEngelOutcomeClass || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.engelOutcomeClass(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /epilepsy/engelOutcomeClass', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/epilepsy/assessments/ilaeOutcomeClass
router.post('/assessments/ilaeOutcomeClass',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.epilepsyIlaeOutcomeClass || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.ilaeOutcomeClass(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /epilepsy/ilaeOutcomeClass', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/epilepsy/assessments/seizureFrequency
router.post('/assessments/seizureFrequency',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.epilepsySeizureFrequency || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.seizureFrequency(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /epilepsy/seizureFrequency', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/epilepsy/assessments/aedSerumLevel
router.post('/assessments/aedSerumLevel',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.epilepsyAedSerumLevel || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.aedSerumLevel(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /epilepsy/aedSerumLevel', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/epilepsy/assessments/sudepRisk
router.post('/assessments/sudepRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.epilepsySudepRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.sudepRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /epilepsy/sudepRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
