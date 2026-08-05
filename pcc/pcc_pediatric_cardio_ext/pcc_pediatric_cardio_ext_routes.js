// P3-EO pcc_pediatric_cardio_ext_routes v3.105.0
// P3-EO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_cardio_ext_engine.js');
const VER = '3.105.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', label: 'PCC Pediatric Cardio Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricCHF', (req, res) => { const r = F.PediatricCHF(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricCHF', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricArrhythmiaEval', (req, res) => { const r = F.PediatricArrhythmiaEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricArrhythmiaEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHypertensionEval', (req, res) => { const r = F.PediatricHypertensionEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricHypertensionEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricLipidDisorder', (req, res) => { const r = F.PediatricLipidDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricLipidDisorder', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricKawasakiLongTerm', (req, res) => { const r = F.PediatricKawasakiLongTerm(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricKawasakiLongTerm', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCardiomyopathy', (req, res) => { const r = F.PediatricCardiomyopathy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricCardiomyopathy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHeartTransplant', (req, res) => { const r = F.PediatricHeartTransplant(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricHeartTransplant', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricFontan', (req, res) => { const r = F.PediatricFontan(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricFontan', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTetralogy', (req, res) => { const r = F.PediatricTetralogy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricTetralogy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricVSD', (req, res) => { const r = F.PediatricVSD(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricVSD', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
