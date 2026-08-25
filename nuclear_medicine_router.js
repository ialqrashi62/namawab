// filepath: namaweb/nuclear_medicine_router.js
// nuclear_medicine — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./nuclear_medicine_engine');

// GET /api/nuclear_medicine/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'nuclear_medicine', version: engine.VERSION }));

// GET /api/nuclear_medicine/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'nuclear_medicine' });
        } catch (err) {
            console.error('GET /nuclear_medicine/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/nuclear_medicine/assessments/petAvidLesion
router.post('/assessments/petAvidLesion',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.nuclear_medicinePetAvidLesion || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.petAvidLesion(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /nuclear_medicine/petAvidLesion', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/nuclear_medicine/assessments/thyroidUptake
router.post('/assessments/thyroidUptake',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.nuclear_medicineThyroidUptake || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.thyroidUptake(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /nuclear_medicine/thyroidUptake', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/nuclear_medicine/assessments/boneScanHotSpot
router.post('/assessments/boneScanHotSpot',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.nuclear_medicineBoneScanHotSpot || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.boneScanHotSpot(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /nuclear_medicine/boneScanHotSpot', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/nuclear_medicine/assessments/myocardialPerfusionDefect
router.post('/assessments/myocardialPerfusionDefect',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.nuclear_medicineMyocardialPerfusionDefect || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.myocardialPerfusionDefect(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /nuclear_medicine/myocardialPerfusionDefect', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/nuclear_medicine/assessments/renogramPattern
router.post('/assessments/renogramPattern',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.nuclear_medicineRenogramPattern || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.renogramPattern(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /nuclear_medicine/renogramPattern', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
