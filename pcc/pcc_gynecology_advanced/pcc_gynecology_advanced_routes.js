// P3-DR pcc_gynecology_advanced_routes v3.82.0
// P3-DR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_gynecology_advanced_engine.js');
const VER = '3.82.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_gynecology_advanced', label: 'PCC Gynecology Advanced', functions: Object.keys(Engine) });
});

router.post('/call/OvarianCancerAdvanced', (req, res) => { const r = Engine.OvarianCancerAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'OvarianCancerAdvanced', plan: r.plan }); });
router.post('/call/EndometrialCancer', (req, res) => { const r = Engine.EndometrialCancer(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'EndometrialCancer', plan: r.plan }); });
router.post('/call/CervicalCancerAdvanced', (req, res) => { const r = Engine.CervicalCancerAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'CervicalCancerAdvanced', plan: r.plan }); });
router.post('/call/UterineFibroidsRefractory', (req, res) => { const r = Engine.UterineFibroidsRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'UterineFibroidsRefractory', plan: r.plan }); });
router.post('/call/EndometriosisAdvanced', (req, res) => { const r = Engine.EndometriosisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'EndometriosisAdvanced', plan: r.plan }); });
router.post('/call/PCOSRefractory', (req, res) => { const r = Engine.PCOSRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'PCOSRefractory', plan: r.plan }); });
router.post('/call/PelvicInflammatoryDisease', (req, res) => { const r = Engine.PelvicInflammatoryDisease(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'PelvicInflammatoryDisease', plan: r.plan }); });
router.post('/call/VulvodyniaAdvanced', (req, res) => { const r = Engine.VulvodyniaAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'VulvodyniaAdvanced', plan: r.plan }); });
router.post('/call/GynecologicSurgeryRisk', (req, res) => { const r = Engine.GynecologicSurgeryRisk(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'GynecologicSurgeryRisk', plan: r.plan }); });
router.post('/call/FertilityPreservation', (req, res) => { const r = Engine.FertilityPreservation(req.body || {}); res.json({ version: VER, module: 'pcc_gynecology_advanced', function: 'FertilityPreservation', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_gynecology_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
