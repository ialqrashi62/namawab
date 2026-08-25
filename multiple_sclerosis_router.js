// filepath: namaweb/multiple_sclerosis_router.js
// multiple_sclerosis — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./multiple_sclerosis_engine');

// GET /api/multiple_sclerosis/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'multiple_sclerosis', version: engine.VERSION }));

// GET /api/multiple_sclerosis/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'multiple_sclerosis' });
        } catch (err) {
            console.error('GET /multiple_sclerosis/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/multiple_sclerosis/assessments/edssScore
router.post('/assessments/edssScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.multiple_sclerosisEdssScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.edssScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /multiple_sclerosis/edssScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/multiple_sclerosis/assessments/msFunctionalComposite
router.post('/assessments/msFunctionalComposite',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.multiple_sclerosisMsFunctionalComposite || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.msFunctionalComposite(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /multiple_sclerosis/msFunctionalComposite', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/multiple_sclerosis/assessments/relapseRate
router.post('/assessments/relapseRate',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.multiple_sclerosisRelapseRate || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.relapseRate(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /multiple_sclerosis/relapseRate', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/multiple_sclerosis/assessments/mriLesionCount
router.post('/assessments/mriLesionCount',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.multiple_sclerosisMriLesionCount || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.mriLesionCount(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /multiple_sclerosis/mriLesionCount', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/multiple_sclerosis/assessments/diseaseProgression
router.post('/assessments/diseaseProgression',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.multiple_sclerosisDiseaseProgression || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.diseaseProgression(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /multiple_sclerosis/diseaseProgression', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
