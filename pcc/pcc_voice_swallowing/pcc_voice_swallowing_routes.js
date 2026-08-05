// P3-EH pcc_voice_swallowing_routes v3.98.0
// P3-EH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_voice_swallowing_engine.js');
const VER = '3.98.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_voice_swallowing', label: 'PCC Voice Swallowing', functions: Object.keys(F) });
});
router.post('/call/VocalCordNoduleEvaluation', (req, res) => { const r = F.VocalCordNoduleEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'VocalCordNoduleEvaluation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LaryngopharyngealReflux', (req, res) => { const r = F.LaryngopharyngealReflux(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'LaryngopharyngealReflux', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MuscleTensionDysphonia', (req, res) => { const r = F.MuscleTensionDysphonia(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'MuscleTensionDysphonia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpasmodicDysphonia', (req, res) => { const r = F.SpasmodicDysphonia(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'SpasmodicDysphonia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VocalCordParalysis', (req, res) => { const r = F.VocalCordParalysis(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'VocalCordParalysis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SubglotticStenosis', (req, res) => { const r = F.SubglotticStenosis(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'SubglotticStenosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TracheoesophagealFistula', (req, res) => { const r = F.TracheoesophagealFistula(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'TracheoesophagealFistula', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ZenkerDiverticulum', (req, res) => { const r = F.ZenkerDiverticulum(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'ZenkerDiverticulum', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DysphagiaSwallowEval', (req, res) => { const r = F.DysphagiaSwallowEval(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'DysphagiaSwallowEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VocalCordPolyps', (req, res) => { const r = F.VocalCordPolyps(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'VocalCordPolyps', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VoiceTherapyProtocol', (req, res) => { const r = F.VoiceTherapyProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'VoiceTherapyProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_voice_swallowing', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
