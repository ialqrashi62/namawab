'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_derm_104_skincancer_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-derm-skincancer' }));
router.post('/melanoma-screen', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.melanomaAbcde(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/bcc', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.bccManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/melanoma-stage', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.melanomaStaging(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/scc', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.sccManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
