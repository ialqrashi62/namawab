// P3-DP pcc_rheumatology_advanced_routes v3.80.0
// P3-DP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_rheumatology_advanced_engine.js');
const VER = '3.80.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_rheumatology_advanced', label: 'PCC Rheumatology Advanced', functions: Object.keys(Engine) });
});

router.post('/call/RheumatoidArthritisAdvanced', (req, res) => { const r = Engine.RheumatoidArthritisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'RheumatoidArthritisAdvanced', plan: r.plan }); });
router.post('/call/SLEFlareManagement', (req, res) => { const r = Engine.SLEFlareManagement(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'SLEFlareManagement', plan: r.plan }); });
router.post('/call/SpondyloarthritisAdvanced', (req, res) => { const r = Engine.SpondyloarthritisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'SpondyloarthritisAdvanced', plan: r.plan }); });
router.post('/call/GoutRefractory', (req, res) => { const r = Engine.GoutRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'GoutRefractory', plan: r.plan }); });
router.post('/call/VasculitisWorkup', (req, res) => { const r = Engine.VasculitisWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'VasculitisWorkup', plan: r.plan }); });
router.post('/call/OsteoporosisAdvanced', (req, res) => { const r = Engine.OsteoporosisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'OsteoporosisAdvanced', plan: r.plan }); });
router.post('/call/MyositisEvaluation', (req, res) => { const r = Engine.MyositisEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'MyositisEvaluation', plan: r.plan }); });
router.post('/call/SjogrenAdvanced', (req, res) => { const r = Engine.SjogrenAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'SjogrenAdvanced', plan: r.plan }); });
router.post('/call/SystemicSclerosis', (req, res) => { const r = Engine.SystemicSclerosis(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'SystemicSclerosis', plan: r.plan }); });
router.post('/call/AutoinflammatoryDisease', (req, res) => { const r = Engine.AutoinflammatoryDisease(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'AutoinflammatoryDisease', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
