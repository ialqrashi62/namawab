// P3-DD pcc_occupational_rehab_routes v3.68.0
// P3-DD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_occupational_rehab_engine.js');
const VER = '3.68.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_occupational_rehab', label: 'PCC Occupational Rehab', functions: Object.keys(Engine) });
});

router.post('/call/WorkCapacity', (req, res) => { const r = Engine.WorkCapacity(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'WorkCapacity', plan: r.plan }); });
router.post('/call/ErgonomicAssessment', (req, res) => { const r = Engine.ErgonomicAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'ErgonomicAssessment', plan: r.plan }); });
router.post('/call/FunctionalRestoration', (req, res) => { const r = Engine.FunctionalRestoration(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'FunctionalRestoration', plan: r.plan }); });
router.post('/call/ReturnToWork', (req, res) => { const r = Engine.ReturnToWork(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'ReturnToWork', plan: r.plan }); });
router.post('/call/VocationalRetraining', (req, res) => { const r = Engine.VocationalRetraining(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'VocationalRetraining', plan: r.plan }); });
router.post('/call/WorkHardening', (req, res) => { const r = Engine.WorkHardening(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'WorkHardening', plan: r.plan }); });
router.post('/call/PainAtWork', (req, res) => { const r = Engine.PainAtWork(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'PainAtWork', plan: r.plan }); });
router.post('/call/CognitiveDemands', (req, res) => { const r = Engine.CognitiveDemands(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'CognitiveDemands', plan: r.plan }); });
router.post('/call/SafetyClearance', (req, res) => { const r = Engine.SafetyClearance(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'SafetyClearance', plan: r.plan }); });
router.post('/call/DisabilityEvaluation', (req, res) => { const r = Engine.DisabilityEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'DisabilityEvaluation', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_occupational_rehab', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
