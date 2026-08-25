'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_derm_101_acne_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-derm-acne' }));
router.post('/severity', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.acneSeverity(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/rosacea', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.rosaceaClassification(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/isotretinoin', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.isotretinoinSafety(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/hormonal', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.hormonalAcne(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
