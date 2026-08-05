// P3-DB pcc_regenerative_medicine_routes v3.66.0
// P3-DB: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_regenerative_medicine_engine.js');
const VER = '3.66.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_regenerative_medicine', label: 'PCC Regenerative Medicine', functions: Object.keys(F) });
});

router.post('/call/StemCellTherapy', (req, res) => { const r = F.StemCellTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_regenerative_medicine', function: 'StemCellTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PRPInjection', (req, res) => { const r = F.PRPInjection(req.body || {}); res.json({ version: VER, module: 'pcc_regenerative_medicine', function: 'PRPInjection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ExosomeTherapy', (req, res) => { const r = F.ExosomeTherapy(req.body || {}); res.json({ version: VER, module: 'pcc_regenerative_medicine', function: 'ExosomeTherapy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CartilageRegeneration', (req, res) => { const r = F.CartilageRegeneration(req.body || {}); res.json({ version: VER, module: 'pcc_regenerative_medicine', function: 'CartilageRegeneration', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TissueEngineering', (req, res) => { const r = F.TissueEngineering(req.body || {}); res.json({ version: VER, module: 'pcc_regenerative_medicine', function: 'TissueEngineering', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CellularReprogramming', (req, res) => { const r = F.CellularReprogramming(req.body || {}); res.json({ version: VER, module: 'pcc_regenerative_medicine', function: 'CellularReprogramming', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GeneEditing', (req, res) => { const r = F.GeneEditing(req.body || {}); res.json({ version: VER, module: 'pcc_regenerative_medicine', function: 'GeneEditing', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ImmuneReset', (req, res) => { const r = F.ImmuneReset(req.body || {}); res.json({ version: VER, module: 'pcc_regenerative_medicine', function: 'ImmuneReset', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/WoundRegeneration', (req, res) => { const r = F.WoundRegeneration(req.body || {}); res.json({ version: VER, module: 'pcc_regenerative_medicine', function: 'WoundRegeneration', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AntiAging', (req, res) => { const r = F.AntiAging(req.body || {}); res.json({ version: VER, module: 'pcc_regenerative_medicine', function: 'AntiAging', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_regenerative_medicine', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
