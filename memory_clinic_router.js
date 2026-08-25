// filepath: namaweb/memory_clinic_router.js
// memory_clinic — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./memory_clinic_engine');

// GET /api/memory_clinic/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'memory_clinic', version: engine.VERSION }));

// GET /api/memory_clinic/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'memory_clinic' });
        } catch (err) {
            console.error('GET /memory_clinic/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/memory_clinic/assessments/mmseScore
router.post('/assessments/mmseScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.memory_clinicMmseScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.mmseScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /memory_clinic/mmseScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/memory_clinic/assessments/moCA
router.post('/assessments/moCA',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.memory_clinicMoCA || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.moCA(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /memory_clinic/moCA', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/memory_clinic/assessments/cdrScore
router.post('/assessments/cdrScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.memory_clinicCdrScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.cdrScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /memory_clinic/cdrScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/memory_clinic/assessments/alzheimerStage
router.post('/assessments/alzheimerStage',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.memory_clinicAlzheimerStage || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.alzheimerStage(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /memory_clinic/alzheimerStage', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/memory_clinic/assessments/vascularDementiaScore
router.post('/assessments/vascularDementiaScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.memory_clinicVascularDementiaScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.vascularDementiaScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /memory_clinic/vascularDementiaScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
