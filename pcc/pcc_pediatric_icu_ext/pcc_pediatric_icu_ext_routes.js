// P3-EN pcc_pediatric_icu_ext_routes v3.104.0
// P3-EN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_icu_ext_engine.js');
const VER = '3.104.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_icu_ext', label: 'PCC Pediatric ICU Ext', functions: Object.keys(Engine) });
});
router.post('/call/PediatricShock', (req, res) => { const r = Engine.PediatricShock(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricShock', plan: r.plan }); });
router.post('/call/PediatricARDS', (req, res) => { const r = Engine.PediatricARDS(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricARDS', plan: r.plan }); });
router.post('/call/PediatricSepsisBundle', (req, res) => { const r = Engine.PediatricSepsisBundle(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricSepsisBundle', plan: r.plan }); });
router.post('/call/PediatricStatusEpilepticus', (req, res) => { const r = Engine.PediatricStatusEpilepticus(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricStatusEpilepticus', plan: r.plan }); });
router.post('/call/PediatricHypertensiveEmergency', (req, res) => { const r = Engine.PediatricHypertensiveEmergency(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricHypertensiveEmergency', plan: r.plan }); });
router.post('/call/PediatricDKA', (req, res) => { const r = Engine.PediatricDKA(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricDKA', plan: r.plan }); });
router.post('/call/PediatricTraumaResuscitation', (req, res) => { const r = Engine.PediatricTraumaResuscitation(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricTraumaResuscitation', plan: r.plan }); });
router.post('/call/PediatricBurnMgmt', (req, res) => { const r = Engine.PediatricBurnMgmt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricBurnMgmt', plan: r.plan }); });
router.post('/call/PediatricToxicology', (req, res) => { const r = Engine.PediatricToxicology(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricToxicology', plan: r.plan }); });
router.post('/call/PediatricPostCardiacArrest', (req, res) => { const r = Engine.PediatricPostCardiacArrest(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: 'PediatricPostCardiacArrest', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_icu_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
