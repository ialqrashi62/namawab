// filepath: namaweb/vascular_surgery_router.js
// vascular_surgery — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./vascular_surgery_engine');

// GET /api/vascular_surgery/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'vascular_surgery', version: engine.VERSION }));

// GET /api/vascular_surgery/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'vascular_surgery' });
        } catch (err) {
            console.error('GET /vascular_surgery/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/vascular_surgery/assessments/abIAAneurysmRisk
router.post('/assessments/abIAAneurysmRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.vascular_surgeryAbIAAneurysmRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.abIAAneurysmRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /vascular_surgery/abIAAneurysmRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/vascular_surgery/assessments/carotidStenosisSeverity
router.post('/assessments/carotidStenosisSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.vascular_surgeryCarotidStenosisSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.carotidStenosisSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /vascular_surgery/carotidStenosisSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/vascular_surgery/assessments/claudicationSeverity
router.post('/assessments/claudicationSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.vascular_surgeryClaudicationSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.claudicationSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /vascular_surgery/claudicationSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/vascular_surgery/assessments/limbIschemiaStage
router.post('/assessments/limbIschemiaStage',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.vascular_surgeryLimbIschemiaStage || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.limbIschemiaStage(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /vascular_surgery/limbIschemiaStage', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/vascular_surgery/assessments/aaaDiameterRisk
router.post('/assessments/aaaDiameterRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.vascular_surgeryAaaDiameterRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.aaaDiameterRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /vascular_surgery/aaaDiameterRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
