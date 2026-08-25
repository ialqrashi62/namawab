// filepath: namaweb/fetal_medicine_router.js
// fetal_medicine — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./fetal_medicine_engine');

// GET /api/fetal_medicine/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'fetal_medicine', version: engine.VERSION }));

// GET /api/fetal_medicine/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'fetal_medicine' });
        } catch (err) {
            console.error('GET /fetal_medicine/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/fetal_medicine/assessments/firstTrimesterScreen
router.post('/assessments/firstTrimesterScreen',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.fetal_medicineFirstTrimesterScreen || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.firstTrimesterScreen(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /fetal_medicine/firstTrimesterScreen', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/fetal_medicine/assessments/cfDNAInterpretation
router.post('/assessments/cfDNAInterpretation',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.fetal_medicineCfDNAInterpretation || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.cfDNAInterpretation(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /fetal_medicine/cfDNAInterpretation', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/fetal_medicine/assessments/fetalGrowthCentile
router.post('/assessments/fetalGrowthCentile',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.fetal_medicineFetalGrowthCentile || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.fetalGrowthCentile(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /fetal_medicine/fetalGrowthCentile', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/fetal_medicine/assessments/umbilicalDoppler
router.post('/assessments/umbilicalDoppler',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.fetal_medicineUmbilicalDoppler || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.umbilicalDoppler(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /fetal_medicine/umbilicalDoppler', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/fetal_medicine/assessments/fetalAnomalyScore
router.post('/assessments/fetalAnomalyScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.fetal_medicineFetalAnomalyScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.fetalAnomalyScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /fetal_medicine/fetalAnomalyScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
