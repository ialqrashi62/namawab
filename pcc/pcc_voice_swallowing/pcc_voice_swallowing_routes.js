// P3-EH pcc_voice_swallowing_routes v3.98.0
// P3-EH: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_voice_swallowing_engine.js');
const VER = '3.98.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_voice_swallowing', label: 'PCC Voice Swallowing', functions: Object.keys(Engine) });
});
router.post('/call/VocalCordNoduleEvaluation', (req, res) => { const r = Engine.VocalCordNoduleEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'VocalCordNoduleEvaluation', plan: r.plan }); });
router.post('/call/LaryngopharyngealReflux', (req, res) => { const r = Engine.LaryngopharyngealReflux(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'LaryngopharyngealReflux', plan: r.plan }); });
router.post('/call/MuscleTensionDysphonia', (req, res) => { const r = Engine.MuscleTensionDysphonia(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'MuscleTensionDysphonia', plan: r.plan }); });
router.post('/call/SpasmodicDysphonia', (req, res) => { const r = Engine.SpasmodicDysphonia(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'SpasmodicDysphonia', plan: r.plan }); });
router.post('/call/VocalCordParalysis', (req, res) => { const r = Engine.VocalCordParalysis(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'VocalCordParalysis', plan: r.plan }); });
router.post('/call/SubglotticStenosis', (req, res) => { const r = Engine.SubglotticStenosis(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'SubglotticStenosis', plan: r.plan }); });
router.post('/call/TracheoesophagealFistula', (req, res) => { const r = Engine.TracheoesophagealFistula(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'TracheoesophagealFistula', plan: r.plan }); });
router.post('/call/ZenkerDiverticulum', (req, res) => { const r = Engine.ZenkerDiverticulum(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'ZenkerDiverticulum', plan: r.plan }); });
router.post('/call/DysphagiaSwallowEval', (req, res) => { const r = Engine.DysphagiaSwallowEval(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'DysphagiaSwallowEval', plan: r.plan }); });
router.post('/call/VocalCordPolyps', (req, res) => { const r = Engine.VocalCordPolyps(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'VocalCordPolyps', plan: r.plan }); });
router.post('/call/VoiceTherapyProtocol', (req, res) => { const r = Engine.VoiceTherapyProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_voice_swallowing', function: 'VoiceTherapyProtocol', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_voice_swallowing', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
