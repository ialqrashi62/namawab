// filepath: namaweb/trauma_surgery_router.js
// trauma_surgery — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./trauma_surgery_engine');

// GET /api/trauma_surgery/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'trauma_surgery', version: engine.VERSION }));

// GET /api/trauma_surgery/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'trauma_surgery' });
        } catch (err) {
            console.error('GET /trauma_surgery/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/trauma_surgery/assessments/issScore
router.post('/assessments/issScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.trauma_surgeryIssScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.issScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /trauma_surgery/issScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/trauma_surgery/assessments/trissProbability
router.post('/assessments/trissProbability',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.trauma_surgeryTrissProbability || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.trissProbability(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /trauma_surgery/trissProbability', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/trauma_surgery/assessments/rtsScore
router.post('/assessments/rtsScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.trauma_surgeryRtsScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.rtsScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /trauma_surgery/rtsScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/trauma_surgery/assessments/gcsScore
router.post('/assessments/gcsScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.trauma_surgeryGcsScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.gcsScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /trauma_surgery/gcsScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/trauma_surgery/assessments/traumaActivation
router.post('/assessments/traumaActivation',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.trauma_surgeryTraumaActivation || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.traumaActivation(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /trauma_surgery/traumaActivation', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
