// P3-ER pcc_pediatric_neuro_ext_routes v3.108.0
// P3-ER: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_neuro_ext_engine.js');
const VER = '3.108.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', label: 'PCC Pediatric Neuro Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricEpilepsyExt', (req, res) => { const r = F.PediatricEpilepsyExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricEpilepsyExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSeizureEvalExt', (req, res) => { const r = F.PediatricSeizureEvalExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricSeizureEvalExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHeadacheEvalExt', (req, res) => { const r = F.PediatricHeadacheEvalExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricHeadacheEvalExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricMigraineExt', (req, res) => { const r = F.PediatricMigraineExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricMigraineExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricStrokeExt', (req, res) => { const r = F.PediatricStrokeExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricStrokeExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricMovementDisorderExt', (req, res) => { const r = F.PediatricMovementDisorderExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricMovementDisorderExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNeurocutaneousExt', (req, res) => { const r = F.PediatricNeurocutaneousExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricNeurocutaneousExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNeuromuscularExt', (req, res) => { const r = F.PediatricNeuromuscularExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricNeuromuscularExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCerebrovascularExt', (req, res) => { const r = F.PediatricCerebrovascularExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricCerebrovascularExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricNeuroimmunologyExt', (req, res) => { const r = F.PediatricNeuroimmunologyExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricNeuroimmunologyExt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
