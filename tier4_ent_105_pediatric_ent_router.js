'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_ent_105_pediatric_ent_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-ent-peds' }));
router.post('/tat', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pediatricAdenotonsillectomy(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/airway', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.pediatricAirwayEvaluation(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/chl', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.congenitalHearingLoss(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
