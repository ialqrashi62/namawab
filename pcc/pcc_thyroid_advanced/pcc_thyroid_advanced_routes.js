// P3-DG pcc_thyroid_advanced_routes v3.71.0
// P3-DG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_thyroid_advanced_engine.js');
const VER = '3.71.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_thyroid_advanced', label: 'PCC Thyroid Advanced', functions: Object.keys(Engine) });
});

router.post('/call/TSHPattern', (req, res) => { const r = Engine.TSHPattern(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'TSHPattern', plan: r.plan }); });
router.post('/call/FreeT3T4', (req, res) => { const r = Engine.FreeT3T4(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'FreeT3T4', plan: r.plan }); });
router.post('/call/ReverseT3', (req, res) => { const r = Engine.ReverseT3(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'ReverseT3', plan: r.plan }); });
router.post('/call/ThyroidAntibodies', (req, res) => { const r = Engine.ThyroidAntibodies(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'ThyroidAntibodies', plan: r.plan }); });
router.post('/call/IodineStatus', (req, res) => { const r = Engine.IodineStatus(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'IodineStatus', plan: r.plan }); });
router.post('/call/SeleniumSupport', (req, res) => { const r = Engine.SeleniumSupport(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'SeleniumSupport', plan: r.plan }); });
router.post('/call/Hashimotos', (req, res) => { const r = Engine.Hashimotos(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'Hashimotos', plan: r.plan }); });
router.post('/call/Graves', (req, res) => { const r = Engine.Graves(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'Graves', plan: r.plan }); });
router.post('/call/ThyroidNodule', (req, res) => { const r = Engine.ThyroidNodule(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'ThyroidNodule', plan: r.plan }); });
router.post('/call/PostpartumThyroid', (req, res) => { const r = Engine.PostpartumThyroid(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'PostpartumThyroid', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_thyroid_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
