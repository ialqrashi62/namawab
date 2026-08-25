// filepath: namaweb/chaplaincy_router.js
// chaplaincy — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./chaplaincy_engine');

// GET /api/chaplaincy/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'chaplaincy', version: engine.VERSION }));

// GET /api/chaplaincy/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'chaplaincy' });
        } catch (err) {
            console.error('GET /chaplaincy/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/chaplaincy/assessments/spiritualAssessment
router.post('/assessments/spiritualAssessment',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.chaplaincySpiritualAssessment || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.spiritualAssessment(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /chaplaincy/spiritualAssessment', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/chaplaincy/assessments/religiousNeeds
router.post('/assessments/religiousNeeds',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.chaplaincyReligiousNeeds || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.religiousNeeds(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /chaplaincy/religiousNeeds', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/chaplaincy/assessments/endOfLifeSpiritualCare
router.post('/assessments/endOfLifeSpiritualCare',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.chaplaincyEndOfLifeSpiritualCare || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.endOfLifeSpiritualCare(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /chaplaincy/endOfLifeSpiritualCare', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/chaplaincy/assessments/griefStage
router.post('/assessments/griefStage',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.chaplaincyGriefStage || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.griefStage(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /chaplaincy/griefStage', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/chaplaincy/assessments/faithCommunitySupport
router.post('/assessments/faithCommunitySupport',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.chaplaincyFaithCommunitySupport || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.faithCommunitySupport(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /chaplaincy/faithCommunitySupport', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
