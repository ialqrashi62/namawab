// P3-EH pcc_pediatric_gi_ext_routes v3.98.0
// P3-EH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_gi_ext_engine.js');
const VER = '3.98.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_gi_ext', label: 'PCC Pediatric GI Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricGERDEvaluation', (req, res) => { const r = F.PediatricGERDEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'PediatricGERDEvaluation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CeliacDisease', (req, res) => { const r = F.CeliacDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'CeliacDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricIBD', (req, res) => { const r = F.PediatricIBD(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'PediatricIBD', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HirschsprungDisease', (req, res) => { const r = F.HirschsprungDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'HirschsprungDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PyloricStenosis', (req, res) => { const r = F.PyloricStenosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'PyloricStenosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Intussusception', (req, res) => { const r = F.Intussusception(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'Intussusception', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHepatology', (req, res) => { const r = F.PediatricHepatology(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'PediatricHepatology', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPancreatitis', (req, res) => { const r = F.PediatricPancreatitis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'PediatricPancreatitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalCholestasis', (req, res) => { const r = F.NeonatalCholestasis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'NeonatalCholestasis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricLiverTransplant', (req, res) => { const r = F.PediatricLiverTransplant(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'PediatricLiverTransplant', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
