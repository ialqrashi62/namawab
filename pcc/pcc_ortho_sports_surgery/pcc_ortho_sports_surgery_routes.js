// P3-DU pcc_ortho_sports_surgery_routes v3.85.0
// P3-DU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_ortho_sports_surgery_engine.js');
const VER = '3.85.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_ortho_sports_surgery', label: 'PCC Ortho Sports Surgery', functions: Object.keys(F) });
});
router.post('/call/ACLRRepair', (req, res) => { const r = F.ACLRRepair(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'ACLRRepair', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RotatorCuffRepair', (req, res) => { const r = F.RotatorCuffRepair(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'RotatorCuffRepair', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MeniscusRepair', (req, res) => { const r = F.MeniscusRepair(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'MeniscusRepair', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HipArthroscopy', (req, res) => { const r = F.HipArthroscopy(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'HipArthroscopy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AchillesTendonRepair', (req, res) => { const r = F.AchillesTendonRepair(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'AchillesTendonRepair', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ShoulderInstability', (req, res) => { const r = F.ShoulderInstability(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'ShoulderInstability', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TennisElbowRelease', (req, res) => { const r = F.TennisElbowRelease(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'TennisElbowRelease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HipReplacementIndication', (req, res) => { const r = F.HipReplacementIndication(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'HipReplacementIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/KneeReplacementIndication', (req, res) => { const r = F.KneeReplacementIndication(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'KneeReplacementIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SportInjuryReturnToPlay', (req, res) => { const r = F.SportInjuryReturnToPlay(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: 'SportInjuryReturnToPlay', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_ortho_sports_surgery', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
