// P3-DY pcc_colorectal_surgery_routes v3.89.0
// P3-DY: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_colorectal_surgery_engine.js');
const VER = '3.89.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_colorectal_surgery', label: 'PCC Colorectal Surgery', functions: Object.keys(Engine) });
});
router.post('/call/ColonCancerResection', (req, res) => { const r = Engine.ColonCancerResection(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'ColonCancerResection', plan: r.plan }); });
router.post('/call/RectalCancerTME', (req, res) => { const r = Engine.RectalCancerTME(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'RectalCancerTME', plan: r.plan }); });
router.post('/call/LowAnteriorResection', (req, res) => { const r = Engine.LowAnteriorResection(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'LowAnteriorResection', plan: r.plan }); });
router.post('/call/HartmannProcedure', (req, res) => { const r = Engine.HartmannProcedure(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'HartmannProcedure', plan: r.plan }); });
router.post('/call/DiverticulitisSurgery', (req, res) => { const r = Engine.DiverticulitisSurgery(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'DiverticulitisSurgery', plan: r.plan }); });
router.post('/call/IBDColectomy', (req, res) => { const r = Engine.IBDColectomy(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'IBDColectomy', plan: r.plan }); });
router.post('/call/ColostomyReversal', (req, res) => { const r = Engine.ColostomyReversal(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'ColostomyReversal', plan: r.plan }); });
router.post('/call/AnalFissureSurgery', (req, res) => { const r = Engine.AnalFissureSurgery(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'AnalFissureSurgery', plan: r.plan }); });
router.post('/call/HemorrhoidectomyIndication', (req, res) => { const r = Engine.HemorrhoidectomyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'HemorrhoidectomyIndication', plan: r.plan }); });
router.post('/call/RectalProlapseRepair', (req, res) => { const r = Engine.RectalProlapseRepair(req.body || {}); res.json({ version: VER, module: 'pcc_colorectal_surgery', function: 'RectalProlapseRepair', plan: r.plan }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_colorectal_surgery', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
