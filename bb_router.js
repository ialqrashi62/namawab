'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_8_bb_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'blood-bank' }));
router.post('/crossmatch', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => res.json({ ok: true, result: engine.typeAndCrossmatch(req.body) }));
router.post('/antibody-screen', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => res.json({ ok: true, result: engine.antibodyScreening(req.body) }));
router.post('/irradiation', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => res.json({ ok: true, result: engine.irradiationTracking(req.body) }));
router.post('/component', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.componentTherapy(req.body) }));
router.post('/reaction', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => res.json({ ok: true, result: engine.transfusionReaction(req.body) }));
router.post('/isbt-label', requireAuth, requireTenantScope, requireRole('lab'), (req, res) => res.json({ ok: true, result: engine.isbtLabeling(req.body) }));

module.exports = router;