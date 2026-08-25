// filepath: namaweb/dermatology_router.js
// dermatology — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./dermatology_engine');

// GET /api/dermatology/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'dermatology', version: engine.VERSION }));

// GET /api/dermatology/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'dermatology' });
        } catch (err) {
            console.error('GET /dermatology/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/dermatology/assessments/pasoriasisSeverity
router.post('/assessments/pasoriasisSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.dermatologyPasoriasisSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.pasoriasisSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /dermatology/pasoriasisSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/dermatology/assessments/melanomaBreslow
router.post('/assessments/melanomaBreslow',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.dermatologyMelanomaBreslow || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.melanomaBreslow(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /dermatology/melanomaBreslow', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/dermatology/assessments/dermatitisSeverity
router.post('/assessments/dermatitisSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.dermatologyDermatitisSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.dermatitisSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /dermatology/dermatitisSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/dermatology/assessments/scoradScore
router.post('/assessments/scoradScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.dermatologyScoradScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.scoradScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /dermatology/scoradScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/dermatology/assessments/drugReactionSeverity
router.post('/assessments/drugReactionSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.dermatologyDrugReactionSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.drugReactionSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /dermatology/drugReactionSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
