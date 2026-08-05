// P3-DW pcc_sports_cardiology_routes v3.87.0
// P3-DW: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_sports_cardiology_engine.js');
const VER = '3.87.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_sports_cardiology', label: 'PCC Sports Cardiology', functions: Object.keys(F) });
});
router.post('/call/AthleteECGInterpretation', (req, res) => { const r = F.AthleteECGInterpretation(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'AthleteECGInterpretation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PreParticipationCardiacScreen', (req, res) => { const r = F.PreParticipationCardiacScreen(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'PreParticipationCardiacScreen', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HypertrophicCardiomyopathyRisk', (req, res) => { const r = F.HypertrophicCardiomyopathyRisk(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'HypertrophicCardiomyopathyRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MarfanSyndromeScreen', (req, res) => { const r = F.MarfanSyndromeScreen(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'MarfanSyndromeScreen', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CommotioCordisRisk', (req, res) => { const r = F.CommotioCordisRisk(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'CommotioCordisRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ExerciseStressTestProtocol', (req, res) => { const r = F.ExerciseStressTestProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'ExerciseStressTestProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AthleteECHOIndication', (req, res) => { const r = F.AthleteECHOIndication(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'AthleteECHOIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CardiacRehabPhaseProgression', (req, res) => { const r = F.CardiacRehabPhaseProgression(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'CardiacRehabPhaseProgression', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ReturnToPlayCardiac', (req, res) => { const r = F.ReturnToPlayCardiac(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'ReturnToPlayCardiac', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SuddenCardiacDeathScreening', (req, res) => { const r = F.SuddenCardiacDeathScreening(req.body || {}); res.json({ version: VER, module: 'pcc_sports_cardiology', function: 'SuddenCardiacDeathScreening', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_sports_cardiology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
