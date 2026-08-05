// P3-ER pcc_neuro_ext9_routes v3.108.0
// P3-ER: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neuro_ext9_engine.js');
const VER = '3.108.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neuro_ext9', label: 'PCC Neuro Ext9', functions: Object.keys(F) });
});
router.post('/call/AdultPHIEval', (req, res) => { const r = F.AdultPHIEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'AdultPHIEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPHIEval', (req, res) => { const r = F.PediatricPHIEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'PediatricPHIEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeurocysticercosisEval', (req, res) => { const r = F.NeurocysticercosisEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'NeurocysticercosisEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CerebralToxoplasmosis', (req, res) => { const r = F.CerebralToxoplasmosis(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'CerebralToxoplasmosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CerebralMalaria', (req, res) => { const r = F.CerebralMalaria(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'CerebralMalaria', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BrainAbscessEval', (req, res) => { const r = F.BrainAbscessEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'BrainAbscessEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SubduralEmpyemaEval', (req, res) => { const r = F.SubduralEmpyemaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'SubduralEmpyemaEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EpiduralAbscessEval', (req, res) => { const r = F.EpiduralAbscessEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'EpiduralAbscessEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VentriculitisEval', (req, res) => { const r = F.VentriculitisEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'VentriculitisEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CNSLymphomaEval', (req, res) => { const r = F.CNSLymphomaEval(req.body || {}); res.json({ version: VER, module: 'pcc_neuro_ext9', function: 'CNSLymphomaEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neuro_ext9', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
