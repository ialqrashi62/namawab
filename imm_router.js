'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_9_imm_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'immunization-registry' }));
router.post('/epi-schedule', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.epiScheduleForAge(req.body) }));
router.post('/cold-chain', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => res.json({ ok: true, result: engine.coldChainTracking(req.body) }));
router.post('/aefi', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.aefiReporting(req.body) }));
router.post('/catch-up', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.catchUpSchedule(req.body) }));
router.post('/contraindication', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.contraindicationCheck(req.body) }));

module.exports = router;