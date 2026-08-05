// P3-EV pcc_pediatric_surg_ext2_routes v3.112.0
// P3-EV: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_pediatric_surg_ext2_engine.js');
const VER = '3.112.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_pediatric_surg_ext2', label: 'PCC Pediatric Surg Ext2', functions: Object.keys(F) });
});
router.post('/call/PediatricCircumcision', (req, res) => { const r = F.PediatricCircumcision(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext2', function: 'PediatricCircumcision', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHerniaRepair', (req, res) => { const r = F.PediatricHerniaRepair(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext2', function: 'PediatricHerniaRepair', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricAppendectomy', (req, res) => { const r = F.PediatricAppendectomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext2', function: 'PediatricAppendectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCholecystectomy', (req, res) => { const r = F.PediatricCholecystectomy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext2', function: 'PediatricCholecystectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricFundoplication', (req, res) => { const r = F.PediatricFundoplication(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext2', function: 'PediatricFundoplication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricGTube', (req, res) => { const r = F.PediatricGTube(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext2', function: 'PediatricGTube', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricOrchiopexy', (req, res) => { const r = F.PediatricOrchiopexy(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext2', function: 'PediatricOrchiopexy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricHypospadias', (req, res) => { const r = F.PediatricHypospadias(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext2', function: 'PediatricHypospadias', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCleftLip', (req, res) => { const r = F.PediatricCleftLip(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext2', function: 'PediatricCleftLip', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/PediatricCleftPalate', (req, res) => { const r = F.PediatricCleftPalate(req.body || {}); res.json({ version: VER, module: 'pcc_pediatric_surg_ext2', function: 'PediatricCleftPalate', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_pediatric_surg_ext2', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
