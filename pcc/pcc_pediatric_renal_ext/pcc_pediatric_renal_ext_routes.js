// P3-EQ pcc_pediatric_renal_ext_routes v3.107.0
// P3-EQ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_renal_ext_engine.js');
const VER = '3.107.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_renal_ext', label: 'PCC Pediatric Renal Ext', functions: Object.keys(Engine) });
});
router.post('/call/PediatricAKI', (req, res) => { const r = Engine.PediatricAKI(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricAKI', plan: r.plan }); });
router.post('/call/PediatricCKDEval', (req, res) => { const r = Engine.PediatricCKDEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricCKDEval', plan: r.plan }); });
router.post('/call/PediatricNS', (req, res) => { const r = Engine.PediatricNS(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricNS', plan: r.plan }); });
router.post('/call/PediatricHUS', (req, res) => { const r = Engine.PediatricHUS(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricHUS', plan: r.plan }); });
router.post('/call/PediatricRPGN', (req, res) => { const r = Engine.PediatricRPGN(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricRPGN', plan: r.plan }); });
router.post('/call/PediatricUTIExt', (req, res) => { const r = Engine.PediatricUTIExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricUTIExt', plan: r.plan }); });
router.post('/call/PediatricVUR', (req, res) => { const r = Engine.PediatricVUR(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricVUR', plan: r.plan }); });
router.post('/call/PediatricRenalTubularAcidosis', (req, res) => { const r = Engine.PediatricRenalTubularAcidosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricRenalTubularAcidosis', plan: r.plan }); });
router.post('/call/PediatricBartterSyndrome', (req, res) => { const r = Engine.PediatricBartterSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricBartterSyndrome', plan: r.plan }); });
router.post('/call/PediatricGitelmanSyndrome', (req, res) => { const r = Engine.PediatricGitelmanSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: 'PediatricGitelmanSyndrome', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_renal_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
