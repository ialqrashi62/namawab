// filepath: namaweb/neurosurgery_router.js
// neurosurgery — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./neurosurgery_engine');

// GET /api/neurosurgery/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'neurosurgery', version: engine.VERSION }));

// GET /api/neurosurgery/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'neurosurgery' });
        } catch (err) {
            console.error('GET /neurosurgery/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/neurosurgery/assessments/tbiSeverity
router.post('/assessments/tbiSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neurosurgeryTbiSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.tbiSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neurosurgery/tbiSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/neurosurgery/assessments/glioblastomaPrognosis
router.post('/assessments/glioblastomaPrognosis',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neurosurgeryGlioblastomaPrognosis || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.glioblastomaPrognosis(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neurosurgery/glioblastomaPrognosis', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/neurosurgery/assessments/spinalCordInjury
router.post('/assessments/spinalCordInjury',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neurosurgerySpinalCordInjury || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.spinalCordInjury(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neurosurgery/spinalCordInjury', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/neurosurgery/assessments/hydrocephalusSeverity
router.post('/assessments/hydrocephalusSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neurosurgeryHydrocephalusSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.hydrocephalusSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neurosurgery/hydrocephalusSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/neurosurgery/assessments/intracranialPressure
router.post('/assessments/intracranialPressure',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.neurosurgeryIntracranialPressure || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.intracranialPressure(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /neurosurgery/intracranialPressure', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
