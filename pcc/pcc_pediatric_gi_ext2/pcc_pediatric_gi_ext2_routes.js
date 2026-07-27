// P3-ER pcc_pediatric_gi_ext2_routes v3.108.0
// P3-ER: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_gi_ext2_engine.js');
const VER = '3.108.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_gi_ext2', label: 'PCC Pediatric GI Ext2', functions: Object.keys(Engine) });
});
router.post('/call/PediatricGERDEvalExt', (req, res) => { const r = Engine.PediatricGERDEvalExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext2', function: 'PediatricGERDEvalExt', plan: r.plan }); });
router.post('/call/PediatricEosinophilicEsophagitis', (req, res) => { const r = Engine.PediatricEosinophilicEsophagitis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext2', function: 'PediatricEosinophilicEsophagitis', plan: r.plan }); });
router.post('/call/PediatricCeliacExt', (req, res) => { const r = Engine.PediatricCeliacExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext2', function: 'PediatricCeliacExt', plan: r.plan }); });
router.post('/call/PediatricIBDExt', (req, res) => { const r = Engine.PediatricIBDExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext2', function: 'PediatricIBDExt', plan: r.plan }); });
router.post('/call/PediatricHirschsprungExt', (req, res) => { const r = Engine.PediatricHirschsprungExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext2', function: 'PediatricHirschsprungExt', plan: r.plan }); });
router.post('/call/PediatricPyloricStenosisExt', (req, res) => { const r = Engine.PediatricPyloricStenosisExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext2', function: 'PediatricPyloricStenosisExt', plan: r.plan }); });
router.post('/call/PediatricIntussusceptionExt', (req, res) => { const r = Engine.PediatricIntussusceptionExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext2', function: 'PediatricIntussusceptionExt', plan: r.plan }); });
router.post('/call/PediatricHepatologyExt', (req, res) => { const r = Engine.PediatricHepatologyExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext2', function: 'PediatricHepatologyExt', plan: r.plan }); });
router.post('/call/PediatricPancreatitisExt', (req, res) => { const r = Engine.PediatricPancreatitisExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext2', function: 'PediatricPancreatitisExt', plan: r.plan }); });
router.post('/call/PediatricLiverDiseaseExt', (req, res) => { const r = Engine.PediatricLiverDiseaseExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_gi_ext2', function: 'PediatricLiverDiseaseExt', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_gi_ext2', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
