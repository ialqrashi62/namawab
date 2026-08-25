// filepath: namaweb/thoracic_surgery_router.js
// thoracic_surgery — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./thoracic_surgery_engine');

// GET /api/thoracic_surgery/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'thoracic_surgery', version: engine.VERSION }));

// GET /api/thoracic_surgery/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'thoracic_surgery' });
        } catch (err) {
            console.error('GET /thoracic_surgery/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/thoracic_surgery/assessments/lungCancerStage
router.post('/assessments/lungCancerStage',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.thoracic_surgeryLungCancerStage || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.lungCancerStage(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /thoracic_surgery/lungCancerStage', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/thoracic_surgery/assessments/esophagusCancerStage
router.post('/assessments/esophagusCancerStage',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.thoracic_surgeryEsophagusCancerStage || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.esophagusCancerStage(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /thoracic_surgery/esophagusCancerStage', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/thoracic_surgery/assessments/mediastinalMassRisk
router.post('/assessments/mediastinalMassRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.thoracic_surgeryMediastinalMassRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.mediastinalMassRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /thoracic_surgery/mediastinalMassRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/thoracic_surgery/assessments/surgicalRiskPulmonary
router.post('/assessments/surgicalRiskPulmonary',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.thoracic_surgerySurgicalRiskPulmonary || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.surgicalRiskPulmonary(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /thoracic_surgery/surgicalRiskPulmonary', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/thoracic_surgery/assessments/cabgRiskScore
router.post('/assessments/cabgRiskScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.thoracic_surgeryCabgRiskScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.cabgRiskScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /thoracic_surgery/cabgRiskScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
