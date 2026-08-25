// filepath: namaweb/wound_care_router.js
// wound_care — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./wound_care_engine');

// GET /api/wound_care/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'wound_care', version: engine.VERSION }));

// GET /api/wound_care/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'wound_care' });
        } catch (err) {
            console.error('GET /wound_care/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/wound_care/assessments/wagnerUlcerGrade
router.post('/assessments/wagnerUlcerGrade',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.wound_careWagnerUlcerGrade || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.wagnerUlcerGrade(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /wound_care/wagnerUlcerGrade', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/wound_care/assessments/pressureUlcerStage
router.post('/assessments/pressureUlcerStage',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.wound_carePressureUlcerStage || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.pressureUlcerStage(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /wound_care/pressureUlcerStage', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/wound_care/assessments/woundHealingPhase
router.post('/assessments/woundHealingPhase',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.wound_careWoundHealingPhase || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.woundHealingPhase(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /wound_care/woundHealingPhase', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/wound_care/assessments/dfuClassification
router.post('/assessments/dfuClassification',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.wound_careDfuClassification || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.dfuClassification(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /wound_care/dfuClassification', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/wound_care/assessments/burnSurfaceArea
router.post('/assessments/burnSurfaceArea',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.wound_careBurnSurfaceArea || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.burnSurfaceArea(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /wound_care/burnSurfaceArea', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
