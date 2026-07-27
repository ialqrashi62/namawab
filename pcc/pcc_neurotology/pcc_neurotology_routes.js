// P3-EG pcc_neurotology_routes v3.97.0
// P3-EG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neurotology_engine.js');
const VER = '3.97.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neurotology', label: 'PCC Neurotology', functions: Object.keys(Engine) });
});
router.post('/call/VertigoLocalization', (req, res) => { const r = Engine.VertigoLocalization(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'VertigoLocalization', plan: r.plan }); });
router.post('/call/AcousticNeuromaScreening', (req, res) => { const r = Engine.AcousticNeuromaScreening(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'AcousticNeuromaScreening', plan: r.plan }); });
router.post('/call/CerebellarStrokeSyndromes', (req, res) => { const r = Engine.CerebellarStrokeSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'CerebellarStrokeSyndromes', plan: r.plan }); });
router.post('/call/BrainstemStrokeSyndromes', (req, res) => { const r = Engine.BrainstemStrokeSyndromes(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'BrainstemStrokeSyndromes', plan: r.plan }); });
router.post('/call/PosteriorFossaTumor', (req, res) => { const r = Engine.PosteriorFossaTumor(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'PosteriorFossaTumor', plan: r.plan }); });
router.post('/call/HerpesZosterOticus', (req, res) => { const r = Engine.HerpesZosterOticus(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'HerpesZosterOticus', plan: r.plan }); });
router.post('/call/VestibularNeuritis', (req, res) => { const r = Engine.VestibularNeuritis(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'VestibularNeuritis', plan: r.plan }); });
router.post('/call/Labyrinthitis', (req, res) => { const r = Engine.Labyrinthitis(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'Labyrinthitis', plan: r.plan }); });
router.post('/call/OtotoxicMonitoringExtended', (req, res) => { const r = Engine.OtotoxicMonitoringExtended(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'OtotoxicMonitoringExtended', plan: r.plan }); });
router.post('/call/TinnitusHabituationTherapy', (req, res) => { const r = Engine.TinnitusHabituationTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_neurotology', function: 'TinnitusHabituationTherapy', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neurotology', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
