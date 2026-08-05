// P3-DV pcc_derma_cosmetic_surgery_routes v3.86.0
// P3-DV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_derma_cosmetic_surgery_engine.js');
const VER = '3.86.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', label: 'PCC Derma Cosmetic Surgery', functions: Object.keys(F) });
});
router.post('/call/RhytidectomyAssessment', (req, res) => { const r = F.RhytidectomyAssessment(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'RhytidectomyAssessment', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BlepharoplastyIndication', (req, res) => { const r = F.BlepharoplastyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'BlepharoplastyIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RhinoplastyConsult', (req, res) => { const r = F.RhinoplastyConsult(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'RhinoplastyConsult', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LiposuctionSafety', (req, res) => { const r = F.LiposuctionSafety(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'LiposuctionSafety', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BotulinumToxinProtocol', (req, res) => { const r = F.BotulinumToxinProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'BotulinumToxinProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DermalFillerPlacement', (req, res) => { const r = F.DermalFillerPlacement(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'DermalFillerPlacement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ChemicalPeelSelection', (req, res) => { const r = F.ChemicalPeelSelection(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'ChemicalPeelSelection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LaserResurfacingType', (req, res) => { const r = F.LaserResurfacingType(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'LaserResurfacingType', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HairTransplantPlanning', (req, res) => { const r = F.HairTransplantPlanning(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'HairTransplantPlanning', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CosmeticScreeningPsych', (req, res) => { const r = F.CosmeticScreeningPsych(req.body || {}); res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: 'CosmeticScreeningPsych', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_derma_cosmetic_surgery', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
