'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_neuro_108_neuromuscular_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-neuro-nm' }));
router.post('/gbs', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.gbsManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/mg', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.myastheniaCrisis(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/als', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.alsManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/myopathy', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.myopathyWorkup(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
