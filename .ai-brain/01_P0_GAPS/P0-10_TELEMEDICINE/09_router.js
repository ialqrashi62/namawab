'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_10_tm_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'telemedicine', timestamp: new Date().toISOString() }));

router.post('/session/init', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  res.json({ ok: true, result: engine.sessionInitialization(req.body) });
});

router.post('/vitals', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => {
  res.json({ ok: true, result: engine.vitalSignsStream(req.body) });
});

router.post('/consult/async', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  res.json({ ok: true, result: engine.asyncConsultRequest(req.body) });
});

router.post('/prescribe', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  res.json({ ok: true, result: engine.ePrescribeFromTele(req.body) });
});

router.post('/follow-up', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  res.json({ ok: true, result: engine.followUpScheduling(req.body) });
});

router.post('/recording-consent', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  res.json({ ok: true, result: engine.sessionRecordingConsent(req.body) });
});

module.exports = router;