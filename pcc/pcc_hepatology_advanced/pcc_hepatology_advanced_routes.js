// P3-DO pcc_hepatology_advanced_routes v3.79.0
// P3-DO: authenticate via requireAuth middleware (sandbox: helmet/CSP enforced at app level)
'use strict';
const express = require('express');
const Engine = require('./pcc_hepatology_advanced_engine.js');
const VER = '3.79.0';
const router = express.Router();

router.get('/list', (req, res) => {
  res.json({ version: VER, module: 'pcc_hepatology_advanced', label: 'PCC Hepatology Advanced', functions: Object.keys(Engine) });
});

router.post('/call/AscitesRefractory', (req, res) => { const r = Engine.AscitesRefractory(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'AscitesRefractory', plan: r.plan }); });
router.post('/call/HepaticEncephalopathyRecurrent', (req, res) => { const r = Engine.HepaticEncephalopathyRecurrent(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'HepaticEncephalopathyRecurrent', plan: r.plan }); });
router.post('/call/HepatorenalSyndrome', (req, res) => { const r = Engine.HepatorenalSyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'HepatorenalSyndrome', plan: r.plan }); });
router.post('/call/HepatopulmonarySyndrome', (req, res) => { const r = Engine.HepatopulmonarySyndrome(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'HepatopulmonarySyndrome', plan: r.plan }); });
router.post('/call/PortopulmonaryHypertension', (req, res) => { const r = Engine.PortopulmonaryHypertension(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'PortopulmonaryHypertension', plan: r.plan }); });
router.post('/call/AcuteLiverFailure', (req, res) => { const r = Engine.AcuteLiverFailure(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'AcuteLiverFailure', plan: r.plan }); });
router.post('/call/AutoimmuneHepatitis', (req, res) => { const r = Engine.AutoimmuneHepatitis(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'AutoimmuneHepatitis', plan: r.plan }); });
router.post('/call/PrimaryBiliaryCholangitis', (req, res) => { const r = Engine.PrimaryBiliaryCholangitis(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'PrimaryBiliaryCholangitis', plan: r.plan }); });
router.post('/call/PrimarySclerosingCholangitis', (req, res) => { const r = Engine.PrimarySclerosingCholangitis(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'PrimarySclerosingCholangitis', plan: r.plan }); });
router.post('/call/LiverTransplantEvaluation', (req, res) => { const r = Engine.LiverTransplantEvaluation(req.body || {}); res.json({ version: VER, module: 'pcc_hepatology_advanced', function: 'LiverTransplantEvaluation', plan: r.plan }); });

router.post('/record', (req, res) => {
  const { encounter_id, tenant_id, input, fn, created_by } = req.body || {};
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const r = Engine[fn](input || {});
  res.json({ version: VER, module: 'pcc_hepatology_advanced', function: fn, plan: r.plan, recorded: true });
});

module.exports = router;
