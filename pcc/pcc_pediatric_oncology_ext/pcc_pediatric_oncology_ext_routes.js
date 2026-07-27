// P3-ES pcc_pediatric_oncology_ext_routes v3.109.0
// P3-ES: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_oncology_ext_engine.js');
const VER = '3.109.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', label: 'PCC Pediatric Oncology Ext', functions: Object.keys(Engine) });
});
router.post('/call/PediatricALLRelapse', (req, res) => { const r = Engine.PediatricALLRelapse(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricALLRelapse', plan: r.plan }); });
router.post('/call/PediatricAMLExt', (req, res) => { const r = Engine.PediatricAMLExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricAMLExt', plan: r.plan }); });
router.post('/call/PediatricCML', (req, res) => { const r = Engine.PediatricCML(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricCML', plan: r.plan }); });
router.post('/call/PediatricMDS', (req, res) => { const r = Engine.PediatricMDS(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricMDS', plan: r.plan }); });
router.post('/call/PediatricJMML', (req, res) => { const r = Engine.PediatricJMML(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricJMML', plan: r.plan }); });
router.post('/call/PediatricBurkittLymphoma', (req, res) => { const r = Engine.PediatricBurkittLymphoma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricBurkittLymphoma', plan: r.plan }); });
router.post('/call/PediatricHodgkinLymphoma', (req, res) => { const r = Engine.PediatricHodgkinLymphoma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricHodgkinLymphoma', plan: r.plan }); });
router.post('/call/PediatricNHL', (req, res) => { const r = Engine.PediatricNHL(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricNHL', plan: r.plan }); });
router.post('/call/PediatricBrainstemGlioma', (req, res) => { const r = Engine.PediatricBrainstemGlioma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricBrainstemGlioma', plan: r.plan }); });
router.post('/call/PediatricMedulloblastoma', (req, res) => { const r = Engine.PediatricMedulloblastoma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricMedulloblastoma', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
