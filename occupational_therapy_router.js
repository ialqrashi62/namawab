// filepath: namaweb/occupational_therapy_router.js
// occupational_therapy — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./occupational_therapy_engine');

// GET /api/occupational_therapy/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'occupational_therapy', version: engine.VERSION }));

// GET /api/occupational_therapy/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'occupational_therapy' });
        } catch (err) {
            console.error('GET /occupational_therapy/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/occupational_therapy/assessments/adlScore
router.post('/assessments/adlScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.occupational_therapyAdlScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.adlScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /occupational_therapy/adlScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/occupational_therapy/assessments/cognitiveAssessment
router.post('/assessments/cognitiveAssessment',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.occupational_therapyCognitiveAssessment || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.cognitiveAssessment(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /occupational_therapy/cognitiveAssessment', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/occupational_therapy/assessments/sensoryProfile
router.post('/assessments/sensoryProfile',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.occupational_therapySensoryProfile || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.sensoryProfile(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /occupational_therapy/sensoryProfile', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/occupational_therapy/assessments/workCapacityEval
router.post('/assessments/workCapacityEval',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.occupational_therapyWorkCapacityEval || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.workCapacityEval(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /occupational_therapy/workCapacityEval', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/occupational_therapy/assessments/handFunctionDexterity
router.post('/assessments/handFunctionDexterity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.occupational_therapyHandFunctionDexterity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.handFunctionDexterity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /occupational_therapy/handFunctionDexterity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
