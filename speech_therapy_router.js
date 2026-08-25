// filepath: namaweb/speech_therapy_router.js
// speech_therapy — Express router
// Pattern: nm-router-middleware
'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db_postgres');
const { requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard } = require('./mw');
const RS = require('./route_schemas');
const engine = require('./speech_therapy_engine');

// GET /api/speech_therapy/health
router.get('/health', (req, res) => res.json({ ok: true, dept: 'speech_therapy', version: engine.VERSION }));

// GET /api/speech_therapy/patients
router.get('/patients',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse', 'receptionist', 'admin', 'owner'),
    async (req, res) => {
        try {
            const limit = Math.min(+req.query.limit || 50, 200);
            res.json({ patients: [], total: 0, dept: 'speech_therapy' });
        } catch (err) {
            console.error('GET /speech_therapy/patients', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);


// POST /api/speech_therapy/assessments/dysphagiaSeverity
router.post('/assessments/dysphagiaSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.speech_therapyDysphagiaSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.dysphagiaSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /speech_therapy/dysphagiaSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/speech_therapy/assessments/aphasiaType
router.post('/assessments/aphasiaType',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.speech_therapyAphasiaType || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.aphasiaType(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /speech_therapy/aphasiaType', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/speech_therapy/assessments/apraxiaScore
router.post('/assessments/apraxiaScore',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.speech_therapyApraxiaScore || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.apraxiaScore(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /speech_therapy/apraxiaScore', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/speech_therapy/assessments/dysarthriaSeverity
router.post('/assessments/dysarthriaSeverity',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.speech_therapyDysarthriaSeverity || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.dysarthriaSeverity(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /speech_therapy/dysarthriaSeverity', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

// POST /api/speech_therapy/assessments/voiceDisorderIndex
router.post('/assessments/voiceDisorderIndex',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.speech_therapyVoiceDisorderIndex || {}),
    idempotencyGuard,
    async (req, res) => {
        try {
            const result = engine.voiceDisorderIndex(req.validated);
            res.status(201).json(result);
        } catch (err) {
            console.error('POST /speech_therapy/voiceDisorderIndex', err);
            res.status(500).json({ error: 'internal_error' });
        }
    }
);

module.exports = router;
