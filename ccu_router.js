// filepath: namaweb/ccu_router.js
// ccu — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./ccu_engine');

// GET /api/ccu/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'ccu', version: engine.VERSION }));

// GET /api/ccu/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'ccu' });
        } catch (err) {
            console.error('GET /ccu/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/ccu/assessments/killipClass
router.post('/assessments/killipClass',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ccuKillipClass || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.killipClass(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ccu/killipClass', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ccu/assessments/graceScore
router.post('/assessments/graceScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ccuGraceScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.graceScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ccu/graceScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ccu/assessments/cardiacArrestPrognosis
router.post('/assessments/cardiacArrestPrognosis',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ccuCardiacArrestPrognosis || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.cardiacArrestPrognosis(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ccu/cardiacArrestPrognosis', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ccu/assessments/cardiogenicShockScore
router.post('/assessments/cardiogenicShockScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ccuCardiogenicShockScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.cardiogenicShockScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ccu/cardiogenicShockScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/ccu/assessments/postPCIComplication
router.post('/assessments/postPCIComplication',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.ccuPostPCIComplication || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.postPCIComplication(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /ccu/postPCIComplication', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
