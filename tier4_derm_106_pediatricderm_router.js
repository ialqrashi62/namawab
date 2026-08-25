'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_derm_106_pediatricderm_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-derm-peds' }));
router.post('/hemangioma', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.hemangiomaInfancy(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/eczema-infant', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.atopicEczemaInfant(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/genetic', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.geneticSkinDisorder(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
