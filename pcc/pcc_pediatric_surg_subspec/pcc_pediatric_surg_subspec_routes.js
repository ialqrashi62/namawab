// P3-EK pcc_pediatric_surg_subspec_routes v3.101.0
// P3-EK: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_surg_subspec_engine.js');
const VER = '3.101.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_surg_subspec', label: 'PCC Pediatric Surg Subspec', functions: Object.keys(F) });
});
router.post('/call/PediatricHepatobiliarySurg', (req, res) => { const r = F.PediatricHepatobiliarySurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_subspec', function: 'PediatricHepatobiliarySurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricThoracicSurg', (req, res) => { const r = F.PediatricThoracicSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_subspec', function: 'PediatricThoracicSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricUrologicSurg', (req, res) => { const r = F.PediatricUrologicSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_subspec', function: 'PediatricUrologicSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricColorectalSurg', (req, res) => { const r = F.PediatricColorectalSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_subspec', function: 'PediatricColorectalSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricENT', (req, res) => { const r = F.PediatricENT(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_subspec', function: 'PediatricENT', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricOphthalmicSurg', (req, res) => { const r = F.PediatricOphthalmicSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_subspec', function: 'PediatricOphthalmicSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricPlasticRecon', (req, res) => { const r = F.PediatricPlasticRecon(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_subspec', function: 'PediatricPlasticRecon', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricBariatricSurg', (req, res) => { const r = F.PediatricBariatricSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_subspec', function: 'PediatricBariatricSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTransplantSurg', (req, res) => { const r = F.PediatricTransplantSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_subspec', function: 'PediatricTransplantSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricTraumaSurg', (req, res) => { const r = F.PediatricTraumaSurg(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_subspec', function: 'PediatricTraumaSurg', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_surg_subspec', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
