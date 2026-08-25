// filepath: namaweb/genetics_router.js
// genetics — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./genetics_engine');

// GET /api/genetics/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'genetics', version: engine.VERSION }));

// GET /api/genetics/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'genetics' });
        } catch (err) {
            console.error('GET /genetics/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/genetics/assessments/breastCancerBRCA
router.post('/assessments/breastCancerBRCA',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.geneticsBreastCancerBRCA || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.breastCancerBRCA(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /genetics/breastCancerBRCA', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/genetics/assessments/lynchSyndromeRisk
router.post('/assessments/lynchSyndromeRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.geneticsLynchSyndromeRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.lynchSyndromeRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /genetics/lynchSyndromeRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/genetics/assessments/cysticFibrosisCarrier
router.post('/assessments/cysticFibrosisCarrier',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.geneticsCysticFibrosisCarrier || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.cysticFibrosisCarrier(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /genetics/cysticFibrosisCarrier', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/genetics/assessments/sickleCellCarrier
router.post('/assessments/sickleCellCarrier',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.geneticsSickleCellCarrier || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.sickleCellCarrier(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /genetics/sickleCellCarrier', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/genetics/assessments/pharmacogenomicCYP
router.post('/assessments/pharmacogenomicCYP',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.geneticsPharmacogenomicCYP || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.pharmacogenomicCYP(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /genetics/pharmacogenomicCYP', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
