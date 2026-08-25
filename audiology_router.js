// filepath: namaweb/audiology_router.js
// audiology — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./audiology_engine');

// GET /api/audiology/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'audiology', version: engine.VERSION }));

// GET /api/audiology/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'audiology' });
        } catch (err) {
            console.error('GET /audiology/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/audiology/assessments/pureToneAverage
router.post('/assessments/pureToneAverage',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.audiologyPureToneAverage || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.pureToneAverage(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /audiology/pureToneAverage', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/audiology/assessments/speechReceptionThreshold
router.post('/assessments/speechReceptionThreshold',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.audiologySpeechReceptionThreshold || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.speechReceptionThreshold(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /audiology/speechReceptionThreshold', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/audiology/assessments/tympanometryType
router.post('/assessments/tympanometryType',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.audiologyTympanometryType || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.tympanometryType(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /audiology/tympanometryType', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/audiology/assessments/otoacousticEmissions
router.post('/assessments/otoacousticEmissions',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.audiologyOtoacousticEmissions || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.otoacousticEmissions(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /audiology/otoacousticEmissions', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/audiology/assessments/auditoryBrainstem
router.post('/assessments/auditoryBrainstem',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.audiologyAuditoryBrainstem || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.auditoryBrainstem(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /audiology/auditoryBrainstem', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
