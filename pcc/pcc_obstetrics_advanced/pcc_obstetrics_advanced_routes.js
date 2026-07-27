// P3-DR pcc_obstetrics_advanced_routes v3.82.0
// P3-DR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_obstetrics_advanced_engine.js');
const VER = '3.82.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_obstetrics_advanced', label: 'PCC Obstetrics Advanced', functions: Object.keys(Engine) });
});

router.post('/call/PreeclampsiaSevere', (req, res) => { const r = Engine.PreeclampsiaSevere(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'PreeclampsiaSevere', plan: r.plan }); });
router.post('/call/EclampsiaManagement', (req, res) => { const r = Engine.EclampsiaManagement(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'EclampsiaManagement', plan: r.plan }); });
router.post('/call/HELLPSyndrome', (req, res) => { const r = Engine.HELLPSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'HELLPSyndrome', plan: r.plan }); });
router.post('/call/PlacentalAbruption', (req, res) => { const r = Engine.PlacentalAbruption(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'PlacentalAbruption', plan: r.plan }); });
router.post('/call/PlacentaPreviaAdvanced', (req, res) => { const r = Engine.PlacentaPreviaAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'PlacentaPreviaAdvanced', plan: r.plan }); });
router.post('/call/PostpartumHemorrhage', (req, res) => { const r = Engine.PostpartumHemorrhage(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'PostpartumHemorrhage', plan: r.plan }); });
router.post('/call/AmnioticFluidEmbolism', (req, res) => { const r = Engine.AmnioticFluidEmbolism(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'AmnioticFluidEmbolism', plan: r.plan }); });
router.post('/call/UterineRupture', (req, res) => { const r = Engine.UterineRupture(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'UterineRupture', plan: r.plan }); });
router.post('/call/ObstetricSepsis', (req, res) => { const r = Engine.ObstetricSepsis(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'ObstetricSepsis', plan: r.plan }); });
router.post('/call/PeripartumCardiomyopathy', (req, res) => { const r = Engine.PeripartumCardiomyopathy(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'PeripartumCardiomyopathy', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
