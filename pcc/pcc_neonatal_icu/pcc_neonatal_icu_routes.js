// P3-DU pcc_neonatal_icu_routes v3.85.0
// P3-DU: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_neonatal_icu_engine.js');
const VER = '3.85.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_neonatal_icu', label: 'PCC Neonatal ICU', functions: Object.keys(Engine) });
});
router.post('/call/NICUAdmissionCriteria', (req, res) => { const r = Engine.NICUAdmissionCriteria(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'NICUAdmissionCriteria', plan: r.plan }); });
router.post('/call/ThermoregulationProtocol', (req, res) => { const r = Engine.ThermoregulationProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'ThermoregulationProtocol', plan: r.plan }); });
router.post('/call/NeonatalVentilation', (req, res) => { const r = Engine.NeonatalVentilation(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'NeonatalVentilation', plan: r.plan }); });
router.post('/call/TPNNeonatal', (req, res) => { const r = Engine.TPNNeonatal(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'TPNNeonatal', plan: r.plan }); });
router.post('/call/NeonatalSepsisKaiser', (req, res) => { const r = Engine.NeonatalSepsisKaiser(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'NeonatalSepsisKaiser', plan: r.plan }); });
router.post('/call/BronchopulmonaryDysplasia', (req, res) => { const r = Engine.BronchopulmonaryDysplasia(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'BronchopulmonaryDysplasia', plan: r.plan }); });
router.post('/call/IVHPremature', (req, res) => { const r = Engine.IVHPremature(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'IVHPremature', plan: r.plan }); });
router.post('/call/ROPExamSchedule', (req, res) => { const r = Engine.ROPExamSchedule(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'ROPExamSchedule', plan: r.plan }); });
router.post('/call/NeonatalSeizureWorkup', (req, res) => { const r = Engine.NeonatalSeizureWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'NeonatalSeizureWorkup', plan: r.plan }); });
router.post('/call/CongenitalHeartDuctus', (req, res) => { const r = Engine.CongenitalHeartDuctus(req.body || {}); res.json({ version: VER, module: 'pcc_neonatal_icu', function: 'CongenitalHeartDuctus', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_neonatal_icu', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
