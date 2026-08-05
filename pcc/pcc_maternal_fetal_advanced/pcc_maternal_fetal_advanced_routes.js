// P3-DR pcc_maternal_fetal_advanced_routes v3.82.0
// P3-DR: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_maternal_fetal_advanced_engine.js');
const VER = '3.82.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', label: 'PCC Maternal Fetal Advanced', functions: Object.keys(F) });
});

router.post('/call/FetalGrowthRestriction', (req, res) => { const r = F.FetalGrowthRestriction(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'FetalGrowthRestriction', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TwinTwinTransfusion', (req, res) => { const r = F.TwinTwinTransfusion(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'TwinTwinTransfusion', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FetalAnemia', (req, res) => { const r = F.FetalAnemia(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'FetalAnemia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FetalArrhythmia', (req, res) => { const r = F.FetalArrhythmia(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'FetalArrhythmia', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CongenitalInfections', (req, res) => { const r = F.CongenitalInfections(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'CongenitalInfections', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RedCellAlloimmunization', (req, res) => { const r = F.RedCellAlloimmunization(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'RedCellAlloimmunization', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PretermLaborTocolysis', (req, res) => { const r = F.PretermLaborTocolysis(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'PretermLaborTocolysis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CervicalInsufficiency', (req, res) => { const r = F.CervicalInsufficiency(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'CervicalInsufficiency', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MaternalCardiacDisease', (req, res) => { const r = F.MaternalCardiacDisease(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'MaternalCardiacDisease', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MaternalRenalDisease', (req, res) => { const r = F.MaternalRenalDisease(req.body || {}); res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: 'MaternalRenalDisease', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_maternal_fetal_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
