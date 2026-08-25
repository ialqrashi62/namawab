// filepath: namaweb/hematology_router.js
// hematology — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./hematology_engine');

// GET /api/hematology/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'hematology', version: engine.VERSION }));

// GET /api/hematology/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'hematology' });
        } catch (err) {
            console.error('GET /hematology/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/hematology/assessments/anemiaClassification
router.post('/assessments/anemiaClassification',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.hematologyAnemiaClassification || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.anemiaClassification(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /hematology/anemiaClassification', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/hematology/assessments/coagulopathyWorkup
router.post('/assessments/coagulopathyWorkup',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.hematologyCoagulopathyWorkup || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.coagulopathyWorkup(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /hematology/coagulopathyWorkup', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/hematology/assessments/thrombocytopeniaCause
router.post('/assessments/thrombocytopeniaCause',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.hematologyThrombocytopeniaCause || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.thrombocytopeniaCause(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /hematology/thrombocytopeniaCause', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/hematology/assessments/leukemiaRiskScore
router.post('/assessments/leukemiaRiskScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.hematologyLeukemiaRiskScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.leukemiaRiskScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /hematology/leukemiaRiskScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/hematology/assessments/lymphomaStaging
router.post('/assessments/lymphomaStaging',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.hematologyLymphomaStaging || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.lymphomaStaging(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /hematology/lymphomaStaging', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
