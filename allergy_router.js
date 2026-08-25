// filepath: namaweb/allergy_router.js
// allergy — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./allergy_engine');

// GET /api/allergy/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'allergy', version: engine.VERSION }));

// GET /api/allergy/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'allergy' });
        } catch (err) {
            console.error('GET /allergy/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/allergy/assessments/skinPrickInterpretation
router.post('/assessments/skinPrickInterpretation',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.allergySkinPrickInterpretation || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.skinPrickInterpretation(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /allergy/skinPrickInterpretation', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/allergy/assessments/igeLevelInterpretation
router.post('/assessments/igeLevelInterpretation',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.allergyIgeLevelInterpretation || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.igeLevelInterpretation(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /allergy/igeLevelInterpretation', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/allergy/assessments/anaphylaxisSeverity
router.post('/assessments/anaphylaxisSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.allergyAnaphylaxisSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.anaphylaxisSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /allergy/anaphylaxisSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/allergy/assessments/foodAllergyScore
router.post('/assessments/foodAllergyScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.allergyFoodAllergyScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.foodAllergyScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /allergy/foodAllergyScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/allergy/assessments/asthmaAllergic
router.post('/assessments/asthmaAllergic',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.allergyAsthmaAllergic || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.asthmaAllergic(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /allergy/asthmaAllergic', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
