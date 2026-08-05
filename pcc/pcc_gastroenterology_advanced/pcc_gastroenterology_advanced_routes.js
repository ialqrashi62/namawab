// P3-DO pcc_gastroenterology_advanced_routes v3.79.0
// P3-DO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_gastroenterology_advanced_engine.js');
const VER = '3.79.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_gastroenterology_advanced', label: 'PCC Gastroenterology Advanced', functions: Object.keys(F) });
});

router.post('/call/ChronicDiarrheaWorkup', (req, res) => { const r = F.ChronicDiarrheaWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_gastroenterology_advanced', function: 'ChronicDiarrheaWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ConstipationRefractory', (req, res) => { const r = F.ConstipationRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_gastroenterology_advanced', function: 'ConstipationRefractory', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/IBDFlareManagement', (req, res) => { const r = F.IBDFlareManagement(req.body || {}); res.json({ version: VER, module: 'pcc_gastroenterology_advanced', function: 'IBDFlareManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/IBSRefractory', (req, res) => { const r = F.IBSRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_gastroenterology_advanced', function: 'IBSRefractory', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CeliacDisease', (req, res) => { const r = F.CeliacDisease(req.body || {}); res.json({ version: VER, module: 'pcc_gastroenterology_advanced', function: 'CeliacDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Gastroparesis', (req, res) => { const r = F.Gastroparesis(req.body || {}); res.json({ version: VER, module: 'pcc_gastroenterology_advanced', function: 'Gastroparesis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EosinophilicEsophagitis', (req, res) => { const r = F.EosinophilicEsophagitis(req.body || {}); res.json({ version: VER, module: 'pcc_gastroenterology_advanced', function: 'EosinophilicEsophagitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GIBleedAdvanced', (req, res) => { const r = F.GIBleedAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_gastroenterology_advanced', function: 'GIBleedAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PancreatitisChronic', (req, res) => { const r = F.PancreatitisChronic(req.body || {}); res.json({ version: VER, module: 'pcc_gastroenterology_advanced', function: 'PancreatitisChronic', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SmallIntestinalBacterialOvergrowth', (req, res) => { const r = F.SmallIntestinalBacterialOvergrowth(req.body || {}); res.json({ version: VER, module: 'pcc_gastroenterology_advanced', function: 'SmallIntestinalBacterialOvergrowth', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_gastroenterology_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
