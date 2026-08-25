'use strict';
const express = require('express');
const router = express.Router();
const { requireAuth, requireTenantScope, requireRole } = require('./mw');
const engine = require('./tier4_peds_108_adolescent_engine');
router.get('/health', (req, res) => res.json({ ok: true, module: 'tier4-peds-adol' }));
router.post('/eating', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.eatingDisorderAssessment(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
router.post('/confidentiality', requireAuth, requireTenantScope, requireRole('doctor'), (req, res) => {
  try { res.json({ ok: true, result: engine.adolescentConfidentiality(req.body) }); } catch (e) { res.status(400).json({ error: e.message }); }
});
module.exports = router;
