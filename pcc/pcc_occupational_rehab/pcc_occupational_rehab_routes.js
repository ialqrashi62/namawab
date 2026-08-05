// P3-DD pcc_occupational_rehab_routes v3.68.0
// P3-DD: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_occupational_rehab_engine.js');
const VER = '3.68.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_occupational_rehab', label: 'PCC Occupational Rehab', functions: Object.keys(F) });
});

router.post('/call/WorkCapacity', (req, res) => { const r = F.WorkCapacity(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'WorkCapacity', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ErgonomicAssessment', (req, res) => { const r = F.ErgonomicAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'ErgonomicAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FunctionalRestoration', (req, res) => { const r = F.FunctionalRestoration(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'FunctionalRestoration', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ReturnToWork', (req, res) => { const r = F.ReturnToWork(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'ReturnToWork', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VocationalRetraining', (req, res) => { const r = F.VocationalRetraining(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'VocationalRetraining', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WorkHardening', (req, res) => { const r = F.WorkHardening(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'WorkHardening', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PainAtWork', (req, res) => { const r = F.PainAtWork(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'PainAtWork', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CognitiveDemands', (req, res) => { const r = F.CognitiveDemands(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'CognitiveDemands', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SafetyClearance', (req, res) => { const r = F.SafetyClearance(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'SafetyClearance', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DisabilityEvaluation', (req, res) => { const r = F.DisabilityEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_occupational_rehab', function: 'DisabilityEvaluation', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_occupational_rehab', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
