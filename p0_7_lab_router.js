'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_7_lab_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'lab-autoverify' }));
router.post('/autoverify', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => res.json({ ok: true, result: engine.autoverifyRules(req.body) }));
router.post('/critical-alert', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => res.json({ ok: true, result: engine.criticalValueAlert(req.body) }));
router.post('/delta-check', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => res.json({ ok: true, result: engine.deltaCheck(req.body) }));
router.post('/reflex', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => res.json({ ok: true, result: engine.reflexTesting(req.body) }));
router.post('/qc', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => res.json({ ok: true, result: engine.qcStatusCheck(req.body) }));

module.exports = router;