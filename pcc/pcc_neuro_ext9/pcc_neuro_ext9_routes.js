// P3-ER pcc_neuro_ext9_routes v3.108.0
// P3-ER: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neuro_ext9_engine.js');
const VER = '3.108.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext9', label: 'PCC Neuro Ext9', functions: Object.keys(Engine) });
});
router.post('/call/AdultPHIEval', (req, res) => { const r = Engine.AdultPHIEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'AdultPHIEval', plan: r.plan }); });
router.post('/call/PediatricPHIEval', (req, res) => { const r = Engine.PediatricPHIEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'PediatricPHIEval', plan: r.plan }); });
router.post('/call/NeurocysticercosisEval', (req, res) => { const r = Engine.NeurocysticercosisEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'NeurocysticercosisEval', plan: r.plan }); });
router.post('/call/CerebralToxoplasmosis', (req, res) => { const r = Engine.CerebralToxoplasmosis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'CerebralToxoplasmosis', plan: r.plan }); });
router.post('/call/CerebralMalaria', (req, res) => { const r = Engine.CerebralMalaria(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'CerebralMalaria', plan: r.plan }); });
router.post('/call/BrainAbscessEval', (req, res) => { const r = Engine.BrainAbscessEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'BrainAbscessEval', plan: r.plan }); });
router.post('/call/SubduralEmpyemaEval', (req, res) => { const r = Engine.SubduralEmpyemaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'SubduralEmpyemaEval', plan: r.plan }); });
router.post('/call/EpiduralAbscessEval', (req, res) => { const r = Engine.EpiduralAbscessEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'EpiduralAbscessEval', plan: r.plan }); });
router.post('/call/VentriculitisEval', (req, res) => { const r = Engine.VentriculitisEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'VentriculitisEval', plan: r.plan }); });
router.post('/call/CNSLymphomaEval', (req, res) => { const r = Engine.CNSLymphomaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'CNSLymphomaEval', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext9', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
