// P3-EM pcc_pediatric_rehab_routes v3.103.0
// P3-EM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_rehab_engine.js');
const VER = '3.103.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_rehab', label: 'PCC Pediatric Rehab', functions: Object.keys(F) });
});
router.post('/call/PediatricRehabAssessment', (req, res) => { const r = F.PediatricRehabAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricRehabAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPT', (req, res) => { const r = F.PediatricPT(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricPT', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricOT', (req, res) => { const r = F.PediatricOT(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricOT', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSpeechRehab', (req, res) => { const r = F.PediatricSpeechRehab(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricSpeechRehab', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCognitiveRehab', (req, res) => { const r = F.PediatricCognitiveRehab(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricCognitiveRehab', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAquaticTherapy', (req, res) => { const r = F.PediatricAquaticTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricAquaticTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricConstraintTherapy', (req, res) => { const r = F.PediatricConstraintTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricConstraintTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricRoboticRehab', (req, res) => { const r = F.PediatricRoboticRehab(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricRoboticRehab', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricGaitTraining', (req, res) => { const r = F.PediatricGaitTraining(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricGaitTraining', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSportsRehab', (req, res) => { const r = F.PediatricSportsRehab(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricSportsRehab', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_rehab', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
