// filepath: namaweb/urology_router.js
// urology — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./urology_engine');

// GET /api/urology/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'urology', version: engine.VERSION }));

// GET /api/urology/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'urology' });
        } catch (err) {
            console.error('GET /urology/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/urology/assessments/ipssScore
router.post('/assessments/ipssScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.urologyIpssScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.ipssScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /urology/ipssScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/urology/assessments/psaRiskScore
router.post('/assessments/psaRiskScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.urologyPsaRiskScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.psaRiskScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /urology/psaRiskScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/urology/assessments/stoneSizeClassification
router.post('/assessments/stoneSizeClassification',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.urologyStoneSizeClassification || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.stoneSizeClassification(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /urology/stoneSizeClassification', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/urology/assessments/uroflowmetryScore
router.post('/assessments/uroflowmetryScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.urologyUroflowmetryScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.uroflowmetryScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /urology/uroflowmetryScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/urology/assessments/renalFailureRisk
router.post('/assessments/renalFailureRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.urologyRenalFailureRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.renalFailureRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /urology/renalFailureRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
