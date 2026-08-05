// P3-DN pcc_electrolyte_acid_base_routes v3.78.0
// P3-DN: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_electrolyte_acid_base_engine.js');
const VER = '3.78.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_electrolyte_acid_base', label: 'PCC Electrolyte Acid Base', functions: Object.keys(F) });
});

router.post('/call/HyponatremiaWorkup', (req, res) => { const r = F.HyponatremiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HyponatremiaWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HypernatremiaWorkup', (req, res) => { const r = F.HypernatremiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HypernatremiaWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HypokalemiaWorkup', (req, res) => { const r = F.HypokalemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HypokalemiaWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HyperkalemiaWorkup', (req, res) => { const r = F.HyperkalemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HyperkalemiaWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HypocalcemiaWorkup', (req, res) => { const r = F.HypocalcemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HypocalcemiaWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HypercalcemiaWorkup', (req, res) => { const r = F.HypercalcemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HypercalcemiaWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HypomagnesemiaWorkup', (req, res) => { const r = F.HypomagnesemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HypomagnesemiaWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HypophosphatemiaWorkup', (req, res) => { const r = F.HypophosphatemiaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'HypophosphatemiaWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MetabolicAcidosis', (req, res) => { const r = F.MetabolicAcidosis(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'MetabolicAcidosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MetabolicAlkalosis', (req, res) => { const r = F.MetabolicAlkalosis(req.body || {}); res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: 'MetabolicAlkalosis', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_electrolyte_acid_base', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
