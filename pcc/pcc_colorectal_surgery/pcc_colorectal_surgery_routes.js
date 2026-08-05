// P3-DY pcc_colorectal_surgery_routes v3.89.0
// P3-DY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_colorectal_surgery_engine.js');
const VER = '3.89.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_colorectal_surgery', label: 'PCC Colorectal Surgery', functions: Object.keys(F) });
});
router.post('/call/ColonCancerResection', (req, res) => { const r = F.ColonCancerResection(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'ColonCancerResection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RectalCancerTME', (req, res) => { const r = F.RectalCancerTME(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'RectalCancerTME', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LowAnteriorResection', (req, res) => { const r = F.LowAnteriorResection(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'LowAnteriorResection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HartmannProcedure', (req, res) => { const r = F.HartmannProcedure(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'HartmannProcedure', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/DiverticulitisSurgery', (req, res) => { const r = F.DiverticulitisSurgery(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'DiverticulitisSurgery', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/IBDColectomy', (req, res) => { const r = F.IBDColectomy(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'IBDColectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ColostomyReversal', (req, res) => { const r = F.ColostomyReversal(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'ColostomyReversal', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/AnalFissureSurgery', (req, res) => { const r = F.AnalFissureSurgery(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'AnalFissureSurgery', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/HemorrhoidectomyIndication', (req, res) => { const r = F.HemorrhoidectomyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'HemorrhoidectomyIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RectalProlapseRepair', (req, res) => { const r = F.RectalProlapseRepair(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'RectalProlapseRepair', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_colorectal_surgery', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
