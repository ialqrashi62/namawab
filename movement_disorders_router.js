// filepath: namaweb/movement_disorders_router.js
// movement_disorders — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./movement_disorders_engine');

// GET /api/movement_disorders/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'movement_disorders', version: engine.VERSION }));

// GET /api/movement_disorders/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'movement_disorders' });
        } catch (err) {
            console.error('GET /movement_disorders/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/movement_disorders/assessments/updrsScore
router.post('/assessments/updrsScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.movement_disordersUpdrsScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.updrsScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /movement_disorders/updrsScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/movement_disorders/assessments/hoehnYahrStage
router.post('/assessments/hoehnYahrStage',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.movement_disordersHoehnYahrStage || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.hoehnYahrStage(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /movement_disorders/hoehnYahrStage', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/movement_disorders/assessments/dyskinesiaRating
router.post('/assessments/dyskinesiaRating',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.movement_disordersDyskinesiaRating || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.dyskinesiaRating(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /movement_disorders/dyskinesiaRating', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/movement_disorders/assessments/tremorSeverity
router.post('/assessments/tremorSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.movement_disordersTremorSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.tremorSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /movement_disorders/tremorSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/movement_disorders/assessments/responseToLevodopa
router.post('/assessments/responseToLevodopa',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.movement_disordersResponseToLevodopa || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.responseToLevodopa(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /movement_disorders/responseToLevodopa', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
