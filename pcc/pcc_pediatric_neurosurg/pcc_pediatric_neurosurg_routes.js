// P3-EI pcc_pediatric_neurosurg_routes v3.99.0
// P3-EI: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_neurosurg_engine.js');
const VER = '3.99.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_neurosurg', label: 'PCC Pediatric Neurosurg', functions: Object.keys(Engine) });
});
router.post('/call/PediatricHydrocephalus', (req, res) => { const r = Engine.PediatricHydrocephalus(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricHydrocephalus', plan: r.plan }); });
router.post('/call/ChiariMalformation', (req, res) => { const r = Engine.ChiariMalformation(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'ChiariMalformation', plan: r.plan }); });
router.post('/call/Craniosynostosis', (req, res) => { const r = Engine.Craniosynostosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'Craniosynostosis', plan: r.plan }); });
router.post('/call/SpinalDysraphism', (req, res) => { const r = Engine.SpinalDysraphism(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'SpinalDysraphism', plan: r.plan }); });
router.post('/call/PediatricBrainTumorSurg', (req, res) => { const r = Engine.PediatricBrainTumorSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricBrainTumorSurg', plan: r.plan }); });
router.post('/call/PediatricEpilepsySurg', (req, res) => { const r = Engine.PediatricEpilepsySurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricEpilepsySurg', plan: r.plan }); });
router.post('/call/PediatricTBI', (req, res) => { const r = Engine.PediatricTBI(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricTBI', plan: r.plan }); });
router.post('/call/PediatricSpineTrauma', (req, res) => { const r = Engine.PediatricSpineTrauma(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricSpineTrauma', plan: r.plan }); });
router.post('/call/PediatricVascularNeurosurg', (req, res) => { const r = Engine.PediatricVascularNeurosurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricVascularNeurosurg', plan: r.plan }); });
router.post('/call/PediatricCraniofacial', (req, res) => { const r = Engine.PediatricCraniofacial(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: 'PediatricCraniofacial', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_neurosurg', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
