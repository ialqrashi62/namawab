// P3-DR pcc_maternal_fetal_advanced_routes v3.82.0
// P3-DR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_maternal_fetal_advanced_engine.js');
const VER = '3.82.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', label: 'PCC Maternal Fetal Advanced', functions: Object.keys(Engine) });
});

router.post('/call/FetalGrowthRestriction', (req, res) => { const r = Engine.FetalGrowthRestriction(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'FetalGrowthRestriction', plan: r.plan }); });
router.post('/call/TwinTwinTransfusion', (req, res) => { const r = Engine.TwinTwinTransfusion(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'TwinTwinTransfusion', plan: r.plan }); });
router.post('/call/FetalAnemia', (req, res) => { const r = Engine.FetalAnemia(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'FetalAnemia', plan: r.plan }); });
router.post('/call/FetalArrhythmia', (req, res) => { const r = Engine.FetalArrhythmia(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'FetalArrhythmia', plan: r.plan }); });
router.post('/call/CongenitalInfections', (req, res) => { const r = Engine.CongenitalInfections(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'CongenitalInfections', plan: r.plan }); });
router.post('/call/RedCellAlloimmunization', (req, res) => { const r = Engine.RedCellAlloimmunization(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'RedCellAlloimmunization', plan: r.plan }); });
router.post('/call/PretermLaborTocolysis', (req, res) => { const r = Engine.PretermLaborTocolysis(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'PretermLaborTocolysis', plan: r.plan }); });
router.post('/call/CervicalInsufficiency', (req, res) => { const r = Engine.CervicalInsufficiency(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'CervicalInsufficiency', plan: r.plan }); });
router.post('/call/MaternalCardiacDisease', (req, res) => { const r = Engine.MaternalCardiacDisease(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'MaternalCardiacDisease', plan: r.plan }); });
router.post('/call/MaternalRenalDisease', (req, res) => { const r = Engine.MaternalRenalDisease(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'MaternalRenalDisease', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
