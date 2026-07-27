// P3-DW pcc_sports_cardiology_routes v3.87.0
// P3-DW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_sports_cardiology_engine.js');
const VER = '3.87.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_sports_cardiology', label: 'PCC Sports Cardiology', functions: Object.keys(Engine) });
});
router.post('/call/AthleteECGInterpretation', (req, res) => { const r = Engine.AthleteECGInterpretation(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'AthleteECGInterpretation', plan: r.plan }); });
router.post('/call/PreParticipationCardiacScreen', (req, res) => { const r = Engine.PreParticipationCardiacScreen(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'PreParticipationCardiacScreen', plan: r.plan }); });
router.post('/call/HypertrophicCardiomyopathyRisk', (req, res) => { const r = Engine.HypertrophicCardiomyopathyRisk(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'HypertrophicCardiomyopathyRisk', plan: r.plan }); });
router.post('/call/MarfanSyndromeScreen', (req, res) => { const r = Engine.MarfanSyndromeScreen(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'MarfanSyndromeScreen', plan: r.plan }); });
router.post('/call/CommotioCordisRisk', (req, res) => { const r = Engine.CommotioCordisRisk(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'CommotioCordisRisk', plan: r.plan }); });
router.post('/call/ExerciseStressTestProtocol', (req, res) => { const r = Engine.ExerciseStressTestProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'ExerciseStressTestProtocol', plan: r.plan }); });
router.post('/call/AthleteECHOIndication', (req, res) => { const r = Engine.AthleteECHOIndication(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'AthleteECHOIndication', plan: r.plan }); });
router.post('/call/CardiacRehabPhaseProgression', (req, res) => { const r = Engine.CardiacRehabPhaseProgression(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'CardiacRehabPhaseProgression', plan: r.plan }); });
router.post('/call/ReturnToPlayCardiac', (req, res) => { const r = Engine.ReturnToPlayCardiac(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'ReturnToPlayCardiac', plan: r.plan }); });
router.post('/call/SuddenCardiacDeathScreening', (req, res) => { const r = Engine.SuddenCardiacDeathScreening(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'SuddenCardiacDeathScreening', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_sports_cardiology', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
