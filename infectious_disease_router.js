// filepath: namaweb/infectious_disease_router.js
// infectious_disease — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./infectious_disease_engine');

// GET /api/infectious_disease/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'infectious_disease', version: engine.VERSION }));

// GET /api/infectious_disease/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'infectious_disease' });
        } catch (err) {
            console.error('GET /infectious_disease/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/infectious_disease/assessments/sepsisSeverity
router.post('/assessments/sepsisSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.infectious_diseaseSepsisSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.sepsisSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /infectious_disease/sepsisSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/infectious_disease/assessments/mdrOrganismRisk
router.post('/assessments/mdrOrganismRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.infectious_diseaseMdrOrganismRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.mdrOrganismRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /infectious_disease/mdrOrganismRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/infectious_disease/assessments/tbRiskAssessment
router.post('/assessments/tbRiskAssessment',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.infectious_diseaseTbRiskAssessment || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.tbRiskAssessment(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /infectious_disease/tbRiskAssessment', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/infectious_disease/assessments/hivStaging
router.post('/assessments/hivStaging',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.infectious_diseaseHivStaging || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.hivStaging(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /infectious_disease/hivStaging', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/infectious_disease/assessments/malariaSeverity
router.post('/assessments/malariaSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.infectious_diseaseMalariaSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.malariaSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /infectious_disease/malariaSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
