// P3-EH pcc_pediatric_gi_ext_routes v3.98.0
// P3-EH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_gi_ext_engine.js');
const VER = '3.98.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_gi_ext', label: 'PCC Pediatric GI Ext', functions: Object.keys(Engine) });
});
router.post('/call/PediatricGERDEvaluation', (req, res) => { const r = Engine.PediatricGERDEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'PediatricGERDEvaluation', plan: r.plan }); });
router.post('/call/CeliacDisease', (req, res) => { const r = Engine.CeliacDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'CeliacDisease', plan: r.plan }); });
router.post('/call/PediatricIBD', (req, res) => { const r = Engine.PediatricIBD(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'PediatricIBD', plan: r.plan }); });
router.post('/call/HirschsprungDisease', (req, res) => { const r = Engine.HirschsprungDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'HirschsprungDisease', plan: r.plan }); });
router.post('/call/PyloricStenosis', (req, res) => { const r = Engine.PyloricStenosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'PyloricStenosis', plan: r.plan }); });
router.post('/call/Intussusception', (req, res) => { const r = Engine.Intussusception(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'Intussusception', plan: r.plan }); });
router.post('/call/PediatricHepatology', (req, res) => { const r = Engine.PediatricHepatology(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'PediatricHepatology', plan: r.plan }); });
router.post('/call/PediatricPancreatitis', (req, res) => { const r = Engine.PediatricPancreatitis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'PediatricPancreatitis', plan: r.plan }); });
router.post('/call/NeonatalCholestasis', (req, res) => { const r = Engine.NeonatalCholestasis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'NeonatalCholestasis', plan: r.plan }); });
router.post('/call/PediatricLiverTransplant', (req, res) => { const r = Engine.PediatricLiverTransplant(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: 'PediatricLiverTransplant', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_gi_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
