'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./p0_12_pe_engine');

router.get('/health', (req, res) => res.json({ ok: true, module: 'patient-engagement', timestamp: new Date().toISOString() }));

router.post('/goal/set', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  res.json({ ok: true, result: engine.goalSetting(req.body) });
});

router.post('/badge/earn', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  res.json({ ok: true, result: engine.achievementBadge(req.body) });
});

router.post('/leaderboard', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  res.json({ ok: true, result: engine.leaderboardGeneration(req.body) });
});

router.post('/reminder', requireAuth, requireTenantScope, requireRole('nurse'), (req, res) => {
  res.json({ ok: true, result: engine.appointmentReminder(req.body) });
});

router.post('/education', requireAuth, requireTenantScope, requireRole('patient'), (req, res) => {
  res.json({ ok: true, result: engine.educationalContentMatching(req.body) });
});

router.post('/push', requireAuth, requireTenantScope, requireRole('admin'), (req, res) => {
  res.json({ ok: true, result: engine.pushNotificationRouting(req.body) });
});

module.exports = router;