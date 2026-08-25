'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ortho_101_sports_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ortho-sports' }));
router.post('/acl', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.aclInjuryManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/rotator-cuff', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.rotatorCuffTear(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/meniscus', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.meniscusTear(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/concussion', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.concussionReturn(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
