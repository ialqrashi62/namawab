'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ortho_103_jointrecon_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ortho-arthroplasty' }));
router.post('/tha', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.thaIndication(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/tka', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.tkaIndication(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/revision', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.revisionTkaPlan(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
