// filepath: namaweb/headache_router.js
// headache — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./headache_engine');

// GET /api/headache/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'headache', version: engine.VERSION }));

// GET /api/headache/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'headache' });
        } catch (err) {
            console.error('GET /headache/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/headache/assessments/midasScore
router.post('/assessments/midasScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.headacheMidasScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.midasScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /headache/midasScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/headache/assessments/hit6Score
router.post('/assessments/hit6Score',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.headacheHit6Score || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.hit6Score(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /headache/hit6Score', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/headache/assessments/chronicDailyHeadache
router.post('/assessments/chronicDailyHeadache',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.headacheChronicDailyHeadache || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.chronicDailyHeadache(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /headache/chronicDailyHeadache', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/headache/assessments/medicationOveruse
router.post('/assessments/medicationOveruse',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.headacheMedicationOveruse || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.medicationOveruse(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /headache/medicationOveruse', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/headache/assessments/temporalPattern
router.post('/assessments/temporalPattern',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.headacheTemporalPattern || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.temporalPattern(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /headache/temporalPattern', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
