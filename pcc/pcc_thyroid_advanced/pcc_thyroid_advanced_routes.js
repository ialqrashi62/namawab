// P3-DG pcc_thyroid_advanced_routes v3.71.0
// P3-DG: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_thyroid_advanced_engine.js');
const VER = '3.71.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_thyroid_advanced', label: 'PCC Thyroid Advanced', functions: Object.keys(F) });
});

router.post('/call/TSHPattern', (req, res) => { const r = F.TSHPattern(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'TSHPattern', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/FreeT3T4', (req, res) => { const r = F.FreeT3T4(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'FreeT3T4', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ReverseT3', (req, res) => { const r = F.ReverseT3(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'ReverseT3', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ThyroidAntibodies', (req, res) => { const r = F.ThyroidAntibodies(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'ThyroidAntibodies', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/IodineStatus', (req, res) => { const r = F.IodineStatus(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'IodineStatus', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SeleniumSupport', (req, res) => { const r = F.SeleniumSupport(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'SeleniumSupport', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Hashimotos', (req, res) => { const r = F.Hashimotos(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'Hashimotos', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/Graves', (req, res) => { const r = F.Graves(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'Graves', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ThyroidNodule', (req, res) => { const r = F.ThyroidNodule(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'ThyroidNodule', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PostpartumThyroid', (req, res) => { const r = F.PostpartumThyroid(req.body || {}); res.json({ version: VER, module: 'pcc_thyroid_advanced', function: 'PostpartumThyroid', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_thyroid_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
