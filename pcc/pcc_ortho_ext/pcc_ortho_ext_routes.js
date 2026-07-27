// P3-EK pcc_ortho_ext_routes v3.101.0
// P3-EK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_ortho_ext_engine.js');
const VER = '3.101.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_ortho_ext', label: 'PCC Ortho Ext', functions: Object.keys(Engine) });
});
router.post('/call/JointReplacementEval', (req, res) => { const r = Engine.JointReplacementEval(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'JointReplacementEval', plan: r.plan }); });
router.post('/call/HipFracturePathway', (req, res) => { const r = Engine.HipFracturePathway(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'HipFracturePathway', plan: r.plan }); });
router.post('/call/KneeArthroscopyIndication', (req, res) => { const r = Engine.KneeArthroscopyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'KneeArthroscopyIndication', plan: r.plan }); });
router.post('/call/ShoulderReplacement', (req, res) => { const r = Engine.ShoulderReplacement(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'ShoulderReplacement', plan: r.plan }); });
router.post('/call/SpinalDecompression', (req, res) => { const r = Engine.SpinalDecompression(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'SpinalDecompression', plan: r.plan }); });
router.post('/call/OrthopedicTraumaTriage', (req, res) => { const r = Engine.OrthopedicTraumaTriage(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'OrthopedicTraumaTriage', plan: r.plan }); });
router.post('/call/PediatricFractureEval', (req, res) => { const r = Engine.PediatricFractureEval(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'PediatricFractureEval', plan: r.plan }); });
router.post('/call/OsteomyelitisWorkup', (req, res) => { const r = Engine.OsteomyelitisWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'OsteomyelitisWorkup', plan: r.plan }); });
router.post('/call/BoneTumorWorkup', (req, res) => { const r = Engine.BoneTumorWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'BoneTumorWorkup', plan: r.plan }); });
router.post('/call/CompartmentSyndromeCheck', (req, res) => { const r = Engine.CompartmentSyndromeCheck(req.body || {}); res.json({ version: VER, module: 'pcc_ortho_ext', function: 'CompartmentSyndromeCheck', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_ortho_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
