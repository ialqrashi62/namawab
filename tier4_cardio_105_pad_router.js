'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_cardio_105_pad_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-cardio-pad' }));
router.post('/assess', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.padAssessment(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/aneurysm', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.aorticAneurysm(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/carotid', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.carotidStenosis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
