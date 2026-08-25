// filepath: namaweb/radiology_router.js
// radiology — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./radiology_engine');

// GET /api/radiology/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'radiology', version: engine.VERSION }));

// GET /api/radiology/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'radiology' });
        } catch (err) {
            console.error('GET /radiology/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/radiology/assessments/lungRadsCategory
router.post('/assessments/lungRadsCategory',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.radiologyLungRadsCategory || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.lungRadsCategory(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /radiology/lungRadsCategory', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/radiology/assessments/biRadsCategory
router.post('/assessments/biRadsCategory',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.radiologyBiRadsCategory || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.biRadsCategory(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /radiology/biRadsCategory', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/radiology/assessments/tiRadsCategory
router.post('/assessments/tiRadsCategory',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.radiologyTiRadsCategory || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.tiRadsCategory(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /radiology/tiRadsCategory', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/radiology/assessments/liRadsCategory
router.post('/assessments/liRadsCategory',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.radiologyLiRadsCategory || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.liRadsCategory(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /radiology/liRadsCategory', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/radiology/assessments/piRadsCategory
router.post('/assessments/piRadsCategory',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.radiologyPiRadsCategory || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.piRadsCategory(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /radiology/piRadsCategory', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
