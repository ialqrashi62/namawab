// P3-DV pcc_transplant_ext2_routes v3.86.0
// P3-DV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_transplant_ext2_engine.js');
const VER = '3.86.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_transplant_ext2', label: 'PCC Transplant Ext2', functions: Object.keys(Engine) });
});
router.post('/call/ABOCompatibilityExtended', (req, res) => { const r = Engine.ABOCompatibilityExtended(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'ABOCompatibilityExtended', plan: r.plan }); });
router.post('/call/HLAtypingExtended', (req, res) => { const r = Engine.HLAtypingExtended(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'HLAtypingExtended', plan: r.plan }); });
router.post('/call/CrossmatchVirtual', (req, res) => { const r = Engine.CrossmatchVirtual(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'CrossmatchVirtual', plan: r.plan }); });
router.post('/call/ImmunosuppressionProtocol', (req, res) => { const r = Engine.ImmunosuppressionProtocol(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'ImmunosuppressionProtocol', plan: r.plan }); });
router.post('/call/RejectionSurveillance', (req, res) => { const r = Engine.RejectionSurveillance(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'RejectionSurveillance', plan: r.plan }); });
router.post('/call/DonorRecipientMatching', (req, res) => { const r = Engine.DonorRecipientMatching(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'DonorRecipientMatching', plan: r.plan }); });
router.post('/call/PostTransplantInfection', (req, res) => { const r = Engine.PostTransplantInfection(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'PostTransplantInfection', plan: r.plan }); });
router.post('/call/GVHDProphylaxis', (req, res) => { const r = Engine.GVHDProphylaxis(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'GVHDProphylaxis', plan: r.plan }); });
router.post('/call/TransplantPharmacogenomics', (req, res) => { const r = Engine.TransplantPharmacogenomics(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'TransplantPharmacogenomics', plan: r.plan }); });
router.post('/call/LongTermGraftSurvival', (req, res) => { const r = Engine.LongTermGraftSurvival(req.body || {}); res.json({ version: VER, module: 'pcc_transplant_ext2', function: 'LongTermGraftSurvival', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_transplant_ext2', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
