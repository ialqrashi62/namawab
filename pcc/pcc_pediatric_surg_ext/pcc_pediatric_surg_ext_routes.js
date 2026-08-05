// P3-EM pcc_pediatric_surg_ext_routes v3.103.0
// P3-EM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_surg_ext_engine.js');
const VER = '3.103.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_surg_ext', label: 'PCC Pediatric Surg Ext', functions: Object.keys(F) });
});
router.post('/call/PediatricLaparoscopic', (req, res) => { const r = F.PediatricLaparoscopic(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricLaparoscopic', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricRoboticSurg', (req, res) => { const r = F.PediatricRoboticSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricRoboticSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricEndoscopic', (req, res) => { const r = F.PediatricEndoscopic(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricEndoscopic', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricFetalSurg', (req, res) => { const r = F.PediatricFetalSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricFetalSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricMinimallyInvasive', (req, res) => { const r = F.PediatricMinimallyInvasive(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricMinimallyInvasive', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricDaySurg', (req, res) => { const r = F.PediatricDaySurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricDaySurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAmbulatorySurg', (req, res) => { const r = F.PediatricAmbulatorySurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricAmbulatorySurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricSameDayDischarge', (req, res) => { const r = F.PediatricSameDayDischarge(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricSameDayDischarge', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPreOpEval', (req, res) => { const r = F.PediatricPreOpEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricPreOpEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPostOpCare', (req, res) => { const r = F.PediatricPostOpCare(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricPostOpCare', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
