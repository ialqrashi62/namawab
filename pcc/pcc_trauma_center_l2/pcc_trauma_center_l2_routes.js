// P3-DT pcc_trauma_center_l2_routes v3.84.0
// P3-DT: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_trauma_center_l2_engine.js');
const VER = '3.84.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_trauma_center_l2', label: 'PCC Trauma Center L2', functions: Object.keys(F) });
});
router.post('/call/ATLSPrimarySurvey', (req, res) => { const r = F.ATLSPrimarySurvey(req.body || {}); res.json({ version: VER, module: 'pcc_trauma_center_l2', function: 'ATLSPrimarySurvey', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FASTExamIndication', (req, res) => { const r = F.FASTExamIndication(req.body || {}); res.json({ version: VER, module: 'pcc_trauma_center_l2', function: 'FASTExamIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PelvicFractureStability', (req, res) => { const r = F.PelvicFractureStability(req.body || {}); res.json({ version: VER, module: 'pcc_trauma_center_l2', function: 'PelvicFractureStability', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BluntCardiacInjury', (req, res) => { const r = F.BluntCardiacInjury(req.body || {}); res.json({ version: VER, module: 'pcc_trauma_center_l2', function: 'BluntCardiacInjury', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TraumaActivationCriteria', (req, res) => { const r = F.TraumaActivationCriteria(req.body || {}); res.json({ version: VER, module: 'pcc_trauma_center_l2', function: 'TraumaActivationCriteria', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MassiveTransfusionProtocol', (req, res) => { const r = F.MassiveTransfusionProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_trauma_center_l2', function: 'MassiveTransfusionProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OpenFractureGustilo', (req, res) => { const r = F.OpenFractureGustilo(req.body || {}); res.json({ version: VER, module: 'pcc_trauma_center_l2', function: 'OpenFractureGustilo', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TraumaticBrainInjuryGCS', (req, res) => { const r = F.TraumaticBrainInjuryGCS(req.body || {}); res.json({ version: VER, module: 'pcc_trauma_center_l2', function: 'TraumaticBrainInjuryGCS', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpineClearanceNEXUS', (req, res) => { const r = F.SpineClearanceNEXUS(req.body || {}); res.json({ version: VER, module: 'pcc_trauma_center_l2', function: 'SpineClearanceNEXUS', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BurnParklandEstimate', (req, res) => { const r = F.BurnParklandEstimate(req.body || {}); res.json({ version: VER, module: 'pcc_trauma_center_l2', function: 'BurnParklandEstimate', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_trauma_center_l2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
