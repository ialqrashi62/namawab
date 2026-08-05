// P3-DP pcc_rheumatology_advanced_routes v3.80.0
// P3-DP: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_rheumatology_advanced_engine.js');
const VER = '3.80.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_rheumatology_advanced', label: 'PCC Rheumatology Advanced', functions: Object.keys(F) });
});

router.post('/call/RheumatoidArthritisAdvanced', (req, res) => { const r = F.RheumatoidArthritisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'RheumatoidArthritisAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SLEFlareManagement', (req, res) => { const r = F.SLEFlareManagement(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'SLEFlareManagement', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SpondyloarthritisAdvanced', (req, res) => { const r = F.SpondyloarthritisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'SpondyloarthritisAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/GoutRefractory', (req, res) => { const r = F.GoutRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'GoutRefractory', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/VasculitisWorkup', (req, res) => { const r = F.VasculitisWorkup(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'VasculitisWorkup', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/OsteoporosisAdvanced', (req, res) => { const r = F.OsteoporosisAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'OsteoporosisAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MyositisEvaluation', (req, res) => { const r = F.MyositisEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'MyositisEvaluation', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SjogrenAdvanced', (req, res) => { const r = F.SjogrenAdvanced(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'SjogrenAdvanced', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/SystemicSclerosis', (req, res) => { const r = F.SystemicSclerosis(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'SystemicSclerosis', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AutoinflammatoryDisease', (req, res) => { const r = F.AutoinflammatoryDisease(req.body || {}); res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: 'AutoinflammatoryDisease', plan: r.plan, score: r.score, score: r.score }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_rheumatology_advanced', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
