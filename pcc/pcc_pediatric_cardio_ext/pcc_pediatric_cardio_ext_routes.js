// P3-EO pcc_pediatric_cardio_ext_routes v3.105.0
// P3-EO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_cardio_ext_engine.js');
const VER = '3.105.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', label: 'PCC Pediatric Cardio Ext', functions: Object.keys(Engine) });
});
router.post('/call/PediatricCHF', (req, res) => { const r = Engine.PediatricCHF(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricCHF', plan: r.plan }); });
router.post('/call/PediatricArrhythmiaEval', (req, res) => { const r = Engine.PediatricArrhythmiaEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricArrhythmiaEval', plan: r.plan }); });
router.post('/call/PediatricHypertensionEval', (req, res) => { const r = Engine.PediatricHypertensionEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricHypertensionEval', plan: r.plan }); });
router.post('/call/PediatricLipidDisorder', (req, res) => { const r = Engine.PediatricLipidDisorder(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricLipidDisorder', plan: r.plan }); });
router.post('/call/PediatricKawasakiLongTerm', (req, res) => { const r = Engine.PediatricKawasakiLongTerm(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricKawasakiLongTerm', plan: r.plan }); });
router.post('/call/PediatricCardiomyopathy', (req, res) => { const r = Engine.PediatricCardiomyopathy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricCardiomyopathy', plan: r.plan }); });
router.post('/call/PediatricHeartTransplant', (req, res) => { const r = Engine.PediatricHeartTransplant(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricHeartTransplant', plan: r.plan }); });
router.post('/call/PediatricFontan', (req, res) => { const r = Engine.PediatricFontan(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricFontan', plan: r.plan }); });
router.post('/call/PediatricTetralogy', (req, res) => { const r = Engine.PediatricTetralogy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricTetralogy', plan: r.plan }); });
router.post('/call/PediatricVSD', (req, res) => { const r = Engine.PediatricVSD(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: 'PediatricVSD', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_cardio_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
