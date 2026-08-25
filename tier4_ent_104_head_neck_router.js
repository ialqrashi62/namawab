'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ent_104_head_neck_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ent-hn' }));
router.post('/neck-mass', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.neckMassWorkup(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/staging', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.headNeckTStaging(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/thyroid', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.thyroidNodule(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
