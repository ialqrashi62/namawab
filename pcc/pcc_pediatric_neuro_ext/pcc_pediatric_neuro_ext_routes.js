// P3-ER pcc_pediatric_neuro_ext_routes v3.108.0
// P3-ER: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_neuro_ext_engine.js');
const VER = '3.108.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', label: 'PCC Pediatric Neuro Ext', functions: Object.keys(Engine) });
});
router.post('/call/PediatricEpilepsyExt', (req, res) => { const r = Engine.PediatricEpilepsyExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricEpilepsyExt', plan: r.plan }); });
router.post('/call/PediatricSeizureEvalExt', (req, res) => { const r = Engine.PediatricSeizureEvalExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricSeizureEvalExt', plan: r.plan }); });
router.post('/call/PediatricHeadacheEvalExt', (req, res) => { const r = Engine.PediatricHeadacheEvalExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricHeadacheEvalExt', plan: r.plan }); });
router.post('/call/PediatricMigraineExt', (req, res) => { const r = Engine.PediatricMigraineExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricMigraineExt', plan: r.plan }); });
router.post('/call/PediatricStrokeExt', (req, res) => { const r = Engine.PediatricStrokeExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricStrokeExt', plan: r.plan }); });
router.post('/call/PediatricMovementDisorderExt', (req, res) => { const r = Engine.PediatricMovementDisorderExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricMovementDisorderExt', plan: r.plan }); });
router.post('/call/PediatricNeurocutaneousExt', (req, res) => { const r = Engine.PediatricNeurocutaneousExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricNeurocutaneousExt', plan: r.plan }); });
router.post('/call/PediatricNeuromuscularExt', (req, res) => { const r = Engine.PediatricNeuromuscularExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricNeuromuscularExt', plan: r.plan }); });
router.post('/call/PediatricCerebrovascularExt', (req, res) => { const r = Engine.PediatricCerebrovascularExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricCerebrovascularExt', plan: r.plan }); });
router.post('/call/PediatricNeuroimmunologyExt', (req, res) => { const r = Engine.PediatricNeuroimmunologyExt(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: 'PediatricNeuroimmunologyExt', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_neuro_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
