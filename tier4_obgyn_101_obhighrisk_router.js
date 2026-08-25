'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_obgyn_101_obhighrisk_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-obgyn-obhighrisk' }));
router.post('/preeclampsia', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.preeclampsiaAssessment(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/gdm', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.gestationalDiabetes(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/cervical', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.cervicalInsufficiency(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/twins', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.multipleGestation(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
