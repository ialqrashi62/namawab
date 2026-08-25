// filepath: namaweb/maternal_fetal_router.js
// maternal_fetal — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./maternal_fetal_engine');

// GET /api/maternal_fetal/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'maternal_fetal', version: engine.VERSION }));

// GET /api/maternal_fetal/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'maternal_fetal' });
        } catch (err) {
            console.error('GET /maternal_fetal/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/maternal_fetal/assessments/preeclampsiaRisk
router.post('/assessments/preeclampsiaRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.maternal_fetalPreeclampsiaRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.preeclampsiaRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /maternal_fetal/preeclampsiaRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/maternal_fetal/assessments/gdmRiskScore
router.post('/assessments/gdmRiskScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.maternal_fetalGdmRiskScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.gdmRiskScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /maternal_fetal/gdmRiskScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/maternal_fetal/assessments/pretermBirthRisk
router.post('/assessments/pretermBirthRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.maternal_fetalPretermBirthRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.pretermBirthRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /maternal_fetal/pretermBirthRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/maternal_fetal/assessments/placentaPreviaSeverity
router.post('/assessments/placentaPreviaSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.maternal_fetalPlacentaPreviaSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.placentaPreviaSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /maternal_fetal/placentaPreviaSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/maternal_fetal/assessments/iugrClassification
router.post('/assessments/iugrClassification',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.maternal_fetalIugrClassification || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.iugrClassification(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /maternal_fetal/iugrClassification', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
