// P3-DJ pcc_pulmonary_advanced_routes v3.74.0
// P3-DJ: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pulmonary_advanced_engine.js');
const VER = '3.74.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pulmonary_advanced', label: 'PCC Pulmonary Advanced', functions: Object.keys(F) });
});

router.post('/call/SpirometryPattern', (req, res) => { const r = F.SpirometryPattern(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'SpirometryPattern', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DiffusionCapacity', (req, res) => { const r = F.DiffusionCapacity(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'DiffusionCapacity', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Bronchoprovocation', (req, res) => { const r = F.Bronchoprovocation(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'Bronchoprovocation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EosinophilicAsthma', (req, res) => { const r = F.EosinophilicAsthma(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'EosinophilicAsthma', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/COPDExacerbation', (req, res) => { const r = F.COPDExacerbation(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'COPDExacerbation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/InterstitialLung', (req, res) => { const r = F.InterstitialLung(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'InterstitialLung', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PulmonaryRehab', (req, res) => { const r = F.PulmonaryRehab(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'PulmonaryRehab', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OxygenTherapy', (req, res) => { const r = F.OxygenTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'OxygenTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VentilatorySupport', (req, res) => { const r = F.VentilatorySupport(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'VentilatorySupport', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LungTransplant', (req, res) => { const r = F.LungTransplant(req.body || {}); res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: 'LungTransplant', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pulmonary_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
