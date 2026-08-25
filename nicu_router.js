// filepath: namaweb/nicu_router.js
// nicu — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./nicu_engine');

// GET /api/nicu/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'nicu', version: engine.VERSION }));

// GET /api/nicu/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'nicu' });
        } catch (err) {
            console.error('GET /nicu/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/nicu/assessments/snappeII
router.post('/assessments/snappeII',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.nicuSnappeII || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.snappeII(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /nicu/snappeII', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/nicu/assessments/neonatalMortality
router.post('/assessments/neonatalMortality',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.nicuNeonatalMortality || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.neonatalMortality(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /nicu/neonatalMortality', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/nicu/assessments/ventilationDays
router.post('/assessments/ventilationDays',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.nicuVentilationDays || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.ventilationDays(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /nicu/ventilationDays', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/nicu/assessments/neonatalPainScore
router.post('/assessments/neonatalPainScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.nicuNeonatalPainScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.neonatalPainScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /nicu/neonatalPainScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/nicu/assessments/parenteralNutrition
router.post('/assessments/parenteralNutrition',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.nicuParenteralNutrition || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.parenteralNutrition(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /nicu/parenteralNutrition', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
