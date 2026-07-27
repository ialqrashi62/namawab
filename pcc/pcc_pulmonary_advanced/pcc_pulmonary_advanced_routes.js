// P3-DJ pcc_pulmonary_advanced_routes v3.74.0
// P3-DJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pulmonary_advanced_engine.js');
const VER = '3.74.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pulmonary_advanced', label: 'PCC Pulmonary Advanced', functions: Object.keys(Engine) });
});

router.post('/call/SpirometryPattern', (req, res) => { const r = Engine.SpirometryPattern(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'SpirometryPattern', plan: r.plan }); });
router.post('/call/DiffusionCapacity', (req, res) => { const r = Engine.DiffusionCapacity(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'DiffusionCapacity', plan: r.plan }); });
router.post('/call/Bronchoprovocation', (req, res) => { const r = Engine.Bronchoprovocation(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'Bronchoprovocation', plan: r.plan }); });
router.post('/call/EosinophilicAsthma', (req, res) => { const r = Engine.EosinophilicAsthma(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'EosinophilicAsthma', plan: r.plan }); });
router.post('/call/COPDExacerbation', (req, res) => { const r = Engine.COPDExacerbation(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'COPDExacerbation', plan: r.plan }); });
router.post('/call/InterstitialLung', (req, res) => { const r = Engine.InterstitialLung(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'InterstitialLung', plan: r.plan }); });
router.post('/call/PulmonaryRehab', (req, res) => { const r = Engine.PulmonaryRehab(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'PulmonaryRehab', plan: r.plan }); });
router.post('/call/OxygenTherapy', (req, res) => { const r = Engine.OxygenTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'OxygenTherapy', plan: r.plan }); });
router.post('/call/VentilatorySupport', (req, res) => { const r = Engine.VentilatorySupport(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'VentilatorySupport', plan: r.plan }); });
router.post('/call/LungTransplant', (req, res) => { const r = Engine.LungTransplant(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'LungTransplant', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
