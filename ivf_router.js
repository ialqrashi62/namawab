// filepath: namaweb/ivf_router.js
// ivf — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./ivf_engine');

// GET /api/ivf/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'ivf', version: engine.VERSION }));

// GET /api/ivf/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'ivf' });
        } catch (err) {
            console.error('GET /ivf/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/ivf/assessments/ovarianReserveAMH
router.post('/assessments/ovarianReserveAMH',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ivfOvarianReserveAMH || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.ovarianReserveAMH(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ivf/ovarianReserveAMH', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ivf/assessments/ivfSuccessProbability
router.post('/assessments/ivfSuccessProbability',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ivfIvfSuccessProbability || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.ivfSuccessProbability(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ivf/ivfSuccessProbability', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ivf/assessments/endometrialReceptivity
router.post('/assessments/endometrialReceptivity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ivfEndometrialReceptivity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.endometrialReceptivity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ivf/endometrialReceptivity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ivf/assessments/embryoQualityGrade
router.post('/assessments/embryoQualityGrade',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ivfEmbryoQualityGrade || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.embryoQualityGrade(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ivf/embryoQualityGrade', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ivf/assessments/miscarriageRisk
router.post('/assessments/miscarriageRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ivfMiscarriageRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.miscarriageRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ivf/miscarriageRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
