// filepath: namaweb/picu_router.js
// picu — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./picu_engine');

// GET /api/picu/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'picu', version: engine.VERSION }));

// GET /api/picu/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'picu' });
        } catch (err) {
            console.error('GET /picu/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/picu/assessments/pelodScore
router.post('/assessments/pelodScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.picuPelodScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.pelodScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /picu/pelodScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/picu/assessments/prismScore
router.post('/assessments/prismScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.picuPrismScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.prismScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /picu/prismScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/picu/assessments/pediatricSepsis
router.post('/assessments/pediatricSepsis',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.picuPediatricSepsis || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.pediatricSepsis(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /picu/pediatricSepsis', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/picu/assessments/vasoactiveScore
router.post('/assessments/vasoactiveScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.picuVasoactiveScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.vasoactiveScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /picu/vasoactiveScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/picu/assessments/mechanicalVentilationDays
router.post('/assessments/mechanicalVentilationDays',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.picuMechanicalVentilationDays || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.mechanicalVentilationDays(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /picu/mechanicalVentilationDays', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
