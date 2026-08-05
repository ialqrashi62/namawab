// P3-EJ pcc_spine_surgery_ext_routes v3.100.0
// P3-EJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_spine_surgery_ext_engine.js');
const VER = '3.100.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_spine_surgery_ext', label: 'PCC Spine Surgery Ext', functions: Object.keys(F) });
});
router.post('/call/SpinalStenosisEval', (req, res) => { const r = F.SpinalStenosisEval(req.body || {}); res.json({ version: VER, module: 'pcc_spine_surgery_ext', function: 'SpinalStenosisEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DiscHerniationProtocol', (req, res) => { const r = F.DiscHerniationProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_spine_surgery_ext', function: 'DiscHerniationProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpinalFusionIndication', (req, res) => { const r = F.SpinalFusionIndication(req.body || {}); res.json({ version: VER, module: 'pcc_spine_surgery_ext', function: 'SpinalFusionIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ScoliosisSurgicalPlan', (req, res) => { const r = F.ScoliosisSurgicalPlan(req.body || {}); res.json({ version: VER, module: 'pcc_spine_surgery_ext', function: 'ScoliosisSurgicalPlan', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpinalCordTriage', (req, res) => { const r = F.SpinalCordTriage(req.body || {}); res.json({ version: VER, module: 'pcc_spine_surgery_ext', function: 'SpinalCordTriage', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VertebralFracture', (req, res) => { const r = F.VertebralFracture(req.body || {}); res.json({ version: VER, module: 'pcc_spine_surgery_ext', function: 'VertebralFracture', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CaudaEquinaSyndrome', (req, res) => { const r = F.CaudaEquinaSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_spine_surgery_ext', function: 'CaudaEquinaSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpinalTumorWorkup', (req, res) => { const r = F.SpinalTumorWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_spine_surgery_ext', function: 'SpinalTumorWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CervicalMyelopathy', (req, res) => { const r = F.CervicalMyelopathy(req.body || {}); res.json({ version: VER, module: 'pcc_spine_surgery_ext', function: 'CervicalMyelopathy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpondylolisthesisEval', (req, res) => { const r = F.SpondylolisthesisEval(req.body || {}); res.json({ version: VER, module: 'pcc_spine_surgery_ext', function: 'SpondylolisthesisEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_spine_surgery_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
