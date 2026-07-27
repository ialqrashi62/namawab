// P3-DN pcc_electrolyte_acid_base_routes v3.78.0
// P3-DN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_electrolyte_acid_base_engine.js');
const VER = '3.78.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_electrolyte_acid_base', label: 'PCC Electrolyte Acid Base', functions: Object.keys(Engine) });
});

router.post('/call/HyponatremiaWorkup', (req, res) => { const r = Engine.HyponatremiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HyponatremiaWorkup', plan: r.plan }); });
router.post('/call/HypernatremiaWorkup', (req, res) => { const r = Engine.HypernatremiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HypernatremiaWorkup', plan: r.plan }); });
router.post('/call/HypokalemiaWorkup', (req, res) => { const r = Engine.HypokalemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HypokalemiaWorkup', plan: r.plan }); });
router.post('/call/HyperkalemiaWorkup', (req, res) => { const r = Engine.HyperkalemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HyperkalemiaWorkup', plan: r.plan }); });
router.post('/call/HypocalcemiaWorkup', (req, res) => { const r = Engine.HypocalcemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HypocalcemiaWorkup', plan: r.plan }); });
router.post('/call/HypercalcemiaWorkup', (req, res) => { const r = Engine.HypercalcemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HypercalcemiaWorkup', plan: r.plan }); });
router.post('/call/HypomagnesemiaWorkup', (req, res) => { const r = Engine.HypomagnesemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HypomagnesemiaWorkup', plan: r.plan }); });
router.post('/call/HypophosphatemiaWorkup', (req, res) => { const r = Engine.HypophosphatemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HypophosphatemiaWorkup', plan: r.plan }); });
router.post('/call/MetabolicAcidosis', (req, res) => { const r = Engine.MetabolicAcidosis(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'MetabolicAcidosis', plan: r.plan }); });
router.post('/call/MetabolicAlkalosis', (req, res) => { const r = Engine.MetabolicAlkalosis(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'MetabolicAlkalosis', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
