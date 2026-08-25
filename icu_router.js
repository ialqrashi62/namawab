// filepath: namaweb/icu_router.js
// icu — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./icu_engine');

// GET /api/icu/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'icu', version: engine.VERSION }));

// GET /api/icu/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'icu' });
        } catch (err) {
            console.error('GET /icu/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/icu/assessments/sofaScore
router.post('/assessments/sofaScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.icuSofaScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.sofaScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /icu/sofaScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/icu/assessments/apacheII
router.post('/assessments/apacheII',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.icuApacheII || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.apacheII(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /icu/apacheII', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/icu/assessments/sapsII
router.post('/assessments/sapsII',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.icuSapsII || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.sapsII(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /icu/sapsII', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/icu/assessments/lodsScore
router.post('/assessments/lodsScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.icuLodsScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.lodsScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /icu/lodsScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/icu/assessments/qSOFA
router.post('/assessments/qSOFA',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.icuQSOFA || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.qSOFA(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /icu/qSOFA', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
