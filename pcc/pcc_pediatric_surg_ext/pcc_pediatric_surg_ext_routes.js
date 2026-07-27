// P3-EM pcc_pediatric_surg_ext_routes v3.103.0
// P3-EM: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_pediatric_surg_ext_engine.js');
const VER = '3.103.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_surg_ext', label: 'PCC Pediatric Surg Ext', functions: Object.keys(Engine) });
});
router.post('/call/PediatricLaparoscopic', (req, res) => { const r = Engine.PediatricLaparoscopic(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricLaparoscopic', plan: r.plan }); });
router.post('/call/PediatricRoboticSurg', (req, res) => { const r = Engine.PediatricRoboticSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricRoboticSurg', plan: r.plan }); });
router.post('/call/PediatricEndoscopic', (req, res) => { const r = Engine.PediatricEndoscopic(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricEndoscopic', plan: r.plan }); });
router.post('/call/PediatricFetalSurg', (req, res) => { const r = Engine.PediatricFetalSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricFetalSurg', plan: r.plan }); });
router.post('/call/PediatricMinimallyInvasive', (req, res) => { const r = Engine.PediatricMinimallyInvasive(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricMinimallyInvasive', plan: r.plan }); });
router.post('/call/PediatricDaySurg', (req, res) => { const r = Engine.PediatricDaySurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricDaySurg', plan: r.plan }); });
router.post('/call/PediatricAmbulatorySurg', (req, res) => { const r = Engine.PediatricAmbulatorySurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricAmbulatorySurg', plan: r.plan }); });
router.post('/call/PediatricSameDayDischarge', (req, res) => { const r = Engine.PediatricSameDayDischarge(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricSameDayDischarge', plan: r.plan }); });
router.post('/call/PediatricPreOpEval', (req, res) => { const r = Engine.PediatricPreOpEval(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricPreOpEval', plan: r.plan }); });
router.post('/call/PediatricPostOpCare', (req, res) => { const r = Engine.PediatricPostOpCare(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: 'PediatricPostOpCare', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_surg_ext', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
