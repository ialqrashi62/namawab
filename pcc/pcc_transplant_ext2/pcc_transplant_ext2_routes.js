// P3-DV pcc_transplant_ext2_routes v3.86.0
// P3-DV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_transplant_ext2_engine.js');
const VER = '3.86.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_transplant_ext2', label: 'PCC Transplant Ext2', functions: Object.keys(F) });
});
router.post('/call/ABOCompatibilityExtended', (req, res) => { const r = F.ABOCompatibilityExtended(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'ABOCompatibilityExtended', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HLAtypingExtended', (req, res) => { const r = F.HLAtypingExtended(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'HLAtypingExtended', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CrossmatchVirtual', (req, res) => { const r = F.CrossmatchVirtual(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'CrossmatchVirtual', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ImmunosuppressionProtocol', (req, res) => { const r = F.ImmunosuppressionProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'ImmunosuppressionProtocol', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RejectionSurveillance', (req, res) => { const r = F.RejectionSurveillance(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'RejectionSurveillance', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DonorRecipientMatching', (req, res) => { const r = F.DonorRecipientMatching(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'DonorRecipientMatching', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PostTransplantInfection', (req, res) => { const r = F.PostTransplantInfection(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'PostTransplantInfection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GVHDProphylaxis', (req, res) => { const r = F.GVHDProphylaxis(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'GVHDProphylaxis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/TransplantPharmacogenomics', (req, res) => { const r = F.TransplantPharmacogenomics(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'TransplantPharmacogenomics', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LongTermGraftSurvival', (req, res) => { const r = F.LongTermGraftSurvival(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'LongTermGraftSurvival', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_transplant_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
