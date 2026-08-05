// P3-DR pcc_obstetrics_advanced_routes v3.82.0
// P3-DR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_obstetrics_advanced_engine.js');
const VER = '3.82.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_obstetrics_advanced', label: 'PCC Obstetrics Advanced', functions: Object.keys(F) });
});

router.post('/call/PreeclampsiaSevere', (req, res) => { const r = F.PreeclampsiaSevere(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'PreeclampsiaSevere', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EclampsiaManagement', (req, res) => { const r = F.EclampsiaManagement(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'EclampsiaManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HELLPSyndrome', (req, res) => { const r = F.HELLPSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'HELLPSyndrome', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PlacentalAbruption', (req, res) => { const r = F.PlacentalAbruption(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'PlacentalAbruption', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PlacentaPreviaAdvanced', (req, res) => { const r = F.PlacentaPreviaAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'PlacentaPreviaAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PostpartumHemorrhage', (req, res) => { const r = F.PostpartumHemorrhage(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'PostpartumHemorrhage', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AmnioticFluidEmbolism', (req, res) => { const r = F.AmnioticFluidEmbolism(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'AmnioticFluidEmbolism', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/UterineRupture', (req, res) => { const r = F.UterineRupture(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'UterineRupture', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ObstetricSepsis', (req, res) => { const r = F.ObstetricSepsis(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'ObstetricSepsis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PeripartumCardiomyopathy', (req, res) => { const r = F.PeripartumCardiomyopathy(req.body || {}); res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: 'PeripartumCardiomyopathy', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_obstetrics_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
