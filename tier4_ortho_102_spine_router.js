'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ortho_102_spine_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ortho-spine' }));
router.post('/stenosis', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.spinalStenosis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/disc', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.discHerniation(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/scoliosis', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.scoliosisAdult(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/sci', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.spinalCordInjury(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
