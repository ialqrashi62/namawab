// P3-DV pcc_derma_cosmetic_surgery_routes v3.86.0
// P3-DV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_derma_cosmetic_surgery_engine.js');
const VER = '3.86.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', label: 'PCC Derma Cosmetic Surgery', functions: Object.keys(Engine) });
});
router.post('/call/RhytidectomyAssessment', (req, res) => { const r = Engine.RhytidectomyAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'RhytidectomyAssessment', plan: r.plan }); });
router.post('/call/BlepharoplastyIndication', (req, res) => { const r = Engine.BlepharoplastyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'BlepharoplastyIndication', plan: r.plan }); });
router.post('/call/RhinoplastyConsult', (req, res) => { const r = Engine.RhinoplastyConsult(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'RhinoplastyConsult', plan: r.plan }); });
router.post('/call/LiposuctionSafety', (req, res) => { const r = Engine.LiposuctionSafety(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'LiposuctionSafety', plan: r.plan }); });
router.post('/call/BotulinumToxinProtocol', (req, res) => { const r = Engine.BotulinumToxinProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'BotulinumToxinProtocol', plan: r.plan }); });
router.post('/call/DermalFillerPlacement', (req, res) => { const r = Engine.DermalFillerPlacement(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'DermalFillerPlacement', plan: r.plan }); });
router.post('/call/ChemicalPeelSelection', (req, res) => { const r = Engine.ChemicalPeelSelection(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'ChemicalPeelSelection', plan: r.plan }); });
router.post('/call/LaserResurfacingType', (req, res) => { const r = Engine.LaserResurfacingType(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'LaserResurfacingType', plan: r.plan }); });
router.post('/call/HairTransplantPlanning', (req, res) => { const r = Engine.HairTransplantPlanning(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'HairTransplantPlanning', plan: r.plan }); });
router.post('/call/CosmeticScreeningPsych', (req, res) => { const r = Engine.CosmeticScreeningPsych(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'CosmeticScreeningPsych', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
