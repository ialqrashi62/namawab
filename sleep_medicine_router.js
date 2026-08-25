// filepath: namaweb/sleep_medicine_router.js
// sleep_medicine — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./sleep_medicine_engine');

// GET /api/sleep_medicine/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'sleep_medicine', version: engine.VERSION }));

// GET /api/sleep_medicine/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'sleep_medicine' });
        } catch (err) {
            console.error('GET /sleep_medicine/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/sleep_medicine/assessments/epworthSleepiness
router.post('/assessments/epworthSleepiness',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.sleep_medicineEpworthSleepiness || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.epworthSleepiness(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /sleep_medicine/epworthSleepiness', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/sleep_medicine/assessments/berlinQuestionnaire
router.post('/assessments/berlinQuestionnaire',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.sleep_medicineBerlinQuestionnaire || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.berlinQuestionnaire(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /sleep_medicine/berlinQuestionnaire', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/sleep_medicine/assessments/psqiScore
router.post('/assessments/psqiScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.sleep_medicinePsqiScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.psqiScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /sleep_medicine/psqiScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/sleep_medicine/assessments/stopBangScore
router.post('/assessments/stopBangScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.sleep_medicineStopBangScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.stopBangScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /sleep_medicine/stopBangScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/sleep_medicine/assessments/insomniaSeverity
router.post('/assessments/insomniaSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.sleep_medicineInsomniaSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.insomniaSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /sleep_medicine/insomniaSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
