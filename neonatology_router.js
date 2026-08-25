// filepath: namaweb/neonatology_router.js
// neonatology — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./neonatology_engine');

// GET /api/neonatology/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'neonatology', version: engine.VERSION }));

// GET /api/neonatology/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'neonatology' });
        } catch (err) {
            console.error('GET /neonatology/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/neonatology/assessments/apgarScore
router.post('/assessments/apgarScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neonatologyApgarScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.apgarScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neonatology/apgarScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/neonatology/assessments/silvermanScore
router.post('/assessments/silvermanScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neonatologySilvermanScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.silvermanScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neonatology/silvermanScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/neonatology/assessments/ballardScore
router.post('/assessments/ballardScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neonatologyBallardScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.ballardScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neonatology/ballardScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/neonatology/assessments/neonatalSepsisRisk
router.post('/assessments/neonatalSepsisRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neonatologyNeonatalSepsisRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.neonatalSepsisRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neonatology/neonatalSepsisRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/neonatology/assessments/bronchopulmonaryDysplasia
router.post('/assessments/bronchopulmonaryDysplasia',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neonatologyBronchopulmonaryDysplasia || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.bronchopulmonaryDysplasia(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neonatology/bronchopulmonaryDysplasia', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
