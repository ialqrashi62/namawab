'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_rare_104_mastocytosis_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-rare-mastocytosis' }));
router.post('/classify', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.mastocytosisClassification(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/mcas', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.mastCellActivationManagement(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/avapritinib', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.avapritinibKitD816V(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/midostaurin', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.midostaurinIndication(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/anesthesia', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.mastocytosisAnesthesiaPlan(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
