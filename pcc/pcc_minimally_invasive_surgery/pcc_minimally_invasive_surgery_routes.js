// P3-DX pcc_minimally_invasive_surgery_routes v3.88.0
// P3-DX: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const F = require('./pcc_minimally_invasive_surgery_engine.js');
const VER = '3.88.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_minimally_invasive_surgery', label: 'PCC Minimally Invasive Surgery', functions: Object.keys(F) });
});
router.post('/call/LaparoscopicCholecystectomy', (req, res) => { const r = F.LaparoscopicCholecystectomy(req.body || {}); res.json({ version: VER, module: 'pcc_minimally_invasive_surgery', function: 'LaparoscopicCholecystectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RoboticProstatectomyIndication', (req, res) => { const r = F.RoboticProstatectomyIndication(req.body || {}); res.json({ version: VER, module: 'pcc_minimally_invasive_surgery', function: 'RoboticProstatectomyIndication', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LaparoscopicHerniaRepair', (req, res) => { const r = F.LaparoscopicHerniaRepair(req.body || {}); res.json({ version: VER, module: 'pcc_minimally_invasive_surgery', function: 'LaparoscopicHerniaRepair', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/ThoracoscopicLobectomy', (req, res) => { const r = F.ThoracoscopicLobectomy(req.body || {}); res.json({ version: VER, module: 'pcc_minimally_invasive_surgery', function: 'ThoracoscopicLobectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/EndoscopicSinusSurgery', (req, res) => { const r = F.EndoscopicSinusSurgery(req.body || {}); res.json({ version: VER, module: 'pcc_minimally_invasive_surgery', function: 'EndoscopicSinusSurgery', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LaparoscopicColonResection', (req, res) => { const r = F.LaparoscopicColonResection(req.body || {}); res.json({ version: VER, module: 'pcc_minimally_invasive_surgery', function: 'LaparoscopicColonResection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/RoboticHysterectomy', (req, res) => { const r = F.RoboticHysterectomy(req.body || {}); res.json({ version: VER, module: 'pcc_minimally_invasive_surgery', function: 'RoboticHysterectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/NOTESProcedureSelection', (req, res) => { const r = F.NOTESProcedureSelection(req.body || {}); res.json({ version: VER, module: 'pcc_minimally_invasive_surgery', function: 'NOTESProcedureSelection', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/LaparoscopicNephrectomy', (req, res) => { const r = F.LaparoscopicNephrectomy(req.body || {}); res.json({ version: VER, module: 'pcc_minimally_invasive_surgery', function: 'LaparoscopicNephrectomy', plan: r.plan, score: r.score, score: r.score }); });
router.post('/call/MISPatientSelectionCriteria', (req, res) => { const r = F.MISPatientSelectionCriteria(req.body || {}); res.json({ version: VER, module: 'pcc_minimally_invasive_surgery', function: 'MISPatientSelectionCriteria', plan: r.plan, score: r.score, score: r.score }); });
router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, decisionId, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = F[fn](input || {});
  res.json({ version: VER, module: 'pcc_minimally_invasive_surgery', function: fn, plan: r.plan, score: r.score, score: r.score, recorded: true , tenant_id: tenant_id || null, decisionId: decisionId || null});
});

module.exports = router;
