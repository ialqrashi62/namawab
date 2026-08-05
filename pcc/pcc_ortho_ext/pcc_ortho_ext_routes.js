// P3-EK pcc_ortho_ext_routes v3.101.0
// P3-EK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_ortho_ext_engine.js');
const VER = '3.101.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_ortho_ext', label: 'PCC Ortho Ext', functions: Object.keys(F) });
});
router.post('/call/JointReplacementEval', (req, res) => { const r = F.JointReplacementEval(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'JointReplacementEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HipFracturePathway', (req, res) => { const r = F.HipFracturePathway(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'HipFracturePathway', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/KneeArthroscopyIndication', (req, res) => { const r = F.KneeArthroscopyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'KneeArthroscopyIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ShoulderReplacement', (req, res) => { const r = F.ShoulderReplacement(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'ShoulderReplacement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpinalDecompression', (req, res) => { const r = F.SpinalDecompression(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'SpinalDecompression', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OrthopedicTraumaTriage', (req, res) => { const r = F.OrthopedicTraumaTriage(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'OrthopedicTraumaTriage', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricFractureEval', (req, res) => { const r = F.PediatricFractureEval(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'PediatricFractureEval', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OsteomyelitisWorkup', (req, res) => { const r = F.OsteomyelitisWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'OsteomyelitisWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BoneTumorWorkup', (req, res) => { const r = F.BoneTumorWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'BoneTumorWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CompartmentSyndromeCheck', (req, res) => { const r = F.CompartmentSyndromeCheck(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'CompartmentSyndromeCheck', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_ortho_ext', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
