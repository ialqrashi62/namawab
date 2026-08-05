// P3-ES pcc_pediatric_oncology_ext_routes v3.109.0
// P3-ES: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_oncology_ext_engine.js');
const VER = '3.109.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', label: 'PCC Pediatric Oncology Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricALLRelapse', (req, res) => { const r = F.PediatricALLRelapse(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricALLRelapse', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAMLExt', (req, res) => { const r = F.PediatricAMLExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricAMLExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCML', (req, res) => { const r = F.PediatricCML(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricCML', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricMDS', (req, res) => { const r = F.PediatricMDS(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricMDS', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricJMML', (req, res) => { const r = F.PediatricJMML(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricJMML', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBurkittLymphoma', (req, res) => { const r = F.PediatricBurkittLymphoma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricBurkittLymphoma', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHodgkinLymphoma', (req, res) => { const r = F.PediatricHodgkinLymphoma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricHodgkinLymphoma', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNHL', (req, res) => { const r = F.PediatricNHL(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricNHL', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBrainstemGlioma', (req, res) => { const r = F.PediatricBrainstemGlioma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricBrainstemGlioma', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricMedulloblastoma', (req, res) => { const r = F.PediatricMedulloblastoma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: 'PediatricMedulloblastoma', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_oncology_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
