'use strict';
/**
 * P0-6 E-Prescription Router
 * Mount: /api/erx
 */
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_6_erx_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'e-prescription', version: '1.0.0' }));
router.post('/controlled-check', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.controlledSubstanceCheck(req.body) }));
router.post('/generate', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.eRxGeneration(req.body) }));
router.post('/refill-validate', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.refillValidation(req.body) }));
router.post('/dosage-validate', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.dosageValidation(req.body) }));
router.post('/cancel', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.prescriptionCancellation(req.body) }));
router.post('/prior-auth', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.priorAuthorization(req.body) }));
router.post('/sign', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.electronicSignature(req.body) }));

module.exports = router;