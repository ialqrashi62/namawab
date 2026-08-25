// filepath: namaweb/infection_control_router.js
// infection_control — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./infection_control_engine');

// GET /api/infection_control/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'infection_control', version: engine.VERSION }));

// GET /api/infection_control/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'infection_control' });
        } catch (err) {
            console.error('GET /infection_control/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/infection_control/assessments/mrsaRisk
router.post('/assessments/mrsaRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.infection_controlMrsaRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.mrsaRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /infection_control/mrsaRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/infection_control/assessments/cdiffRisk
router.post('/assessments/cdiffRisk',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.infection_controlCdiffRisk || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.cdiffRisk(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /infection_control/cdiffRisk', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/infection_control/assessments/vREColonization
router.post('/assessments/vREColonization',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.infection_controlVREColonization || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.vREColonization(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /infection_control/vREColonization', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/infection_control/assessments/isolationPrecaution
router.post('/assessments/isolationPrecaution',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.infection_controlIsolationPrecaution || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.isolationPrecaution(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /infection_control/isolationPrecaution', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/infection_control/assessments/outbreakInvestigation
router.post('/assessments/outbreakInvestigation',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.infection_controlOutbreakInvestigation || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.outbreakInvestigation(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /infection_control/outbreakInvestigation', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
