// filepath: namaweb/cicu_router.js
// cicu — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./cicu_engine');

// GET /api/cicu/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'cicu', version: engine.VERSION }));

// GET /api/cicu/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'cicu' });
        } catch (err) {
            console.error('GET /cicu/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/cicu/assessments/stsRiskScore
router.post('/assessments/stsRiskScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.cicuStsRiskScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.stsRiskScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /cicu/stsRiskScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/cicu/assessments/cabgMortalityRisk
router.post('/assessments/cabgMortalityRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.cicuCabgMortalityRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.cabgMortalityRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /cicu/cabgMortalityRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/cicu/assessments/valveReplacementRisk
router.post('/assessments/valveReplacementRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.cicuValveReplacementRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.valveReplacementRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /cicu/valveReplacementRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/cicu/assessments/postOpAfibRisk
router.post('/assessments/postOpAfibRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.cicuPostOpAfibRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.postOpAfibRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /cicu/postOpAfibRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/cicu/assessments/icuLengthOfStay
router.post('/assessments/icuLengthOfStay',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.cicuIcuLengthOfStay || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.icuLengthOfStay(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /cicu/icuLengthOfStay', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
