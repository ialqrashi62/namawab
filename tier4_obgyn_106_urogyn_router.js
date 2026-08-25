'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_obgyn_106_urogyn_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-obgyn-urogyn' }));
router.post('/prolapse', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pelvicProlapseStage(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/incontinence', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.urinaryIncontinenceWorkup(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
