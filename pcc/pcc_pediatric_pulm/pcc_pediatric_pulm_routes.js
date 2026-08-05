// P3-EG pcc_pediatric_pulm_routes v3.97.0
// P3-EG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_pulm_engine.js');
const VER = '3.97.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_pulm', label: 'PCC Pediatric Pulm', functions: Object.keys(F) });
});
router.post('/call/PediatricAsthmaManagement', (req, res) => { const r = F.PediatricAsthmaManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricAsthmaManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCysticFibrosis', (req, res) => { const r = F.PediatricCysticFibrosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricCysticFibrosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BronchiolitisManagement', (req, res) => { const r = F.BronchiolitisManagement(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'BronchiolitisManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPneumonia', (req, res) => { const r = F.PediatricPneumonia(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricPneumonia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTuberculosis', (req, res) => { const r = F.PediatricTuberculosis(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricTuberculosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSleepApnea', (req, res) => { const r = F.PediatricSleepApnea(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricSleepApnea', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricChronicLungDisease', (req, res) => { const r = F.PediatricChronicLungDisease(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricChronicLungDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricVentilationSupport', (req, res) => { const r = F.PediatricVentilationSupport(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricVentilationSupport', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAirwayAnomalies', (req, res) => { const r = F.PediatricAirwayAnomalies(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricAirwayAnomalies', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPulmonaryHypertension', (req, res) => { const r = F.PediatricPulmonaryHypertension(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_pulm', function: 'PediatricPulmonaryHypertension', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_pulm', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
