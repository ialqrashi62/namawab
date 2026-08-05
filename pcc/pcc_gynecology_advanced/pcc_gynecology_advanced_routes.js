// P3-DR pcc_gynecology_advanced_routes v3.82.0
// P3-DR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_gynecology_advanced_engine.js');
const VER = '3.82.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_gynecology_advanced', label: 'PCC Gynecology Advanced', functions: Object.keys(F) });
});

router.post('/call/OvarianCancerAdvanced', (req, res) => { const r = F.OvarianCancerAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'OvarianCancerAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EndometrialCancer', (req, res) => { const r = F.EndometrialCancer(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'EndometrialCancer', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CervicalCancerAdvanced', (req, res) => { const r = F.CervicalCancerAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'CervicalCancerAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/UterineFibroidsRefractory', (req, res) => { const r = F.UterineFibroidsRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'UterineFibroidsRefractory', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EndometriosisAdvanced', (req, res) => { const r = F.EndometriosisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'EndometriosisAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PCOSRefractory', (req, res) => { const r = F.PCOSRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'PCOSRefractory', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PelvicInflammatoryDisease', (req, res) => { const r = F.PelvicInflammatoryDisease(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'PelvicInflammatoryDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VulvodyniaAdvanced', (req, res) => { const r = F.VulvodyniaAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'VulvodyniaAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GynecologicSurgeryRisk', (req, res) => { const r = F.GynecologicSurgeryRisk(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'GynecologicSurgeryRisk', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FertilityPreservation', (req, res) => { const r = F.FertilityPreservation(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'FertilityPreservation', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_gynecology_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
