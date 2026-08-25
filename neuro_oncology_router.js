// filepath: namaweb/neuro_oncology_router.js
// neuro_oncology — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./neuro_oncology_engine');

// GET /api/neuro_oncology/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'neuro_oncology', version: engine.VERSION }));

// GET /api/neuro_oncology/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'neuro_oncology' });
        } catch (err) {
            console.error('GET /neuro_oncology/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/neuro_oncology/assessments/kpsScore
router.post('/assessments/kpsScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neuro_oncologyKpsScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.kpsScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neuro_oncology/kpsScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/neuro_oncology/assessments/glioblastomaMGMT
router.post('/assessments/glioblastomaMGMT',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neuro_oncologyGlioblastomaMGMT || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.glioblastomaMGMT(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neuro_oncology/glioblastomaMGMT', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/neuro_oncology/assessments/metastasisNumber
router.post('/assessments/metastasisNumber',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neuro_oncologyMetastasisNumber || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.metastasisNumber(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neuro_oncology/metastasisNumber', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/neuro_oncology/assessments/recursivePartitioning
router.post('/assessments/recursivePartitioning',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neuro_oncologyRecursivePartitioning || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.recursivePartitioning(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neuro_oncology/recursivePartitioning', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/neuro_oncology/assessments/prognosisEstimate
router.post('/assessments/prognosisEstimate',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neuro_oncologyPrognosisEstimate || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.prognosisEstimate(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neuro_oncology/prognosisEstimate', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
