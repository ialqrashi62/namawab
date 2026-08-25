// filepath: namaweb/immunology_router.js
// immunology — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./immunology_engine');

// GET /api/immunology/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'immunology', version: engine.VERSION }));

// GET /api/immunology/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'immunology' });
        } catch (err) {
            console.error('GET /immunology/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/immunology/assessments/autoimmuneRisk
router.post('/assessments/autoimmuneRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.immunologyAutoimmuneRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.autoimmuneRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /immunology/autoimmuneRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/immunology/assessments/immunosuppressionLevel
router.post('/assessments/immunosuppressionLevel',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.immunologyImmunosuppressionLevel || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.immunosuppressionLevel(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /immunology/immunosuppressionLevel', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/immunology/assessments/vaccineResponsePredict
router.post('/assessments/vaccineResponsePredict',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.immunologyVaccineResponsePredict || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.vaccineResponsePredict(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /immunology/vaccineResponsePredict', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/immunology/assessments/igaDeficiency
router.post('/assessments/igaDeficiency',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.immunologyIgaDeficiency || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.igaDeficiency(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /immunology/igaDeficiency', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/immunology/assessments/complementDeficiency
router.post('/assessments/complementDeficiency',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.immunologyComplementDeficiency || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.complementDeficiency(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /immunology/complementDeficiency', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
