'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_cardio_104_imaging_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-cardio-imaging' }));
router.post('/echo', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.echoIndications(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/ccta', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.coronaryCcta(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/mri', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.cardiacMri(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
