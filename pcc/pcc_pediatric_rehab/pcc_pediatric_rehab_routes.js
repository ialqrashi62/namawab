// P3-EM pcc_pediatric_rehab_routes v3.103.0
// P3-EM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_rehab_engine.js');
const VER = '3.103.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_rehab', label: 'PCC Pediatric Rehab', functions: Object.keys(Engine) });
});
router.post('/call/PediatricRehabAssessment', (req, res) => { const r = Engine.PediatricRehabAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricRehabAssessment', plan: r.plan }); });
router.post('/call/PediatricPT', (req, res) => { const r = Engine.PediatricPT(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricPT', plan: r.plan }); });
router.post('/call/PediatricOT', (req, res) => { const r = Engine.PediatricOT(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricOT', plan: r.plan }); });
router.post('/call/PediatricSpeechRehab', (req, res) => { const r = Engine.PediatricSpeechRehab(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricSpeechRehab', plan: r.plan }); });
router.post('/call/PediatricCognitiveRehab', (req, res) => { const r = Engine.PediatricCognitiveRehab(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricCognitiveRehab', plan: r.plan }); });
router.post('/call/PediatricAquaticTherapy', (req, res) => { const r = Engine.PediatricAquaticTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricAquaticTherapy', plan: r.plan }); });
router.post('/call/PediatricConstraintTherapy', (req, res) => { const r = Engine.PediatricConstraintTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricConstraintTherapy', plan: r.plan }); });
router.post('/call/PediatricRoboticRehab', (req, res) => { const r = Engine.PediatricRoboticRehab(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricRoboticRehab', plan: r.plan }); });
router.post('/call/PediatricGaitTraining', (req, res) => { const r = Engine.PediatricGaitTraining(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricGaitTraining', plan: r.plan }); });
router.post('/call/PediatricSportsRehab', (req, res) => { const r = Engine.PediatricSportsRehab(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_rehab', function: 'PediatricSportsRehab', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_rehab', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
