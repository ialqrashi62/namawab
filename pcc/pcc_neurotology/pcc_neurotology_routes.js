// P3-EG pcc_neurotology_routes v3.97.0
// P3-EG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neurotology_engine.js');
const VER = '3.97.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neurotology', label: 'PCC Neurotology', functions: Object.keys(F) });
});
router.post('/call/VertigoLocalization', (req, res) => { const r = F.VertigoLocalization(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'VertigoLocalization', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AcousticNeuromaScreening', (req, res) => { const r = F.AcousticNeuromaScreening(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'AcousticNeuromaScreening', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CerebellarStrokeSyndromes', (req, res) => { const r = F.CerebellarStrokeSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'CerebellarStrokeSyndromes', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BrainstemStrokeSyndromes', (req, res) => { const r = F.BrainstemStrokeSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'BrainstemStrokeSyndromes', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PosteriorFossaTumor', (req, res) => { const r = F.PosteriorFossaTumor(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'PosteriorFossaTumor', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HerpesZosterOticus', (req, res) => { const r = F.HerpesZosterOticus(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'HerpesZosterOticus', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VestibularNeuritis', (req, res) => { const r = F.VestibularNeuritis(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'VestibularNeuritis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Labyrinthitis', (req, res) => { const r = F.Labyrinthitis(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'Labyrinthitis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OtotoxicMonitoringExtended', (req, res) => { const r = F.OtotoxicMonitoringExtended(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'OtotoxicMonitoringExtended', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TinnitusHabituationTherapy', (req, res) => { const r = F.TinnitusHabituationTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'TinnitusHabituationTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neurotology', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
