// filepath: namaweb/psychiatry_router.js
// psychiatry — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./psychiatry_engine');

// GET /api/psychiatry/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'psychiatry', version: engine.VERSION }));

// GET /api/psychiatry/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'psychiatry' });
        } catch (err) {
            console.error('GET /psychiatry/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/psychiatry/assessments/phq9Score
router.post('/assessments/phq9Score',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.psychiatryPhq9Score || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.phq9Score(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /psychiatry/phq9Score', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/psychiatry/assessments/gad7Score
router.post('/assessments/gad7Score',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.psychiatryGad7Score || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.gad7Score(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /psychiatry/gad7Score', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/psychiatry/assessments/pssScore
router.post('/assessments/pssScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.psychiatryPssScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.pssScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /psychiatry/pssScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/psychiatry/assessments/mmseScore
router.post('/assessments/mmseScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.psychiatryMmseScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.mmseScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /psychiatry/mmseScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/psychiatry/assessments/yBOCS
router.post('/assessments/yBOCS',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.psychiatryYBOCS || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.yBOCS(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /psychiatry/yBOCS', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
