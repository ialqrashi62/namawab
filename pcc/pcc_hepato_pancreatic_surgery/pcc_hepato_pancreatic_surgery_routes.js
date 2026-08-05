// P3-DY pcc_hepato_pancreatic_surgery_routes v3.89.0
// P3-DY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_hepato_pancreatic_surgery_engine.js');
const VER = '3.89.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', label: 'PCC Hepato Pancreatic Surgery', functions: Object.keys(F) });
});
router.post('/call/WhippleIndication', (req, res) => { const r = F.WhippleIndication(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'WhippleIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LiverResectionHCC', (req, res) => { const r = F.LiverResectionHCC(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'LiverResectionHCC', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PancreaticCancerStaging', (req, res) => { const r = F.PancreaticCancerStaging(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'PancreaticCancerStaging', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/CholangiocarcinomaSurgery', (req, res) => { const r = F.CholangiocarcinomaSurgery(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'CholangiocarcinomaSurgery', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/BiliaryReconstruction', (req, res) => { const r = F.BiliaryReconstruction(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'BiliaryReconstruction', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LiverTransplantHCC', (req, res) => { const r = F.LiverTransplantHCC(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'LiverTransplantHCC', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PancreaticNecrosectomy', (req, res) => { const r = F.PancreaticNecrosectomy(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'PancreaticNecrosectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DistalPancreatectomy', (req, res) => { const r = F.DistalPancreatectomy(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'DistalPancreatectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HepaticCystFenestration', (req, res) => { const r = F.HepaticCystFenestration(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'HepaticCystFenestration', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PortalHypertensionShunt', (req, res) => { const r = F.PortalHypertensionShunt(req.body || {}); res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: 'PortalHypertensionShunt', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_hepato_pancreatic_surgery', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
