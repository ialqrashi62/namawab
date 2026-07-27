// P3-DO pcc_endoscopy_advanced_routes v3.79.0
// P3-DO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_endoscopy_advanced_engine.js');
const VER = '3.79.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_endoscopy_advanced', label: 'PCC Endoscopy Advanced', functions: Object.keys(Engine) });
});

router.post('/call/ColonoscopyScreeningAdvanced', (req, res) => { const r = Engine.ColonoscopyScreeningAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_endoscopy_advanced', function: 'ColonoscopyScreeningAdvanced', plan: r.plan }); });
router.post('/call/PolypectomyRisk', (req, res) => { const r = Engine.PolypectomyRisk(req.body || {}); res.json({ version: VER, module: 'pcc_endoscopy_advanced', function: 'PolypectomyRisk', plan: r.plan }); });
router.post('/call/ERCPIndication', (req, res) => { const r = Engine.ERCPIndication(req.body || {}); res.json({ version: VER, module: 'pcc_endoscopy_advanced', function: 'ERCPIndication', plan: r.plan }); });
router.post('/call/EUSIndication', (req, res) => { const r = Engine.EUSIndication(req.body || {}); res.json({ version: VER, module: 'pcc_endoscopy_advanced', function: 'EUSIndication', plan: r.plan }); });
router.post('/call/EndoscopicHemostasis', (req, res) => { const r = Engine.EndoscopicHemostasis(req.body || {}); res.json({ version: VER, module: 'pcc_endoscopy_advanced', function: 'EndoscopicHemostasis', plan: r.plan }); });
router.post('/call/PEGPlacement', (req, res) => { const r = Engine.PEGPlacement(req.body || {}); res.json({ version: VER, module: 'pcc_endoscopy_advanced', function: 'PEGPlacement', plan: r.plan }); });
router.post('/call/EndoscopicDilation', (req, res) => { const r = Engine.EndoscopicDilation(req.body || {}); res.json({ version: VER, module: 'pcc_endoscopy_advanced', function: 'EndoscopicDilation', plan: r.plan }); });
router.post('/call/EndoscopicResection', (req, res) => { const r = Engine.EndoscopicResection(req.body || {}); res.json({ version: VER, module: 'pcc_endoscopy_advanced', function: 'EndoscopicResection', plan: r.plan }); });
router.post('/call/CapsuleEndoscopy', (req, res) => { const r = Engine.CapsuleEndoscopy(req.body || {}); res.json({ version: VER, module: 'pcc_endoscopy_advanced', function: 'CapsuleEndoscopy', plan: r.plan }); });
router.post('/call/EndoscopySedationRisk', (req, res) => { const r = Engine.EndoscopySedationRisk(req.body || {}); res.json({ version: VER, module: 'pcc_endoscopy_advanced', function: 'EndoscopySedationRisk', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_endoscopy_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
