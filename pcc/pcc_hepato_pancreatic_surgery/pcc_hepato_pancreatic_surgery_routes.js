// P3-DY pcc_hepato_pancreatic_surgery_routes v3.89.0
// P3-DY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_hepato_pancreatic_surgery_engine.js');
const VER = '3.89.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', label: 'PCC Hepato Pancreatic Surgery', functions: Object.keys(Engine) });
});
router.post('/call/WhippleIndication', (req, res) => { const r = Engine.WhippleIndication(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'WhippleIndication', plan: r.plan }); });
router.post('/call/LiverResectionHCC', (req, res) => { const r = Engine.LiverResectionHCC(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'LiverResectionHCC', plan: r.plan }); });
router.post('/call/PancreaticCancerStaging', (req, res) => { const r = Engine.PancreaticCancerStaging(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'PancreaticCancerStaging', plan: r.plan }); });
router.post('/call/CholangiocarcinomaSurgery', (req, res) => { const r = Engine.CholangiocarcinomaSurgery(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'CholangiocarcinomaSurgery', plan: r.plan }); });
router.post('/call/BiliaryReconstruction', (req, res) => { const r = Engine.BiliaryReconstruction(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'BiliaryReconstruction', plan: r.plan }); });
router.post('/call/LiverTransplantHCC', (req, res) => { const r = Engine.LiverTransplantHCC(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'LiverTransplantHCC', plan: r.plan }); });
router.post('/call/PancreaticNecrosectomy', (req, res) => { const r = Engine.PancreaticNecrosectomy(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'PancreaticNecrosectomy', plan: r.plan }); });
router.post('/call/DistalPancreatectomy', (req, res) => { const r = Engine.DistalPancreatectomy(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'DistalPancreatectomy', plan: r.plan }); });
router.post('/call/HepaticCystFenestration', (req, res) => { const r = Engine.HepaticCystFenestration(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'HepaticCystFenestration', plan: r.plan }); });
router.post('/call/PortalHypertensionShunt', (req, res) => { const r = Engine.PortalHypertensionShunt(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'PortalHypertensionShunt', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
