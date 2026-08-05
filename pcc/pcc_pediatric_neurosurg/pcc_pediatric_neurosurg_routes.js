// P3-EI pcc_pediatric_neurosurg_routes v3.99.0
// P3-EI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_neurosurg_engine.js');
const VER = '3.99.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_neurosurg', label: 'PCC Pediatric Neurosurg', functions: Object.keys(F) });
});
router.post('/call/PediatricHydrocephalus', (req, res) => { const r = F.PediatricHydrocephalus(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricHydrocephalus', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ChiariMalformation', (req, res) => { const r = F.ChiariMalformation(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'ChiariMalformation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Craniosynostosis', (req, res) => { const r = F.Craniosynostosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'Craniosynostosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpinalDysraphism', (req, res) => { const r = F.SpinalDysraphism(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'SpinalDysraphism', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBrainTumorSurg', (req, res) => { const r = F.PediatricBrainTumorSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricBrainTumorSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricEpilepsySurg', (req, res) => { const r = F.PediatricEpilepsySurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricEpilepsySurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTBI', (req, res) => { const r = F.PediatricTBI(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricTBI', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSpineTrauma', (req, res) => { const r = F.PediatricSpineTrauma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricSpineTrauma', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricVascularNeurosurg', (req, res) => { const r = F.PediatricVascularNeurosurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricVascularNeurosurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCraniofacial', (req, res) => { const r = F.PediatricCraniofacial(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricCraniofacial', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
