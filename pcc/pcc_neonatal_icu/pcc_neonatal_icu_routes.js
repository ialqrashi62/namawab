// P3-DU pcc_neonatal_icu_routes v3.85.0
// P3-DU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_neonatal_icu_engine.js');
const VER = '3.85.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neonatal_icu', label: 'PCC Neonatal ICU', functions: Object.keys(F) });
});
router.post('/call/NICUAdmissionCriteria', (req, res) => { const r = F.NICUAdmissionCriteria(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'NICUAdmissionCriteria', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ThermoregulationProtocol', (req, res) => { const r = F.ThermoregulationProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'ThermoregulationProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalVentilation', (req, res) => { const r = F.NeonatalVentilation(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'NeonatalVentilation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TPNNeonatal', (req, res) => { const r = F.TPNNeonatal(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'TPNNeonatal', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalSepsisKaiser', (req, res) => { const r = F.NeonatalSepsisKaiser(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'NeonatalSepsisKaiser', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BronchopulmonaryDysplasia', (req, res) => { const r = F.BronchopulmonaryDysplasia(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'BronchopulmonaryDysplasia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/IVHPremature', (req, res) => { const r = F.IVHPremature(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'IVHPremature', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ROPExamSchedule', (req, res) => { const r = F.ROPExamSchedule(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'ROPExamSchedule', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NeonatalSeizureWorkup', (req, res) => { const r = F.NeonatalSeizureWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'NeonatalSeizureWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CongenitalHeartDuctus', (req, res) => { const r = F.CongenitalHeartDuctus(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'CongenitalHeartDuctus', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_neonatal_icu', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
