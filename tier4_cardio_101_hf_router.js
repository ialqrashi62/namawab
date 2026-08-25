'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_cardio_101_hf_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-cardio-hf' }));
router.post('/class', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.hfClassification(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/med', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.hfMedicationOptimization(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/acute', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.acuteDecompensatedHF(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
